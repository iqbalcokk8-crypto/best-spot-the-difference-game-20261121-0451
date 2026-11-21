// Usage: node /tmp/kembar-shots.mjs
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const shots = JSON.parse(readFileSync(process.argv[2] ?? 'shots.json', 'utf8'));
const browser = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', m => { if (m.type() === 'error') console.log('[page error]', m.text().slice(0, 300)); });
page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 300)));
for (const shot of shots) {
  await page.goto('http://localhost:8080/index.html' + shot.query, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: process.argv[3] + '/screenshots/' + shot.name, type: 'jpeg', quality: 82 });
  console.log('saved', process.argv[3] + '/screenshots/' + shot.name);
}
await browser.close();
