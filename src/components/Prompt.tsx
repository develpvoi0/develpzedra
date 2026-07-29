import { useEffect, useRef, useState } from "react";
import { audio } from "../engine/audio";

export function Prompt({ onSubmit, disabled }: {
  onSubmit: (raw: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  // al reaparecer tras un juego, recuperar el foco solo
  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  if (disabled) return null;

  return (
    <div className="flex items-baseline gap-2 mt-2 flex-wrap">
      <span className="whitespace-nowrap">
        <span className="ps-u">develpzedra</span><span className="text-dim">@</span>
        <span className="ps-h">ccs</span><span className="text-dim">:</span>
        <span className="ps-d">~</span><span className="text-dim">$</span>
      </span>
      <input
        ref={ref}
        value={value}
        aria-label="terminal"
        autoComplete="off"
        spellCheck={false}
        className="bg-transparent border-0 outline-none flex-1 min-w-[120px] phosphor caret-transparent"
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
      />
      <span className="cur" />
    </div>
  );
}