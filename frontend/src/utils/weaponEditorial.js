function formatPrice(usd) {
  if (usd == null) return null;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(usd);
}

function describeExterior(exterior) {
  const map = {
    'Factory New': 'Factory New (recién fabricada, sin desgaste visible)',
    'Minimal Wear': 'Minimal Wear (ligeramente desgastada)',
    'Field-Tested': 'Field-Tested (desgaste moderado, la más común en juego)',
    'Well-Worn': 'Well-Worn (desgaste notable)',
    'Battle-Scarred': 'Battle-Scarred (muy desgastada, suele ser la opción más económica)',
  };
  return map[exterior] || exterior;
}

export function buildWeaponEditorialParagraphs(weapon, pricing) {
  const name = weapon.display_name;
  const category = weapon.category_label || 'objeto de CS2';
  const rarity = weapon.rarity ? ` rareza ${weapon.rarity}` : '';
  const stattrak = weapon.stattrak
    ? ' Esta variante incluye contador StatTrak™, que registra eliminaciones confirmadas en partidas oficiales.'
    : '';
  const exterior = weapon.exterior
    ? ` El exterior indicado es ${describeExterior(weapon.exterior)}.`
    : '';
  const weaponType = weapon.weapon ? ` Pertenece al arma ${weapon.weapon}.` : '';

  const avg = formatPrice(pricing?.average_price_usd);
  const sources = pricing?.sources_count ?? 0;
  const cheapest = pricing?.top_cheapest?.[0];

  const priceParagraph = avg
    ? sources > 0
      ? `Según nuestra última consulta a ${sources} marketplace${sources !== 1 ? 's' : ''}, el precio medio orientativo de ${name} ronda ${avg}.${cheapest ? ` La oferta más económica detectada estaba en ${cheapest.marketplace_name} por ${formatPrice(cheapest.price_usd)}.` : ''} Recuerda que comisiones, impuestos y tipo de cambio pueden modificar el importe final.`
      : `En este momento no disponemos de precios actualizados para ${name}. Puedes volver más tarde o consultar directamente Steam Community Market y otros mercados especializados.`
    : `Todavía no hemos podido calcular un precio medio fiable para ${name}. Los mercados pueden tardar en indexar nuevos listados o limitar temporalmente las consultas.`;

  return [
    `${name} es un ${category.toLowerCase()} de Counter-Strike 2${rarity}.${weaponType}${exterior}${stattrak} En Global Skin Metrics reunimos ofertas públicas para que compares dónde resulta más conveniente comprar este ítem sin tener que revisar cada marketplace por separado.`,
    priceParagraph,
    'Antes de comprar, comprueba la reputación del vendedor, las comisiones del mercado y que el listado coincida exactamente con el nombre y exterior que buscas. Global Skin Metrics no participa en la transacción: actuamos como herramienta informativa y te redirigimos al sitio donde se formaliza la compra.',
    'Si eres coleccionista o trader, conviene seguir la evolución del precio durante varios días. Las skins de CS2 fluctúan con actualizaciones del juego, torneos profesionales y cambios en la oferta del mercado secundario.',
  ];
}
