let ac: AudioContext | null = null;
let noiseBuff: AudioBuffer | null = null;
let muted = false;

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
};
