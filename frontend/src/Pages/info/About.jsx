import { Link } from 'react-router-dom';
import { InfoLayout } from '../../components/InfoLayout';
import { LEGAL } from '../../content/legalSite';

export function About() {
  const titularesText = LEGAL.titulares.map((t) => t.name).join(' y ');

  return (
    <InfoLayout title="Sobre nosotros">
      <p>
        <strong>{LEGAL.siteName}</strong> nació con una idea sencilla: el mercado de skins de
        Counter-Strike 2 está repartido entre muchas plataformas y comparar precios manualmente
        lleva demasiado tiempo. Queremos centralizar esa información de forma clara, honesta y
        accesible para jugadores, coleccionistas y traders de cualquier nivel.
      </p>

      <h2>Nuestra misión</h2>
      <p>
        Ofrecer un comparador fiable y fácil de usar que muestre dónde encontrar mejores precios en
        skins, cuchillos, guantes y otros objetos de CS2, sin obligarte a registrarte ni a
        intermediar en las compras. Creemos que la transparencia de precios beneficia a toda la
        comunidad.
      </p>

      <h2>Quién está detrás</h2>
      <p>
        El proyecto está desarrollado y operado por <strong>{titularesText}</strong>, con domicilio
        en {LEGAL.address}. Somos aficionados al ecosistema de Counter-Strike y a la programación
        web; combinamos ambas áreas para mantener el catálogo y las integraciones con mercados
        externos.
      </p>

      <h2>Qué hacemos y qué no hacemos</h2>
      <ul>
        <li>
          <strong>Sí:</strong> agregamos precios públicos, mostramos ofertas ordenadas y
          documentamos cómo interpretar la información.
        </li>
        <li>
          <strong>Sí:</strong> publicamos textos legales, política de privacidad y un canal de
          contacto real.
        </li>
        <li>
          <strong>No:</strong> vendemos ítems, custodiamos inventarios ni procesamos pagos de skins.
        </li>
        <li>
          <strong>No:</strong> estamos afiliados a Valve Corporation, Steam ni Counter-Strike.
        </li>
      </ul>

      <h2>Fuentes de datos e imágenes</h2>
      <p>
        Las imágenes e identificadores de los objetos proceden de {LEGAL.imageSources}. Los precios
        se obtienen de {LEGAL.externalMarkets}. Trabajamos para mantener el catálogo actualizado,
        pero dependemos de la disponibilidad de cada API externa.
      </p>

      <h2>Infraestructura</h2>
      <p>
        El sitio se aloja en un {LEGAL.hosting.product} de {LEGAL.hosting.provider} (
        {LEGAL.hosting.locationNote}). Priorizamos estabilidad, tiempos de carga razonables y
        cumplimiento del Reglamento General de Protección de Datos (RGPD) para usuarios europeos.
      </p>

      <h2>Contacto y colaboraciones</h2>
      <p>
        Puedes escribirnos para soporte técnico, sugerencias o propuestas de patrocinio desde{' '}
        <Link to="/contacto">Contacto</Link>. También respondemos por correo en{' '}
        <a href={`mailto:${LEGAL.emails.public}`}>{LEGAL.emails.public}</a>.
      </p>

      <p>
        Si quieres entender cómo recopilamos y mostramos precios, visita{' '}
        <Link to="/como-funciona">Cómo funciona</Link>. Para aprender más sobre compra segura y
        terminología del mercado, consulta nuestras <Link to="/guias">guías</Link>.
      </p>
    </InfoLayout>
  );
}
