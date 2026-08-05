import { Section } from "../Icons";
import { useContent } from "../../i18n/lang";

export function ArcadeMenu() {
  const { ui } = useContent();
  return (
    <div>
      <Section icon="chip" tone="grn">{ui.sections.arcade}</Section>
      <div>{ui.arcade.choose}</div>
      <div className="out kv">
        <span className="text-cyan">snake</span>
        <span>{ui.arcade.snake}</span>
        <span className="text-cyan">bat</span>
        <span>{ui.arcade.bat}</span>
      </div>
      <div className="text-dim">
        {ui.arcade.howtoPre} <span className="text-cyan">ESC</span> {ui.arcade.esc}
      </div>
    </div>
  );
}
