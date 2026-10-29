const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const mode = process.argv[2] || 'preview';
  const fps = 30, D = 17.9;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const dir = __dirname + '/' + (mode === 'preview' ? 'prev' : 'frames');
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  const times = mode === 'preview' ? [0.0, 2.0, 3.8, 5.8, 8.0, 10.3, 13.9, 16.5] : Array.from({ length: Math.round(D * fps) }, (_, i) => i / fps);
  let i = 0;
  for (const t of times) {
    await p.evaluate(t => window.seek(t), t);
    await p.screenshot({ path: `${dir}/${String(i++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await b.close();
  console.log('frames', i);
})();
