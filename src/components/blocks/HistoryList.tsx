import { Icons, Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";
import { jobs } from "../../data/profile";

export function HistoryList({ onDone }: { onDone?: () => void }) {
  return (
    <div>
      <Section icon="clock">runtime · trayectoria</Section>
      {jobs.map((j, i) => (
        <article key={j.id} className="rec">
          <div className="ric">{Icons.clock}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-2.5 flex-wrap items-baseline">
              <span className="font-bold">{j.empresa}</span>
              <span className="text-[11.5px] text-mag">
                {j.id} ·{" "}
                {j.running
                  ? <span className="text-grn">● running</span>
                  : <span className="text-dim">exit 0</span>}
              </span>
            </div>
            <div className="text-dim text-xs mt-0.5 mb-2">
              {j.periodo} · {j.lugar} — {j.rol}
            </div>
            {j.logros.map((l, k) => (
              <div key={k} className="text-dim">
                {"  ─ "}<span className="text-fg2">{l}</span>
              </div>
            ))}
            <TypedBlock
              className="note mt-2.5"
              segs={[{ text: j.nota }]}
              onDone={i === jobs.length - 1 ? onDone : undefined}
            />
          </div>
        </article>
      ))}
    </div>
  );
}