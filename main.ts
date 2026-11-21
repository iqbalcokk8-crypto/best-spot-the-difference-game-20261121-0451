// KEMBAR SENJA — Spot the Difference (Node 22, standard library only).
//
// Program penyerahan: menyalin game/ dan screenshots/ dari repo ini ke
// /output (atau MAKEFUN_OUTPUT_DIR di luar grader) lalu menulis
// /output/dossier.json dengan buildDossier dari vendor/makefun-game.ts.
// Game-nya sendiri file statis di game/ (index.html + modul ES + CSS),
// tanpa build step dan tanpa network request.
//
// Jalankan di luar grader untuk memeriksa hasil:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Direktori repo ini (tempat main.ts berada) dan direktori keluaran.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Batas yang dipakai grader untuk /output (lihat competition.yaml):
// game/ paling banyak 993 entri dan 48 MiB, screenshots/ paling banyak 4
// berkas @ 256 KiB, dossier.json paling banyak 1,5 MiB.
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function handIn() {
  mkdirSync(outputDir, { recursive: true });
  cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
  }
  const dossier = buildDossier(outputDir, DOSSIER_LIMITS);
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
  return dossier.length;
}

const dossierBytes = handIn();
console.log(`KEMBAR SENJA handed in: dossier.json ${dossierBytes} bytes -> ${outputDir}`);
