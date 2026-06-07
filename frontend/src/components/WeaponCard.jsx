import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';

function formatPrice(usd, locale) {
  if (usd == null) return null;
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(usd);
}

export function WeaponCard({ weapon }) {
  const { to, locale } = useLocale();
  const { t } = useTranslation('catalog');
  const priceLabel = formatPrice(weapon.preview_price_usd, locale);

  return (
    <Link to={to('weapon', { id: weapon.id })} className="weapon-card">
      <div className="weapon-card__image-wrap">
        {weapon.image ? (
          <img
            className="weapon-card__image"
            src={weapon.image}
            alt={weapon.display_name}
            loading="lazy"
          />
        ) : (
          <span style={{ opacity: 0.3 }}>{t('card.noImage')}</span>
        )}
        <div
          className="weapon-card__rarity"
          style={{ background: weapon.rarity_color || '#b0c3d9' }}
        />
      </div>
      <div className="weapon-card__body">
        <h3 className="weapon-card__name">{weapon.display_name}</h3>
        <p className="weapon-card__meta">{weapon.category_label}</p>
        {priceLabel ? (
          <p className="weapon-card__price">{t('card.from', { price: priceLabel })}</p>
        ) : (
          <p className="weapon-card__price weapon-card__price--muted">{t('card.seePrices')}</p>
        )}
      </div>
    </Link>
  );
}
