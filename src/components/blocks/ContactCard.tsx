/* CAPA 4 · ContactCard.tsx — salida de `contact`.
   Enlaces reales (mailto/tel/https) en rejilla clave→valor. */
import { Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";
import { useContent } from "../../i18n/lang";

export function ContactCard({ onDone }: { onDone?: () => void }) {
  const { contact, ui } = useContent();
  return (
    <div>
      <Section icon="mail" tone="mag">{ui.sections.contact}</Section>
      <div className="out kv">
        <span className="k">{ui.contactLabels.email}</span>
        <a href={`mailto:${contact.correo}`}>{contact.correo}</a>
        <span className="k">Linkedin</span>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          {contact.linkedinLabel}
        </a>
        <span className="k">{ui.contactLabels.phone}</span>
        <a href={contact.telHref}>{contact.telefono}</a>
      </div>
      <TypedBlock className="note" segs={[{ text: contact.nota }]} onDone={onDone} />
    </div>
  );
}
