import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import '../styles/info.css';

const STEP_KEYS = ['1', '2', '3', '4'];
const MARKET_KEYS = ['steam', 'skinport', 'dmarket', 'waxpeer', 'csfloat'];
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
const GUIDE_KEYS = [
  { route: 'guideBuySafe', key: 'buySafe' },
  { route: 'guideMarkets', key: 'markets' },
  { route: 'guideTerms', key: 'terms' },
];

export function HomeEditorial() {
  const { to } = useLocale();
  const { t } = useTranslation('home');

  return (
    <div className="home-editorial">
      <section className="home-editorial__section" aria-labelledby="home-about-title">
        <h2 id="home-about-title" className="home-editorial__title">
          {t('about.title')}
        </h2>
        <p>{t('about.p1')}</p>
        <p>
          <Link to={to('howItWorks')}>{t('common:actions.learnHow')}</Link>
        </p>
      </section>

      <section className="home-editorial__section" aria-labelledby="home-steps-title">
        <h2 id="home-steps-title" className="home-editorial__title">
          {t('about.stepsTitle')}
        </h2>
        <ol className="home-steps">
          {STEP_KEYS.map((key, index) => (
            <li key={key} className="home-steps__item">
              <span className="home-steps__num" aria-hidden>
                {index + 1}
              </span>
              <div>
                <h3 className="home-steps__heading">{t(`steps.${key}.title`)}</h3>
                <p>{t(`steps.${key}.text`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-editorial__section" aria-labelledby="home-markets-title">
        <h2 id="home-markets-title" className="home-editorial__title">
          {t('about.marketsTitle')}
        </h2>
        <ul className="home-markets">
          {MARKET_KEYS.map((key) => (
            <li key={key} className="home-markets__item">
              <strong>{t(`markets.${key}.name`)}</strong>
              <span>{t(`markets.${key}.desc`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-editorial__section" aria-labelledby="home-guides-title">
        <h2 id="home-guides-title" className="home-editorial__title">
          {t('about.guidesTitle')}
        </h2>
        <p>{t('about.guidesIntro')}</p>
        <ul className="home-guides-links">
          {GUIDE_KEYS.map(({ route, key }) => (
            <li key={route}>
              <Link to={to(route)}>{t(`guideLinks.${key}`)}</Link>
            </li>
          ))}
        </ul>
        <p>
          <Link to={to('guides')}>{t('common:actions.seeAllGuides')}</Link>
        </p>
      </section>

      <section className="home-editorial__section" aria-labelledby="home-faq-title">
        <h2 id="home-faq-title" className="home-editorial__title">
          {t('about.faqTitle')}
        </h2>
        <dl className="home-faq">
          {FAQ_KEYS.map((key) => (
            <div key={key} className="home-faq__item">
              <dt className="home-faq__question">{t(`faq.${key}.q`)}</dt>
              <dd className="home-faq__answer">{t(`faq.${key}.a`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="home-editorial__trust">
        <p>
          <Trans
            i18nKey="about.trust"
            ns="home"
            components={{
              aboutLink: <Link to={to('about')} />,
              contactLink: <Link to={to('contact')} />,
              legalLink: <Link to={to('legalNotice')} />,
              privacyLink: <Link to={to('privacy')} />,
            }}
          />
        </p>
      </section>
    </div>
  );
}

export function buildHomeFaqJsonLd(t) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`faq.${key}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.${key}.a`),
      },
    })),
  };
}
