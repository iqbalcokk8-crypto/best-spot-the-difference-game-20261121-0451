// KEMBAR SENJA — Spot the Difference
// render.js — merakit dua panel SVG dari satu scene: panel kiri dan kanan,
// penanda perbedaan yang sudah ketemu, cincin petunjuk, dan kursor keyboard.
// Panel dirender ulang tiap ada perubahan state, jadi tampilannya selalu
// jujur terhadap state permainan (tidak ada gambar hasil edit).

import { GAME_CONFIG } from './config.js';

const NS = 'http://www.w3.org/2000/svg';

// Lingkaran penanda: emas, garis putus-putus, plus centang kecil.
export function foundMarker(diff) {
  const { x, y } = diff;
  return `<g class="marker" data-diff="${diff.id}">
    <circle cx="${x}" cy="${y}" r="${GAME_CONFIG.markerRadius}" fill="rgba(255, 209, 102, 0.22)"
      stroke="#ffd166" stroke-width="4" stroke-dasharray="10 6"/>
    <circle cx="${x}" cy="${y}" r="${GAME_CONFIG.markerRadius - 7}" fill="none"
      stroke="#ffd166" stroke-width="1.5" opacity="0.7"/>
    <text x="${x}" y="${y + 7}" font-size="22" fill="#ffd166" font-weight="bold"
      text-anchor="middle" font-family="Georgia, serif">✓</text>
  </g>`;
}

// Cincin petunjuk: berdenyut di sekitar satu perbedaan yang belum ketemu.
export function hintRing(diff) {
  return `<g class="hint-ring" data-diff="${diff.id}">
    <circle cx="${diff.x}" cy="${diff.y}" r="${GAME_CONFIG.markerRadius + 4}" fill="none"
      stroke="#4cc9f0" stroke-width="4"/>
    <circle cx="${diff.x}" cy="${diff.y}" r="${GAME_CONFIG.markerRadius + 12}" fill="none"
      stroke="#4cc9f0" stroke-width="2" opacity="0.5"/>
  </g>`;
}

// Kursor keyboard: bidikan silang yang digerakkan tombol panah.
export function keyboardCursor(pos) {
  if (!pos) return '';
  const { x, y } = pos;
  return `<g class="kbd-cursor" pointer-events="none">
    <circle cx="${x}" cy="${y}" r="16" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.9"/>
    <circle cx="${x}" cy="${y}" r="3" fill="#ffffff"/>
    <line x1="${x - 24}" y1="${y}" x2="${x - 18}" y2="${y}" stroke="#ffffff" stroke-width="2"/>
    <line x1="${x + 18}" y1="${y}" x2="${x + 24}" y2="${y}" stroke="#ffffff" stroke-width="2"/>
    <line x1="${x}" y1="${y - 24}" x2="${x}" y2="${y - 18}" stroke="#ffffff" stroke-width="2"/>
    <line x1="${x}" y1="${y + 18}" x2="${x}" y2="${y + 24}" stroke="#ffffff" stroke-width="2"/>
  </g>`;
}

// Rakit satu panel lengkap: gambar scene + semua penanda di atasnya.
export function renderPanel(scene, side, state) {
  const found = scene.diffs.filter((d) => state.found.has(d.id));
  const hint = state.hintDiff && !state.found.has(state.hintDiff.id) ? state.hintDiff : null;
  const cursor = state.activePanel === side ? state.cursor : null;
  return `<svg viewBox="0 0 640 480" role="img"
      aria-label="Panel ${side === 'L' ? 'kiri' : 'kanan'} scene ${scene.name}"
      xmlns="${NS}">
    ${scene.draw(side)}
    ${found.map(foundMarker).join('')}
    ${hint ? hintRing(hint) : ''}
    ${keyboardCursor(cursor)}
  </svg>`;
}

// Dots sisa: tujuh titik, yang ketemu jadi emas, sisanya garis luar saja.
export function remainingDots(scene, found) {
  return scene.diffs
    .map((d) => `<span class="dot ${found.has(d.id) ? 'done' : ''}" title="${d.label}"></span>`)
    .join('');
}
