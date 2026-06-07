import { Link } from 'react-router-dom';
import { InfoLayout } from '../../../components/InfoLayout';

export function MarketComparisonGuide() {
  return (
    <InfoLayout title="Steam vs Skinport vs DMarket: ¿dónde comprar skins CS2?">
      <p className="info-page__lead">
        No existe un marketplace «perfecto» para todas las situaciones. Cada plataforma tiene
        ventajas distintas en comisiones, métodos de pago, catálogo y velocidad. Esta comparativa
        te ayuda a elegir con criterio.
      </p>

      <h2>Steam Community Market</h2>
      <p>
        <strong>Ventajas:</strong> integración total con tu inventario de Steam, sin riesgo de
        intermediarios externos para la entrega, y acceso directo desde el cliente del juego.
      </p>
      <p>
        <strong>Desventajas:</strong> el saldo de la cartera Steam no se retira a efectivo; las
        comisiones de Steam se aplican en cada transacción; algunos precios pueden ser más altos que
        en mercados alternativos por la comodidad y la liquidez.
      </p>
      <p>
        <strong>Ideal para:</strong> jugadores que quieren skins en su cuenta de Steam rápidamente y
        no necesitan convertir el saldo en dinero real.
      </p>

      <h2>Skinport</h2>
      <p>
        <strong>Ventajas:</strong> interfaz clara, pagos con tarjeta y métodos habituales en Europa,
        catálogo amplio de skins con buena liquidez en cuchillos y rifles populares.
      </p>
      <p>
        <strong>Desventajas:</strong> comisiones de compra y venta; los tiempos de retirada al
        inventario dependen del sistema P2P o automatizado del listado concreto.
      </p>
      <p>
        <strong>Ideal para:</strong> compradores que prefieren pagar en euros y comparar precios
        fuera del ecosistema de saldo Steam.
      </p>

      <h2>DMarket</h2>
      <p>
        <strong>Ventajas:</strong> gran volumen de listados, distintas modalidades de compra y
        promociones frecuentes en objetos populares.
      </p>
      <p>
        <strong>Desventajas:</strong> la curva de aprendizaje puede ser mayor para usuarios nuevos;
        conviene leer las condiciones de cada tipo de listado (P2P, bot, etc.).
      </p>
      <p>
        <strong>Ideal para:</strong> usuarios habituados al trading que buscan variedad y comparan
        muchos precios a la vez.
      </p>

      <h2>Consejo práctico</h2>
      <p>
        Usa un comparador como{' '}
        <Link to="/">Global Skin Metrics</Link> para ver el panorama en USD y luego abre el
        marketplace que mejor encaje con tu método de pago. Revisa siempre el precio final en la
        página de checkout.
      </p>

      <p>
        <Link to="/guias">← Volver a todas las guías</Link>
      </p>
    </InfoLayout>
  );
}
