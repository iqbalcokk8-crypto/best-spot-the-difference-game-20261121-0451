# Tools — cara mengulang pengujian KEMBAR SENJA

Butuh Node 22.18+ dan Chromium yang bisa dipakai Playwright
(`npx playwright install chromium` bila belum ada; `playwright-core`
tidak mengunduh browser sendiri).

```sh
npm install          # dari folder tools/ — memasang playwright-core 1.65.1
node serve.ts        # dari root repo — sajikan game di http://localhost:8080
```

Lalu, dari folder `tools/`:

```sh
# Playthrough penuh: klik 21 beda di 3 scene, simpan layar hasil ASLI
# (dari sesi yang benar-benar dimainkan) ke screenshots/4-results.jpg
node kembar-fullrun.mjs ..

# Screenshot 1-3 dari mode ?shot=play (state dibangun lewat jalur
# gameplay asli: checkPoint + sceneComplete, tanpa angka dekoratif)
node kembar-shots.mjs ../shots.json ..
```

Catatan: `screenshots/4-results.jpg` HANYA dihasilkan oleh
`kembar-fullrun.mjs` — tidak ada preset `?shot=results` di dalam game,
supaya angka layar hasil selalu berasal dari sesi yang dimainkan.
Log terakhir playthrough tersimpan di `tools/fullrun-log.txt`.
