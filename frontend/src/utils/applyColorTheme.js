const VALID_THEMES = new Set(['orange', 'blue']);
const STORAGE_KEY = 'gsm_color_theme';

export function resolveColorTheme(value) {
  const theme = String(value || 'orange').toLowerCase();
  return VALID_THEMES.has(theme) ? theme : 'orange';
}

/** Último tema publicado conocido (evita flash a naranja entre cargas). */
export function getStoredColorTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_THEMES.has(stored)) return stored;
  } catch {
    /* ignore */
  }
  return 'orange';
}

/** Aplica data-theme en <html> para que las variables CSS cambien en todo el sitio. */
export function applyColorTheme(theme) {
  const resolved = resolveColorTheme(theme);
  document.documentElement.setAttribute('data-theme', resolved);
  try {
    localStorage.setItem(STORAGE_KEY, resolved);
  } catch {
    /* ignore */
  }
  return resolved;
}
