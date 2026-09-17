export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'enjoy-physics-theme';
export const LEGACY_THEME_KEY = 'enjoy_physics_dark_mode';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_KEY);
    if (saved === 'dark' || saved === 'true') return 'dark';
    if (saved === 'light' || saved === 'false') return 'light';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Add temporary transition class if motion preferred
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    root.classList.add('theme-transition');
  }

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(LEGACY_THEME_KEY, theme === 'dark' ? 'true' : 'false');
  } catch (e) {
    console.warn('Could not save theme to localStorage', e);
  }

  if (!prefersReducedMotion) {
    window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 350);
  }
}

export const setTheme = applyTheme;

export function toggleTheme(current: Theme): Theme {
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
