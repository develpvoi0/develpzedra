/* ═══════════════════════════════════════════════════════════════
   CAPA 2 · batGame.ts — VESPER//mini (mismo contrato que snake)
   ───────────────────────────────────────────────────────────────
   Estilo flappy: gravedad + aleteo. El murciélago se dibuja con
   drawMap desde BATMAP — el MISMO mapa del sprite de la tarjeta
   de proyectos (fuente única).

   DOS decisiones que lo hacen jugable:
   1. FÍSICA POR TIEMPO REAL (delta-time). El loop no asume 60fps:
      mide cuántos "frames de 60fps" pasaron entre cuadros (dt) y
      escala gravedad, velocidad y avance con eso. Así se siente
      IGUAL en un monitor de 60Hz que en uno de 144Hz (antes, a
      144Hz, la gravedad efectiva era ~2.4× y el murciélago se
      desplomaba al instante).
   2. NO CAE HASTA EL PRIMER TOQUE. `started` mantiene al
      murciélago flotando hasta que el jugador aletea por primera
      vez: nada de perder en el medio segundo inicial.
   ═══════════════════════════════════════════════════════════════ */
import { audio } from "../engine/audio";
import { BATMAP, BATPAL, drawMap } from "../engine/sprites";
import type { GameHooks } from "./snake";

type Wall = { x: number; gy: number; gh: number; passed: boolean };

/* Constantes de sintonía (en unidades "por frame de 60fps"). */
const GRAV = 0.11;     // gravedad
const FLAP = -2.4;     // impulso de aleteo
const WALLSPD = 1.2;   // velocidad de las paredes
const SPAWN = 115;     // frames entre paredes
const GAP = 66;        // hueco vertical

export function startBat(cv: HTMLCanvasElement, hooks: GameHooks): () => void {
  const c2 = cv.getContext("2d")!;
  const S = 1.6;                 // escala del sprite
  const BW = 12 * S, BH = 10 * S; // caja de colisión (12×10 celdas)
  const BX = 44;                  // x fija del murciélago

  let by = 72, vy = 0;            // posición y velocidad vertical
  let t = 0, score = 0, over = false, raf = 0;
  let started = false;           // la física no corre hasta el 1er aleteo
  let walls: Wall[] = [];
  let spawnAcc = SPAWN - 90;      // gracia: 1ª pared a ~1.5s de empezar
  let last = 0;                   // timestamp del cuadro anterior

  const end = (msg: string) => {
    if (!over) { over = true; hooks.onEnd(msg); }
  };

  const flap = () => {
    if (over) return;
    started = true;              // el primer aleteo arranca la partida
    vy = FLAP;
    audio.keyClick(true, true);  // golpe de ala
  };

  const draw = (now: number) => {
    c2.fillStyle = "#05070f"; c2.fillRect(0, 0, 240, 160);
    // motas de cueva desplazándose (parallax barato)
    c2.fillStyle = "#101a30";
    for (let i = 0; i < 26; i++)
      c2.fillRect(((i * 67 - ((t * 0.4) | 0)) % 252 + 252) % 252 - 6, (i * 53) % 160, 2, 2);
    // columnas: cuerpo oscuro + borde cyan en el hueco
    walls.forEach(w => {
      c2.fillStyle = "#101b33";
      c2.fillRect(w.x, 0, 16, w.gy);
      c2.fillRect(w.x, w.gy + w.gh, 16, 160 - w.gy - w.gh);
      c2.fillStyle = "#22e5ff";
      c2.fillRect(w.x, w.gy - 1.5, 16, 1.5);
      c2.fillRect(w.x, w.gy + w.gh, 16, 1.5);
    });
    // mientras espera el primer toque, flota con un bob suave y
    // muestra la pista (usa `now` porque `t` aún no avanza)
    const bob = started ? 0 : Math.sin(now / 300) * 4;
    drawMap(c2, BATMAP, BATPAL, BX, by + bob, S);
    if (!started) {
      c2.fillStyle = "#22e5ff";
      c2.font = "10px monospace";
      c2.textAlign = "center";
      c2.fillText("toca o pulsa espacio para volar", 120, 140);
      c2.textAlign = "left";
    }
  };

  const loop = (now: number) => {
    if (over) return;
    if (!last) last = now;
    // dt = cuántos frames de 60fps transcurrieron; clamp para
    // absorber pausas (cambio de pestaña) sin un salto brusco.
    let dt = (now - last) / (1000 / 60);
    last = now;
    if (dt > 3) dt = 3;

    if (started) {
      t += dt;
      vy += GRAV * dt;   // gravedad escalada por tiempo real
      by += vy * dt;

      // nueva pared cada SPAWN frames, hueco a altura aleatoria
      spawnAcc += dt;
      if (spawnAcc >= SPAWN) {
        spawnAcc -= SPAWN;
        walls.push({ x: 244, gy: 22 + Math.random() * (160 - 44 - GAP), gh: GAP, passed: false });
      }
      walls.forEach(w => (w.x -= WALLSPD * dt));
      walls = walls.filter(w => w.x > -18);

      // techo/suelo
      if (by < -2 || by + BH > 162) {
        audio.errBuzz();
        return end("Contra la cueva");
      }
      // colisión con paredes + punto al pasarlas (con margen de 2px
      // a favor del jugador: los juegos justos se sienten mejor)
      for (const w of walls) {
        if (BX + BW - 2 > w.x && BX + 2 < w.x + 16 &&
            (by + 2 < w.gy || by + BH - 2 > w.gy + w.gh)) {
          audio.errBuzz();
          return end("Contra la cueva");
        }
        if (!w.passed && w.x + 16 < BX) {
          w.passed = true;
          hooks.onScore(++score);
          audio.beep(760 + score * 14, 0.05, 0.04);
        }
      }
    }

    draw(now);
    raf = requestAnimationFrame(loop);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      audio.beep(300, 0.08, 0.04);
      return end("Sesión de Juego Cerrada");
    }
    if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
      e.preventDefault();  // que el espacio no haga scroll
      flap();
    }
  };
  const onTap = (e: PointerEvent) => { e.preventDefault(); flap(); };

  document.addEventListener("keydown", onKey, true);
  cv.addEventListener("pointerdown", onTap);
  raf = requestAnimationFrame(loop);  // primer cuadro con timestamp real

  return () => {
    over = true;
    cancelAnimationFrame(raf);
    document.removeEventListener("keydown", onKey, true);
    cv.removeEventListener("pointerdown", onTap);
  };
}
