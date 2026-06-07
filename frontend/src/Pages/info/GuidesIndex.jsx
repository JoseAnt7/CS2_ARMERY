import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { InfoLayout } from '../../components/InfoLayout';
import { useLocale } from '../../hooks/useLocale';

const GUIDE_ITEMS = [
  { route: 'guideBuySafe', key: 'buySafe' },
  { route: 'guideMarkets', key: 'markets' },
  { route: 'guideTerms', key: 'terms' },
];

export function GuidesIndex() {
  const { t } = useTranslation('info');
  const { to } = useLocale();

  return (
    <InfoLayout title={t('guidesIndex.title')}>
      <p>{t('guidesIndex.intro')}</p>

      <ul className="guides-list">
        {GUIDE_ITEMS.map(({ route, key }) => (
          <li key={route} className="guides-list__item">
            <Link to={to(route)} className="guides-list__link">
              <strong>{t(`guides.${key}.title`)}</strong>
              <span>{t(`guides.${key}.desc`)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p>
        <Trans
          i18nKey="guidesIndex.backCatalog"
          ns="info"
          components={{
            catalogLink: <Link to={to('home')} />,
            howLink: <Link to={to('howItWorks')} />,
          }}
        />
      </p>
    </InfoLayout>
  );
}
