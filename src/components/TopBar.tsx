import { useEffect, useState } from "react";
import { audio } from "../engine/audio";
import { applyTheme, getInitialTheme, nextTheme, THEME_LABEL } from "../engine/theme";
import { useContent, useLang } from "../i18n/lang";

function useClock(): string {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toTimeString().slice(0, 8);
}

export function TopBar() {
  const clock = useClock();
  const { ui } = useContent();
  const [lang, setLang] = useLang();
  const [on, setOn] = useState(true);                 // estado VISUAL del sonido
  const [theme, setTheme] = useState(getInitialTheme); // tema actual (para la etiqueta)

  return (
    <div className="sticky top-0 z-30 flex items-center gap-2.5 px-3.5 py-2 bg-[var(--bar-bg)] backdrop-blur-sm border-b border-[color:var(--bar-border)] text-[11.5px] text-dim tracking-[.04em] h-20">
      <span className="flex gap-1.5">
        <i className="w-[11px] h-[11px] rounded-full bg-red block" />
        <i className="w-[11px] h-[11px] rounded-full bg-amb block" />
        <i className="w-[11px] h-[11px] rounded-full bg-grn block" />
      </span>
      <span className="text-cyan hidden md:inline">develpzedra@ccs</span>
      <span className="hidden md:inline">:~/portfolio</span>
      <span className="flex-1" />

      {/* idioma: alterna ES/EN */}
      <button
        className="chip flex items-center gap-1.5"
        aria-label="language"
        onClick={() => {
          setLang(lang === "es" ? "en" : "es");
          audio.keyClick(true);
        }}
      >
        {lang === "es" ? "ES" : "EN"} <span className="text-dim">/ {lang === "es" ? "EN" : "ES"}</span>
      </button>

      {/* tema: cicla entre las 4 paletas */}
      <button
        className="chip flex items-center gap-1.5"
        aria-label="theme"
        onClick={() => {
          const nx = nextTheme(theme);
          applyTheme(nx);
          setTheme(nx);
          audio.blip(520, 0.05, 0.06);
        }}
      >
        ◑ {THEME_LABEL[theme]}
      </button>

      <button
        className={`chip flex items-center gap-1.5 ${on ? "" : "text-dim"}`}
        onClick={() => {
          const v = !on;
          setOn(v);
          audio.setMuted(!v);
          if (v) audio.beep(660, 0.07, 0.05);   // confirma al reactivar
        }}
      >
        {ui.topbar.sound} {on ? ui.topbar.on : ui.topbar.off}
      </button>
      <span className="hidden md:inline">
        conn <b className="text-grn">secure</b> · {clock}
      </span>
    </div>
  );
}
