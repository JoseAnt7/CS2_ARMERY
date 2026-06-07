"""Sitemap dinámico y utilidades SEO en el servidor."""
import os
from datetime import datetime, timezone
from xml.sax.saxutils import escape

from flask import Blueprint, Response

from services import catalog

seo_bp = Blueprint("seo", __name__)

SITE_URL = os.environ.get("SITE_URL", "https://globalskinmetrics.com").rstrip("/")
SITEMAP_MAX_URLS = 50_000
SUPPORTED_LOCALES = ("es", "en")

# Debe coincidir con frontend/public/ads.txt y el client en index.html
ADSENSE_PUBLISHER_ID = os.environ.get("ADSENSE_PUBLISHER_ID", "pub-7858627003457160")
ADS_TXT_BODY = (
    f"google.com, {ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0\n"
)

# Rutas estáticas localizadas: (locale, segmento, changefreq, priority)
LOCALIZED_STATIC_PATHS = [
    ("es", "", "daily", "1.0"),
    ("en", "", "daily", "1.0"),
    ("es", "como-funciona", "monthly", "0.9"),
    ("en", "how-it-works", "monthly", "0.9"),
    ("es", "sobre-nosotros", "monthly", "0.8"),
    ("en", "about-us", "monthly", "0.8"),
    ("es", "guias", "monthly", "0.8"),
    ("en", "guides", "monthly", "0.8"),
    ("es", "guias/comprar-skins-cs2-seguro", "monthly", "0.7"),
    ("en", "guides/buy-cs2-skins-safely", "monthly", "0.7"),
    ("es", "guias/steam-vs-skinport-vs-dmarket", "monthly", "0.7"),
    ("en", "guides/steam-vs-skinport-vs-dmarket", "monthly", "0.7"),
    ("es", "guias/float-exterior-stattrak", "monthly", "0.7"),
    ("en", "guides/float-exterior-stattrak", "monthly", "0.7"),
    ("es", "suscripciones", "weekly", "0.7"),
    ("en", "subscriptions", "weekly", "0.7"),
    ("es", "contacto", "monthly", "0.5"),
    ("en", "contact", "monthly", "0.5"),
    ("es", "aviso-legal", "yearly", "0.3"),
    ("en", "legal-notice", "yearly", "0.3"),
    ("es", "privacidad", "yearly", "0.3"),
    ("en", "privacy", "yearly", "0.3"),
    ("es", "cookies", "yearly", "0.3"),
    ("en", "cookies", "yearly", "0.3"),
    ("es", "terminos", "yearly", "0.3"),
    ("en", "terms", "yearly", "0.3"),
]


def _lastmod():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _url_entry(loc, changefreq, priority, lastmod=None):
    lm = lastmod or _lastmod()
    return (
        "  <url>\n"
        f"    <loc>{escape(loc)}</loc>\n"
        f"    <lastmod>{lm}</lastmod>\n"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>\n"
    )


def _build_urlset(entries_xml):
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{entries_xml}"
        "</urlset>"
    )


def _build_sitemap_index(sitemap_urls):
    body = ""
    for loc in sitemap_urls:
        body += (
            "  <sitemap>\n"
            f"    <loc>{escape(loc)}</loc>\n"
            f"    <lastmod>{_lastmod()}</lastmod>\n"
            "  </sitemap>\n"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{body}"
        "</sitemapindex>"
    )


def _path_for_locale(locale, segment):
    if locale == "es":
        return f"/{segment}" if segment else "/"
    return f"/en/{segment}" if segment else "/en"


def _weapon_url_entries(items, lastmod):
    lines = []
    for item in items:
        weapon_id = item.get("id")
        if not weapon_id:
            continue
        lines.append(_url_entry(f"{SITE_URL}/arma/{weapon_id}", "weekly", "0.8", lastmod))
        lines.append(_url_entry(f"{SITE_URL}/en/arma/{weapon_id}", "weekly", "0.8", lastmod))
    return "".join(lines)


def _static_entries():
    lines = []
    for locale, segment, cf, pr in LOCALIZED_STATIC_PATHS:
        path = _path_for_locale(locale, segment)
        lines.append(_url_entry(f"{SITE_URL}{path}", cf, pr))
    return "".join(lines)


@seo_bp.route("/ads.txt", methods=["GET"])
def ads_txt():
    """Respaldo si el estático de Nginx no está disponible (AdSense)."""
    return Response(ADS_TXT_BODY, mimetype="text/plain; charset=utf-8")


@seo_bp.route("/sitemap.xml", methods=["GET"])
def sitemap_index_or_single():
    """Índice si hay muchas URLs; un solo urlset si caben en un archivo."""
    cat = catalog.load_catalog()
    weapon_chunks = []
    for i in range(0, len(cat), SITEMAP_MAX_URLS):
        weapon_chunks.append(cat[i : i + SITEMAP_MAX_URLS])

    lastmod = _lastmod()
    static_count = len(LOCALIZED_STATIC_PATHS)

    if len(cat) * len(SUPPORTED_LOCALES) + static_count <= SITEMAP_MAX_URLS:
        entries = _static_entries() + _weapon_url_entries(cat, lastmod)
        xml = _build_urlset(entries)
    else:
        sitemap_locs = [f"{SITE_URL}/sitemap-static.xml"]
        for n in range(len(weapon_chunks)):
            sitemap_locs.append(f"{SITE_URL}/sitemap-weapons-{n + 1}.xml")
        xml = _build_sitemap_index(sitemap_locs)

    return Response(xml, mimetype="application/xml")


@seo_bp.route("/sitemap-static.xml", methods=["GET"])
def sitemap_static():
    xml = _build_urlset(_static_entries())
    return Response(xml, mimetype="application/xml")


@seo_bp.route("/sitemap-weapons-<int:chunk>.xml", methods=["GET"])
def sitemap_weapons_chunk(chunk):
    """chunk es 1-based."""
    cat = catalog.load_catalog()
    start = (chunk - 1) * SITEMAP_MAX_URLS
    if start >= len(cat):
        return Response("Not found", status=404)
    end = start + SITEMAP_MAX_URLS
    entries = _weapon_url_entries(cat[start:end], _lastmod())
    xml = _build_urlset(entries)
    return Response(xml, mimetype="application/xml")
