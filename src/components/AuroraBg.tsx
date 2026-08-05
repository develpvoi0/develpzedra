/* AuroraBg — capa de luz ambiental detrás de todo. Puro CSS: tres
   manchas de color (cian/magenta/verde del tema) que derivan muy
   despacio. No captura eventos y se congela con prefers-reduced-motion
   (regla en index.css). Colores vía variables → cambian con el tema. */
export function AuroraBg() {
  return (
    <div className="aurora" aria-hidden>
      <b className="a1" />
      <b className="a2" />
      <b className="a3" />
    </div>
  );
}
