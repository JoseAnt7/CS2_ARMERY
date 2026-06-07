import { Navigate } from 'react-router-dom';
import { englishRootPathToLocalized, stripEsPrefix } from '../i18n/routePaths';

/** /es y /es/* → misma ruta sin prefijo (español canónico). */
export function StripEsPrefixRedirect() {
  const path = stripEsPrefix(window.location.pathname);
  const search = window.location.search;
  const hash = window.location.hash;
  return <Navigate to={`${path}${search}${hash}`} replace />;
}

/** Rutas EN sueltas en raíz (/contact, /how-it-works…) → /en/… */
export function EnglishRootRedirect() {
  const path = window.location.pathname;
  const target = englishRootPathToLocalized(path);
  if (!target) {
    return <Navigate to="/" replace />;
  }
  const search = window.location.search;
  const hash = window.location.hash;
  return <Navigate to={`${target}${search}${hash}`} replace />;
}
