import { bus } from "../engine/bus";
import { useContent } from "../i18n/lang";

const CHIPS = ["whoami", "history", "infra", "projects", "stack", "contact", "tired"];

export function HintBar() {
  const { ui } = useContent();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-[var(--bar-bg)] border-t border-[color:var(--bar-border)] px-3.5 py-2 text-[11.5px] text-dim flex gap-x-4 gap-y-2 flex-wrap items-center h-20">
      <span><b className="text-cyan">{ui.hintbar.comandos}</b></span>
      {CHIPS.map(c => (
        <button key={c} className="chip" onClick={() => bus.emit(c)}>{c}</button>
      ))}
      <span className="flex-1" />
      <span className="hidden md:inline">
        {ui.hintbar.escribePre} <b className="text-cyan">help</b> {ui.hintbar.escribePost}
      </span>
    </div>
  );
}
