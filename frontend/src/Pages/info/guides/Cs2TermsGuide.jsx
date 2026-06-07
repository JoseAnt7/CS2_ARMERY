import { Link } from 'react-router-dom';
import { InfoLayout } from '../../../components/InfoLayout';

export function Cs2TermsGuide() {
  return (
    <InfoLayout title="Float, exterior y StatTrak: conceptos clave al comprar skins CS2">
      <p className="info-page__lead">
        Si eres nuevo en el mercado de skins, verás términos como «Field-Tested», «float 0.15» o
        «StatTrak» en casi todos los listados. Entenderlos evita pagar de más o comprar un objeto
        distinto al que querías.
      </p>

      <h2>Exterior (wear)</h2>
      <p>
        El exterior describe el desgaste visual de la skin y se divide en cinco grados, de mejor a
        peor estado aparente:
      </p>
      <ul>
        <li>
          <strong>Factory New (FN)</strong> — aspecto nuevo, sin desgaste visible. Suele ser la
          variante más cara.
        </li>
        <li>
          <strong>Minimal Wear (MW)</strong> — pequeñas marcas de uso, a menudo difíciles de ver en
          juego.
        </li>
        <li>
          <strong>Field-Tested (FT)</strong> — desgaste moderado; es la más común en partidas
          competitivas.
        </li>
        <li>
          <strong>Well-Worn (WW)</strong> — desgaste evidente en grandes zonas del arma.
        </li>
        <li>
          <strong>Battle-Scarred (BS)</strong> — aspecto muy desgastado; opción económica para quien
          prioriza precio sobre estética.
        </li>
      </ul>

      <h2>Float (valor de desgaste)</h2>
      <p>
        El float es un número entre 0 y 1 que determina dónde cae la skin dentro de su categoría de
        exterior. Por ejemplo, dos skins Field-Tested pueden verse distintas si una tiene float 0.18
        y otra 0.37. Coleccionistas y traders valoran floats bajos dentro del mismo exterior porque
        afectan a la apariencia (menos rasguños en zonas visibles).
      </p>
      <p>
        Mercados como CSFloat muestran el float con precisión. Si no te importa la estética
        minuciosa, puedes ahorrar eligiendo floats altos dentro del mismo exterior.
      </p>

      <h2>StatTrak™</h2>
      <p>
        Las versiones StatTrak incluyen un contador digital en el arma que registra eliminaciones
        confirmadas mientras usas esa skin en partidas oficiales compatibles. Suelen costar más que
        la versión normal del mismo diseño. No confundas StatTrak con Souvenir: son categorías
        distintas con orígenes y mercados diferentes.
      </p>

      <h2>Cómo aplicarlo al comparar precios</h2>
      <p>
        En el <Link to="/">catálogo de Global Skin Metrics</Link> filtra por exterior y abre la
        ficha del ítem para ver ofertas ordenadas. Compara siempre dentro del mismo exterior y
        variante (StatTrak sí/no) antes de decidirte.
      </p>

      <p>
        <Link to="/guias">← Volver a todas las guías</Link>
      </p>
    </InfoLayout>
  );
}
