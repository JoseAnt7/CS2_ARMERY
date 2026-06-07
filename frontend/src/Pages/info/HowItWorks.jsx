import { Link } from 'react-router-dom';
import { InfoLayout } from '../../components/InfoLayout';
import { HOW_IT_WORKS_STEPS, MARKETPLACES } from '../../content/siteContent';
import { LEGAL } from '../../content/legalSite';

export function HowItWorks() {
  return (
    <InfoLayout title="Cómo funciona Global Skin Metrics">
      <p>
        {LEGAL.siteName} es una herramienta gratuita para comparar precios de skins y objetos de
        Counter-Strike 2 en distintos mercados. Nuestro objetivo es ahorrarte tiempo y ayudarte a
        tomar decisiones informadas antes de comprar en el mercado secundario.
      </p>

      <h2>Proceso paso a paso</h2>
      <ol className="info-steps">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <li key={step.title}>
            <strong>
              {index + 1}. {step.title}
            </strong>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>

      <h2>Mercados que comparamos</h2>
      <p>
        Actualmente consultamos ofertas públicas en los siguientes marketplaces cuando hay datos
        disponibles. La lista puede ampliarse según integremos nuevas fuentes:
      </p>
      <ul>
        {MARKETPLACES.map((market) => (
          <li key={market.name}>
            <strong>{market.name}</strong> — {market.description}
          </li>
        ))}
      </ul>

      <h2>De dónde salen los precios</h2>
      <p>
        Los importes mostrados provienen de APIs y listados públicos de cada marketplace. Calculamos
        un precio medio orientativo y destacamos las cinco ofertas más baratas que detectamos en el
        momento de la consulta. No garantizamos que un precio siga vigente al abrir el enlace de
        compra: el mercado secundario de CS2 es dinámico y los listados cambian constantemente.
      </p>

      <h2>Limitaciones importantes</h2>
      <ul>
        <li>
          <strong>No vendemos skins.</strong> Las transacciones se realizan en sitios de terceros bajo
          sus propias condiciones.
        </li>
        <li>
          <strong>No somos asesores financieros.</strong> La información es orientativa y no
          constituye recomendación de inversión.
        </li>
        <li>
          <strong>Steam puede limitar consultas.</strong> En momentos de alta demanda algunos precios
          pueden no estar disponibles temporalmente.
        </li>
        <li>
          <strong>Comisiones y tipo de cambio.</strong> El precio final puede incluir tasas del
          marketplace, conversión de divisa o retirada de fondos.
        </li>
      </ul>

      <h2>Transparencia sobre enlaces</h2>
      <p>
        Los botones «Comprar» te llevan directamente al marketplace correspondiente. En algunos casos
        podríamos utilizar enlaces de afiliado en el futuro; si lo hacemos, lo indicaremos de forma
        clara en esta página y en nuestros{' '}
        <Link to="/terminos">Términos y condiciones</Link>. Hoy mostramos ofertas con fines
        informativos para el usuario.
      </p>

      <h2>¿Necesitas ayuda?</h2>
      <p>
        Si tienes dudas sobre el funcionamiento del comparador, escríbenos desde la página de{' '}
        <Link to="/contacto">Contacto</Link> o consulta nuestras{' '}
        <Link to="/guias">guías para compradores</Link>.
      </p>
    </InfoLayout>
  );
}
