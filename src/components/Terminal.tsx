import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { audio } from "../engine/audio";
import { bus } from "../engine/bus";
import { commands, resolve } from "../engine/commands";
import type { GameKind } from "../engine/types";
import { BANNER } from "../engine/sprites";
import { GameCanvas } from "../arcade/GameCanvas";
import { Prompt } from "./Prompt";
import { SkipCtx } from "./TypedBlock";

type Entry = { id: number; node: ReactNode };

const GAME_META: Record<GameKind, { title: string; tip: string }> = {
  snake: { title: "SNAKE//neon",  tip: "flechas o WASD · deslizar en móvil · ESC salir" },
  bat:   { title: "VESPER//mini", tip: "espacio o toque para aletear · ESC salir" },
};

/* Banner de bienvenida. Se usa en dos sitios: al montar (primera
   entrada) y en `clear` (que reinicia el log dejando SOLO esto).
   Es un elemento estático: cada vez que entra al log con una key
   nueva, React lo remonta y su animación `introIn` se reproduce. */
const WELCOME = (
  <div className="intro">
    <pre className="banner">{BANNER}</pre>
    <div className="tagline">
      {"// Del componente al clúster — Construyo y lo mantengo corriendo."}
    </div>
    <div className="mt-2">
      Sesión Iniciada como <b className="text-grn">Jhorman Parra</b> · Caracas, VE ·{" "}
      <span className="text-amb">5+ años</span>
    </div>
    <div className="text-dim">
      Escribe <b className="text-cyan">help</b> para ver comandos, o toca un chip abajo ↓
    </div>
  </div>
);

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [skip, setSkip] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const idRef = useRef(0);
  const stopRef = useRef<(() => void) | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* useCallback estabiliza identidades: run depende de print,
     los efectos dependen de run — sin esto, cada render crearía
     funciones nuevas y una cadena de re-suscripciones inútiles. */
  const print = useCallback((node: ReactNode) => {
    setEntries(prev => [...prev, { id: ++idRef.current, node }]);
  }, []);

  /* clear NO deja el log vacío: lo reinicia mostrando de nuevo el
     banner de bienvenida (como una sesión recién abierta). El eco
     del propio comando `clear` también se borra, porque este
     setEntries reemplaza TODO por una sola entrada. */
  const clear = useCallback(() => {
    setEntries([{ id: ++idRef.current, node: WELCOME }]);
  }, []);

  /* Monta el juego como una entrada más del log. El GameCanvas
     nos entrega su función de parada vía registerStop (el
     Terminal NO sabe cómo se detiene un juego — solo guarda el
     botón rojo que el juego mismo le dio). */
  const launchGame = useCallback((kind: GameKind) => {
    setGameActive(true);
    const meta = GAME_META[kind];
    print(
      <GameCanvas
        kind={kind}
        title={meta.title}
        tip={meta.tip}
        registerStop={s => { stopRef.current = s; }}
        onEnd={(msg, score) => {
          setGameActive(false);
          print(
            <div>
              {msg} — puntuación <b className="text-amb">{score}</b> · otra ronda:{" "}
              <span className="text-cyan">tired</span>
            </div>,
          );
        }}
      />,
    );
  }, [print]);

  /* EL VIAJE DE UN COMANDO — cuatro pasos en orden:
     1. saltar tecleos pendientes  2. interrumpir juego activo
     3. eco del prompt             4. resolver y despachar */
  const run = useCallback((raw: string) => {
    setSkip(s => s + 1);
    stopRef.current?.();
    print(
      <div>
        <span className="ps-u">develpzedra</span><span className="text-dim">@</span>
        <span className="ps-h">ccs</span><span className="text-dim">:</span>
        <span className="ps-d">~</span><span className="text-dim">$</span>{" "}
        <span className="font-medium">{raw}</span>
      </div>,
    );
    const cmd = resolve(raw);
    if (cmd === "") return;
    const c = commands[cmd];
    if (c) {
      c.run({ print, clear, launchGame });   // inyección de capacidades
      audio.beep(760, 0.05, 0.035);
    } else {
      audio.errBuzz();
      print(
        <div>
          <span className="text-red">comando no encontrado:</span> {cmd} — escribe{" "}
          <span className="text-cyan">help</span>
        </div>,
      );
    }
  }, [print, clear, launchGame]);

  /* chips de la HintBar → bus → run. bus.on devuelve la
     des-suscripción: el return del efecto ES el cleanup. */
  useEffect(() => bus.on(cmd => { audio.keyClick(true); run(cmd); }), [run]);

  /* Cualquier clic salta el tecleo en curso (los TypedBlock nuevos
     no se ven afectados gracias a su skip0). Se excluyen enlaces
     y botones para no robarles la interacción. */
  useEffect(() => {
    const bump = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest?.("a") || t.closest?.("button")) return;
      setSkip(s => s + 1);
    };
    document.addEventListener("pointerdown", bump);
    return () => document.removeEventListener("pointerdown", bump);
  }, []);

  /* Banner de bienvenida como primera entrada + fanfarria.
     Deps vacías: solo al montar. */
  useEffect(() => {
    print(WELCOME);
    audio.beep(660, 0.07, 0.045);
    const t = setTimeout(() => audio.beep(990, 0.09, 0.045), 110);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* autoscroll al fondo con cada entrada nueva */
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [entries.length]);

  return (
    <SkipCtx.Provider value={skip}>
      <main
        role="log"
        aria-live="polite"
        className="max-w-[920px] mx-auto px-4 pt-6 pb-32 phosphor"
        onClick={e => {
          // clic en cualquier parte → foco al input (como toda
          // terminal real). Enlaces y canvas quedan fuera.
          const t = e.target as HTMLElement;
          if (!t.closest("a") && !t.closest("canvas")) {
            (document.querySelector('input[aria-label="terminal"]') as HTMLInputElement | null)?.focus();
          }
        }}
      >
        {entries.map(e => <div key={e.id}>{e.node}</div>)}
        <Prompt onSubmit={run} disabled={gameActive} />
        <div ref={bottomRef} />
      </main>
    </SkipCtx.Provider>
  );
}