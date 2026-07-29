import { useEffect, useState } from "react";
import { audio } from "../engine/audio";

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
  const [on, setOn] = useState(true);   // estado VISUAL del botón;
                                        // el estado real vive en audio.ts
  return (
    <div className="sticky top-0 z-30 flex items-center gap-2.5 px-3.5 py-2 bg-[#05060caa] backdrop-blur-sm border-b border-[#1b2e4b] text-[11.5px] text-dim tracking-[.04em]">
      <span className="flex gap-1.5">
        <i className="w-[11px] h-[11px] rounded-full bg-red block" />
        <i className="w-[11px] h-[11px] rounded-full bg-amb block" />
        <i className="w-[11px] h-[11px] rounded-full bg-grn block" />
      </span>
      <span className="text-cyan hidden md:inline">develpzedra@ccs</span>
      <span className="hidden md:inline">:~/portfolio</span>
      <span className="flex-1" />
      <button
        className={`chip flex items-center gap-1.5 ${on ? "" : "text-dim"}`}
        onClick={() => {
          const v = !on;
          setOn(v);
          audio.setMuted(!v);
          if (v) audio.beep(660, 0.07, 0.05);   // confirma al reactivar
        }}
      >
        sonido {on ? "on" : "off"}
      </button>
      <span className="hidden md:inline">
        conn <b className="text-grn">secure</b> · {clock}
      </span>
    </div>
  );
}