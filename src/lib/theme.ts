export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "sudoku.theme";

function getSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function setThemeColorMeta(theme: ThemeMode) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) return;

  meta.content = theme === "dark" ? "#151218" : "#fffbfe";
}

export function getSavedTheme(): ThemeMode | null {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function getActiveTheme(): ThemeMode {
  return getSavedTheme() ?? getSystemTheme();
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  setThemeColorMeta(theme);
}

export function setTheme(theme: ThemeMode) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

export function initTheme() {
  applyTheme(getActiveTheme());
}
