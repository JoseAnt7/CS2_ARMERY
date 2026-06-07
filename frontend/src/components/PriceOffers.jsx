import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import '../styles/detail.css';

function formatPrice(usd, locale) {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(usd);
}

export function PriceOffers({ pricing }) {
  const { locale } = useLocale();
  const { t } = useTranslation('catalog');
  const offers = pricing?.top_cheapest ?? [];

  if (!offers.length) {
    return (
      <div className="offers-panel">
        <h2 className="offers-panel__title">{t('detail.offersEmptyTitle')}</h2>
        <p className="offers-panel__subtitle">{t('detail.offersEmptySubtitle')}</p>
        <div className="no-offers">{t('detail.noOffers')}</div>
      </div>
    );
  }

  return (
    <div className="offers-panel">
      <h2 className="offers-panel__title">{t('detail.offersTitle')}</h2>
      <p className="offers-panel__subtitle">
        {t('detail.offersSubtitle', { count: pricing.sources_count })}
      </p>
      <ul className="offer-list">
        {offers.map((offer, index) => (
          <li
            key={offer.marketplace_id}
            className={`offer-row ${index === 0 ? 'offer-row--best' : ''}`}
          >
            <span className="offer-row__rank">{index + 1}</span>
            <div className="offer-row__market">
              <div className="offer-row__market-name">
                <span aria-hidden>{offer.logo}</span>
                {offer.marketplace_name}
              </div>
              {offer.note && <div className="offer-row__note">{offer.note}</div>}
            </div>
            <span className="offer-row__price">{formatPrice(offer.price_usd, locale)}</span>
            <a
              className="offer-row__cta"
              href={offer.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('detail.buy')}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
