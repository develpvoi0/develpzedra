import { Icons, Section, type IconName } from "../Icons";
import { PixelSprite } from "../PixelSprite";
import { TypedBlock } from "../TypedBlock";
import { BATMAP, BATPAL, SLIMEMAP, SLIMEPAL } from "../../engine/sprites";
import { useContent } from "../../i18n/lang";

const SPRITES = {
  bat: { map: BATMAP, pal: BATPAL },
  slime: { map: SLIMEMAP, pal: SLIMEPAL },
} as const;

export function ProjectList({ onDone }: { onDone?: () => void }) {
  const { projects, ui } = useContent();
  return (
    <div>
      <Section icon="box">{ui.sections.projects}</Section>

      {projects.map(p => (
        <article key={p.id} className={`rec ${p.game ? "rec-game" : ""}`}>
          {p.sprite ? (
            <div className="sprite">
              <PixelSprite map={SPRITES[p.sprite].map} palette={SPRITES[p.sprite].pal} />
            </div>
          ) : (
            <div className="ric">{Icons[p.icono as IconName]}</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-2.5 flex-wrap items-baseline">
              <span className="font-bold">{p.nombre}</span>
              <span className={`text-[11.5px] ${p.game ? "text-grn" : "text-mag"}`}>
                {p.id}
              </span>
            </div>
            <div className="text-dim text-xs mt-0.5 mb-2">{p.meta}</div>
            <p className="text-fg2 text-[13px]">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            {p.nota && (
              <TypedBlock className="note mt-2.5" segs={[{ text: p.nota }]} />
            )}
          </div>
        </article>
      ))}

      {/* nota de cierre del bloque completo */}
      <TypedBlock className="note" onDone={onDone} segs={[{ text: ui.notes.projects }]} />
    </div>
  );
}
