import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { audio } from "./audio";

/* Verifica el reproductor de música y, sobre todo, el DUCKING:
   que al puntuar la música baje y luego regrese, para que el
   sonido de score siempre se oiga.

   `new Audio()` se stubea devolviendo un <audio> real de jsdom
   (así appendChild funciona) con un play() resuelto (jsdom no
   implementa play). Los beeps usan WebAudio (AudioContext, que no
   existe en jsdom): van en try/catch, así que no estorban aquí. */
class FakeAudio {
  constructor(src: string) {
    const el = document.createElement("audio");
    el.src = src;
    el.play = () => Promise.resolve(); // jsdom no implementa play()
    return el as unknown as FakeAudio;
  }
}

const el = () =>
  document.querySelector("audio[data-game-music]") as HTMLAudioElement | null;

// deja resolver el .then(play) (microtask) y avanza el fade-in
async function settleStart() {
  await Promise.resolve();
  await Promise.resolve();
  vi.advanceTimersByTime(700); // fade-in dura 600ms
}

describe("audio · música de fondo + ducking", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("Audio", FakeAudio);
    audio.setMuted(false);
  });
  afterEach(() => {
    audio.stopMusic();
    vi.runAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("startMusic reproduce en bucle y sube al volumen de fondo (0.14)", async () => {
    audio.startMusic("snake.mp3");
    const a = el();
    expect(a).not.toBeNull();
    expect(a!.loop).toBe(true);
    await settleStart();
    expect(a!.volume).toBeCloseTo(0.14, 2);
  });

  it("scorePing NO altera el volumen de la música (sin pump)", async () => {
    audio.startMusic("snake.mp3");
    const a = el();
    await settleStart();
    expect(a!.volume).toBeCloseTo(0.14, 2); // fondo antes del punto

    audio.scorePing(660);          // ← anotar
    // muestrea el volumen en varios instantes: debe quedarse igual
    for (const ms of [30, 80, 160, 320]) {
      vi.advanceTimersByTime(ms);
      expect(a!.volume).toBeCloseTo(0.14, 2);
    }
  });

  it("el botón de sonido silencia/reactiva la música en curso", async () => {
    audio.startMusic("bat.mp3");
    const a = el();
    await settleStart();
    audio.setMuted(true);
    expect(a!.muted).toBe(true);
    audio.setMuted(false);
    expect(a!.muted).toBe(false);
  });

  it("stopMusic hace fade-out y quita el elemento del DOM", async () => {
    audio.startMusic("snake.mp3");
    await settleStart();
    expect(el()).not.toBeNull();
    audio.stopMusic();
    vi.advanceTimersByTime(400); // fade-out 300ms + limpieza
    expect(el()).toBeNull();
  });
});
