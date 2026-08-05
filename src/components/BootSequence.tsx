import { useEffect, useRef, useState } from "react";
import { audio } from "../engine/audio";
import { useContent } from "../i18n/lang";
import { usePrefersReducedMotion } from "./TypedBlock";

const TOTAL = 28;   // segmentos de la barra

export function BootSequence({ onDone }: { onDone: () => void }) {
  const { bootScript, ui } = useContent();
  const still = usePrefersReducedMotion();
  const [lines, setLines] = useState(0);     // líneas ya mostradas
  const [bar, setBar] = useState(-1);        // -1: aún no · 0..TOTAL: llenando
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (!doneRef.current) { doneRef.current = true; onDone(); }
  };

  useEffect(() => {
    if (still) { finish(); return; }         // accesibilidad: sin boot

    // fase 1: líneas del guion, cada una con su beep ascendente
    if (lines < bootScript.length) {
      audio.beep(bootScript[lines].tone, 0.05, 0.03);
      const id = setTimeout(() => setLines(l => l + 1), bootScript[lines].delay);
      return () => clearTimeout(id);
    }
    // fase 2: barra con blips que suben de tono con el progreso
    if (bar < 0) { setBar(0); return; }
    if (bar < TOTAL) {
      if (bar > 0 && bar % 2 === 0) audio.beep(300 + (bar / TOTAL) * 600, 0.03, 0.022);
      const id = setTimeout(() => setBar(b => b + 1), 44);
      return () => clearTimeout(id);
    }
    // fase 3: 100% → arpegio de completado → todo el log sale junto
    audio.beep(660, 0.09, 0.05);
    const t1 = setTimeout(() => audio.beep(880, 0.09, 0.05), 90);
    const t2 = setTimeout(() => audio.beep(1320, 0.14, 0.055), 180);
    const t3 = setTimeout(() => setLeaving(true), 480);
    const t4 = setTimeout(finish, 1400);     // respaldo si animationend no llega
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [lines, bar, still]); // eslint-disable-line react-hooks/exhaustive-deps

  if (still) return null;

  return (
    <div
      className={`max-w-[920px] mx-auto px-4 pt-6 phosphor bootlog ${leaving ? "bootlog-out" : ""}`}
      onAnimationEnd={leaving ? finish : undefined}
    >
      {bootScript.slice(0, lines).map((l, i) => (
        <div key={i} className={`bootline ${l.dim ? "text-dim" : ""}`}>
          {!l.dim && <span className="text-grn">{"[ ok ] "}</span>}
          {l.text.replace("[ ok ] ", "")}
        </div>
      ))}
      {bar >= 0 && (
        <div>
          <span className="text-dim">{ui.bootBar}</span>
          <span className={bar >= TOTAL
            ? "text-grn [text-shadow:0_0_10px_#4dff9e99]"
            : "text-grn"}>
            [{"█".repeat(bar)}
          </span>
          <span className="text-dim">{"░".repeat(TOTAL - bar)}]</span>
          <span className={bar >= TOTAL ? "text-grn" : "text-amb"}>
            {" "}{Math.round((100 * bar) / TOTAL)}%
          </span>
        </div>
      )}
    </div>
  );
}