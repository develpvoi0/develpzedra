/* ═══════════════════════════════════════════════════════════════
   CAPA 2 · snake.ts — lógica de juego pura (CERO React)
   ───────────────────────────────────────────────────────────────
   EL CONTRATO: start(canvas, hooks) => stopFn.
   Esa firma calza EXACTO con useEffect (montar → cleanup): por
   eso "desmontar el componente" y "terminar el juego" son la
   misma operación, y la interrupción limpia sale gratis.
   El juego reporta hacia arriba SOLO por los hooks (onScore,
   onEnd); no sabe que React existe.
   ═══════════════════════════════════════════════════════════════ */
import { audio } from "../engine/audio";

export type GameHooks = {
  onScore(n: number): void;
  onEnd(msg: string): void;
};

type P = { x: number; y: number };

export function startSnake(cv: HTMLCanvasElement, hooks: GameHooks): () => void {
  const c2 = cv.getContext("2d")!;
  const cell = 10, cols = 24, rows = 16;         // 24×16 celdas = 240×160 px

  let snake: P[] = [{ x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }];
  let dir: P = { x: 1, y: 0 };
  let ndir = dir;      // dirección PENDIENTE: se aplica al inicio del tick
  let score = 0;       //   (evita el bug de girar dos veces en un tick
  let over = false;    //    y morderse el cuello)

  const place = (): P => {
    let p: P;
    do {
      p = { x: (Math.random() * cols) | 0, y: (Math.random() * rows) | 0 };
    } while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
  };
  let food = place();

  /* nunca permitir reversa directa (izq→der en un tick) */
  const setDir = (d: P) => {
    if (d.x !== -dir.x || d.y !== -dir.y) ndir = d;
  };

  const draw = () => {
    c2.fillStyle = "#05070f"; c2.fillRect(0, 0, 240, 160);
    // rejilla de puntos tenue
    c2.fillStyle = "#0d1428";
    for (let gx = 0; gx < cols; gx++)
      for (let gy = 0; gy < rows; gy++)
        c2.fillRect(gx * cell + 4.5, gy * cell + 4.5, 1, 1);
    // comida magenta con halo
    c2.fillStyle = "#ff2ea640"; c2.fillRect(food.x * cell, food.y * cell, 10, 10);
    c2.fillStyle = "#ff2ea6";   c2.fillRect(food.x * cell + 2, food.y * cell + 2, 6, 6);
    // serpiente: cabeza cyan brillante, cuerpo alternando tonos
    snake.forEach((s, i) => {
      c2.fillStyle = i === 0 ? "#22e5ff" : i % 2 ? "#17b8d6" : "#118aa8";
      c2.fillRect(s.x * cell + 1, s.y * cell + 1, 8, 8);
    });
  };

  const end = (msg: string) => {
    if (!over) { over = true; hooks.onEnd(msg); }
  };

  /* tick del juego cada 110ms */
  const iv = setInterval(() => {
    dir = ndir;
    // bordes que envuelven (túnel): más amable para partidas casuales
    const h: P = {
      x: (snake[0].x + dir.x + cols) % cols,
      y: (snake[0].y + dir.y + rows) % rows,
    };
    if (snake.some(s => s.x === h.x && s.y === h.y)) {
      audio.errBuzz();
      return end("te mordiste");
    }
    snake.unshift(h);
    if (h.x === food.x && h.y === food.y) {
      hooks.onScore(++score);
      audio.beep(700 + score * 18, 0.05, 0.045);  // tono sube con el score
      food = place();
    } else {
      snake.pop();
    }
    draw();
  }, 110);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      audio.beep(300, 0.08, 0.04);
      return end("sesión de juego cerrada");
    }
    const m: Record<string, P> = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
    };
    if (m[e.key]) { e.preventDefault(); setDir(m[e.key]); }
  };

  /* móvil: swipe = dirección (umbral de 12px para ignorar taps) */
  let tx = 0, ty = 0;
  const onTS = (e: TouchEvent) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; };
  const onTE = (e: TouchEvent) => {
    const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) + Math.abs(dy) < 12) return;
    if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    else setDir(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
  };

  document.addEventListener("keydown", onKey, true);
  cv.addEventListener("touchstart", onTS, { passive: true });
  cv.addEventListener("touchend", onTE, { passive: true });
  draw();

  /* TODO se desregistra aquí — la mitad del contrato */
  return () => {
    over = true;
    clearInterval(iv);
    document.removeEventListener("keydown", onKey, true);
    cv.removeEventListener("touchstart", onTS);
    cv.removeEventListener("touchend", onTE);
  };
}
