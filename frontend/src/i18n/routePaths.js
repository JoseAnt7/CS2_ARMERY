/** Rutas localizadas: español sin prefijo (default), inglés bajo /en/ */

export const SUPPORTED_LOCALES = ['es', 'en'];
export const DEFAULT_LOCALE = 'es';
export const LOCALE_STORAGE_KEY = 'gsm_locale';
export const PREFIXED_LOCALES = ['en'];

export const LOCALE_META = {
  es: { ogLocale: 'es_ES', htmlLang: 'es', label: 'ES', name: 'Español' },
  en: { ogLocale: 'en_US', htmlLang: 'en', label: 'EN', name: 'English' },
};

/** id interno → segmento de URL por idioma (sin barra inicial). */
export const ROUTES = {
  home: { es: '', en: '' },
  howItWorks: { es: 'como-funciona', en: 'how-it-works' },
  about: { es: 'sobre-nosotros', en: 'about-us' },
  guides: { es: 'guias', en: 'guides' },
  guideBuySafe: {
    es: 'guias/comprar-skins-cs2-seguro',
    en: 'guides/buy-cs2-skins-safely',
  },
  guideMarkets: {
    es: 'guias/steam-vs-skinport-vs-dmarket',
    en: 'guides/steam-vs-skinport-vs-dmarket',
  },
  guideTerms: {
    es: 'guias/float-exterior-stattrak',
    en: 'guides/float-exterior-stattrak',
  },
  contact: { es: 'contacto', en: 'contact' },
  legalNotice: { es: 'aviso-legal', en: 'legal-notice' },
  privacy: { es: 'privacidad', en: 'privacy' },
  cookies: { es: 'cookies', en: 'cookies' },
  terms: { es: 'terminos', en: 'terms' },
  subscriptions: { es: 'suscripciones', en: 'subscriptions' },
  auth: { es: 'cuenta', en: 'account' },
  profile: { es: 'profile', en: 'profile' },
  admin: { es: 'admin', en: 'admin' },
};

const ES_SEGMENT_TO_ROUTE = {
  '': 'home',
  'como-funciona': 'howItWorks',
  'sobre-nosotros': 'about',
  guias: 'guides',
  'guias/comprar-skins-cs2-seguro': 'guideBuySafe',
  'guias/steam-vs-skinport-vs-dmarket': 'guideMarkets',
  'guias/float-exterior-stattrak': 'guideTerms',
  contacto: 'contact',
  'aviso-legal': 'legalNotice',
  privacidad: 'privacy',
  cookies: 'cookies',
  terminos: 'terms',
  suscripciones: 'subscriptions',
  cuenta: 'auth',
  profile: 'profile',
  admin: 'admin',
};

const EN_SEGMENT_TO_ROUTE = {
  '': 'home',
  'how-it-works': 'howItWorks',
  'about-us': 'about',
  guides: 'guides',
  'guides/buy-cs2-skins-safely': 'guideBuySafe',
  'guides/steam-vs-skinport-vs-dmarket': 'guideMarkets',
  'guides/float-exterior-stattrak': 'guideTerms',
  contact: 'contact',
  'legal-notice': 'legalNotice',
  privacy: 'privacy',
  cookies: 'cookies',
  terms: 'terms',
  subscriptions: 'subscriptions',
  account: 'auth',
  profile: 'profile',
  admin: 'admin',
};

export function isSupportedLocale(value) {
  return SUPPORTED_LOCALES.includes(value);
}

export function localeUsesPrefix(locale) {
  return PREFIXED_LOCALES.includes(locale);
}

/** Resuelve el idioma activo a partir de la URL. */
export function resolveLocaleFromPathname(pathname) {
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return 'en';
  }
  return DEFAULT_LOCALE;
}

export function parseLocalePath(pathname) {
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const rest = pathname === '/en' ? '' : pathname.slice(4);
    return { locale: 'en', path: rest ? `/${rest}` : '/', rest };
  }

  if (pathname === '/es' || pathname.startsWith('/es/')) {
    const rest = pathname === '/es' ? '' : pathname.slice(4);
    return { locale: 'es', path: rest ? `/${rest}` : '/', rest };
  }

  const rest = pathname.replace(/^\//, '');
  return { locale: DEFAULT_LOCALE, path: pathname, rest };
}

function joinPath(prefix, segment) {
  if (!segment) return prefix || '/';
  return `${prefix}/${segment}`.replace(/\/+/g, '/');
}

export function pathForRoute(locale, routeId, params = {}) {
  if (!isSupportedLocale(locale)) locale = DEFAULT_LOCALE;

  const prefix = localeUsesPrefix(locale) ? `/${locale}` : '';

  if (routeId === 'weapon') {
    return joinPath(prefix, `arma/${params.id || ''}`);
  }
  if (routeId === 'subscriptionDetail') {
    const base = ROUTES.subscriptions[locale];
    return joinPath(prefix, `${base}/${params.slug || ''}`);
  }

  const segment = ROUTES[routeId]?.[locale];
  if (segment === undefined) return prefix || '/';
  if (segment === '') return prefix || '/';

  return joinPath(prefix, segment);
}

function matchRest(locale, rest) {
  if (!rest) {
    return { locale, routeId: 'home' };
  }

  if (rest.startsWith('arma/')) {
    return { locale, routeId: 'weapon', params: { id: rest.slice(5) } };
  }

  const subBase = ROUTES.subscriptions[locale];
  if (rest.startsWith(`${subBase}/`)) {
    return {
      locale,
      routeId: 'subscriptionDetail',
      params: { slug: rest.slice(subBase.length + 1) },
    };
  }

  const map = locale === 'en' ? EN_SEGMENT_TO_ROUTE : ES_SEGMENT_TO_ROUTE;
  const routeId = map[rest];
  if (routeId) {
    return { locale, routeId };
  }

  return { locale, routeId: null, rest };
}

export function matchLocalizedRoute(pathname) {
  const { locale, rest } = parseLocalePath(pathname);
  return matchRest(locale, rest);
}

export function switchLocalePath(pathname, targetLocale) {
  const matched = matchLocalizedRoute(pathname);
  if (!matched?.routeId) {
    return pathForRoute(targetLocale, 'home');
  }
  return pathForRoute(targetLocale, matched.routeId, matched.params || {});
}

/** Redirige /es/… al path sin prefijo (español = URL canónica). */
export function stripEsPrefix(pathname) {
  if (pathname === '/es') return '/';
  if (pathname.startsWith('/es/')) {
    const stripped = pathname.slice(3);
    return stripped || '/';
  }
  return pathname;
}

/** Redirige rutas EN sueltas en raíz hacia /en/… */
export function englishRootPathToLocalized(pathname) {
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '');
  const routeId = EN_SEGMENT_TO_ROUTE[clean];
  if (routeId) {
    return pathForRoute('en', routeId);
  }
  if (clean.startsWith('subscriptions/')) {
    const slug = clean.slice('subscriptions/'.length);
    return pathForRoute('en', 'subscriptionDetail', { slug });
  }
  return null;
}

export function allLocalizedStaticPaths() {
  const paths = [];
  for (const locale of SUPPORTED_LOCALES) {
    for (const routeId of Object.keys(ROUTES)) {
      paths.push(pathForRoute(locale, routeId));
    }
  }
  return paths;
}
