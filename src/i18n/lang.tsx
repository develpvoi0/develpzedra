/* ═══════════════════════════════════════════════════════════════
   lang.tsx — contexto de idioma.
   ───────────────────────────────────────────────────────────────
   `useContent()` devuelve el diccionario del idioma activo; cualquier
   componente montado que lo use se re-renderiza al cambiar de idioma,
   así que la salida ya impresa se re-traduce sola (salvo el eco de
   texto plano, que es lo que tú tecleaste). `useLang()` da el par
   [lang, setLang] para el switch del TopBar. Se persiste en
   localStorage y arranca según el idioma del navegador. */
import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { content, type Lang, type LocaleContent } from "./content";

const KEY = "pz-lang";

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY) as Lang | null;
    if (saved && saved in content) return saved;
    if (navigator.language?.toLowerCase().startsWith("es")) return "es";
  } catch { /* storage bloqueado */ }
  return "en";
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: LocaleContent };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* no-op */ }
    document.documentElement.lang = l;
  }, []);

  return (
    <LangCtx.Provider value={{ lang, setLang, t: content[lang] }}>
      {children}
    </LangCtx.Provider>
  );
}

function useCtx(): Ctx {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useContent/useLang deben usarse dentro de <LangProvider>");
  return c;
}

/** diccionario del idioma activo */
export const useContent = (): LocaleContent => useCtx().t;

/** [lang, setLang] para el switch de idioma */
export const useLang = (): [Lang, (l: Lang) => void] => {
  const { lang, setLang } = useCtx();
  return [lang, setLang];
};
