import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esGuidesContent from './locales/es/guidesContent.json';
import enGuidesContent from './locales/en/guidesContent.json';

import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esInfo from './locales/es/info.json';
import esCatalog from './locales/es/catalog.json';
import esSeo from './locales/es/seo.json';
import esCookies from './locales/es/cookies.json';
import esContact from './locales/es/contact.json';
import esAuth from './locales/es/auth.json';
import esProfile from './locales/es/profile.json';
import esAdmin from './locales/es/admin.json';
import esSubscriptions from './locales/es/subscriptions.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enInfo from './locales/en/info.json';
import enCatalog from './locales/en/catalog.json';
import enSeo from './locales/en/seo.json';
import enCookies from './locales/en/cookies.json';
import enContact from './locales/en/contact.json';
import enAuth from './locales/en/auth.json';
import enProfile from './locales/en/profile.json';
import enAdmin from './locales/en/admin.json';
import enSubscriptions from './locales/en/subscriptions.json';

import { DEFAULT_LOCALE, resolveLocaleFromPathname } from './routePaths';

const resources = {
  es: {
    common: esCommon,
    home: esHome,
    info: esInfo,
    catalog: esCatalog,
    seo: esSeo,
    cookies: esCookies,
    contact: esContact,
    guidesContent: esGuidesContent,
    auth: esAuth,
    profile: esProfile,
    admin: esAdmin,
    subscriptions: esSubscriptions,
  },
  en: {
    common: enCommon,
    home: enHome,
    info: enInfo,
    catalog: enCatalog,
    seo: enSeo,
    cookies: enCookies,
    contact: enContact,
    guidesContent: enGuidesContent,
    auth: enAuth,
    profile: enProfile,
    admin: enAdmin,
    subscriptions: enSubscriptions,
  },
};

const initialLocale =
  typeof window !== 'undefined'
    ? resolveLocaleFromPathname(window.location.pathname)
    : DEFAULT_LOCALE;

i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: ['es', 'en'],
  defaultNS: 'common',
  ns: ['common', 'home', 'info', 'catalog', 'seo', 'cookies', 'contact', 'guidesContent', 'auth', 'profile', 'admin', 'subscriptions'],
  interpolation: { escapeValue: false },
});

export default i18n;
