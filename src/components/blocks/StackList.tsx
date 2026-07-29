/* CAPA 4 · StackList.tsx — salida de `stack`.
   Agrupado por FUNCIÓN en el sistema, no por porcentaje de
   dominio — y la nota lo dice explícito. */
import { Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";
import { stack } from "../../data/profile";

export function StackList({ onDone }: { onDone?: () => void }) {
  return (
    <div>
      <Section icon="chip" tone="amb">stack · por función</Section>
      <div className="out">
        {stack.map(([n, v]) => (
          <div key={n} className="my-1">
            <span className="text-mag font-bold">▍{n}</span>
            <div className="pl-2 text-fg2 text-[13.5px]">{v}</div>
          </div>
        ))}
      </div>
      <TypedBlock
        className="note"
        onDone={onDone}
        segs={[{ text: "// Ordenado por función, no por porcentaje. Las barras de habilidades son ficción." }]}
      />
    </div>
  );
}
