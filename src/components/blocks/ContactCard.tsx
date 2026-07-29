/* CAPA 4 · ContactCard.tsx — salida de `contact`.
   Enlaces reales (mailto/tel/https) en rejilla clave→valor. */
import { Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";
import { contact } from "../../data/profile";

export function ContactCard({ onDone }: { onDone?: () => void }) {
  return (
    <div>
      <Section icon="mail" tone="mag">signals · contacto</Section>
      <div className="out kv">
        <span className="k">Correo</span>
        <a href={`mailto:${contact.correo}`}>{contact.correo}</a>
        <span className="k">Linkedin</span>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          {contact.linkedinLabel}
        </a>
        <span className="k">Teléfono</span>
        <a href={contact.telHref}>{contact.telefono}</a>
      </div>
      <TypedBlock className="note" segs={[{ text: contact.nota }]} onDone={onDone} />
    </div>
  );
}
