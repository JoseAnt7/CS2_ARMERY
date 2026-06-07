import { useEffect } from 'react';
import { applyGoogleConsentMode } from '../utils/cookieConsent';
import { syncAdSenseWithConsent } from '../utils/adsense';

/**
 * Consent Mode v2 + AdSense: el script solo se carga si el usuario acepta publicidad.
 * Verificación AdSense: meta tag + ads.txt + public/adsense-bootstrap.js (client id en HTML).
 */
export function AdSenseLoader() {
  useEffect(() => {
    function sync() {
      applyGoogleConsentMode();
      syncAdSenseWithConsent();
    }

    sync();
    window.addEventListener('cookie-consent-changed', sync);
    return () => window.removeEventListener('cookie-consent-changed', sync);
  }, []);

  return null;
}
