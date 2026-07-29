import { PixelSprite } from "../PixelSprite";
import { TypedBlock, useSteps } from "../TypedBlock";
import { Section } from "../Icons";
import { FACEMAP, FACEPAL } from "../../engine/sprites";
import { identity } from "../../data/profile";

export function Neofetch({ onDone }: { onDone?: () => void }) {
  const { step, next } = useSteps();

  const ficha: [string, string][] = [
    ["usuario", identity.usuario],
    ["título", identity.titulo],
    ["rol", identity.rol],
    ["host", identity.host],
    ["uptime", identity.uptime],
    ["shell", identity.shell],
    ["formación", identity.formacion],
    ["idiomas", identity.idiomas],
    ["estado", identity.estado],
  ];

  return (
     <div>
      <Section icon="user">identity</Section>

      {/* avatar + ficha: instantáneos */}
      <div className="flex flex-wrap gap-5  my-2.5 items-center">
        <div className="avatar-px">
          <PixelSprite map={FACEMAP} palette={FACEPAL} cell={5} />
        </div>
        <div className="kv min-w-[260px] self-center">
          {ficha.map(([k, v]) => (
            
            <div key={k} className="contents">
              <span className="k">{k}</span>
              <span
                className={
                  k === "usuario" ? "text-cyan font-bold"
                  : k === "uptime" ? "text-amb"
                  : k === "estado" ? "text-grn"
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
