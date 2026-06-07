import { Link } from 'react-router-dom';
import { InfoLayout } from '../../../components/InfoLayout';

export function BuySkinsSafelyGuide() {
  return (
    <InfoLayout title="Cómo comprar skins CS2 de forma segura">
      <p className="info-page__lead">
        Comprar skins en el mercado secundario es habitual entre jugadores de Counter-Strike 2, pero
        también es un entorno donde conviene actuar con precaución. Esta guía resume buenas
        prácticas para reducir riesgos de estafa y comprar con tranquilidad.
      </p>

      <h2>1. Usa marketplaces conocidos</h2>
      <p>
        Prioriza plataformas con historial, sistema de reputación y soporte al cliente. Steam
        Community Market es la opción oficial dentro del ecosistema Steam; Skinport, DMarket,
        Waxpeer o CSFloat son alternativas frecuentes en la comunidad. Desconfía de intercambios
        directos por mensaje privado si no conoces al vendedor.
      </p>

      <h2>2. Verifica el listado antes de pagar</h2>
      <p>
        Comprueba que el nombre del ítem, el exterior (Factory New, Field-Tested, etc.) y la
        variante StatTrak coinciden exactamente con lo que buscas. Un error de una letra puede
        convertir una «bargaña» en una compra incorrecta. En Global Skin Metrics puedes abrir la
        ficha del objeto y comparar ofertas antes de saltar al marketplace.
      </p>

      <h2>3. Revisa comisiones y precio final</h2>
      <p>
        El precio más bajo en USD no siempre es el más barato al final: suma comisiones de
        depósito, retirada, conversión de divisa e impuestos locales. Dedica un minuto a calcular el
        coste total antes de confirmar el pago.
      </p>

      <h2>4. Protege tu cuenta de Steam</h2>
      <ul>
        <li>Activa Steam Guard y no compartas códigos de verificación.</li>
        <li>No inicies sesión en sitios sospechosos que imiten Steam.</li>
        <li>Revisa las ofertas de intercambio en el cliente oficial antes de aceptar.</li>
        <li>Desconfía de premios «demasiado buenos para ser verdad» en redes sociales.</li>
      </ul>

      <h2>5. Guarda comprobantes</h2>
      <p>
        Conserva capturas o correos de confirmación de la compra. Si surge un problema con la
        entrega, el soporte del marketplace te pedirá identificadores de transacción y fecha.
      </p>

      <h2>6. Empieza con importes pequeños</h2>
      <p>
        Si es tu primera compra fuera de Steam, prueba con una skin de poco valor para familiarizarte
        con el proceso de depósito, compra y retirada al inventario.
      </p>

      <p>
        <Link to="/guias">← Volver a todas las guías</Link>
      </p>
    </InfoLayout>
  );
}
