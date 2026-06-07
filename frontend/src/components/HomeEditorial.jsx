import { Link } from 'react-router-dom';
import { HOME_FAQ, HOW_IT_WORKS_STEPS, MARKETPLACES } from '../content/siteContent';
import { LEGAL } from '../content/legalSite';
import '../styles/info.css';

export function HomeEditorial() {
  return (
    <div className="home-editorial">
      <section className="home-editorial__section" aria-labelledby="home-about-title">
        <h2 id="home-about-title" className="home-editorial__title">
          ¿Qué es {LEGAL.siteName}?
        </h2>
        <p>
          Somos un comparador independiente de precios para skins, cuchillos, guantes y objetos de
          Counter-Strike 2. Consultamos ofertas públicas en varios marketplaces y las ordenamos para
          que encuentres rápidamente dónde comprar más barato. No vendemos ítems ni gestionamos
          pagos: te informamos y te redirigimos al mercado donde se completa la transacción.
        </p>
        <p>
          <Link to="/como-funciona">Descubre cómo funciona el comparador →</Link>
        </p>
      </section>

      <section className="home-editorial__section" aria-labelledby="home-steps-title">
        <h2 id="home-steps-title" className="home-editorial__title">
          Cómo funciona en cuatro pasos
        </h2>
        <ol className="home-steps">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <li key={step.title} className="home-steps__item">
              <span className="home-steps__num" aria-hidden>
                {index + 1}
              </span>
              <div>
                <h3 className="home-steps__heading">{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-editorial__section" aria-labelledby="home-markets-title">
        <h2 id="home-markets-title" className="home-editorial__title">
          Mercados que comparamos
        </h2>
        <ul className="home-markets">
          {MARKETPLACES.map((market) => (
            <li key={market.name} className="home-markets__item">
              <strong>{market.name}</strong>
              <span>{market.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-editorial__section" aria-labelledby="home-guides-title">
        <h2 id="home-guides-title" className="home-editorial__title">
          Guías para compradores
        </h2>
        <p>
          Además del comparador, publicamos contenido editorial para ayudarte a comprar con criterio
          y entender el mercado de CS2.
        </p>
        <ul className="home-guides-links">
          <li>
            <Link to="/guias/comprar-skins-cs2-seguro">Cómo comprar skins CS2 de forma segura</Link>
          </li>
          <li>
            <Link to="/guias/steam-vs-skinport-vs-dmarket">Steam vs Skinport vs DMarket</Link>
          </li>
          <li>
            <Link to="/guias/float-exterior-stattrak">Float, exterior y StatTrak explicados</Link>
          </li>
        </ul>
        <p>
          <Link to="/guias">Ver todas las guías →</Link>
        </p>
      </section>

      <section className="home-editorial__section" aria-labelledby="home-faq-title">
        <h2 id="home-faq-title" className="home-editorial__title">
          Preguntas frecuentes
        </h2>
        <dl className="home-faq">
          {HOME_FAQ.map((item) => (
            <div key={item.question} className="home-faq__item">
              <dt className="home-faq__question">{item.question}</dt>
              <dd className="home-faq__answer">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="home-editorial__trust">
        <p>
          ¿Tienes dudas o quieres colaborar? Visita{' '}
          <Link to="/sobre-nosotros">Sobre nosotros</Link> o escríbenos en{' '}
          <Link to="/contacto">Contacto</Link>. Consulta también nuestro{' '}
          <Link to="/aviso-legal">Aviso legal</Link> y la <Link to="/privacidad">Política de privacidad</Link>.
        </p>
      </section>
    </div>
  );
}

export { buildHomeFaqJsonLd } from '../content/siteContent';
