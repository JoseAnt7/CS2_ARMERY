import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  applyGoogleConsentMode,
  getCookieConsent,
  hasConsentChoice,
  setCookieConsent,
} from '../utils/cookieConsent';
import { useLocale } from '../hooks/useLocale';
import '../styles/legal.css';

export function CookieConsent() {
  const { t } = useTranslation('cookies');
  const { to } = useLocale();
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [ads, setAds] = useState(false);
  const [adsPersonalized, setAdsPersonalized] = useState(false);

  useEffect(() => {
    function sync() {
      if (!hasConsentChoice()) {
        setVisible(true);
        return;
      }
      const c = getCookieConsent();
      setAds(Boolean(c?.advertising));
      setAdsPersonalized(Boolean(c?.advertisingPersonalized));
      applyGoogleConsentMode();
      setVisible(false);
    }
    sync();
    window.addEventListener('cookie-consent-reopen', sync);
    return () => window.removeEventListener('cookie-consent-reopen', sync);
  }, []);

  function acceptAll() {
    setCookieConsent({
      advertising: true,
      advertisingPersonalized: true,
      analytics: false,
    });
    applyGoogleConsentMode();
    setVisible(false);
  }

  function acceptNecessaryOnly() {
    setCookieConsent({
      advertising: false,
      advertisingPersonalized: false,
      analytics: false,
    });
    applyGoogleConsentMode();
    setVisible(false);
  }

  function savePreferences() {
    setCookieConsent({
      advertising: ads,
      advertisingPersonalized: ads && adsPersonalized,
      analytics: false,
    });
    applyGoogleConsentMode();
    setVisible(false);
    setShowPrefs(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title">
      <div className="cookie-banner__inner">
        <div>
          <p id="cookie-banner-title" className="cookie-banner__text">
            {t('banner.text')}{' '}
            <Link to={to('cookies')}>{t('banner.cookiesLink')}</Link> {t('banner.and')}{' '}
            <Link to={to('privacy')}>{t('banner.privacyLink')}</Link>.
          </p>
          {showPrefs && (
            <div className="cookie-banner__prefs">
              <label className="cookie-banner__pref">
                <input type="checkbox" checked disabled readOnly />
                <span>
                  <strong>{t('necessary').split(' — ')[0]}</strong>
                  {' — '}
                  {t('necessary').split(' — ')[1]}
                </span>
              </label>
              <label className="cookie-banner__pref">
                <input
                  type="checkbox"
                  checked={ads}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setAds(on);
                    if (!on) setAdsPersonalized(false);
                  }}
                />
                <span>
                  <strong>{t('ads').split(' — ')[0]}</strong>
                  {' — '}
                  {t('ads').split(' — ')[1]}
                </span>
              </label>
              <label className="cookie-banner__pref">
                <input
                  type="checkbox"
                  checked={adsPersonalized}
                  disabled={!ads}
                  onChange={(e) => setAdsPersonalized(e.target.checked)}
                />
                <span>
                  <strong>{t('adsPersonalized').split(' — ')[0]}</strong>
                  {' — '}
                  {t('adsPersonalized').split(' — ')[1]}
                </span>
              </label>
            </div>
          )}
        </div>
        <div className="cookie-banner__actions">
          {showPrefs ? (
            <>
              <button type="button" className="cookie-banner__btn" onClick={() => setShowPrefs(false)}>
                {t('back')}
              </button>
              <button
                type="button"
                className="cookie-banner__btn cookie-banner__btn--primary"
                onClick={savePreferences}
              >
                {t('save')}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="cookie-banner__btn" onClick={acceptNecessaryOnly}>
                {t('necessaryOnly')}
              </button>
              <button type="button" className="cookie-banner__btn" onClick={() => setShowPrefs(true)}>
                {t('configure')}
              </button>
              <button
                type="button"
                className="cookie-banner__btn cookie-banner__btn--primary"
                onClick={acceptAll}
              >
                {t('acceptAll')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
