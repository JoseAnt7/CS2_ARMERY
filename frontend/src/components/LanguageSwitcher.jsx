import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LOCALE_META, SUPPORTED_LOCALES } from '../i18n/routePaths';
import { useLocale } from '../hooks/useLocale';
import '../styles/layout.css';

export function LanguageSwitcher({ className = '' }) {
  const { locale, switchTo } = useLocale();
  const { i18n, t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();

  const activeLocale =
    locale || (i18n.language?.startsWith('en') ? 'en' : 'es');

  function handleChange(nextLocale) {
    if (nextLocale === activeLocale) return;
    const path = switchTo(nextLocale);
    navigate(`${path}${location.search}${location.hash}`, { replace: true });
  }

  return (
    <div className={`lang-switcher ${className}`.trim()} role="group" aria-label={t('lang.label')}>
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switcher__btn ${code === activeLocale ? 'lang-switcher__btn--active' : ''}`}
          aria-pressed={code === activeLocale}
          aria-label={LOCALE_META[code].name}
          onClick={() => handleChange(code)}
        >
          {LOCALE_META[code].label}
        </button>
      ))}
    </div>
  );
}
