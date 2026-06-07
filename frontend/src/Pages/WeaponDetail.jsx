import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchWeaponDetail } from '../api/client';
import { PriceOffers } from '../components/PriceOffers';
import { Seo } from '../components/Seo';
import { buildWeaponEditorialParagraphs } from '../utils/weaponEditorial';
import { buildProductJsonLd, slugToDisplayTitle } from '../seo/siteSeo';
import { useLocale } from '../hooks/useLocale';
import '../styles/detail.css';
import '../styles/info.css';

function formatPrice(usd, locale) {
  if (usd == null) return '—';
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(usd);
}

export function WeaponDetail() {
  const { id } = useParams();
  const { to, locale } = useLocale();
  const { t } = useTranslation(['catalog', 'common']);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const weaponPath = to('weapon', { id });
  const fallbackName = slugToDisplayTitle(id);
  const fallbackDescription = t('detail.fallbackDesc', { name: fallbackName });
  const priceSuffix = t('detail.priceSuffix');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchWeaponDetail(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Seo
          title={`${fallbackName} ${priceSuffix}`}
          description={fallbackDescription}
          canonicalPath={weaponPath}
          locale={locale}
        />
        <div className="detail-loading">
          <div className="detail-hero" style={{ minHeight: 320 }} />
          <div className="offers-panel" style={{ minHeight: 280, marginTop: 24 }} />
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Seo
          title={`${fallbackName} ${priceSuffix}`}
          description={fallbackDescription}
          canonicalPath={weaponPath}
          noindex
          locale={locale}
        />
        <div className="error-state">
          <p>{error || t('detail.notFound')}</p>
          <Link to={to('home')} className="back-link">
            {t('common:actions.backToCatalog')}
          </Link>
        </div>
      </>
    );
  }

  const { weapon, pricing } = data;
  const editorialParagraphs = buildWeaponEditorialParagraphs(weapon, pricing);
  const priceHint =
    pricing?.average_price_usd != null
      ? t('detail.avgHintPrice', { price: formatPrice(pricing.average_price_usd, locale) })
      : '';
  const seoDescription = t('detail.compareDesc', { name: weapon.display_name }) + priceHint;
  const productJsonLd = buildProductJsonLd(weapon, pricing, seoDescription);
  const avgHintKey = pricing.sources_count === 1 ? 'detail.avgHint' : 'detail.avgHintPlural';

  return (
    <>
      <Seo
        title={`${weapon.display_name} ${priceSuffix}`}
        description={seoDescription}
        canonicalPath={weaponPath}
        jsonLdExtra={productJsonLd}
        imageUrl={weapon.image || undefined}
        imageAlt={`${weapon.display_name} ${priceSuffix}`}
        locale={locale}
      />

      <nav className="detail-breadcrumb" aria-label={t('detail.breadcrumbLabel')}>
        <Link to={to('home')}>{t('detail.breadcrumbCatalog')}</Link>
        <span className="detail-breadcrumb__sep" aria-hidden>
          /
        </span>
        <span>{weapon.category_label}</span>
        <span className="detail-breadcrumb__sep" aria-hidden>
          /
        </span>
        <span aria-current="page">{weapon.display_name}</span>
      </nav>

      <Link to={to('home')} className="back-link">
        {t('common:actions.backToCatalog')}
      </Link>

      <div className="detail-layout">
        <article className="detail-hero">
          <div className="detail-hero__image">
            {weapon.image && (
              <img src={weapon.image} alt={weapon.display_name} />
            )}
          </div>
          <div
            className="detail-hero__rarity-bar"
            style={{ background: weapon.rarity_color }}
          />
          <div className="detail-hero__info">
            <p className="detail-hero__category">{weapon.category_label}</p>
            <h1 className="detail-hero__title">{weapon.display_name}</h1>
            <div className="detail-hero__tags">
              {weapon.rarity && <span className="tag">{weapon.rarity}</span>}
              {weapon.weapon && <span className="tag">{weapon.weapon}</span>}
              {weapon.stattrak && <span className="tag">{t('detail.stattrak')}</span>}
              {weapon.exterior && <span className="tag">{weapon.exterior}</span>}
            </div>

            <div className="average-price-box">
              <div className="average-price-box__label">{t('detail.avgPrice')}</div>
              <div className="average-price-box__value">
                {formatPrice(pricing.average_price_usd, locale)}
              </div>
              <p className="average-price-box__hint">
                {t(avgHintKey, { count: pricing.sources_count })}
                {t('detail.avgHintSuffix')}
              </p>
            </div>
          </div>
        </article>

        <PriceOffers pricing={pricing} />
      </div>

      <section className="weapon-editorial" aria-labelledby="weapon-editorial-title">
        <h2 id="weapon-editorial-title" className="weapon-editorial__title">
          {t('detail.aboutTitle', { name: weapon.display_name })}
        </h2>
        {editorialParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        <p className="weapon-editorial__links">
          <Link to={to('howItWorks')}>{t('detail.compareLink')}</Link>
          <Link to={to('guideBuySafe')}>{t('detail.safeLink')}</Link>
        </p>
      </section>
    </>
  );
}
