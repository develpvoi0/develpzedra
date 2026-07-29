import { Section } from "../Icons";

export function ArcadeMenu() {
  return (
    <div>
      <Section icon="chip" tone="grn">arcade · para el aburrimiento</Section>
      <div>Sala de Juegos Retro — Elige:</div>
      <div className="out kv">
        <span className="text-cyan">snake</span>
        <span>La serpiente clásica, versión neón</span>
        <span className="text-cyan">bat</span>
        <span>Vuela el murciélago de VESPER por la cueva</span>
      </div>
      <div className="text-dim">
        Escribe el nombre del juego · dentro: <span className="text-cyan">ESC</span> para salir
      </div>
    </div>
  );
}