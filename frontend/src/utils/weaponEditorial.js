import i18n from '../i18n';

function formatPrice(usd) {
  if (usd == null) return null;
  return new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(usd);
}

function describeExterior(exterior) {
  const key = `catalog:editorial.exteriors.${exterior}`;
  const translated = i18n.t(key);
  return translated !== key ? translated : exterior;
}

export function buildWeaponEditorialParagraphs(weapon, pricing) {
  const name = weapon.display_name;
  const category = weapon.category_label || 'objeto de CS2';
  const rarity = weapon.rarity ? i18n.t('catalog:editorial.rarityPrefix', { rarity: weapon.rarity }) : '';
  const stattrak = weapon.stattrak ? i18n.t('catalog:editorial.stattrakNote') : '';
  const exterior = weapon.exterior
    ? i18n.t('catalog:editorial.exteriorPrefix', { exterior: describeExterior(weapon.exterior) })
    : '';
  const weaponType = weapon.weapon
    ? i18n.t('catalog:editorial.weaponPrefix', { weapon: weapon.weapon })
    : '';

  const avg = formatPrice(pricing?.average_price_usd);
  const sources = pricing?.sources_count ?? 0;
  const cheapest = pricing?.top_cheapest?.[0];
  const countSuffix = sources !== 1 ? 's' : '';

  let priceParagraph;
  if (avg && sources > 0) {
    const cheapestPart = cheapest
      ? i18n.t('catalog:editorial.cheapest', {
          market: cheapest.marketplace_name,
          price: formatPrice(cheapest.price_usd),
        })
      : '';
    priceParagraph = i18n.t('catalog:editorial.priceWithData', {
      count: sources,
      countSuffix,
      name,
      avg,
      cheapest: cheapestPart,
    });
  } else if (avg) {
    priceParagraph = i18n.t('catalog:editorial.priceNoData', { name });
  } else {
    priceParagraph = i18n.t('catalog:editorial.priceNoAvg', { name });
  }

  return [
    i18n.t('catalog:editorial.intro', {
      name,
      category: category.toLowerCase(),
      rarity,
      weapon: weaponType,
      exterior,
      stattrak,
    }),
    priceParagraph,
    i18n.t('catalog:editorial.advice'),
    i18n.t('catalog:editorial.trader'),
  ];
}
