import { Link } from 'react-router-dom';
import { InfoLayout } from '../../components/InfoLayout';
import { GUIDES } from '../../content/siteContent';

export function GuidesIndex() {
  return (
    <InfoLayout title="Guías para compradores de skins CS2">
      <p>
        Estas guías están redactadas por el equipo de Global Skin Metrics para ayudarte a comprar
        con criterio, entender la terminología del mercado y elegir el marketplace adecuado según
        tu situación. Son contenido editorial original, independiente de los listados automáticos
        del catálogo.
      </p>

      <ul className="guides-list">
        {GUIDES.map((guide) => (
          <li key={guide.slug} className="guides-list__item">
            <Link to={`/guias/${guide.slug}`} className="guides-list__link">
              <strong>{guide.title}</strong>
              <span>{guide.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p>
        ¿Prefieres comparar precios directamente? Vuelve al{' '}
        <Link to="/">catálogo de skins CS2</Link> o lee{' '}
        <Link to="/como-funciona">cómo funciona el comparador</Link>.
      </p>
    </InfoLayout>
  );
}
