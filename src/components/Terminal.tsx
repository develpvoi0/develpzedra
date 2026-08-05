import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { audio } from "../engine/audio";
import { bus } from "../engine/bus";
import { commands, resolve } from "../engine/commands";
import type { GameKind } from "../engine/types";
import { BANNER, SUBTITLE } from "../engine/sprites";
import { GameCanvas } from "../arcade/GameCanvas";
import { Prompt } from "./Prompt";
import { SkipCtx } from "./TypedBlock";
import { useContent } from "../i18n/lang";

type Entry = { id: number; node: ReactNode };

/* Banner de bienvenida. Como es un componente que lee el idioma,
   al cambiar de idioma se re-traduce solo (esté donde esté en el
   log). Se usa al montar y en `clear`. */
function Welcome() {
  const { ui } = useContent();
  return (
    <div className="intro">
      <pre className="banner">{BANNER}</pre>
      <div className="tagline text-amb text-xl">{SUBTITLE}</div>
      <div className="tagline">{ui.welcome.tagline}</div>
      <div className="mt-2">
        {ui.welcome.sessionPre} <b className="text-grn">Jhorman Parra</b> · {ui.welcome.city}
      </div>
      <div className="text-dim">
        {ui.welcome.hintPre} <b className="text-cyan">help</b> {ui.welcome.hintPost}
      </div>
    </div>
  );
}

export function Terminal() {
  const { ui } = useContent();
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
     banner de bienvenida (como una sesión recién abierta). */
  const clear = useCallback(() => {
    setEntries([{ id: ++idRef.current, node: <Welcome /> }]);
  }, []);

  /* Monta el juego como una entrada más del log. */
  const launchGame = useCallback((kind: GameKind) => {
    setGameActive(true);
    const meta = ui.games[kind];
    print(
      <GameCanvas
        kind={kind}
        title={meta.title}
        tip={meta.tip}
        registerStop={s => { stopRef.current = s; }}
        onEnd={(msg, score) => {
          setGameActive(false);
          const reason = ui.gameEnd[msg as keyof typeof ui.gameEnd] ?? msg;
          print(
            <div>
              {reason} {ui.terminal.scorePre} <b className="text-amb">{score}</b> {ui.terminal.another}{" "}
              <span className="text-cyan">tired</span>
            </div>,
          );
        }}
      />,
    );
  }, [print, ui]);

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
          <span className="text-red">{ui.terminal.notFound}</span> {cmd} — {ui.terminal.tryHelp}{" "}
          <span className="text-cyan">help</span>
        </div>,
      );
    }
  }, [print, clear, launchGame, ui]);

  /* chips de la HintBar → bus → run. */
  useEffect(() => bus.on(cmd => { audio.keyClick(true); run(cmd); }), [run]);

  /* Cualquier clic salta el tecleo en curso. */
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
    print(<Welcome />);
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
