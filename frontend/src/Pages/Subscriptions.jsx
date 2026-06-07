import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { fetchSubscriptions } from '../api/client';
import { SubscriptionCard } from '../components/SubscriptionCard';
import '../styles/catalog.css';
import '../styles/subscriptions.css';

export function Subscriptions() {
  const { t } = useTranslation('subscriptions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscriptions()
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">
          <Trans i18nKey="heroTitle" ns="subscriptions" components={{ span: <span /> }} />
        </h1>
        <p className="hero__subtitle">{t('heroSubtitle')}</p>
      </section>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>{t('loading')}</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{t('loadError', { message: error })}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <p>{t('empty')}</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="subscriptions-grid">
          {items.map((sub) => (
            <SubscriptionCard key={sub.slug} subscription={sub} />
          ))}
        </div>
      )}
    </>
  );
}
