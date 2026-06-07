import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import '../styles/info.css';

export function InfoLayout({ title, children }) {
  const { to } = useLocale();
  const { t } = useTranslation('common');

  const links = [
    { route: 'howItWorks', label: t('infoNav.howItWorks') },
    { route: 'about', label: t('infoNav.about') },
    { route: 'guides', label: t('infoNav.guides') },
    { route: 'contact', label: t('infoNav.contact') },
    { route: 'home', label: t('infoNav.catalog') },
  ];

  return (
    <article className="info-page">
      <header className="info-page__header">
        <h1 className="info-page__title">{title}</h1>
        <nav className="info-page__nav" aria-label={t('infoNav.label')}>
          {links.map((link) => (
            <Link key={link.route} to={to(link.route)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="info-page__body">{children}</div>
    </article>
  );
}
