import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { InfoLayout } from '../../../components/InfoLayout';
import { useLocale } from '../../../hooks/useLocale';

function GuideBody({ guideId }) {
  const { t } = useTranslation('guidesContent');
  const sections = t(`${guideId}.sections`, { returnObjects: true });

  if (!Array.isArray(sections)) return null;

  return sections.map((section) => {
    if (section.type === 'ul') {
      return (
        <section key={section.heading}>
          {section.heading && <h2>{section.heading}</h2>}
          <ul>
            {(section.items || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      );
    }

    return (
      <section key={section.heading || section.text?.slice(0, 40)}>
        {section.heading && <h2>{section.heading}</h2>}
        {section.text && <p>{section.text}</p>}
      </section>
    );
  });
}

function GuidePage({ guideId, guideKey }) {
  const { t } = useTranslation(['guidesContent', 'info']);
  const { to } = useLocale();

  return (
    <InfoLayout title={t(`info:guides.${guideKey}.title`)}>
      <p className="info-page__lead">{t(`${guideId}.lead`)}</p>
      <GuideBody guideId={guideId} />
      <p>
        <Link to={to('guides')}>{t('info:backToGuides')}</Link>
      </p>
    </InfoLayout>
  );
}

export function BuySkinsSafelyGuide() {
  return <GuidePage guideId="buySafe" guideKey="buySafe" />;
}

export function MarketComparisonGuide() {
  const { t } = useTranslation(['guidesContent', 'info']);
  const { to } = useLocale();

  return (
    <InfoLayout title={t('info:guides.markets.title')}>
      <p className="info-page__lead">{t('markets.lead')}</p>
      <GuideBody guideId="markets" />
      <p>
        <Trans
          i18nKey="markets.tip"
          ns="guidesContent"
          components={{ homeLink: <Link to={to('home')} /> }}
        />
      </p>
      <p>
        <Link to={to('guides')}>{t('info:backToGuides')}</Link>
      </p>
    </InfoLayout>
  );
}

export function Cs2TermsGuide() {
  const { t } = useTranslation(['guidesContent', 'info']);
  const { to } = useLocale();

  return (
    <InfoLayout title={t('info:guides.terms.title')}>
      <p className="info-page__lead">{t('terms.lead')}</p>
      <GuideBody guideId="terms" />
      <p>
        <Trans
          i18nKey="terms.tip"
          ns="guidesContent"
          components={{ homeLink: <Link to={to('home')} /> }}
        />
      </p>
      <p>
        <Link to={to('guides')}>{t('info:backToGuides')}</Link>
      </p>
    </InfoLayout>
  );
}
