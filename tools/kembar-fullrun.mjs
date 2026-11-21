// Full honest playthrough: click all 21 diffs, screenshot the REAL results screen.
import { chromium } from 'playwright-core';
const DIFFS = [
  [[120,108],[320,232],[494,312],[522,62],[210,135],[413,322],[300,176]],
  [[218,330],[430,368],[122,148],[505,200],[320,442],[560,118],[252,118]],
  [[320,235],[505,156],[150,108],[225,392],[450,362],[96,262],[348,306]],
];
const browser = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('http://localhost:8080/index.html', { waitUntil: 'load' });
await page.waitForTimeout(400);
await page.click('#start-button');
await page.waitForTimeout(300);
for (let s = 0; s < 3; s++) {
  const box = await page.locator('#panel-left svg').boundingBox();
  for (const [x, y] of DIFFS[s]) {
    await page.mouse.click(box.x + (x / 640) * box.width, box.y + (y / 480) * box.height);
    await page.waitForTimeout(1400);
  }
  await page.waitForTimeout(900);
  const st = await page.evaluate(() => ({ screen: window.__kembarSenja.state.screen, found: window.__kembarSenja.state.found.size }));
  console.log(`scene ${s + 1}:`, JSON.stringify(st));
  if (s < 2) { await page.click('#next-scene-button'); await page.waitForTimeout(300); }
}
await page.click('#next-scene-button'); await page.waitForTimeout(600);
const final = await page.evaluate(() => {
  const g = window.__kembarSenja.state;
  return { screen: g.screen, score: g.score, totalFound: g.totalFound, totalClicks: g.totalClicks, totalTimeUsed: g.totalTimeUsed, sceneStars: g.sceneStars };
});
console.log('FINAL:', JSON.stringify(final));
console.log('results text:', await page.locator('#results-detail').textContent(), '|', await page.locator('#results-found').textContent(), await page.locator('#results-accuracy').textContent(), await page.locator('#results-time').textContent(), await page.locator('#results-stars').textContent());
await page.screenshot({ path: process.argv[2] + '/screenshots/4-results.jpg', type: 'jpeg', quality: 82 });
console.log('saved real 4-results.jpg');
console.log('page errors:', errors.length ? errors : 'none');
await browser.close();
