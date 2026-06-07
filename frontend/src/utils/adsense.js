const ADSENSE_CLIENT = 'ca-pub-7858627003457160';

let loadRequested = false;

export function getAdSenseClientId() {
  return ADSENSE_CLIENT;
}

/** Carga el script de AdSense una sola vez (requiere consentimiento previo). */
export function loadAdSenseScript() {
  if (loadRequested || typeof document === 'undefined') return;
  if (document.querySelector('script[data-gsm-adsense]')) {
    loadRequested = true;
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.crossOrigin = 'anonymous';
  script.setAttribute('data-gsm-adsense', '1');
  document.head.appendChild(script);
  loadRequested = true;
}
