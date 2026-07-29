let ac: AudioContext | null = null;
let noiseBuff: AudioBuffer | null = null;
let muted = false;

/* ── Música de fondo ──────────────────────────────────────────
   HTMLAudio (no WebAudio): es un stream largo en bucle, no un
   efecto sintetizado. Vive fuera de React como el resto del
   motor. Cada fade se rastrea POR elemento (WeakMap) para que la
   pista saliente y la entrante no se pisen al cambiar de juego. */
let music: HTMLAudioElement | null = null;
const fades = new WeakMap<HTMLAudioElement, ReturnType<typeof setInterval>>();
const MUSIC_VOL = 0.14;   // fondo bajo y CONSTANTE (sin ducking)

/* Lleva el volumen de `m` hasta `target` en ~`ms` ms y luego
   ejecuta `done`. Un fade por elemento, cancelable. */
function fade(m: HTMLAudioElement, target: number, ms: number, done?: () => void) {
  const prev = fades.get(m);
  if (prev) clearInterval(prev);
  const steps = Math.max(1, Math.round(ms / 40));
  const from = m.volume;
  let i = 0;
  const id = setInterval(() => {
    i++;
    m.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)));
    if (i >= steps) { clearInterval(id); fades.delete(m); done?.(); }
  }, 40);
  fades.set(m, id);
}

function ctx(): AudioContext {
  if (!ac) {
    ac = new AudioContext();
    const len = ac.sampleRate * 0.06;
    noiseBuff = ac.createBuffer(1, len, ac.sampleRate);
    const d = noiseBuff.getChannelData(0);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  }
  if (ac.state === "suspended") void ac.resume();
  return ac;
}

export const audio = {
  setMuted(v: boolean) {
    muted = v;
    if (music) music.muted = v;   // silencia/reactiva la música al instante
  },
  isMuted: () => muted,

  keyClick(deep = false, soft = false) {
    if (muted) return;
    try {
      const a = ctx(),
        t = a.currentTime,
        v = soft ? 0.5 : 1;
      const n = a.createBufferSource();
      n.buffer = noiseBuff!;
      const f = a.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = (deep ? 900 : 2200) + Math.random() * 600;
      f.Q.value = 1.4;
      const g = a.createGain();
      g.gain.setValueAtTime((deep ? 0.22 : 0.12) * v, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + (deep ? 0.09 : 0.05));
      n.connect(f);
      f.connect(g);
      g.connect(a.destination);
      n.start(t);
      const o = a.createOscillator();
      o.type = "square";
      o.frequency.setValueAtTime((deep ? 140 : 340) + Math.random() * 40, t);
      const og = a.createGain();
      og.gain.setValueAtTime((deep ? 0.05 : 0.025) * v, t);
      og.gain.exponentialRampToValueAtTime(0.0008, t + 0.03);
      o.connect(og);
      og.connect(a.destination);
      o.start(t);
      o.stop(t + 0.04);
    } catch {
  
    }
  },


  beep(freq: number, dur = 0.08, vol = 0.05) {
    if (muted) return;
    try {
      const a = ctx(),
        t = a.currentTime;
      const o = a.createOscillator(),
        g = a.createGain();
      o.type = "triangle";
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g);
      g.connect(a.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch {
      /* sin audio: la app sigue */
    }
  },

  /* Error: dos zumbidos graves descendentes. */
  errBuzz() {
    audio.beep(110, 0.16, 0.07);
    setTimeout(() => audio.beep(92, 0.18, 0.07), 70);
  },

  /* Sonido de PUNTUACIÓN: arpegio corto y brillante (dos tonos que
     suben, con un armónico cuadrado que le da "brillo"). Va lo
     bastante fuerte y con un timbre distinto al de la música para
     destacar SOLO, sin tocar el volumen del fondo (nada de pump).
     Úsalo al comer (snake) o pasar un pilar (bat). */
  scorePing(base: number) {
    audio.blip(base, 0.06, 0.15);
    setTimeout(() => audio.blip(base * 1.5, 0.13, 0.17), 55);
  },

  /* Tono con cuerpo: triángulo (base) + un poco de cuadrada una
     octava arriba para el ataque. Más "presente" que audio.beep,
     por eso corta la mezcla sin subir el volumen. */
  blip(freq: number, dur = 0.1, vol = 0.12) {
    if (muted) return;
    try {
      const a = ctx(), t = a.currentTime;
      const g = a.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      g.connect(a.destination);
      const o1 = a.createOscillator();
      o1.type = "triangle"; o1.frequency.value = freq;
      o1.connect(g); o1.start(t); o1.stop(t + dur + 0.02);
      const o2 = a.createOscillator();
      o2.type = "square"; o2.frequency.value = freq * 2;
      const g2 = a.createGain();
      g2.gain.setValueAtTime(vol * 0.28, t);           // brillo sutil
      g2.gain.exponentialRampToValueAtTime(0.0008, t + dur * 0.6);
      o2.connect(g2); g2.connect(a.destination);
      o2.start(t); o2.stop(t + dur + 0.02);
    } catch { /* sin audio: la app sigue */ }
  },

  /* Arranca una pista de fondo EN BUCLE con fade-in. `src` es la
     URL del asset (cada juego importa la suya; Vite la resuelve).
     Si el autoplay está bloqueado o el formato falla, la partida
     sigue sin música — nunca revienta el juego. */
  startMusic(src: string) {
    audio.stopMusic();
    try {
      const m = new Audio(src);
      m.loop = true;        // bucle nativo, sin cortes al terminar
      m.volume = 0;         // arranca en silencio para el fade-in
      m.muted = muted;      // respeta el botón global de sonido
      m.setAttribute("data-game-music", "");
      m.style.display = "none";
      document.body.appendChild(m);   // adjunto: reproducible y observable
      music = m;
      m.play()
        .then(() => { if (music === m) fade(m, MUSIC_VOL, 600); })
        .catch(() => { /* autoplay bloqueado: sin música */ });
    } catch { /* sin música: la partida sigue */ }
  },

  /* Fade-out corto y liberación. Idempotente: llamarlo en la
     muerte y otra vez en el desmontaje no rompe nada. */
  stopMusic() {
    const m = music;
    if (!m) return;
    music = null;
    fade(m, 0, 300, () => {
      try { m.pause(); m.currentTime = 0; m.remove(); } catch { /* noop */ }
    });
  },
};
