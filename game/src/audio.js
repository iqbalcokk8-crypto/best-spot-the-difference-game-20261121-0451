// KEMBAR SENJA — Spot the Difference
// audio.js — semua suara disintesis dengan WebAudio, tanpa file audio.
// Nada-nada orisinal: petik lembut saat ketemu, dentum rendah saat meleset,
// arpeggio saat scene selesai. Tidak ada sampel atau lagu dari luar.

let audioContext = null;
let muted = false;

export function setMuted(value) {
  muted = Boolean(value);
}

export function isMuted() {
  return muted;
}

function context() {
  if (!audioContext) {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

// Satu nada: osilator + penguat yang memudar.
function tone(freq, startAt, duration, type = 'sine', volume = 0.12) {
  const ctx = context();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

export const sounds = {
  // Dua petik naik: E5 lalu A5 — perbedaan ketemu.
  find() {
    tone(659.25, 0, 0.18, 'triangle', 0.14);
    tone(880, 0.09, 0.24, 'triangle', 0.14);
  },
  // Dentum rendah — klik meleset.
  miss() {
    tone(110, 0, 0.22, 'square', 0.07);
    tone(82.4, 0.05, 0.25, 'sine', 0.1);
  },
  // Bunyi tombol biasa.
  click() {
    tone(523.25, 0, 0.07, 'sine', 0.08);
  },
  // Lonceng kecil — petunjuk dipakai.
  hint() {
    tone(1046.5, 0, 0.16, 'sine', 0.1);
    tone(1318.5, 0.08, 0.2, 'sine', 0.08);
  },
  // Arpeggio naik C–E–G–C — scene selesai.
  complete() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone(freq, i * 0.11, 0.3, 'triangle', 0.12));
  },
  // Detik terakhir timer (dipakai saat waktu tinggal 10 detik).
  tick() {
    tone(880, 0, 0.05, 'square', 0.04);
  },
  // Fanfare pendek — semua scene selesai.
  fanfare() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => tone(freq, i * 0.12, 0.35, 'triangle', 0.12));
    tone(261.63, 0, 0.7, 'sine', 0.06);
  },
};
