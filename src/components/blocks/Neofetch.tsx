import { PixelSprite } from "../PixelSprite";
import { TypedBlock, useSteps } from "../TypedBlock";
import { Section } from "../Icons";
import { FACEMAP, FACEPAL } from "../../engine/sprites";
import { useContent } from "../../i18n/lang";

export function Neofetch({ onDone }: { onDone?: () => void }) {
  const { step, next } = useSteps();
  const { identity, ui } = useContent();

  const ficha: [string, string][] = [
    [ui.fields.usuario, identity.usuario],
    [ui.fields.titulo, identity.titulo],
    [ui.fields.rol, identity.rol],
    [ui.fields.host, identity.host],
    [ui.fields.uptime, identity.uptime],
    [ui.fields.shell, identity.shell],
    [ui.fields.formacion, identity.formacion],
    [ui.fields.idiomas, identity.idiomas],
    [ui.fields.estado, identity.estado],
  ];

  return (
     <div>
      <Section icon="user">{ui.sections.identity}</Section>

      {/* avatar + ficha: instantáneos */}
      <div className="flex flex-wrap gap-5  my-2.5 items-center">
        <div className="avatar-px">
          <PixelSprite map={FACEMAP} palette={FACEPAL} cell={5} />
        </div>
        <div className="kv min-w-[260px] self-center">
          {ficha.map(([k, v], i) => (
            <div key={k} className="contents">
              <span className="k">{k}</span>
              <span
                className={
                  i === 0 ? "text-cyan font-bold"
                  : i === 4 ? "text-amb"
                  : i === 8 ? "text-grn"
                  : ""
                }
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      <TypedBlock segs={[{ text: identity.lema }]} onDone={next} />
      {step >= 1 && (
        <TypedBlock className="note" segs={[{ text: identity.nota }]} onDone={onDone} />
      )}
    </div>
  )
}
