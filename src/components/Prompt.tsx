/* ═══════════════════════════════════════════════════════════════
   CAPA 6 · Prompt.tsx — la línea de entrada (deliberadamente tonta)
   ───────────────────────────────────────────────────────────────
   Su único trabajo: (a) sonar en cada tecla, (b) entregar el texto
   crudo con onSubmit al recibir Enter. NO sabe qué es un comando.

   CURSOR estilo terminal: no usamos el caret nativo (va oculto).
   En su lugar hay un ESPEJO visible con el texto tecleado + un
   bloque `.cur` justo después — así el cursor AVANZA con lo escrito
   y soporta cualquier largo (el espejo hace wrap). Encima va el
   <input> real, transparente, que solo captura el teclado.

   TECLADO SIN CLICK: auto-foco al aparecer + recuperación de foco
   al perderlo (salvo si se va a un enlace), para que la terminal
   esté siempre lista para escribir sin tener que hacer click.
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import { audio } from "../engine/audio";

export function Prompt({ onSubmit, disabled }: {
  onSubmit: (raw: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  // auto-foco al montar (arranque) y al reaparecer tras un juego
  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  if (disabled) return null;

  return (
    <div className="flex items-baseline gap-2 mt-2">
      <span className="whitespace-nowrap">
        <span className="ps-u">develpzedra</span><span className="text-dim">@</span>
        <span className="ps-h">ccs</span><span className="text-dim">:</span>
        <span className="ps-d">~</span><span className="text-dim">$</span>
      </span>

      {/* área de escritura: espejo visible + input transparente encima */}
      <div className="relative flex-1 min-w-0">
        <div className="whitespace-pre-wrap break-all phosphor" aria-hidden>
          {value}
          <span className="cur" />
        </div>
        <input
          ref={ref}
          value={value}
          aria-label="terminal"
          autoComplete="off"
          spellCheck={false}
          autoFocus
          className="absolute inset-0 h-full w-full bg-transparent border-0 p-0 m-0 text-transparent caret-transparent"
          // el contorno de foco iría inline: la regla global :focus-visible
          // está fuera de @layer y ganaría a cualquier utilidad de Tailwind.
          // El cursor de bloque ya indica el foco, así que lo anulamos.
          style={{ outline: "none" }}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              audio.keyClick(true);          // Enter suena grave
              onSubmit(value);
              setValue("");
            } else if (e.key.length === 1 || e.key === "Backspace") {
              audio.keyClick();              // tecla normal
            }
          }}
          onBlur={e => {
            // mantener la terminal lista para teclear: recupera el foco
            // al perderlo, SALVO que vaya a un enlace (contacto), para
            // no romper esa navegación. Los botones (chips, sonido)
            // ejecutan su acción y el foco vuelve aquí.
            const to = e.relatedTarget as HTMLElement | null;
            if (to && to.closest && to.closest("a")) return;
            requestAnimationFrame(() => ref.current?.focus());
          }}
        />
      </div>
    </div>
  );
}
