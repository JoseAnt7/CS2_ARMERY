import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  LOCALE_STORAGE_KEY,
  resolveLocaleFromPathname,
} from '../i18n/routePaths';

export function LocaleLayout() {
  const { pathname } = useLocation();
  const locale = resolveLocaleFromPathname(pathname);
  const { i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return <Outlet />;
}
