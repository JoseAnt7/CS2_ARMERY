import { Link } from 'react-router-dom';
import '../styles/info.css';

const INFO_NAV = [
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/sobre-nosotros', label: 'Sobre nosotros' },
  { to: '/guias', label: 'Guías' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/', label: 'Catálogo' },
];

export function InfoLayout({ title, children }) {
  return (
    <article className="info-page">
      <header className="info-page__header">
        <h1 className="info-page__title">{title}</h1>
        <nav className="info-page__nav" aria-label="Navegación informativa">
          {INFO_NAV.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="info-page__body">{children}</div>
    </article>
  );
}
