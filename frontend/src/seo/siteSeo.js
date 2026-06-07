import { LEGAL } from '../content/legalSite';
import { GUIDES, buildHomeFaqJsonLd } from '../content/siteContent';

/** Configuración SEO central (producción: globalskinmetrics.com). */
export const SITE_SEO = {
  name: LEGAL.siteName,
  titleSuffix: LEGAL.siteName,
  url: LEGAL.url,
  locale: 'es_ES',
  language: 'es',
  defaultTitle: `${LEGAL.siteName} | Comparador de precios de skins CS2`,
  defaultDescription:
    'Compara precios de skins, cuchillos y objetos de Counter-Strike 2 en Steam, Skinport, DMarket, Waxpeer y más. Precios actualizados y ofertas en un solo lugar.',
  defaultKeywords:
    'CS2 skins, precios skins CS2, comparador skins, Counter-Strike 2, Steam market, Skinport, DMarket, Global Skin Metrics',
  themeColor: '#0a0c10',
  twitterCard: 'summary_large_image',
  ogImage: `${LEGAL.url}/og-global-skin-metrics.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${LEGAL.siteName} — comparador de precios de skins CS2`,
};

const PUBLIC_ROUTES = {
  '/': {
    title: 'Comparador de precios de skins CS2',
    description: SITE_SEO.defaultDescription,
  },
  '/como-funciona': {
    title: 'Cómo funciona el comparador',
    description:
      'Aprende cómo Global Skin Metrics compara precios de skins CS2 en Steam, Skinport, DMarket, Waxpeer y más mercados.',
  },
  '/sobre-nosotros': {
    title: 'Sobre nosotros',
    description:
      'Conoce al equipo detrás de Global Skin Metrics, nuestra misión y cómo mantenemos el comparador de skins CS2.',
  },
  '/guias': {
    title: 'Guías para compradores de skins CS2',
    description:
      'Guías originales sobre compra segura, marketplaces y terminología (float, exterior, StatTrak) en Counter-Strike 2.',
  },
  '/suscripciones': {
    title: 'Suscripciones y herramientas premium',
    description: `Planes y herramientas premium de ${LEGAL.siteName}: alertas, CSBot y funciones para traders de skins CS2.`,
  },
  '/aviso-legal': {
    title: 'Aviso legal',
    description: `Información legal y datos del titular del sitio ${LEGAL.siteName}.`,
    noindex: false,
  },
  '/privacidad': {
    title: 'Política de privacidad',
    description: `Cómo tratamos tus datos personales en ${LEGAL.siteName} (RGPD).`,
  },
  '/cookies': {
    title: 'Política de cookies',
    description: `Uso de cookies y publicidad en ${LEGAL.siteName}.`,
  },
  '/terminos': {
    title: 'Términos y condiciones',
    description: `Condiciones de uso del comparador ${LEGAL.siteName}.`,
  },
  '/contacto': {
    title: 'Contacto',
    description: `Contacta con el equipo de ${LEGAL.siteName}: soporte y patrocinios.`,
  },
};

const NOINDEX_PREFIXES = ['/admin', '/cuenta', '/profile'];

export function getSeoForPath(pathname) {
  if (NOINDEX_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return {
      title: LEGAL.siteName,
      description: SITE_SEO.defaultDescription,
      noindex: true,
      canonicalPath: pathname,
    };
  }

  if (pathname.startsWith('/arma/')) {
    return {
      title: 'Precio y ofertas CS2',
      description:
        'Consulta el precio medio y las mejores ofertas de esta skin u objeto de CS2 en varios mercados.',
      canonicalPath: pathname,
    };
  }

  if (pathname.startsWith('/suscripciones/')) {
    return {
      ...PUBLIC_ROUTES['/suscripciones'],
      canonicalPath: pathname,
    };
  }

  const guide = GUIDES.find((g) => pathname === `/guias/${g.slug}`);
  if (guide) {
    return {
      title: guide.title,
      description: guide.description,
      canonicalPath: pathname,
    };
  }

  return {
    ...(PUBLIC_ROUTES[pathname] || {
      title: SITE_SEO.defaultTitle,
      description: SITE_SEO.defaultDescription,
    }),
    canonicalPath: pathname,
  };
}

export function buildTitle(pageTitle) {
  if (!pageTitle) return SITE_SEO.defaultTitle;
  return `${pageTitle} | ${SITE_SEO.titleSuffix}`;
}

export function buildCanonical(path) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_SEO.url}${clean}`;
}

/** Título legible desde slug de URL (/arma/ak-47-redline-ft). */
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

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_SEO.name,
    url: SITE_SEO.url,
    description: SITE_SEO.defaultDescription,
    inLanguage: SITE_SEO.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_SEO.url}/?q={search_term_string}`,
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
