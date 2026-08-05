import { VISIBLE_COMMANDS } from "../../engine/commands";
import { useContent } from "../../i18n/lang";

export function HelpList() {
  const { ui } = useContent();
  return (
    <div className="out kv">
      {VISIBLE_COMMANDS.map(name => (
        <div key={name} className="contents">
          <span className="text-cyan">{name}</span>
          <span>{ui.commands[name] ?? ""}</span>
        </div>
      ))}
    </div>
  );
}
