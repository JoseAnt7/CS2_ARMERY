"""Programador de tareas en background (catálogo + índices de precios)."""
import logging
import os
from datetime import datetime, timedelta

from services.refresh_jobs import (
    refresh_catalog_job,
    refresh_price_indexes_job,
    whalewatch_scan_job,
)

logger = logging.getLogger(__name__)

_scheduler = None


def init_scheduler(app):
    global _scheduler
    if _scheduler is not None:
        return _scheduler
    if os.environ.get("ENABLE_SCHEDULER", "1") != "1":
        return None

    try:
        from zoneinfo import ZoneInfo

        from apscheduler.schedulers.background import BackgroundScheduler
        from apscheduler.triggers.cron import CronTrigger
        from apscheduler.triggers.interval import IntervalTrigger
    except ImportError as exc:
        logger.warning(
            "Scheduler desactivado: falta dependencia (%s). "
            "Ejecuta: pip install -r requirements.txt",
            exc,
        )
        return None

    tz_name = os.environ.get("SCHEDULER_TZ", "Europe/Madrid")
    catalog_hour = int(os.environ.get("CATALOG_REFRESH_HOUR", "4"))
    price_hours = int(os.environ.get("PRICE_INDEX_REFRESH_HOURS", "4"))
    whalewatch_minutes = int(os.environ.get("WHALEWATCH_SCAN_INTERVAL_MIN", "20"))
    startup_delay = int(os.environ.get("PRICE_INDEX_STARTUP_DELAY_MIN", "2"))
    whalewatch_delay = int(os.environ.get("WHALEWATCH_STARTUP_DELAY_MIN", "5"))

    try:
        tz = ZoneInfo(tz_name)
    except Exception:
        logger.warning("Zona horaria %s no disponible; usando UTC", tz_name)
        tz_name = "UTC"
        tz = ZoneInfo("UTC")

    scheduler = BackgroundScheduler(timezone=tz_name)

    scheduler.add_job(
        refresh_catalog_job,
        CronTrigger(hour=catalog_hour, minute=0),
        id="refresh_catalog",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )

    scheduler.add_job(
        refresh_price_indexes_job,
        IntervalTrigger(hours=price_hours),
        id="refresh_price_indexes",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
        next_run_time=datetime.now(tz) + timedelta(minutes=startup_delay),
    )

    if os.environ.get("ENABLE_WHALEWATCH_SCANNER", "1") == "1":
        scheduler.add_job(
            whalewatch_scan_job,
            IntervalTrigger(minutes=whalewatch_minutes),
            id="whalewatch_scan",
            replace_existing=True,
            max_instances=1,
            coalesce=True,
            next_run_time=datetime.now(tz) + timedelta(minutes=whalewatch_delay),
        )

    scheduler.start()
    _scheduler = scheduler
    logger.info(
        "Scheduler started (catalog daily at %02d:00 %s, price indexes every %sh, "
        "WhaleWatch every %smin)",
        catalog_hour,
        tz_name,
        price_hours,
        whalewatch_minutes,
    )
    return scheduler


def shutdown_scheduler():
    global _scheduler
    if _scheduler:
        _scheduler.shutdown(wait=False)
        _scheduler = None
