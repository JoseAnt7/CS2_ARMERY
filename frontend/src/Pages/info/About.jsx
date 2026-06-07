import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { InfoLayout } from '../../components/InfoLayout';
import { LEGAL } from '../../content/legalSite';
import { useLocale } from '../../hooks/useLocale';

export function About() {
  const { t } = useTranslation('info');
  const { locale, to } = useLocale();
  const titularesText = LEGAL.titulares.map((item) => item.name).join(locale === 'en' ? ' and ' : ' y ');

  return (
    <InfoLayout title={t('about.title')}>
      <p>
        <Trans
          i18nKey="about.intro"
          ns="info"
          values={{ siteName: LEGAL.siteName }}
          components={{ strong: <strong /> }}
        />
      </p>

      <h2>{t('about.missionTitle')}</h2>
      <p>{t('about.missionText')}</p>

      <h2>{t('about.teamTitle')}</h2>
      <p>
        <Trans
          i18nKey="about.teamText"
          ns="info"
          values={{ titulares: titularesText, address: LEGAL.address }}
          components={{ strong: <strong /> }}
        />
      </p>

      <h2>{t('about.doTitle')}</h2>
      <ul>
        {(t('about.doYes', { returnObjects: true }) || []).map((item) => (
          <li key={item}>{item}</li>
        ))}
        {(t('about.doNo', { returnObjects: true }) || []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{t('about.dataTitle')}</h2>
      <p>
        {t('about.dataText', {
          imageSources: LEGAL.imageSources,
          externalMarkets: LEGAL.externalMarkets,
        })}
      </p>

      <h2>{t('about.hostingTitle')}</h2>
      <p>
        {t('about.hostingText', {
          hostingProduct: LEGAL.hosting.product,
          hostingProvider: LEGAL.hosting.provider,
          hostingLocation: LEGAL.hosting.locationNote,
        })}
      </p>

      <h2>{t('about.contactTitle')}</h2>
      <p>
        <Trans
          i18nKey="about.contactText"
          ns="info"
          values={{ email: LEGAL.emails.public }}
          components={{
            contactLink: <Link to={to('contact')} />,
            emailLink: <a href={`mailto:${LEGAL.emails.public}`} />,
          }}
        />
      </p>

      <p>
        <Trans
          i18nKey="about.footerLinks"
          ns="info"
          components={{
            howLink: <Link to={to('howItWorks')} />,
            guidesLink: <Link to={to('guides')} />,
          }}
        />
      </p>
    </InfoLayout>
  );
}
