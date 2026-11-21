// KEMBAR SENJA — Spot the Difference
// main.js — titik masuk permainan: bangun game, terapkan mode potret bila ada
// (?shot=... untuk screenshot), dan buka judul bila tidak ada mode lain.
// Juga mengekspos window.__kembarSenja supaya play-test otomatis bisa
// memeriksa state tanpa menebak-nebak DOM.

import { createGame } from './game.js';

const game = createGame(document);
const params = new URLSearchParams(window.location.search);
const shotMode = game.applyShotMode(params);
if (!shotMode) {
  game.showScreen('title');
}

window.__kembarSenja = game;
