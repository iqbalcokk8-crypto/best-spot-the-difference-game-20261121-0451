// KEMBAR SENJA — Spot the Difference
// config.js — satu-satunya tempat konstanta permainan tinggal.
// Semua angka gameplay (waktu, skor, kombo) diubah dari sini saja.

export const GAME_CONFIG = {
  // Ukuran kanvas tiap panel (viewBox SVG), piksel logis.
  panelWidth: 640,
  panelHeight: 480,
  // Waktu per scene, detik — makin malam makin mepet, tiap scene terasa beda.
  timePerScene: [150, 135, 120],
  // Skor dasar tiap perbedaan yang ketemu.
  baseFindScore: 100,
  // Kombo berlipat sampai batas ini.
  maxCombo: 5,
  // Penalti sekali klik meleset.
  missPenalty: 25,
  // Biaya sekali pakai hint.
  hintCost: 50,
  // Hint yang tersedia tiap scene.
  hintsPerScene: 3,
  // Bonus waktu sisa tiap scene, per detik.
  timeBonusPerSecond: 10,
  // Jari-jari zona klik tiap perbedaan (piksel logis panel).
  hitRadius: 34,
  // Jari-jari lingkaran penanda perbedaan yang sudah ketemu — cukup besar
  // supaya tetap terbaca saat screenshot diperkecil jadi contact sheet.
  markerRadius: 28,
  // Batas bintang: tanpa meleset dan tanpa hint = 3 bintang.
  starsForClean: 3,
  starsForGood: 2,
};

export const SCENE_ORDER = ['pasar-senja', 'taman-kunang', 'loteng-bintang'];

// Teks antarmuka (Bahasa Indonesia, sesuai tema Kota Senja).
export const UI_TEXT = {
  title: 'KEMBAR SENJA',
  subtitle: 'Cari Bedanya di Kota Senja',
  tagline: 'Dua gambar kembar. Tujuh beda tersembunyi. Matamu setajam apa?',
  howToTitle: 'Cara Main',
  remainingLabel: 'SISA',
  foundLabel: 'KETEMU',
  scoreLabel: 'SKOR',
  timeLabel: 'WAKTU',
  comboLabel: 'KOMBO',
  hintLabel: 'Petunjuk',
  lensLabel: 'Lensa',
  soundLabel: 'Suara',
  nextSceneLabel: 'Scene Berikutnya',
  playAgainLabel: 'Main Lagi',
  resultsTitle: 'Petualangan Selesai!',
  accuracyLabel: 'Ketepatan',
  totalFoundLabel: 'Bedanya Ketemu',
};
