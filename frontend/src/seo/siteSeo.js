import { LEGAL } from '../content/legalSite';
import {
  matchLocalizedRoute,
  parseLocalePath,
  pathForRoute,
  SUPPORTED_LOCALES,
  LOCALE_META,
  DEFAULT_LOCALE,
} from '../i18n/routePaths';

export const SITE_SEO = {
  name: LEGAL.siteName,
  titleSuffix: LEGAL.siteName,
  url: LEGAL.url,
  themeColor: '#0a0c10',
  twitterCard: 'summary_large_image',
  ogImage: `${LEGAL.url}/og-global-skin-metrics.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${LEGAL.siteName} — comparador de precios de skins CS2`,
};

const ROUTE_SEO_KEYS = {
  home: 'home',
  howItWorks: 'howItWorks',
  about: 'about',
  guides: 'guides',
  guideBuySafe: 'guideBuySafe',
  guideMarkets: 'guideMarkets',
  guideTerms: 'guideTerms',
  contact: 'contact',
  weapon: 'weapon',
  subscriptions: 'subscriptions',
  legalNotice: 'legalNotice',
  privacy: 'privacy',
  cookies: 'cookies',
  terms: 'terms',
};

const NOINDEX_ROUTES = new Set(['auth', 'profile', 'admin']);

export function getLocaleMeta(locale) {
  return LOCALE_META[locale] || LOCALE_META.es;
}

export function getSeoForLocalizedPath(pathname, t) {
  const matched = matchLocalizedRoute(pathname);
  const locale = matched?.locale || 'es';

  if (matched?.routeId && NOINDEX_ROUTES.has(matched.routeId)) {
    return {
      title: SITE_SEO.name,
      description: t('defaultDescription'),
      noindex: true,
      canonicalPath: pathname,
      locale,
    };
  }

  if (matched?.routeId === 'weapon') {
    return {
      title: t('routes.weapon.title'),
      description: t('routes.weapon.description'),
      canonicalPath: pathname,
      locale,
    };
  }

  if (matched?.routeId === 'subscriptionDetail') {
    return {
      title: t('routes.subscriptions.title', { defaultValue: t('routes.home.title') }),
      description: t('defaultDescription'),
      canonicalPath: pathname,
      locale,
    };
  }

  const seoKey = ROUTE_SEO_KEYS[matched?.routeId];
  if (seoKey) {
    return {
      title: t(`routes.${seoKey}.title`),
      description: t(`routes.${seoKey}.description`),
      canonicalPath: pathname,
      locale,
    };
  }

  return {
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    canonicalPath: pathname,
    locale,
  };
}

export function buildTitle(pageTitle) {
  if (!pageTitle) return `${SITE_SEO.name}`;
  return `${pageTitle} | ${SITE_SEO.titleSuffix}`;
}

export function buildCanonical(path) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_SEO.url}${clean}`;
}

export function slugToDisplayTitle(slug) {
  if (!slug) return 'Skin CS2';
  return slug
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ''))
    .join(' ')
    .replace(/\bStattrak\b/i, 'StatTrak™');
}

export function buildProductJsonLd(weapon, pricing, seoDescription) {
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: weapon.display_name,
    description: seoDescription,
    image: weapon.image || undefined,
    category: weapon.category_label,
  };

  const prices = (pricing?.top_cheapest || [])
    .map((o) => o.price_usd)
    .filter((p) => p != null);

  if (prices.length > 0) {
    product.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: pricing.currency || 'USD',
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: pricing.sources_count || prices.length,
      availability: 'https://schema.org/InStock',
    };
  }

  return product;
}

export function buildWebsiteJsonLd(locale) {
  const meta = getLocaleMeta(locale);
  const basePath = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_SEO.name,
    url: `${SITE_SEO.url}${basePath || '/'}`,
    inLanguage: meta.htmlLang,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_SEO.url}${basePath || ''}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_SEO.name,
    url: SITE_SEO.url,
    email: LEGAL.emails.public,
  };
}

export function buildHreflangLinks(pathname) {
  return SUPPORTED_LOCALES.map((locale) => ({
    hreflang: getLocaleMeta(locale).htmlLang,
    href: buildCanonical(switchLocaleForPath(pathname, locale)),
  }));
}

function switchLocaleForPath(pathname, targetLocale) {
  const matched = matchLocalizedRoute(pathname);
  if (!matched?.routeId) return pathForRoute(targetLocale, 'home');
  return pathForRoute(targetLocale, matched.routeId, matched.params || {});
}

/** @deprecated use getSeoForLocalizedPath */
export function getSeoForPath(pathname) {
  const { locale } = parseLocalePath(pathname);
  return getSeoForLocalizedPath(pathname, (key) => key);
}
