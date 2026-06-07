import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchSubscriptionDetail, subscribeToPlan } from '../api/client';
import { useLocale } from '../hooks/useLocale';
import '../styles/subscriptions.css';
import '../styles/catalog.css';

function formatPrice(eur, locale) {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(eur);
}

export function SubscriptionDetail() {
  const { to, locale } = useLocale();
  const { t } = useTranslation('subscriptions');
  const { slug } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const isLoggedIn = Boolean(localStorage.getItem('access_token'));

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSubscriptionDetail(slug)
      .then((data) => setSubscription(data.subscription))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSelectPlan(plan) {
    setMessage({ type: '', text: '' });

    if (!isLoggedIn) {
      navigate(to('auth'), { state: { from: to('subscriptionDetail', { slug }) } });
      return;
    }

    setSubscribing(plan.slug);
    try {
      await subscribeToPlan({
        subscriptionSlug: slug,
        planSlug: plan.slug,
      });
      window.dispatchEvent(new Event('auth-changed'));
      setMessage({
        type: 'success',
        text: t('detail.activated', { plan: plan.name }),
      });
      setTimeout(() => navigate(to('profile'), { state: { section: 'subscriptions' } }), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubscribing(null);
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>{t('detail.loading')}</p>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="error-state">
        <p>{error || t('detail.notFound')}</p>
        <Link to={to('subscriptions')} className="back-link">
          {t('detail.back')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link to={to('subscriptions')} className="back-link">
        {t('detail.back')}
      </Link>

      {message.text && (
        <p className={`sub-message sub-message--${message.type}`}>{message.text}</p>
      )}

      <div className="sub-detail">
        <article className="sub-detail__hero">
          {subscription.image_url && (
            <img
              className="sub-detail__image"
              src={subscription.image_url}
              alt={subscription.name}
            />
          )}
          <div className="sub-detail__info">
            <h1 className="sub-detail__title">{subscription.name}</h1>
            {subscription.tagline && (
              <p className="sub-detail__tagline">{subscription.tagline}</p>
            )}
            <p className="sub-detail__description">{subscription.description}</p>
          </div>
        </article>
      </div>

      {subscription.plans?.length > 0 && (
        <section className="sub-plans">
          <h2 className="sub-plans__title">{t('detail.choosePlan')}</h2>
          <p className="sub-plans__subtitle">
            {!isLoggedIn ? t('detail.loginHint') : t('detail.selectHint')}
          </p>
          <div className="sub-plans__row">
            {subscription.plans.map((plan) => (
              <article
                key={plan.slug}
                className={`plan-card ${plan.is_featured ? 'plan-card--featured' : ''}`}
              >
                {plan.is_featured && (
                  <span className="plan-card__badge">{t('detail.recommended')}</span>
                )}
                <h3 className="plan-card__name">{plan.name}</h3>
                <p className="plan-card__price">
                  {formatPrice(plan.price_eur, locale)}
                  <span>{t('detail.perMonth')}</span>
                </p>
                <p className="plan-card__desc">{plan.description}</p>
                <button
                  type="button"
                  className="plan-card__btn"
                  disabled={subscribing === plan.slug}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {subscribing === plan.slug
                    ? t('detail.subscribing')
                    : t('detail.subscribe', { plan: plan.name })}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
