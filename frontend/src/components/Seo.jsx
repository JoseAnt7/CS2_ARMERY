import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  SITE_SEO,
  buildCanonical,
  buildTitle,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  getSeoForLocalizedPath,
  getLocaleMeta,
  buildHreflangLinks,
} from '../seo/siteSeo';
import { buildHomeFaqJsonLd } from './HomeEditorial';
import { pathForRoute, DEFAULT_LOCALE, matchLocalizedRoute } from '../i18n/routePaths';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href, extra = {}) {
  if (!href) return;
  const selector =
    rel === 'alternate' && extra.hreflang
      ? `link[rel="alternate"][hreflang="${extra.hreflang}"]`
      : `link[rel="${rel}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  if (extra.hreflang) el.setAttribute('hreflang', extra.hreflang);
}

function removeAlternateLinks() {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function Seo({
  title,
  description,
  canonicalPath,
  noindex = false,
  jsonLdExtra = null,
  imageUrl = null,
  imageAlt = null,
  locale = DEFAULT_LOCALE,
}) {
  const location = useLocation();
  const path = canonicalPath ?? location.pathname;
  const fullTitle = buildTitle(title);
  const desc = description;
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';
  const canonical = buildCanonical(path);
  const ogImage = imageUrl || SITE_SEO.ogImage;
  const ogImageAlt = imageAlt || SITE_SEO.ogImageAlt;
  const meta = getLocaleMeta(locale);

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = meta.htmlLang;

    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'author', SITE_SEO.name);
    upsertMeta('name', 'theme-color', SITE_SEO.themeColor);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_SEO.name);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:locale', meta.ogLocale);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:width', String(SITE_SEO.ogImageWidth));
    upsertMeta('property', 'og:image:height', String(SITE_SEO.ogImageHeight));
    upsertMeta('property', 'og:image:alt', ogImageAlt);

    upsertMeta('name', 'twitter:card', SITE_SEO.twitterCard);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);

    upsertLink('canonical', canonical);

    removeAlternateLinks();
    buildHreflangLinks(path).forEach(({ hreflang, href }) => {
      upsertLink('alternate', href, { hreflang });
    });
    const matched = matchLocalizedRoute(path);
    const defaultPath = matched?.routeId
      ? pathForRoute(DEFAULT_LOCALE, matched.routeId, matched.params || {})
      : pathForRoute(DEFAULT_LOCALE, 'home');
    upsertLink('alternate', buildCanonical(defaultPath), { hreflang: 'x-default' });

    upsertJsonLd('jsonld-website', buildWebsiteJsonLd(locale));
    upsertJsonLd('jsonld-organization', buildOrganizationJsonLd());
    if (jsonLdExtra) {
      upsertJsonLd('jsonld-page', jsonLdExtra);
    } else {
      const extra = document.getElementById('jsonld-page');
      if (extra) extra.remove();
    }
  }, [fullTitle, desc, robots, canonical, jsonLdExtra, ogImage, ogImageAlt, meta, path, locale]);

  return null;
}

export function SeoRouteWatcher() {
  const { pathname } = useLocation();
  const { t } = useTranslation('seo');
  const { t: tHome } = useTranslation('home');
  const matched = matchLocalizedRoute(pathname);

  if (matched?.routeId === 'weapon') {
    return null;
  }

  const config = getSeoForLocalizedPath(pathname, t);
  const jsonLdExtra =
    matched?.routeId === 'home' ? buildHomeFaqJsonLd((key, opts) => tHome(key, opts)) : null;

  return (
    <Seo
      title={config.title}
      description={config.description}
      canonicalPath={config.canonicalPath}
      noindex={config.noindex}
      jsonLdExtra={jsonLdExtra}
      locale={config.locale}
    />
  );
}
