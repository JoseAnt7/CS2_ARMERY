"""
WhaleWatch: radar automático de manipulación de mercado.
Escanea el catálogo completo en background y publica alertas globales.
"""
import json
import logging
import os
import re
from datetime import datetime, timedelta

from extensions import db
from models import MarketSnapshot, WhaleAlert
from services import cache, catalog
from services.steam_market import (
    fetch_bucket_group_id,
    fetch_listings_for_group,
    fetch_reference_price,
    split_hash_name,
)

logger = logging.getLogger(__name__)

WHALEWATCH_SLUG = 'whalewatch'
WHALEWATCH_PLAN_SLUG = 'radar'

CURSOR_CACHE_KEY = 'whalewatch_scan_cursor'
BATCH_SIZE = int(os.environ.get('WHALEWATCH_BATCH_SIZE', '40'))
HISTORY_HOURS = int(os.environ.get('WHALEWATCH_HISTORY_HOURS', '168'))
MIN_SEVERITY = int(os.environ.get('WHALEWATCH_MIN_SEVERITY', '40'))
ALERT_MAX_AGE_HOURS = int(os.environ.get('WHALEWATCH_ALERT_MAX_AGE_HOURS', '72'))
SNAPSHOT_RETENTION_DAYS = int(os.environ.get('WHALEWATCH_SNAPSHOT_RETENTION_DAYS', '14'))

ALERT_LABELS = {
    'accumulation': 'Acumulación (compras repetidas)',
    'mass_dump': 'Dump masivo',
    'pump_dump': 'Pump & dump',
}

DISCLAIMER = (
    'Señales heurísticas basadas en datos públicos de Steam. '
    'No constituyen asesoramiento financiero ni prueba de manipulación.'
)


def _parse_volume(raw):
    if raw is None:
        return None
    if isinstance(raw, (int, float)):
        return int(raw)
    cleaned = re.sub(r'[^\d]', '', str(raw))
    return int(cleaned) if cleaned else None


def _pct_change(old, new):
    if old is None or new is None or old <= 0:
        return None
    return round((new - old) / old * 100, 2)


def _get_last_snapshot(market_hash_name):
    row = (
        MarketSnapshot.query.filter_by(market_hash_name=market_hash_name)
        .order_by(MarketSnapshot.captured_at.desc())
        .first()
    )
    return row.to_dict() if row else None


def _needs_deep_snapshot(market_hash_name, ref_usd):
    prev = _get_last_snapshot(market_hash_name)
    if not prev or prev.get('reference_usd') is None or ref_usd is None:
        return True
    change = abs(_pct_change(prev['reference_usd'], ref_usd) or 0)
    return change >= 4


def capture_snapshot(market_hash_name, deep=False, overview=None):
    """Registra snapshot. Modo ligero = solo precio/volumen (1 petición Steam)."""
    overview = overview or fetch_reference_price(market_hash_name) or {}
    ref = overview.get('reference_usd')
    lowest = overview.get('lowest_usd')
    median = overview.get('median_usd')
    volume = _parse_volume(overview.get('volume'))

    listing_count = 0
    cheapest = None
    if deep or _needs_deep_snapshot(market_hash_name, ref):
        group_id = fetch_bucket_group_id(market_hash_name)
        if group_id:
            base_name, _ = split_hash_name(market_hash_name)
            listings = fetch_listings_for_group(group_id, base_name=base_name)
            for row in listings:
                h = row.get('market_hash_name')
                if h == market_hash_name or not h:
                    listing_count += 1
                    price = row.get('price_usd')
                    if price is not None and (cheapest is None or price < cheapest):
                        cheapest = price
    else:
        prev = _get_last_snapshot(market_hash_name)
        if prev:
            listing_count = prev.get('listing_count') or 0
            cheapest = prev.get('cheapest_listing_usd')

    row = MarketSnapshot(
        market_hash_name=market_hash_name,
        reference_usd=ref,
        lowest_usd=lowest,
        median_usd=median,
        volume_24h=volume,
        listing_count=listing_count,
        cheapest_listing_usd=cheapest,
    )
    db.session.add(row)
    db.session.commit()
    return row.to_dict()


def _get_history(market_hash_name, hours=None):
    hours = hours or HISTORY_HOURS
    since = datetime.utcnow() - timedelta(hours=hours)
    rows = (
        MarketSnapshot.query.filter(
            MarketSnapshot.market_hash_name == market_hash_name,
            MarketSnapshot.captured_at >= since,
        )
        .order_by(MarketSnapshot.captured_at.asc())
        .all()
    )
    return [r.to_dict() for r in rows]


def _snapshot_at_offset(history, hours_ago):
    if not history:
        return None
    target = datetime.utcnow() - timedelta(hours=hours_ago)
    best = None
    best_delta = None
    for snap in history:
        raw = snap['captured_at']
        if raw.endswith('Z'):
            raw = raw[:-1]
        ts = datetime.fromisoformat(raw)
        delta = abs((ts - target).total_seconds())
        if best_delta is None or delta < best_delta:
            best_delta = delta
            best = snap
    return best


def analyze_patterns(history, latest):
    alerts = []
    if len(history) < 2:
        return alerts

    ref_now = latest.get('reference_usd')
    vol_now = latest.get('volume_24h')
    listings_now = latest.get('listing_count') or 0

    snap_6h = _snapshot_at_offset(history, 6)
    snap_24h = _snapshot_at_offset(history, 24)

    refs = [h['reference_usd'] for h in history if h.get('reference_usd')]
    peak_ref = max(refs) if refs else None
    min_ref = min(refs) if refs else None

    if snap_24h and ref_now and snap_24h.get('reference_usd'):
        price_up = _pct_change(snap_24h['reference_usd'], ref_now)
        vol_up = _pct_change(snap_24h.get('volume_24h'), vol_now)
        list_down = _pct_change(snap_24h.get('listing_count') or 0, listings_now)
        has_listings = (snap_24h.get('listing_count') or 0) > 0 and listings_now > 0

        accumulation_ok = (
            price_up is not None
            and price_up >= 6
            and vol_up is not None
            and vol_up >= 35
        )
        if has_listings:
            accumulation_ok = accumulation_ok and list_down is not None and list_down <= -15
        else:
            accumulation_ok = accumulation_ok and vol_up >= 50 and price_up >= 8

        if accumulation_ok:
            severity = min(100, int(price_up * 2 + vol_up * 0.5))
            summary = (
                f'Precio +{price_up}% y volumen +{vol_up}% en 24h'
                + (
                    f'; listados {list_down}% (posible acumulación).'
                    if has_listings and list_down is not None
                    else ' (posible acumulación).'
                )
            )
            alerts.append({
                'type': 'accumulation',
                'label': ALERT_LABELS['accumulation'],
                'severity': severity,
                'summary': summary,
                'metrics': {
                    'price_change_pct': price_up,
                    'volume_change_pct': vol_up,
                    'listing_change_pct': list_down,
                },
            })

    if snap_6h and ref_now and snap_6h.get('reference_usd'):
        ref_6h = snap_6h['reference_usd']
        price_down = round((ref_6h - ref_now) / ref_6h * 100, 2) if ref_6h > 0 else None
        list_up = _pct_change(snap_6h.get('listing_count') or 0, listings_now)
        vol_up = _pct_change(snap_6h.get('volume_24h'), vol_now)

        dump_ok = price_down is not None and price_down >= 8
        if list_up is not None and list_up >= 50:
            dump_ok = dump_ok and True
        elif vol_up is not None and vol_up >= 80:
            dump_ok = dump_ok and True
        else:
            dump_ok = False

        if dump_ok:
            severity = min(100, int(price_down * 2 + (list_up or vol_up or 0) * 0.4))
            detail = (
                f'listados +{list_up}%'
                if list_up is not None and list_up >= 50
                else f'volumen +{vol_up}%'
            )
            alerts.append({
                'type': 'mass_dump',
                'label': ALERT_LABELS['mass_dump'],
                'severity': severity,
                'summary': (
                    f'Precio -{price_down}% y {detail} en ~6h '
                    f'(posible venta coordinada).'
                ),
                'metrics': {
                    'price_drop_pct': price_down,
                    'listing_change_pct': list_up,
                    'volume_change_pct': vol_up,
                },
            })

    if peak_ref and ref_now and min_ref and len(refs) >= 3:
        pump_from_min = _pct_change(min_ref, peak_ref)
        dump_from_peak = round((peak_ref - ref_now) / peak_ref * 100, 2) if peak_ref > 0 else None
        if (
            pump_from_min is not None
            and pump_from_min >= 12
            and dump_from_peak is not None
            and dump_from_peak >= 10
            and ref_now < peak_ref * 0.92
        ):
            severity = min(100, int(pump_from_min + dump_from_peak))
            alerts.append({
                'type': 'pump_dump',
                'label': ALERT_LABELS['pump_dump'],
                'severity': severity,
                'summary': (
                    f'Patrón pump & dump: subió +{pump_from_min}% y cayó '
                    f'-{dump_from_peak}% desde el pico.'
                ),
                'metrics': {
                    'pump_pct': pump_from_min,
                    'dump_from_peak_pct': dump_from_peak,
                    'peak_reference_usd': peak_ref,
                },
            })

    return alerts


def _upsert_alert(weapon, alert, latest):
    now = datetime.utcnow()
    row = WhaleAlert.query.filter_by(
        market_hash_name=weapon['market_hash_name'],
        alert_type=alert['type'],
    ).first()

    if row:
        row.severity = alert['severity']
        row.summary = alert['summary']
        row.metrics_json = json.dumps(alert.get('metrics') or {})
        row.weapon_id = weapon.get('id')
        row.display_name = weapon.get('display_name')
        row.image = weapon.get('image')
        row.category_label = weapon.get('category_label')
        row.reference_usd = latest.get('reference_usd')
        row.volume_24h = latest.get('volume_24h')
        row.listing_count = latest.get('listing_count')
        row.detected_at = now
        row.updated_at = now
    else:
        row = WhaleAlert(
            market_hash_name=weapon['market_hash_name'],
            alert_type=alert['type'],
            severity=alert['severity'],
            summary=alert['summary'],
            metrics_json=json.dumps(alert.get('metrics') or {}),
            weapon_id=weapon.get('id'),
            display_name=weapon.get('display_name'),
            image=weapon.get('image'),
            category_label=weapon.get('category_label'),
            reference_usd=latest.get('reference_usd'),
            volume_24h=latest.get('volume_24h'),
            listing_count=latest.get('listing_count'),
            detected_at=now,
            updated_at=now,
        )
        db.session.add(row)

    db.session.commit()
    return row


def _process_weapon(weapon):
    market_hash_name = weapon.get('market_hash_name')
    if not market_hash_name:
        return 0

    overview = fetch_reference_price(market_hash_name) or {}
    deep = _needs_deep_snapshot(market_hash_name, overview.get('reference_usd'))
    latest = capture_snapshot(market_hash_name, deep=deep, overview=overview)
    history = _get_history(market_hash_name)

    if len(history) < 2:
        return 0

    saved = 0
    for alert in analyze_patterns(history, latest):
        if alert['severity'] < MIN_SEVERITY:
            continue
        _upsert_alert(weapon, alert, latest)
        saved += 1
    return saved


def _get_catalog_batch():
    items = catalog.load_catalog()
    total = len(items)
    if total == 0:
        return [], 0, 0

    cursor = cache.get(CURSOR_CACHE_KEY) or 0
    cursor = int(cursor) % total
    end = min(cursor + BATCH_SIZE, total)
    batch = items[cursor:end]
    next_cursor = 0 if end >= total else end

    cache.set(CURSOR_CACHE_KEY, next_cursor, ttl_seconds=86400 * 30, persist=True)
    return batch, cursor, total


def _prune_old_data():
    snap_cutoff = datetime.utcnow() - timedelta(days=SNAPSHOT_RETENTION_DAYS)
    MarketSnapshot.query.filter(MarketSnapshot.captured_at < snap_cutoff).delete(
        synchronize_session=False
    )

    alert_cutoff = datetime.utcnow() - timedelta(hours=ALERT_MAX_AGE_HOURS)
    WhaleAlert.query.filter(WhaleAlert.detected_at < alert_cutoff).delete(
        synchronize_session=False
    )
    db.session.commit()


def run_background_scan():
    """Procesa un lote del catálogo completo. Llamado por el scheduler."""
    batch, cursor, total = _get_catalog_batch()
    if not batch:
        return {'scanned': 0, 'alerts_saved': 0, 'catalog_total': 0}

    alerts_saved = 0
    for weapon in batch:
        try:
            alerts_saved += _process_weapon(weapon)
        except Exception:
            logger.exception('WhaleWatch error on %s', weapon.get('market_hash_name'))

    try:
        _prune_old_data()
    except Exception:
        logger.exception('WhaleWatch prune failed')
        db.session.rollback()

    meta = {
        'last_scan_at': datetime.utcnow().isoformat() + 'Z',
        'batch_size': len(batch),
        'cursor': cursor,
        'next_cursor': cache.get(CURSOR_CACHE_KEY) or 0,
        'catalog_total': total,
        'alerts_saved': alerts_saved,
    }
    cache.set('whalewatch_radar_meta', meta, ttl_seconds=86400, persist=True)
    logger.info(
        'WhaleWatch batch: %s items (cursor %s/%s), %s alerts',
        len(batch),
        cursor,
        total,
        alerts_saved,
    )
    return meta


def get_radar_status():
    meta = cache.get('whalewatch_radar_meta') or {}
    catalog_total = meta.get('catalog_total') or len(catalog.load_catalog())
    tracked = db.session.query(MarketSnapshot.market_hash_name).distinct().count()
    active_alerts = WhaleAlert.query.count()

    cursor = meta.get('next_cursor') or cache.get(CURSOR_CACHE_KEY) or 0
    progress_pct = round((cursor / catalog_total) * 100, 1) if catalog_total else 0

    return {
        'catalog_total': catalog_total,
        'tracked_items': tracked,
        'scan_progress_pct': progress_pct,
        'batch_size': BATCH_SIZE,
        'last_scan_at': meta.get('last_scan_at'),
        'active_alerts': active_alerts,
        'disclaimer': DISCLAIMER,
    }


def get_active_alerts(limit=80, alert_type=None):
    query = WhaleAlert.query
    if alert_type and alert_type != 'all':
        query = query.filter(WhaleAlert.alert_type == alert_type)

    rows = query.order_by(WhaleAlert.severity.desc(), WhaleAlert.detected_at.desc()).limit(limit).all()
    return [r.to_dict() for r in rows]
