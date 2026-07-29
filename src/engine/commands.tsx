import type { Command } from "./types";
import { Neofetch } from "../components/blocks/Neofetch";
import { HistoryList } from "../components/blocks/HistoryList";
import { InfraPanel } from "../components/blocks/InfraPanel";
import { ProjectList } from "../components/blocks/ProjectList";
import { StackList } from "../components/blocks/StackList";
import { ContactCard } from "../components/blocks/ContactCard";
import { ArcadeMenu } from "../components/blocks/ArcadeMenu";
import { HelpList } from "../components/blocks/HelpList";

export const commands: Record<string, Command> = {
  help:     { desc: "Lista de comandos",           run: c => c.print(<HelpList list={helpRows()} />) },
  whoami:   { desc: "Perfil estilo neofetch",      run: c => c.print(<Neofetch />) },
  history:  { desc: "Trayectoria profesional",     run: c => c.print(<HistoryList />) },
  infra:    { desc: "Estado del clúster K3s",      run: c => c.print(<InfraPanel />) },
  projects: { desc: "Builds: producción y juegos", run: c => c.print(<ProjectList />) },
  stack:    { desc: "Tecnologías por función",     run: c => c.print(<StackList />) },
  contact:  { desc: "Canales de contacto",         run: c => c.print(<ContactCard />) },
  tired:    { desc: "Sala de juegos retro",        run: c => c.print(<ArcadeMenu />) },
  snake:    { desc: "SNAKE//neon",                 run: c => c.launchGame("snake") },
  bat:      { desc: "VESPER//mini",                run: c => c.launchGame("bat") },
  clear:    { desc: "Limpiar la terminal",         run: c => c.clear() },
};

/* Alias: puras redirecciones de nombre. */
export const aliases: Record<string, string> = {
  neofetch: "whoami", cat: "whoami", about: "whoami", ls: "help",
  bored: "tired", aburrido: "tired", play: "tired", games: "tired",
};

/* snake/bat no salen en help: se descubren desde el menú `tired`. */
const HIDDEN = new Set(["snake", "bat"]);

export const helpRows = (): [string, string][] =>
  Object.entries(commands)
    .filter(([n]) => !HIDDEN.has(n))
    .map(([n, c]) => [n, c.desc]);

/* Normaliza la entrada del usuario y traduce alias. */
export const resolve = (raw: string): string => {
  const c = raw.trim().toLowerCase();
  return aliases[c] ?? c;
};