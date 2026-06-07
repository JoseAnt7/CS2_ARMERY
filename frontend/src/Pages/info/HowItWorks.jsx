import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { InfoLayout } from '../../components/InfoLayout';
import { useLocale } from '../../hooks/useLocale';

const STEP_KEYS = ['1', '2', '3', '4'];
const MARKET_KEYS = ['steam', 'skinport', 'dmarket', 'waxpeer', 'csfloat'];

export function HowItWorks() {
  const { t } = useTranslation(['info', 'home']);
  const { to } = useLocale();

  return (
    <InfoLayout title={t('info:howItWorks.title')}>
      <p>{t('info:howItWorks.intro')}</p>

      <h2>{t('info:howItWorks.stepsTitle')}</h2>
      <ol className="info-steps">
        {STEP_KEYS.map((key, index) => (
          <li key={key}>
            <strong>
              {index + 1}. {t(`home:steps.${key}.title`)}
            </strong>
            <p>{t(`home:steps.${key}.text`)}</p>
          </li>
        ))}
      </ol>

      <h2>{t('info:howItWorks.marketsTitle')}</h2>
      <p>{t('info:howItWorks.marketsIntro')}</p>
      <ul>
        {MARKET_KEYS.map((key) => (
          <li key={key}>
            <strong>{t(`home:markets.${key}.name`)}</strong> — {t(`home:markets.${key}.desc`)}
          </li>
        ))}
      </ul>

      <h2>{t('info:howItWorks.sourcesTitle')}</h2>
      <p>{t('info:howItWorks.sourcesText')}</p>

      <h2>{t('info:howItWorks.limitsTitle')}</h2>
      <ul>
        {(t('info:howItWorks.limits', { returnObjects: true }) || []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t('info:howItWorks.transparencyTitle')}</h2>
      <p>
        <Trans
          i18nKey="howItWorks.transparencyText"
          ns="info"
          components={{ termsLink: <Link to={to('terms')} /> }}
        />
      </p>

      <h2>{t('info:howItWorks.helpTitle')}</h2>
      <p>
        <Trans
          i18nKey="howItWorks.helpText"
          ns="info"
          components={{
            contactLink: <Link to={to('contact')} />,
            guidesLink: <Link to={to('guides')} />,
          }}
        />
      </p>
    </InfoLayout>
  );
}
