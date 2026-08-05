/* ═══════════════════════════════════════════════════════════════
   theme.ts — 4 paletas conmutables sobre el mismo set de tokens.
   ───────────────────────────────────────────────────────────────
   El tema real vive en `document.documentElement.dataset.theme`.
   El CSS (index.css) define las variables por cada [data-theme=…];
   aquí solo elegimos, persistimos y recordamos la última elección.
   Se aplica ANTES del render (main.tsx) para no ver un parpadeo. */

export const THEMES = ["dark", "amber", "green", "light"] as const;
export type Theme = (typeof THEMES)[number];

/* etiqueta corta para el botón del TopBar */
export const THEME_LABEL: Record<Theme, string> = {
  dark: "cian",
  amber: "ámbar",
  green: "fósforo",
  light: "claro",
};

const KEY = "pz-theme";

export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY) as Theme | null;
    if (saved && THEMES.includes(saved)) return saved;
    if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  } catch { /* SSR / storage bloqueado: cae a dark */ }
  return "dark";
}

export function applyTheme(t: Theme): void {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(KEY, t); } catch { /* no-op */ }
}

/* siguiente tema en el ciclo (para el botón que rota entre los 4) */
export function nextTheme(t: Theme): Theme {
  return THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
}
