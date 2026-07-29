import { useEffect, useRef, useState } from "react";
import { startSnake } from "./snake";
import { startBat } from "./batGame";
import type { GameKind } from "../engine/types";

export function GameCanvas({ kind, title, tip, onEnd, registerStop }: {
  kind: GameKind;
  title: string;
  tip: string;
  onEnd: (msg: string, score: number) => void;
  registerStop: (stop: (() => void) | null) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let final = 0;
    let stopped = false;
    const start = kind === "snake" ? startSnake : startBat;

    const stop = start(ref.current!, {
      onScore: n => { final = n; setScore(n); },
      onEnd: msg => {
        if (!stopped) { stopped = true; registerStop(null); onEnd(msg, final); }
      },
    });

    
    registerStop(() => {
      if (!stopped) {
        stopped = true; stop(); registerStop(null);
        onEnd("juego interrumpido", final);
      }
    });

    
    return () => {
      if (!stopped) { stopped = true; stop(); registerStop(null); }
    };
  }, [kind]); 

  return (
    <div className="game-host">
      <div className="game-hud">
        <span>{title}</span>
        <span>score <b>{score}</b></span>
      </div>
      <canvas ref={ref} width={240} height={160} />
      <div className="text-dim text-[11px] mt-1.5">{tip}</div>
    </div>
  );
}