import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isSupportedLocale,
  pathForRoute,
  resolveLocaleFromPathname,
  switchLocalePath,
} from '../i18n/routePaths';

export function useLocale() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const locale = resolveLocaleFromPathname(pathname);

  const to = useCallback(
    (routeId, routeParams = {}) => pathForRoute(locale, routeId, routeParams),
    [locale],
  );

  const switchTo = useCallback(
    (targetLocale) => {
      if (!isSupportedLocale(targetLocale)) return '/';
      localStorage.setItem(LOCALE_STORAGE_KEY, targetLocale);
      i18n.changeLanguage(targetLocale);
      return switchLocalePath(pathname, targetLocale);
    },
    [i18n, pathname],
  );

  return { locale, to, switchTo };
}
