/**
 * Carga AdSense solo si el usuario ya aceptó cookies de publicidad (visitas recurrentes).
 * El verificador de AdSense ve el client id en este archivo y en ads.txt / meta tag.
 */
(function () {
  var CONSENT_KEY = 'gsm_cookie_consent';
  var CLIENT = 'ca-pub-7858627003457160';

  window.__gsmLoadAdSense = function () {
    if (document.querySelector('script[data-gsm-adsense]')) return;
    var script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-gsm-adsense', '1');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
    document.head.appendChild(script);
  };

  try {
    var raw = localStorage.getItem(CONSENT_KEY);
    if (raw && JSON.parse(raw).advertising) {
      window.__gsmLoadAdSense();
    }
  } catch {
    /* ignore */
  }
})();
