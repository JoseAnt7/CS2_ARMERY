import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import '../styles/legal.css';

export function LegalLayout({ title, children }) {
  const { t } = useTranslation('common');
  const { to } = useLocale();

  return (
    <article className="legal-page">
      <header className="legal-page__header">
        <h1 className="legal-page__title">{title}</h1>
        <nav className="legal-page__nav" aria-label={t('footer.navLabel')}>
          <Link to={to('legalNotice')}>{t('footer.legalNotice')}</Link>
          <Link to={to('privacy')}>{t('footer.privacy')}</Link>
          <Link to={to('cookies')}>{t('footer.cookies')}</Link>
          <Link to={to('terms')}>{t('footer.terms')}</Link>
          <Link to={to('contact')}>{t('footer.contact')}</Link>
        </nav>
      </header>
      <div className="legal-page__body">{children}</div>
    </article>
  );
}
