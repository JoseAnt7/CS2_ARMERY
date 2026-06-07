import { LEGAL } from './legalSite';

export const MARKETPLACES = [
  {
    name: 'Steam Community Market',
    description:
      'Mercado oficial integrado en Steam. Compras con saldo de la cartera; las skins quedan en tu inventario de forma inmediata.',
  },
  {
    name: 'Skinport',
    description:
      'Marketplace europeo muy popular por su interfaz clara y pagos con tarjeta o métodos locales.',
  },
  {
    name: 'DMarket',
    description:
      'Plataforma con gran catálogo y distintas modalidades de compra P2P y automatizada.',
  },
  {
    name: 'Waxpeer',
    description:
      'Mercado alternativo con listados frecuentes; conviene comparar el precio final con comisiones incluidas.',
  },
  {
    name: 'CSFloat',
    description:
      'Especializado en listados con información de float y verificación de pegatinas.',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Explora el catálogo',
    text: 'Busca por nombre, categoría, exterior o rareza entre miles de skins, cuchillos, guantes y objetos de CS2.',
  },
  {
    title: 'Comparamos mercados',
    text: 'Consultamos precios públicos en Steam, Skinport, DMarket, Waxpeer, CSFloat y otras fuentes disponibles.',
  },
  {
    title: 'Elige la mejor oferta',
    text: 'Ordenamos las ofertas de menor a mayor precio en USD para que veas dónde conviene comprar en cada momento.',
  },
  {
    title: 'Compra en el marketplace',
    text: 'Te redirigimos al mercado externo donde se realiza la transacción. Global Skin Metrics no vende ítems ni gestiona pagos.',
  },
];

export const HOME_FAQ = [
  {
    question: '¿Qué es Global Skin Metrics?',
    answer: `${LEGAL.siteName} es un comparador independiente de precios de skins y objetos de Counter-Strike 2. Reunimos ofertas de varios mercados para ayudarte a decidir dónde comprar más barato.`,
  },
  {
    question: '¿Global Skin Metrics vende skins?',
    answer:
      'No. No somos tienda ni intermediarios. Las compras se completan en marketplaces externos como Steam, Skinport o DMarket. Nosotros mostramos información orientativa.',
  },
  {
    question: '¿Los precios son exactos en tiempo real?',
    answer:
      'Los precios se obtienen de fuentes públicas y pueden variar en minutos por ofertas, comisiones o límites de las APIs. Verifica siempre el importe final en el mercado antes de pagar.',
  },
  {
    question: '¿Estáis afiliados a Valve o Counter-Strike?',
    answer:
      'No. No estamos afiliados a Valve Corporation ni a Counter-Strike. Steam y el resto de marcas mencionadas pertenecen a sus respectivos titulares.',
  },
  {
    question: '¿Necesito cuenta para usar el comparador?',
    answer:
      'No. Puedes consultar precios y ofertas sin registrarte. La cuenta es opcional para funciones como alertas o herramientas premium.',
  },
  {
    question: '¿De dónde provienen las imágenes e información de los ítems?',
    answer: `Utilizamos ${LEGAL.imageSources}. Los datos de precio provienen de los mercados enlazados cuando están disponibles.`,
  },
];

export const GUIDES = [
  {
    slug: 'comprar-skins-cs2-seguro',
    title: 'Cómo comprar skins CS2 de forma segura',
    description:
      'Consejos prácticos para evitar estafas, verificar vendedores y comprar con tranquilidad en mercados de confianza.',
  },
  {
    slug: 'steam-vs-skinport-vs-dmarket',
    title: 'Steam vs Skinport vs DMarket',
    description:
      'Comparativa de comisiones, métodos de pago, tiempos de entrega y cuándo conviene usar cada marketplace.',
  },
  {
    slug: 'float-exterior-stattrak',
    title: 'Float, exterior y StatTrak en CS2',
    description:
      'Guía para entender el desgaste, el valor del float y qué implica una skin StatTrak™ al comprar o vender.',
  },
];

export function buildHomeFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
