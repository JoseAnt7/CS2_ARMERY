import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchUserSubscriptions } from '../api/client';
import { useLocale } from '../hooks/useLocale';
import '../styles/subscriptions.css';

function formatPrice(eur, locale) {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(eur);
}

function formatDate(iso, locale) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ProfileSubscriptionsSection() {
  const { to, locale } = useLocale();
  const { t } = useTranslation('profile');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserSubscriptions()
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2 className="profile-section__title">{t('subs.title')}</h2>
      <p className="profile-section__desc">{t('subs.desc')}</p>

      {loading && <p className="profile-section__desc">{t('subs.loading')}</p>}

      {error && <p className="profile-message profile-message--error">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="profile-placeholder">
          <p>{t('subs.empty')}</p>
          <Link to={to('subscriptions')} className="profile-guard__link" style={{ marginTop: '1rem' }}>
            {t('subs.browsePlans')}
          </Link>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="user-subs-list">
          {items.map((item) => (
            <li key={item.id} className="user-sub-card">
              {item.subscription?.image_url && (
                <img
                  className="user-sub-card__img"
                  src={item.subscription.image_url}
                  alt=""
                />
              )}
              <div className="user-sub-card__body">
                <h3 className="user-sub-card__product">{item.subscription?.name}</h3>
                <p className="user-sub-card__plan">
                  {t('subs.planLabel')} <strong>{item.plan?.name}</strong>
                  {' · '}
                  {formatPrice(item.plan?.price_eur, locale)}
                  <span className="user-sub-card__period">{t('subs.perMonth')}</span>
                </p>
                <p className="user-sub-card__desc">{item.plan?.description}</p>
                <p className="user-sub-card__date">
                  {t('subs.activeSince', { date: formatDate(item.subscribed_at, locale) })}
                </p>
              </div>
              <Link
                to={to('subscriptionDetail', { slug: item.subscription?.slug })}
                className="user-sub-card__link"
              >
                {t('subs.manage')}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to={to('subscriptions')} className="profile-subs-more">
        {t('subs.exploreMore')}
      </Link>
    </section>
  );
}
