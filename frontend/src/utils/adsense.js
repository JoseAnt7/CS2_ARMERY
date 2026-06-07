import { canLoadAds } from './cookieConsent';

const ADSENSE_CLIENT = 'ca-pub-7858627003457160';

export function getAdSenseClientId() {
  return ADSENSE_CLIENT;
}

function scriptAlreadyPresent() {
  return Boolean(document.querySelector('script[data-gsm-adsense]'));
}

/** Inserta el script de AdSense solo si hay consentimiento de publicidad. */
export function loadAdSenseScript() {
  if (typeof document === 'undefined') return false;
  if (!canLoadAds()) return false;
  if (scriptAlreadyPresent()) return true;

  if (typeof window.__gsmLoadAdSense === 'function') {
    window.__gsmLoadAdSense();
    return true;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.crossOrigin = 'anonymous';
  script.setAttribute('data-gsm-adsense', '1');
  document.head.appendChild(script);
  return true;
}

/** Sincroniza Consent Mode y carga/retira el script según la elección del usuario. */
export function syncAdSenseWithConsent() {
  if (canLoadAds()) {
    loadAdSenseScript();
    return;
  }
  if (scriptAlreadyPresent()) {
    document.querySelectorAll('script[data-gsm-adsense]').forEach((node) => node.remove());
  }
}
