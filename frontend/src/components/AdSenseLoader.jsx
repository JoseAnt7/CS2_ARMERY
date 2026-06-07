import { useEffect } from 'react';
import { applyGoogleConsentMode } from '../utils/cookieConsent';
import { loadAdSenseScript } from '../utils/adsense';

/**
 * Inicializa Consent Mode y carga el script de AdSense.
 * Con consentimiento denegado por defecto, Google puede mostrar anuncios no personalizados.
 */
export function AdSenseLoader() {
  useEffect(() => {
    applyGoogleConsentMode();
    loadAdSenseScript();

    function onConsentChange() {
      applyGoogleConsentMode();
    }

    window.addEventListener('cookie-consent-changed', onConsentChange);
    return () => window.removeEventListener('cookie-consent-changed', onConsentChange);
  }, []);

  return null;
}
