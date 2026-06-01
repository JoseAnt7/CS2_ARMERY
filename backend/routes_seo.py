"""Sitemap dinámico y utilidades SEO en el servidor."""
import os
from datetime import datetime, timezone
from xml.sax.saxutils import escape

from flask import Blueprint, Response

from services import catalog

seo_bp = Blueprint("seo", __name__)

SITE_URL = os.environ.get("SITE_URL", "https://globalskinmetrics.com").rstrip("/")
SITEMAP_MAX_URLS = 50_000

STATIC_PATHS = [
    ("/", "daily", "1.0"),
    ("/suscripciones", "weekly", "0.7"),
    ("/contacto", "monthly", "0.5"),
    ("/aviso-legal", "yearly", "0.3"),
    ("/privacidad", "yearly", "0.3"),
    ("/cookies", "yearly", "0.3"),
    ("/terminos", "yearly", "0.3"),
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


def _weapon_url_entries(items, lastmod):
    lines = []
    for item in items:
        weapon_id = item.get("id")
        if not weapon_id:
            continue
        loc = f"{SITE_URL}/arma/{weapon_id}"
        lines.append(_url_entry(loc, "weekly", "0.8", lastmod))
    return "".join(lines)


def _static_entries():
    return "".join(_url_entry(f"{SITE_URL}{path}", cf, pr) for path, cf, pr in STATIC_PATHS)


@seo_bp.route("/sitemap.xml", methods=["GET"])
def sitemap_index_or_single():
    """Índice si hay muchas URLs; un solo urlset si caben en un archivo."""
    cat = catalog.load_catalog()
    weapon_chunks = []
    for i in range(0, len(cat), SITEMAP_MAX_URLS):
        weapon_chunks.append(cat[i : i + SITEMAP_MAX_URLS])

    lastmod = _lastmod()
    static_count = len(STATIC_PATHS)

    if len(cat) + static_count <= SITEMAP_MAX_URLS:
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
