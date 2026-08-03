import { bus } from "../engine/bus";

const CHIPS = ["whoami", "history", "infra", "projects", "stack", "contact", "tired"];

export function HintBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-[#05060cf2] border-t border-[#1b2e4b] px-3.5 py-2 text-[11.5px] text-dim flex gap-x-4 gap-y-2 flex-wrap items-center h-20">
      <span><b className="text-cyan">comandos:</b></span>
      {CHIPS.map(c => (
        <button key={c} className="chip" onClick={() => bus.emit(c)}>{c}</button>
      ))}
      <span className="flex-1" />
      <span className="hidden md:inline">
        escribe <b className="text-cyan">help</b> ↵
      </span>
    </div>
  );
}