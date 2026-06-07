import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reopenCookieBanner } from '../utils/cookieConsent';
import { useLocale } from '../hooks/useLocale';
import '../styles/layout.css';

export function Footer() {
  const { to } = useLocale();
  const { t } = useTranslation('common');

  return (
    <footer className="site-footer">
      <p>{t('footer.disclaimer')}</p>
      <nav className="site-footer__legal" aria-label={t('footer.navLabel')}>
        <Link to={to('howItWorks')}>{t('footer.howItWorks')}</Link>
        <Link to={to('about')}>{t('footer.about')}</Link>
        <Link to={to('guides')}>{t('footer.guides')}</Link>
        <Link to={to('legalNotice')}>{t('footer.legalNotice')}</Link>
        <Link to={to('privacy')}>{t('footer.privacy')}</Link>
        <Link to={to('cookies')}>{t('footer.cookies')}</Link>
        <Link to={to('terms')}>{t('footer.terms')}</Link>
        <Link to={to('contact')}>{t('footer.contact')}</Link>
        <button
          type="button"
          className="site-footer__cookie-btn"
          onClick={reopenCookieBanner}
        >
          {t('footer.cookieSettings')}
        </button>
      </nav>
    </footer>
  );
}
