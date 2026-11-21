// KEMBAR SENJA — Spot the Difference
// scenes.js — tiga scene orisinal Kota Senja, digambar dari kode (SVG murni).
// Tiap scene punya draw(side) yang mengembalikan isi SVG panel kiri ('L')
// atau kanan ('R'). Perbedaan antar panel hidup di dalam draw itu sendiri,
// jadi tidak ada dua file gambar yang bisa tertukar atau dicuri dari luar.
// Koordinat dalam viewBox 640 x 480. Semua nama, warna, dan bentuk orisinal.

// ---- Pembantu kecil pembentuk SVG -----------------------------------------
export function circle(cx, cy, r, fill, extra = '') {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
}
export function rect(x, y, w, h, fill, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
}
export function ellipse(cx, cy, rx, ry, fill, extra = '') {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
}
export function path(d, fill, extra = '') {
  return `<path d="${d}" fill="${fill}" ${extra}/>`;
}
export function line(x1, y1, x2, y2, stroke, width = 2, extra = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
}
export function text(x, y, str, size, fill, extra = '') {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="Georgia, serif" text-anchor="middle" ${extra}>${str}</text>`;
}
// Bintang empat-jurai kecil (kilau), dipakai di langit dan taman.
export function sparkle(x, y, s, fill, cls = '') {
  const c = cls ? ` class="${cls}"` : '';
  return `<path d="M ${x} ${y - s} L ${x + s * 0.28} ${y - s * 0.28} L ${x + s} ${y} L ${x + s * 0.28} ${y + s * 0.28} L ${x} ${y + s} L ${x - s * 0.28} ${y + s * 0.28} L ${x - s} ${y} L ${x - s * 0.28} ${y - s * 0.28} Z" fill="${fill}"${c}/>`;
}
// Lampion kertas bundar dengan rusuk dan rumbai bawah.
export function lantern(x, y, r, color, lit = true) {
  const glow = lit ? `<circle cx="${x}" cy="${y}" r="${r + 12}" fill="${color}" opacity="0.18"/>` : '';
  return `${glow}
    ${ellipse(x, y, r, r * 1.12, color)}
    ${ellipse(x, y, r * 0.62, r * 1.12, 'rgba(255,255,255,0.25)')}
    ${line(x - r * 0.55, y - r * 0.7, x - r * 0.55, y + r * 0.7, 'rgba(0,0,0,0.25)', 1.5)}
    ${line(x + r * 0.55, y - r * 0.7, x + r * 0.55, y + r * 0.7, 'rgba(0,0,0,0.25)', 1.5)}
    ${rect(x - 7, y - r * 1.12 - 6, 14, 7, '#8a6d3b')}
    ${line(x - 4, y + r * 1.12 + 6, x - 4, y + r * 1.12 + 16, '#e8b4b8', 2)}
    ${line(x + 4, y + r * 1.12 + 6, x + 4, y + r * 1.12 + 16, '#e8b4b8', 2)}`;
}

// ---- Scene 1: Pasar Senja -------------------------------------------------
// Lapak pasar malam: langit senja, lampu gantung, tenda batik, piramida buah,
// kucing tidur di peti, dan papan tulis harga. Tujuh perbedaan tersembunyi.
function drawPasarSenja(side) {
  const s = side; // 'L' atau 'R'
  const lanternColor = s === 'L' ? '#e5484d' : '#2a9d8f'; // beda 1
  const price = s === 'L' ? '12' : '15'; // beda 3
  const stripeColor = s === 'L' ? '#c0392b' : '#1e7d32'; // beda 5
  const candyLevel = s === 'L' ? 318 : 336; // beda 6: isi toples permen
  const extraStar = s === 'R' ? sparkle(522, 62, 9, '#fff7cc', 'twinkle') : ''; // beda 4
  const topMango = s === 'L' ? circle(320, 232, 15, '#ff9f1c') + circle(317, 229, 4, '#ffd166') : ''; // beda 2
  const buntingFlag = s === 'L' ? path('M 292 168 L 308 168 L 300 188 Z', '#f4d35e') : ''; // beda 7
  return `
  <defs>
    <linearGradient id="sky1-${s}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b1b4d"/><stop offset="0.55" stop-color="#7b2f5e"/>
      <stop offset="1" stop-color="#ff9a5c"/>
    </linearGradient>
    <linearGradient id="awning-${s}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f6ead2"/><stop offset="1" stop-color="#efd9a7"/>
    </linearGradient>
  </defs>
  ${rect(0, 0, 640, 480, `url(#sky1-${s})`)}
  ${sparkle(60, 48, 7, '#fff7cc', 'twinkle')}${sparkle(150, 90, 5, '#ffffff', 'twinkle')}
  ${sparkle(430, 40, 6, '#fff7cc', 'twinkle')}${sparkle(590, 110, 5, '#ffffff', 'twinkle')}
  ${sparkle(330, 55, 4, '#ffffff', 'twinkle')}${extraStar}
  ${circle(592, 58, 24, '#ffe9a8')}${circle(583, 50, 20, '#2b1b4d', 'opacity="0.55"')}
  ${path('M 0 40 Q 320 96 640 36', 'none', 'stroke="#3a2b52" stroke-width="2" fill="none"')}
  ${circle(90, 58, 6, '#ffd166')}${circle(200, 76, 6, '#ff7b7b')}${circle(320, 82, 6, '#ffd166')}
  ${circle(440, 74, 6, '#7bd389')}${circle(560, 56, 6, '#ff7b7b')}
  ${line(90, 58, 90, 44, '#3a2b52', 2)}${line(200, 76, 200, 62, '#3a2b52', 2)}
  ${line(320, 82, 320, 68, '#3a2b52', 2)}${line(440, 74, 440, 60, '#3a2b52', 2)}${line(560, 56, 560, 42, '#3a2b52', 2)}
  ${rect(28, 118, 584, 34, `url(#awning-${s})`)}
  ${rect(28, 118, 73, 34, '#c0392b')}${rect(174, 118, 73, 34, stripeColor)}${rect(320, 118, 73, 34, '#c0392b')}
  ${rect(466, 118, 73, 34, '#c0392b')}${rect(101, 118, 73, 34, '#f6ead2')}
  ${rect(247, 118, 73, 34, '#f6ead2')}${rect(393, 118, 73, 34, '#f6ead2')}${rect(539, 118, 73, 34, '#f6ead2')}
  ${path('M 28 152 L 101 152 L 101 168 L 64 158 L 28 168 Z', '#c0392b')}
  ${path('M 101 152 L 174 152 L 174 168 L 137 158 L 101 168 Z', '#f6ead2')}
  ${path('M 174 152 L 247 152 L 247 168 L 210 158 L 174 168 Z', stripeColor)}
  ${path('M 247 152 L 320 152 L 320 168 L 283 158 L 247 168 Z', '#f6ead2')}
  ${path('M 320 152 L 393 152 L 393 168 L 356 158 L 320 168 Z', '#c0392b')}
  ${path('M 393 152 L 466 152 L 466 168 L 429 158 L 393 168 Z', '#f6ead2')}
  ${path('M 466 152 L 539 152 L 539 168 L 502 158 L 466 168 Z', '#c0392b')}
  ${path('M 539 152 L 612 152 L 612 168 L 575 158 L 539 168 Z', '#f6ead2')}
  ${path('M 240 168 L 258 168 L 249 186 Z', '#e5484d')}${buntingFlag}
  ${path('M 340 168 L 358 168 L 349 186 Z', '#2a9d8f')}${path('M 390 168 L 408 168 L 399 186 Z', '#f4d35e')}
  ${lantern(120, 108, 17, lanternColor)}
  ${lantern(520, 104, 15, '#f4a259')}
  ${rect(52, 152, 10, 190, '#6b4226')}${rect(578, 152, 10, 190, '#6b4226')}
  ${rect(40, 342, 560, 22, '#8a5a33')}${rect(40, 364, 560, 10, '#6b4226')}
  ${rect(40, 374, 560, 74, '#5d3a1e')}
  ${circle(290, 262, 15, '#ff9f1c')}${circle(320, 262, 15, '#e5383b')}${circle(350, 262, 15, '#ff9f1c')}
  ${circle(305, 232, 15, '#e5383b')}${circle(335, 232, 15, '#ff9f1c')}${topMango}
  ${circle(287, 259, 4, '#ffd166')}${circle(317, 259, 4, '#ff8fa3')}${circle(347, 259, 4, '#ffd166')}
  ${circle(302, 229, 4, '#ff8fa3')}${circle(332, 229, 4, '#ffd166')}
  ${rect(390, 300, 46, 42, '#cfe8ef', 'opacity="0.85"')}
  ${rect(390, candyLevel, 46, 342 - candyLevel, '#ff6b9d', 'opacity="0.9"')}
  ${rect(388, 296, 50, 8, '#8a6d3b')}
  ${circle(402, 326, 5, '#ffd166')}${circle(414, 330, 5, '#7bd389')}${circle(426, 324, 5, '#4cc9f0')}
  ${rect(452, 268, 84, 74, '#2e2a26', 'rx="6"')}${rect(458, 274, 72, 62, '#3d4a2f', 'rx="4"')}
  ${text(494, 302, 'MANGGA', 13, '#f6ead2')}${text(494, 326, price + 'rb', 20, '#ffd166', 'font-weight="bold"')}
  ${ellipse(120, 396, 66, 26, '#7a5c2e')}${rect(66, 372, 108, 26, '#8a6d3b')}${rect(66, 372, 108, 6, '#a07a45')}
  ${ellipse(120, 366, 34, 18, '#f2a65a')}
  ${circle(104, 352, 13, '#f2a65a')}${path('M 94 342 L 98 330 L 106 340 Z', '#f2a65a')}${path('M 108 340 L 114 330 L 118 342 Z', '#f2a65a')}
  ${path('M 148 360 Q 168 348 162 330', 'none', 'stroke="#f2a65a" stroke-width="7" fill="none" stroke-linecap="round"')}
  ${circle(100, 350, 2, '#2b1b4d')}${path('M 92 356 Q 98 359 104 356', 'none', 'stroke="#2b1b4d" stroke-width="1.5" fill="none"')}
  ${circle(540, 404, 22, '#c9a86a')}${circle(540, 404, 14, '#8a6d3b')}${circle(540, 404, 5, '#5d3a1e')}
  ${ellipse(560, 430, 40, 12, '#2f6b3a')}${ellipse(585, 436, 30, 10, '#3a7d44')}
  ${circle(575, 424, 4, '#ff7b7b')}${circle(590, 430, 4, '#ffd166')}
  ${line(576, 152, 576, 196, '#8a6d3b', 2)}${circle(576, 204, 7, '#e5383b')}${circle(576, 218, 7, '#e5383b')}${circle(576, 232, 7, '#ff9f1c')}
  ${line(72, 152, 72, 192, '#8a6d3b', 2)}${circle(72, 200, 7, '#f8f9fa')}${circle(72, 214, 7, '#f8f9fa')}${circle(72, 228, 7, '#f8f9fa')}
  ${circle(196, 326, 13, '#e5383b')}${circle(220, 326, 13, '#ff9f1c')}${circle(208, 306, 13, '#e5383b')}
  ${circle(193, 323, 3, '#ff8fa3')}${circle(217, 323, 3, '#ffd166')}${circle(205, 303, 3, '#ff8fa3')}
  ${ellipse(588, 330, 26, 10, '#8a6d3b')}${circle(580, 322, 7, '#ff9f1c')}${circle(594, 320, 7, '#e5383b')}${circle(588, 312, 7, '#ff9f1c')}`;
}

export const SCENE_PASAR = {
  id: 'pasar-senja',
  name: 'Pasar Senja',
  subtitle: 'Lapak buah di pasar malam — ada kucing yang pura-pura tidur.',
  draw: drawPasarSenja,
  diffs: [
    { id: 'lampion', x: 120, y: 108, r: 30, label: 'Warna lampion berubah' },
    { id: 'mangga', x: 320, y: 232, r: 28, label: 'Satu mangga hilang' },
    { id: 'harga', x: 494, y: 312, r: 32, label: 'Harga di papan tulis berubah' },
    { id: 'bintang', x: 522, y: 62, r: 26, label: 'Satu bintang muncul' },
    { id: 'tenda', x: 210, y: 135, r: 30, label: 'Warna garis tenda berubah' },
    { id: 'permen', x: 413, y: 322, r: 28, label: 'Isi toples permen berkurang' },
    { id: 'bendera', x: 300, y: 176, r: 24, label: 'Satu bendera hilang' },
  ],
};

// ---- Scene 2: Taman Kunang-Kunang ----------------------------------------
// Kolam di taman malam: katak di batu, teratai, kunang-kunang, kupu-kupu,
// dan lampion gantung di pohon. Tujuh perbedaan tersembunyi.
function drawTamanKunang(side) {
  const s = side;
  const lotusColor = s === 'L' ? '#ff8fab' : '#f8f9fa'; // beda 2
  const frogWink = s === 'R'; // beda 1: katak mengedip sebelah
  const extraFirefly = s === 'R' ? circle(122, 148, 4, '#ffe66d', 'class="twinkle"') + circle(122, 148, 10, '#ffe66d', 'opacity="0.25"') : ''; // beda 3
  const wingSpot = s === 'L' ? circle(504, 196, 5, '#2b1b4d') : ''; // beda 4
  const stone = s === 'L' ? ellipse(320, 442, 30, 10, '#8d99ae') : ''; // beda 5
  const postLit = s === 'L'; // beda 6: lampion pos menyala
  const dragonfly = s === 'L' ? `<g stroke="#4cc9f0" stroke-width="2" fill="none">
      <line x1="252" y1="118" x2="238" y2="104"/><line x1="252" y1="118" x2="266" y2="104"/>
      <ellipse cx="244" cy="110" rx="9" ry="4" fill="#bde0fe" stroke="none" transform="rotate(-30 244 110)"/>
      <ellipse cx="260" cy="110" rx="9" ry="4" fill="#bde0fe" stroke="none" transform="rotate(30 260 110)"/>
      <line x1="252" y1="112" x2="252" y2="132" stroke="#2b2d42" stroke-width="3"/></g>` : ''; // beda 7
  return `
  <defs>
    <linearGradient id="sky2-${s}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d2b2e"/><stop offset="0.6" stop-color="#1d5c4d"/>
      <stop offset="1" stop-color="#2a7f62"/>
    </linearGradient>
    <radialGradient id="pond-${s}" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0" stop-color="#2e6f8e"/><stop offset="1" stop-color="#123f5c"/>
    </radialGradient>
  </defs>
  ${rect(0, 0, 640, 480, `url(#sky2-${s})`)}
  ${circle(560, 70, 30, '#fdf6c9')}${circle(548, 60, 26, '#0d2b2e', 'opacity="0.5"')}
  ${sparkle(80, 60, 6, '#fff7cc', 'twinkle')}${sparkle(200, 40, 5, '#ffffff', 'twinkle')}
  ${sparkle(330, 70, 6, '#fff7cc', 'twinkle')}${sparkle(470, 50, 4, '#ffffff', 'twinkle')}
  ${sparkle(600, 160, 5, '#fff7cc', 'twinkle')}${sparkle(40, 180, 5, '#ffffff', 'twinkle')}
  ${path('M 60 0 L 110 0 L 96 300 Q 70 330 40 300 Z', '#12261f')}
  ${path('M 110 120 Q 170 90 210 130', 'none', 'stroke="#12261f" stroke-width="10" fill="none" stroke-linecap="round"')}
  ${path('M 96 180 Q 40 160 16 190', 'none', 'stroke="#12261f" stroke-width="8" fill="none" stroke-linecap="round"')}
  ${lantern(150, 150, 13, '#ff9f1c')}${lantern(60, 205, 11, '#e5484d')}
  ${circle(180, 200, 4, '#ffe66d', 'class="twinkle"')}${circle(260, 90, 4, '#ffe66d', 'class="twinkle"')}
  ${circle(360, 130, 4, '#ffe66d', 'class="twinkle"')}${circle(430, 210, 4, '#ffe66d', 'class="twinkle"')}
  ${circle(90, 260, 4, '#ffe66d', 'class="twinkle"')}${extraFirefly}
  ${dragonfly}
  ${ellipse(320, 400, 300, 82, `url(#pond-${s})`)}
  ${ellipse(320, 400, 300, 82, 'none', 'stroke="#7fb5a8" stroke-width="2" opacity="0.5"')}
  ${path('M 120 390 Q 180 384 240 390', 'none', 'stroke="#7fb5a8" stroke-width="2" opacity="0.6" fill="none"')}
  ${path('M 380 420 Q 450 414 520 420', 'none', 'stroke="#7fb5a8" stroke-width="2" opacity="0.6" fill="none"')}
  ${ellipse(180, 400, 52, 16, '#2f7d4f')}${ellipse(430, 385, 58, 17, '#2f7d4f')}
  ${ellipse(500, 420, 44, 14, '#2f7d4f')}
  ${circle(430, 372, 9, lotusColor)}${circle(420, 366, 9, lotusColor)}${circle(440, 366, 9, lotusColor)}
  ${circle(430, 362, 8, lotusColor)}${circle(430, 372, 5, '#ffd166')}
  ${circle(500, 410, 7, '#ff8fab')}${circle(493, 406, 7, '#ff8fab')}${circle(507, 406, 7, '#ff8fab')}${circle(500, 404, 4, '#ffd166')}
  ${ellipse(205, 372, 46, 18, '#8d99ae')}${ellipse(205, 372, 46, 18, 'none', 'stroke="#6c757d" stroke-width="2"')}
  ${ellipse(205, 348, 34, 26, '#57a773')}
  ${circle(192, 330, 12, '#57a773')}${circle(218, 330, 12, '#57a773')}
  ${circle(192, 330, 5, '#1b4332')}${frogWink ? line(214, 330, 222, 330, '#1b4332', 2.5) : circle(218, 330, 5, '#1b4332')}
  ${circle(194, 328, 2, '#ffffff')}${frogWink ? '' : circle(220, 328, 2, '#ffffff')}
  ${path('M 190 352 Q 205 360 220 352', 'none', 'stroke="#1b4332" stroke-width="2" fill="none"')}
  ${ellipse(120, 442, 26, 9, '#8d99ae')}${ellipse(220, 448, 26, 9, '#8d99ae')}${stone}
  ${ellipse(420, 446, 26, 9, '#8d99ae')}${ellipse(520, 440, 26, 9, '#8d99ae')}
  ${path('M 505 190 Q 520 230 505 260 Q 490 230 505 190 Z', '#ff9f1c', 'opacity="0.9"')}
  ${path('M 505 260 Q 520 230 505 190 Q 490 230 505 260', 'none', 'stroke="#e07b39" stroke-width="1.5" fill="none"')}
  ${path('M 495 200 Q 505 214 515 200', 'none', 'stroke="#7b2f00" stroke-width="1.5" fill="none"')}
  ${circle(492, 218, 6, '#2b1b4d')}${circle(518, 218, 6, '#2b1b4d')}
  ${path('M 505 190 Q 500 176 496 170', 'none', 'stroke="#7b2f00" stroke-width="2" fill="none"')}
  ${path('M 505 190 Q 512 176 518 170', 'none', 'stroke="#7b2f00" stroke-width="2" fill="none"')}
  ${rect(556, 96, 8, 120, '#4a3728')}${rect(548, 88, 24, 10, '#4a3728')}
  ${lantern(560, 118, 14, '#ffd166', postLit)}
  ${ellipse(560, 226, 30, 10, '#2f7d4f')}
  ${circle(585, 216, 5, '#ff8fab')}${circle(575, 210, 5, '#ff8fab')}${circle(595, 210, 5, '#ffd166')}
  ${circle(70, 330, 6, '#ff8fab')}${circle(82, 336, 6, '#ffd166')}${circle(60, 340, 6, '#f8f9fa')}
  ${circle(600, 330, 6, '#ffd166')}${circle(612, 338, 6, '#ff8fab')}${circle(590, 340, 6, '#f8f9fa')}`;
}

export const SCENE_TAMAN = {
  id: 'taman-kunang',
  name: 'Taman Kunang-Kunang',
  subtitle: 'Kolam teratai di bawah kunang-kunang — kataknya suka mengedip.',
  draw: drawTamanKunang,
  diffs: [
    { id: 'katak', x: 218, y: 330, r: 26, label: 'Katak mengedip sebelah' },
    { id: 'teratai', x: 430, y: 368, r: 30, label: 'Warna bunga teratai berubah' },
    { id: 'kunang', x: 122, y: 148, r: 26, label: 'Satu kunang-kunang muncul' },
    { id: 'kupu', x: 505, y: 200, r: 30, label: 'Bintik sayap kupu-kupu hilang' },
    { id: 'batu', x: 320, y: 442, r: 28, label: 'Satu batu pijakan hilang' },
    { id: 'pos', x: 560, y: 118, r: 28, label: 'Lampion pos padam' },
    { id: 'capung', x: 252, y: 118, r: 28, label: 'Capung hilang' },
  ],
};

// ---- Scene 3: Loteng Bintang ----------------------------------------------
// Loteng astronom: jendela bundar penuh bintang, teleskop, burung hantu,
// peta bintang, tumpukan buku, dan gantungan planet. Tujuh perbedaan.
function drawLotengBintang(side) {
  const s = side;
  const scopeDown = s === 'R'; // beda 1: teleskop menunduk
  const owlWink = s === 'R'; // beda 2: burung hantu mengedip
  const saturn = s === 'L' ? `<g>${circle(150, 108, 12, '#e8c07d')}${ellipse(150, 108, 22, 6, '#d4a24e', 'transform="rotate(-18 150 108)"')}</g>` : ''; // beda 3
  const topBook = s === 'L' ? rect(170, 386, 110, 12, '#2a9d8f') : ''; // beda 4
  const flameH = s === 'L' ? 16 : 8; // beda 5: nyala lilin
  const extraChartStar = s === 'R' ? sparkle(96, 262, 7, '#ffd166', 'twinkle') : ''; // beda 6
  const steam = s === 'L' ? path('M 348 330 Q 342 316 348 304 Q 354 292 348 282', 'none', 'stroke="#e8e8e8" stroke-width="2.5" opacity="0.7" fill="none" stroke-linecap="round"') : ''; // beda 7
  return `
  <defs>
    <linearGradient id="wall3-${s}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a2b4d"/><stop offset="1" stop-color="#241a33"/>
    </linearGradient>
  </defs>
  ${rect(0, 0, 640, 480, `url(#wall3-${s})`)}
  ${path('M 0 0 L 640 0 L 640 120 L 0 200 Z', '#1d1428')}
  ${path('M 0 200 L 640 120', 'none', 'stroke="#4a3728" stroke-width="10" fill="none"')}
  ${line(140, 28, 200, 190, '#4a3728', 10)}${line(500, 14, 460, 160, '#4a3728', 10)}
  ${circle(320, 148, 92, '#0d1b3d')}${circle(320, 148, 92, 'none', 'stroke="#c9a86a" stroke-width="10"')}
  ${circle(320, 148, 78, '#16294d')}
  ${sparkle(280, 100, 7, '#ffffff', 'twinkle')}${sparkle(350, 90, 6, '#fff7cc', 'twinkle')}
  ${sparkle(310, 150, 5, '#ffffff', 'twinkle')}${sparkle(370, 140, 7, '#fff7cc', 'twinkle')}
  ${sparkle(270, 160, 5, '#ffffff', 'twinkle')}${sparkle(345, 180, 4, '#ffffff', 'twinkle')}
  ${circle(300, 120, 18, '#fdf6c9')}${circle(293, 113, 15, '#16294d', 'opacity="0.5"')}
  ${path('M 300 170 Q 320 190 340 170 Q 320 158 300 170 Z', '#8d99ae', 'opacity="0.9"')}
  ${line(320, 240, 320, 300, '#6b4226', 8)}
  ${line(320, 300, 268, 380, '#6b4226', 6)}${line(320, 300, 372, 380, '#6b4226', 6)}${line(320, 300, 320, 384, '#6b4226', 6)}
  ${path(scopeDown ? 'M 268 268 L 372 246' : 'M 262 252 L 378 218', 'none', 'stroke="#c9a86a" stroke-width="16" stroke-linecap="round"')}
  ${path(scopeDown ? 'M 372 246 L 396 240' : 'M 378 218 L 402 210', 'none', 'stroke="#8a6d3b" stroke-width="20" stroke-linecap="round"')}
  ${circle(scopeDown ? 268 : 262, scopeDown ? 268 : 252, 10, '#2b1b4d')}
  ${circle(150, 60, 4, '#c9a86a')}${line(150, 64, 150, 92, '#c9a86a', 2)}
  ${circle(110, 130, 10, '#4cc9f0')}${circle(190, 88, 8, '#ff8fab')}${saturn}
  ${ellipse(200, 130, 34, 8, '#c9a86a', 'opacity="0.5"')}
  ${rect(60, 220, 110, 130, '#f6ead2', 'rx="4"')}${rect(60, 220, 110, 130, 'none', 'stroke="#c9a86a" stroke-width="3"')}
  ${line(80, 250, 150, 250, '#2b1b4d', 1.5)}${line(150, 250, 150, 300, '#2b1b4d', 1.5)}${line(150, 300, 90, 300, '#2b1b4d', 1.5)}
  ${circle(80, 250, 4, '#e5484d')}${circle(150, 250, 4, '#e5484d')}${circle(150, 300, 4, '#e5484d')}${circle(90, 300, 4, '#e5484d')}
  ${circle(115, 250, 3, '#2a9d8f')}${circle(150, 275, 3, '#2a9d8f')}${circle(120, 300, 3, '#2a9d8f')}${extraChartStar}
  ${text(115, 338, 'RASI SENJA', 11, '#2b1b4d')}
  ${ellipse(500, 196, 30, 38, '#8a6d3b')}${ellipse(500, 160, 26, 24, '#6b4226')}
  ${circle(490, 156, 7, '#ffffff')}${owlWink ? line(506, 156, 514, 156, '#1b4332', 2.5) : circle(510, 156, 7, '#ffffff')}
  ${circle(490, 156, 3.5, '#1b4332')}${owlWink ? '' : circle(510, 156, 3.5, '#1b4332')}
  ${path('M 496 172 L 504 178 L 496 182 Z', '#e8b4b8')}
  ${path('M 478 180 Q 472 200 480 214', 'none', 'stroke="#6b4226" stroke-width="8" fill="none" stroke-linecap="round"')}
  ${path('M 522 180 Q 528 200 520 214', 'none', 'stroke="#6b4226" stroke-width="8" fill="none" stroke-linecap="round"')}
  ${line(470, 236, 530, 236, '#6b4226', 6)}
  ${rect(430, 330, 140, 16, '#5d3a1e')}${rect(440, 346, 12, 60, '#6b4226')}${rect(548, 346, 12, 60, '#6b4226')}
  ${ellipse(352, 330, 26, 10, '#4cc9f0')}${path('M 330 330 L 336 306 L 368 306 L 374 330 Z', '#7fb5d5')}
  ${path('M 368 312 L 384 318', 'none', 'stroke="#7fb5d5" stroke-width="4" fill="none"')}
  ${steam}
  ${circle(398, 322, 10, '#f8f9fa')}
  ${rect(170, 398, 110, 12, '#e5484d')}${rect(176, 410, 98, 12, '#f4a259')}${rect(182, 422, 86, 12, '#2a9d8f')}${topBook}
  ${rect(420, 386, 60, 12, '#c9a86a')}${rect(424, 374, 52, 12, '#e8e8e8')}
  ${rect(444, 368, 12, 8, '#f8f9fa')}
  ${circle(450, 368 - flameH, 3, '#ffd166')}${ellipse(450, 368 - flameH, 5, flameH, '#ff9f1c', 'opacity="0.85"')}
  ${ellipse(320, 440, 150, 22, '#7b2f5e')}${ellipse(320, 440, 150, 22, 'none', 'stroke="#f4d35e" stroke-width="2" opacity="0.6"')}
  ${path('M 200 440 Q 320 428 440 440', 'none', 'stroke="#f4d35e" stroke-width="2" opacity="0.6" fill="none"')}
  ${path('M 220 448 Q 320 438 420 448', 'none', 'stroke="#f4d35e" stroke-width="2" opacity="0.5" fill="none"')}`;
}

export const SCENE_LOTENG = {
  id: 'loteng-bintang',
  name: 'Loteng Bintang',
  subtitle: 'Loteng astronom di bawah jendela bundar — burung hantunya cerewet.',
  draw: drawLotengBintang,
  diffs: [
    { id: 'teleskop', x: 320, y: 235, r: 32, label: 'Teleskop menunduk' },
    { id: 'hantu', x: 505, y: 156, r: 28, label: 'Burung hantu mengedip' },
    { id: 'saturnus', x: 150, y: 108, r: 28, label: 'Satu planet hilang' },
    { id: 'buku', x: 225, y: 392, r: 28, label: 'Satu buku hilang' },
    { id: 'lilin', x: 450, y: 362, r: 26, label: 'Nyala lilin mengecil' },
    { id: 'peta', x: 96, y: 262, r: 26, label: 'Satu bintang muncul di peta' },
    { id: 'uap', x: 348, y: 306, r: 28, label: 'Uap teko hilang' },
  ],
};

// ---- Daftar scene ----------------------------------------------------------
export const SCENES = [SCENE_PASAR, SCENE_TAMAN, SCENE_LOTENG];

export function getScene(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}
