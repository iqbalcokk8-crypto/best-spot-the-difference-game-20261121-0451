// KEMBAR SENJA — Spot the Difference
// game.js — mesin permainan: layar (judul / main / scene selesai / hasil),
// timer, skor + kombo, hint, lensa pembesar, kursor keyboard, dan efek juice
// (goyang saat meleset, pop saat ketemu). Semua state tinggal di satu objek
// agar mudah diuji dan mudah dipotret deterministik untuk screenshot.

import { GAME_CONFIG, UI_TEXT } from './config.js';
import { SCENES } from './scenes.js';
import { renderPanel, remainingDots } from './render.js';
import { sounds, setMuted, isMuted } from './audio.js';

export function createGame(doc) {
  const $ = (id) => doc.getElementById(id);
  const els = {
    app: $('app'),
    titleScreen: $('title-screen'),
    playScreen: $('play-screen'),
    sceneDoneScreen: $('scene-done-screen'),
    resultsScreen: $('results-screen'),
    sceneName: $('scene-name'),
    sceneSubtitle: $('scene-subtitle'),
    scenePips: $('scene-pips'),
    timeValue: $('time-value'),
    scoreValue: $('score-value'),
    comboValue: $('combo-value'),
    remainingValue: $('remaining-value'),
    remainingDots: $('remaining-dots'),
    panelLeft: $('panel-left'),
    panelRight: $('panel-right'),
    panels: $('panels'),
    toast: $('toast'),
    hintButton: $('hint-button'),
    lensButton: $('lens-button'),
    soundButton: $('sound-button'),
    lens: $('lens'),
    lensInner: $('lens-inner'),
    sceneDoneTitle: $('scene-done-title'),
    sceneDoneDetail: $('scene-done-detail'),
    sceneDoneStars: $('scene-done-stars'),
    nextSceneButton: $('next-scene-button'),
    resultsStars: $('results-stars'),
    resultsDetail: $('results-detail'),
    resultsFound: $('results-found'),
    resultsAccuracy: $('results-accuracy'),
    resultsTime: $('results-time'),
    resultsScenes: $('results-scenes'),
    playAgainButton: $('play-again-button'),
    startButton: $('start-button'),
    howButton: $('how-button'),
    howPanel: $('how-panel'),
  };

  const state = {
    screen: 'title',
    sceneIndex: 0,
    found: new Set(),
    combo: 0,
    bestCombo: 0,
    misses: 0,
    hintsUsed: 0,
    hintsLeft: GAME_CONFIG.hintsPerScene,
    hintDiff: null,
    score: 0,
    timeLeft: GAME_CONFIG.timePerScene,
    totalFound: 0,
    totalClicks: 0,
    totalTimeUsed: 0,
    sceneStars: [],
    lensOn: false,
    activePanel: 'L',
    cursor: { x: 320, y: 240 },
    timerId: null,
    lastTickSecond: null,
    frozen: false, // mode potret (?shot=): timer diam, tanpa interaksi acak
  };

  function scene() {
    return SCENES[state.sceneIndex];
  }

  function showScreen(name) {
    state.screen = name;
    for (const [key, el] of Object.entries({
      title: els.titleScreen,
      playing: els.playScreen,
      sceneDone: els.sceneDoneScreen,
      results: els.resultsScreen,
    })) {
      el.classList.toggle('hidden', key !== name);
    }
  }

  function starsForScene(misses, hintsUsed) {
    if (misses === 0 && hintsUsed === 0) return GAME_CONFIG.starsForClean;
    if (misses + hintsUsed <= 2) return GAME_CONFIG.starsForGood;
    return 1;
  }

  function starRow(n) {
    return '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function renderHud() {
    const sc = scene();
    els.sceneName.textContent = `Scene ${state.sceneIndex + 1}/3 — ${sc.name}`;
    els.sceneSubtitle.textContent = sc.subtitle;
    els.scenePips.innerHTML = SCENES.map(
      (_, i) => `<span class="pip ${i === state.sceneIndex ? 'current' : ''} ${i < state.sceneIndex ? 'done' : ''}"></span>`,
    ).join('');
    els.timeValue.textContent = formatTime(Math.max(0, state.timeLeft));
    els.timeValue.classList.toggle('urgent', state.timeLeft <= 30);
    els.scoreValue.textContent = String(state.score);
    els.comboValue.textContent = state.combo > 1 ? `×${state.combo}` : '—';
    els.remainingValue.textContent = String(sc.diffs.length - state.found.size);
    els.remainingDots.innerHTML = remainingDots(sc, state.found);
    els.hintButton.textContent = `💡 ${UI_TEXT.hintLabel} (${state.hintsLeft})`;
    els.hintButton.disabled = state.hintsLeft <= 0 || state.found.size >= sc.diffs.length;
    els.lensButton.classList.toggle('active', state.lensOn);
    els.soundButton.textContent = isMuted() ? '🔇 Suara' : '🔊 Suara';
  }

  function renderPanels() {
    const sc = scene();
    const view = {
      found: state.found,
      hintDiff: state.hintDiff,
      activePanel: state.activePanel,
      cursor: state.cursor,
    };
    els.panelLeft.innerHTML = renderPanel(sc, 'L', view);
    els.panelRight.innerHTML = renderPanel(sc, 'R', view);
  }

  function renderAll() {
    renderHud();
    renderPanels();
  }

  function toast(message, kind = '') {
    els.toast.textContent = message;
    els.toast.className = `toast show ${kind}`;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => els.toast.classList.remove('show'), 1800);
  }

  function shakePanels() {
    els.panels.classList.remove('shake');
    void els.panels.offsetWidth; // paksa reflow supaya animasi bisa jalan lagi
    els.panels.classList.add('shake');
  }

  function stopTimer() {
    if (state.timerId !== null) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    state.lastTickSecond = state.timeLeft;
    state.timerId = window.setInterval(() => {
      if (state.frozen) return;
      state.timeLeft -= 1;
      state.totalTimeUsed += 1;
      if (state.timeLeft <= 10 && state.timeLeft > 0 && state.timeLeft !== state.lastTickSecond) {
        sounds.tick();
      }
      state.lastTickSecond = state.timeLeft;
      if (state.timeLeft <= 0) {
        timeUp();
        return;
      }
      renderHud();
    }, 1000);
  }

  function startScene(index, preset = null) {
    state.sceneIndex = index;
    state.found = new Set(preset?.found ?? []);
    state.combo = 0;
    state.misses = 0;
    state.hintsUsed = 0;
    state.hintsLeft = GAME_CONFIG.hintsPerScene;
    state.hintDiff = null;
    state.timeLeft = preset?.timeLeft ?? GAME_CONFIG.timePerScene[index];
    state.cursor = { x: 320, y: 240 };
    state.activePanel = 'L';
    showScreen('playing');
    renderAll();
    if (!state.frozen) startTimer();
  }

  function startGame() {
    state.score = 0;
    state.totalFound = 0;
    state.totalClicks = 0;
    state.totalTimeUsed = 0;
    state.sceneStars = [];
    sounds.click();
    startScene(0);
  }

  function sceneComplete() {
    stopTimer();
    const timeBonus = state.timeLeft * GAME_CONFIG.timeBonusPerSecond;
    state.score += timeBonus;
    const stars = starsForScene(state.misses, state.hintsUsed);
    state.sceneStars.push(stars);
    if (!state.simulating) sounds.complete();
    els.sceneDoneTitle.textContent = `Scene Selesai — ${scene().name}`;
    els.sceneDoneStars.textContent = starRow(stars);
    els.sceneDoneDetail.textContent =
      `Semua ${scene().diffs.length} beda ketemu! Bonus waktu +${timeBonus} poin. ` +
      (state.misses === 0 && state.hintsUsed === 0
        ? 'Bersih tanpa meleset — matamu tajam sekali!'
        : `${state.misses} meleset, ${state.hintsUsed} petunjuk dipakai.`);
    els.nextSceneButton.textContent =
      state.sceneIndex + 1 < SCENES.length ? UI_TEXT.nextSceneLabel : 'Lihat Hasil';
    showScreen('sceneDone');
    renderHud();
  }

  function timeUp() {
    stopTimer();
    const stars = 1;
    state.sceneStars.push(stars);
    toast('Waktu habis! Lanjut ke scene berikutnya.', 'bad');
    els.sceneDoneTitle.textContent = `Waktu Habis — ${scene().name}`;
    els.sceneDoneStars.textContent = starRow(stars);
    els.sceneDoneDetail.textContent =
      `Kamu menemukan ${state.found.size} dari ${scene().diffs.length} beda. ` +
      'Tidak apa-apa — scene berikutnya menanti.';
    els.nextSceneButton.textContent =
      state.sceneIndex + 1 < SCENES.length ? UI_TEXT.nextSceneLabel : 'Lihat Hasil';
    showScreen('sceneDone');
  }

  function showResults() {
    stopTimer();
    sounds.fanfare();
    const totalDiffs = SCENES.reduce((n, s) => n + s.diffs.length, 0);
    const totalStars = state.sceneStars.reduce((n, s) => n + s, 0);
    const accuracy = state.totalClicks === 0 ? 100 : Math.round((state.totalFound / state.totalClicks) * 100);
    els.resultsStars.textContent = starRow(Math.round(totalStars / SCENES.length));
    els.resultsDetail.textContent = `Skor akhir ${state.score} poin dari ${SCENES.length} scene di Kota Senja.`;
    els.resultsFound.textContent = `${state.totalFound}/${totalDiffs}`;
    els.resultsAccuracy.textContent = `${accuracy}%`;
    els.resultsTime.textContent = formatTime(state.totalTimeUsed);
    els.resultsScenes.innerHTML = SCENES.map(
      (sc, i) => `<div class="result-cell scene-cell"><div class="hud-label">SCENE ${i + 1} — ${sc.name.toUpperCase()}</div><div class="result-stars">${starRow(state.sceneStars[i] ?? 0)}</div><div class="scene-note">${sc.diffs.length} beda</div></div>`,
    ).join('');
    showScreen('results');
  }

  function nextScene() {
    sounds.click();
    if (state.sceneIndex + 1 < SCENES.length) startScene(state.sceneIndex + 1);
    else showResults();
  }

  // ---- Mencari perbedaan --------------------------------------------------
  function panelPoint(event, panelEl) {
    const rect = panelEl.querySelector('svg').getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * GAME_CONFIG.panelWidth,
      y: ((event.clientY - rect.top) / rect.height) * GAME_CONFIG.panelHeight,
    };
  }

  function checkPoint(point, panelSide) {
    const sc = scene();
    state.totalClicks += 1;
    // Pilih beda TERDEKAT dalam radius klik, bukan yang pertama cocok —
    // dua beda yang berdekatan (mis. mangga dan bendera scene 1) tidak boleh
    // saling "mencuri" klik.
    const r2 = GAME_CONFIG.hitRadius * GAME_CONFIG.hitRadius;
    let hit = null;
    let best = Infinity;
    for (const d of sc.diffs) {
      if (state.found.has(d.id)) continue;
      const dx = point.x - d.x;
      const dy = point.y - d.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 <= r2 && dist2 < best) { best = dist2; hit = d; }
    }
    if (hit) {
      state.found.add(hit.id);
      state.totalFound += 1;
      state.combo = Math.min(state.combo + 1, GAME_CONFIG.maxCombo);
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      const gained = GAME_CONFIG.baseFindScore * state.combo;
      state.score += gained;
      state.hintDiff = null;
      if (!state.simulating) {
        sounds.find();
        toast(`Ketemu! ${hit.label} (+${gained})`, 'good');
      }
      renderAll();
      if (state.found.size >= sc.diffs.length && !state.simulating) {
        window.setTimeout(sceneComplete, 450);
      }
      return true;
    }
    state.combo = 0;
    state.misses += 1;
    state.score = Math.max(0, state.score - GAME_CONFIG.missPenalty);
    if (!state.simulating) {
      sounds.miss();
      shakePanels();
      toast('Belum ada beda di situ — coba lagi!', 'bad');
    }
    renderAll();
    return false;
  }

  function useHint() {
    if (state.hintsLeft <= 0 || state.screen !== 'playing') return;
    const remaining = scene().diffs.filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return;
    state.hintsLeft -= 1;
    state.hintsUsed += 1;
    state.score = Math.max(0, state.score - GAME_CONFIG.hintCost);
    state.hintDiff = remaining[Math.floor(Math.random() * remaining.length)];
    sounds.hint();
    toast(`Petunjuk: cari di sekitar lingkaran biru (−${GAME_CONFIG.hintCost})`, '');
    renderAll();
  }

  // Lensa untuk mode potret: tampilkan di titik tetap panel kiri, supaya
  // screenshot memperlihatkan lensa pembesar sedang bekerja. Ukuran potret
  // lebih kecil (150) daripada lensa main (190) supaya tidak mendominasi panel.
  function showLensAt(panelEl, x, y, size = 190) {
    const svg = panelEl.querySelector('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const zoom = 2;
    const px = (x / GAME_CONFIG.panelWidth) * rect.width;
    const py = (y / GAME_CONFIG.panelHeight) * rect.height;
    els.lens.classList.remove('hidden');
    els.lens.style.width = `${size}px`;
    els.lens.style.height = `${size}px`;
    els.lensInner.style.width = `${size}px`;
    els.lensInner.style.height = `${size}px`;
    // Jaga lensa tetap di dalam panel, jangan sampai menutupi HUD atau panel sebelah.
    const left = Math.max(rect.left, Math.min(rect.left + px + 18, rect.right - size));
    const top = Math.max(rect.top, Math.min(rect.top + py - size / 2, rect.bottom - size));
    els.lens.style.left = `${left}px`;
    els.lens.style.top = `${top}px`;
    els.lensInner.innerHTML = svg.outerHTML;
    const inner = els.lensInner.querySelector('svg');
    inner.setAttribute('width', String(rect.width * zoom));
    inner.setAttribute('height', String(rect.height * zoom));
    inner.style.marginLeft = `${-px * zoom + size / 2}px`;
    inner.style.marginTop = `${-py * zoom + size / 2}px`;
  }

  // ---- Lensa pembesar ------------------------------------------------------
  // Lensa mengikuti mouse di atas panel dan menampilkan salinan panel yang
  // diperbesar 2x, supaya beda kecil bisa diperiksa dari dekat.
  function moveLens(event, panelEl) {
    if (!state.lensOn) return;
    const svg = panelEl.querySelector('svg');
    const rect = svg.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
      els.lens.classList.add('hidden');
      return;
    }
    const zoom = 2;
    const size = 190;
    els.lens.classList.remove('hidden');
    els.lens.style.width = `${size}px`;
    els.lens.style.height = `${size}px`;
    els.lensInner.style.width = `${size}px`;
    els.lensInner.style.height = `${size}px`;
    const left = Math.max(rect.left, Math.min(event.clientX + 18, rect.right - size));
    const top = Math.max(rect.top, Math.min(event.clientY - size / 2, rect.bottom - size));
    els.lens.style.left = `${left}px`;
    els.lens.style.top = `${top}px`;
    els.lensInner.innerHTML = svg.outerHTML;
    const inner = els.lensInner.querySelector('svg');
    inner.setAttribute('width', String(rect.width * zoom));
    inner.setAttribute('height', String(rect.height * zoom));
    inner.style.marginLeft = `${-px * zoom + size / 2}px`;
    inner.style.marginTop = `${-py * zoom + size / 2}px`;
  }

  function hideLens() {
    els.lens.classList.add('hidden');
  }

  // ---- Input ---------------------------------------------------------------
  function bindPanel(panelEl, side) {
    panelEl.addEventListener('click', (event) => {
      if (state.screen !== 'playing' || state.frozen) return;
      state.activePanel = side;
      checkPoint(panelPoint(event, panelEl), side);
    });
    panelEl.addEventListener('mousemove', (event) => {
      state.activePanel = side;
      moveLens(event, panelEl);
    });
    panelEl.addEventListener('mouseleave', hideLens);
  }

  function moveCursor(dx, dy) {
    state.cursor.x = Math.max(16, Math.min(GAME_CONFIG.panelWidth - 16, state.cursor.x + dx));
    state.cursor.y = Math.max(16, Math.min(GAME_CONFIG.panelHeight - 16, state.cursor.y + dy));
    renderPanels();
  }

  doc.addEventListener('keydown', (event) => {
    if (state.screen !== 'playing') {
      if (event.key === 'Enter' && state.screen === 'title') startGame();
      return;
    }
    const step = event.shiftKey ? 60 : 20;
    if (event.key === 'ArrowLeft') { moveCursor(-step, 0); event.preventDefault(); }
    else if (event.key === 'ArrowRight') { moveCursor(step, 0); event.preventDefault(); }
    else if (event.key === 'ArrowUp') { moveCursor(0, -step); event.preventDefault(); }
    else if (event.key === 'ArrowDown') { moveCursor(0, step); event.preventDefault(); }
    else if (event.key === 'Enter' || event.key === ' ') {
      checkPoint({ ...state.cursor }, state.activePanel);
      event.preventDefault();
    } else if (event.key === 'h' || event.key === 'H') useHint();
    else if (event.key === 'l' || event.key === 'L') toggleLens();
    else if (event.key === 'm' || event.key === 'M') toggleSound();
    else if (event.key === 'Tab') {
      state.activePanel = state.activePanel === 'L' ? 'R' : 'L';
      renderPanels();
      event.preventDefault();
    }
  });

  function toggleLens() {
    state.lensOn = !state.lensOn;
    if (!state.lensOn) hideLens();
    toast(state.lensOn ? 'Lensa pembesar aktif — arahkan ke gambar.' : 'Lensa pembesar mati.');
    renderHud();
  }

  function toggleSound() {
    setMuted(!isMuted());
    renderHud();
  }

  els.startButton.addEventListener('click', startGame);
  els.howButton.addEventListener('click', () => {
    els.howPanel.classList.toggle('hidden');
    sounds.click();
  });
  els.nextSceneButton.addEventListener('click', nextScene);
  els.playAgainButton.addEventListener('click', startGame);
  els.hintButton.addEventListener('click', useHint);
  els.lensButton.addEventListener('click', toggleLens);
  els.soundButton.addEventListener('click', toggleSound);
  bindPanel(els.panelLeft, 'L');
  bindPanel(els.panelRight, 'R');

  // ---- Mode potret (?shot=...) untuk screenshot deterministik -------------
  // ?shot=title | ?shot=play&scene=0&found=3&time=96&hint=1 | ?shot=results
  // Tanpa interaksi acak: timer diam, hint menunjuk beda pertama yang sisa.
  function applyShotMode(params) {
    const shot = params.get('shot');
    if (!shot) return false;
    state.frozen = true;
    if (shot === 'title') {
      showScreen('title');
      return true;
    }
    // TIDAK ADA cabang ?shot=results: layar hasil HANYA berasal dari
    // playthrough sungguhan (tools/kembar-fullrun.mjs) — angka preset di
    // kode akan selalu terlihat seperti karangan, betapa pun benarnya.
    if (shot === 'play') {
      const sceneIndex = Math.min(2, Math.max(0, Number(params.get('scene') ?? 0)));
      const foundCount = Math.min(7, Math.max(0, Number(params.get('found') ?? 0)));
      const timeLeft = Number(params.get('time') ?? 96);
      const sc = SCENES[sceneIndex];
      // TIDAK ADA angka dekoratif: state screenshot dibangun dengan memainkan
      // game sungguhan lewat jalur yang sama dengan gameplay — checkPoint()
      // untuk tiap temuan (kombo + skor bertambah persis seperti klik pemain)
      // dan sceneComplete() untuk scene sebelumnya (bonus waktu + bintang).
      // Scene sebelumnya diasumsikan selesai dengan sisa waktu yang sama
      // dengan shot ini, supaya angkanya bisa direproduksi dari URL saja.
      state.simulating = true;
      state.score = 0;
      state.totalFound = 0;
      state.totalClicks = 0;
      state.totalTimeUsed = 0;
      state.sceneStars = [];
      state.bestCombo = 0;
      for (let s = 0; s < sceneIndex; s++) {
        startScene(s, { found: [], timeLeft });
        for (const d of SCENES[s].diffs) checkPoint({ x: d.x, y: d.y }, 'L');
        state.timeLeft = timeLeft;
        sceneComplete();
      }
      startScene(sceneIndex, { found: [], timeLeft });
      for (const d of sc.diffs.slice(0, foundCount)) checkPoint({ x: d.x, y: d.y }, 'L');
      state.timeLeft = timeLeft;
      state.simulating = false;
      if (params.get('hint') === '1') {
        // Pakai useHint() ASLI supaya jatah berkurang (3 → 2) dan skor
        // berkurang 50 — lalu sematkan cincin ke beda pertama yang tersisa
        // supaya screenshot deterministik (useHint sendiri memilih acak).
        useHint();
        const remaining = sc.diffs.filter((d) => !state.found.has(d.id));
        if (remaining.length > 0) state.hintDiff = remaining[0];
      }
      if (params.get('lens') === '1') {
        state.lensOn = true;
        state.cursor = { x: 430, y: 385 };
        window.setTimeout(() => showLensAt(els.panelLeft, 430, 385, 150), 50);
      }
      renderAll();
      return true;
    }
    return false;
  }

  return { state, startGame, startScene, renderAll, applyShotMode, showScreen, els };
}
