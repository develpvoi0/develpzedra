import type { Command } from "./types";
import { Neofetch } from "../components/blocks/Neofetch";
import { HistoryList } from "../components/blocks/HistoryList";
import { InfraPanel } from "../components/blocks/InfraPanel";
import { ProjectList } from "../components/blocks/ProjectList";
import { StackList } from "../components/blocks/StackList";
import { ContactCard } from "../components/blocks/ContactCard";
import { ArcadeMenu } from "../components/blocks/ArcadeMenu";
import { HelpList } from "../components/blocks/HelpList";

/* Comandos: nombre → acción. Las descripciones (traducibles) viven
   en el diccionario i18n (ui.commands) y las pinta HelpList. */
export const commands: Record<string, Command> = {
  help:     { run: c => c.print(<HelpList />) },
  whoami:   { run: c => c.print(<Neofetch />) },
  history:  { run: c => c.print(<HistoryList />) },
  infra:    { run: c => c.print(<InfraPanel />) },
  projects: { run: c => c.print(<ProjectList />) },
  stack:    { run: c => c.print(<StackList />) },
  contact:  { run: c => c.print(<ContactCard />) },
  tired:    { run: c => c.print(<ArcadeMenu />) },
  snake:    { run: c => c.launchGame("snake") },
  bat:      { run: c => c.launchGame("bat") },
  clear:    { run: c => c.clear() },
};

/* Alias: puras redirecciones de nombre. */
export const aliases: Record<string, string> = {
  neofetch: "whoami", cat: "whoami", about: "whoami", ls: "help",
  bored: "tired", aburrido: "tired", play: "tired", games: "tired",
};

/* snake/bat no salen en help: se descubren desde el menú `tired`. */
const HIDDEN = new Set(["snake", "bat"]);

/* Nombres visibles en `help`, en orden de declaración. HelpList les
   pone la descripción del idioma activo. */
export const VISIBLE_COMMANDS = Object.keys(commands).filter(n => !HIDDEN.has(n));

/* Normaliza la entrada del usuario y traduce alias. */
export const resolve = (raw: string): string => {
  const c = raw.trim().toLowerCase();
  return aliases[c] ?? c;
};
