const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const mode = process.argv[2] || 'preview';
  const fps = 30, D = 20.6;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const dir = __dirname + '/' + (mode === 'preview' ? 'prev' : 'frames');
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  const times = mode === 'preview' ? [1.5, 3.0, 5.5, 8.5, 10.4, 12.0, 16.4, 19.0] : Array.from({ length: Math.round(D * fps) }, (_, i) => i / fps);
  let i = 0;
  for (const t of times) {
    await p.evaluate(t => window.seek(t), t);
    await p.screenshot({ path: `${dir}/${String(i++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await b.close();
  console.log('frames', i);
})();
