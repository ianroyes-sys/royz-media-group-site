const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://127.0.0.1:3105';

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
      console.log('Testing viewport', viewport.width);
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      await page.locator('.showroom-phones').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => {
        const videos = [...document.querySelectorAll('.showroom video')];
        return videos.length === 3 && videos.every(v => !v.paused && v.currentTime > 0 && v.muted);
      }, null, { timeout: 25000 });
      await page.getByRole('button', { name: 'Pause Lighthouse Church app showcase', exact: true }).click();
      assert.equal(await page.locator('.showroom video').first().evaluate(v => v.paused), true, 'hero pause control works');
      await page.getByRole('button', { name: 'Play Lighthouse Church app showcase', exact: true }).click();
      await page.waitForFunction(() => !document.querySelector('.showroom video').paused);
      for (const name of ['Lighthouse Church', 'Guerrier Inc.', 'Alex Royes']) {
        console.log('Testing portfolio', name);
        await page.getByRole('tab', { name }).click();
        await page.locator('#work-panel video').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
          const v = document.querySelector('#work-panel video');
          return v && !v.paused && v.currentTime > 0;
        }, null, { timeout: 20000 });
      }
      await page.goto(`${base}/work/lighthouse`, { waitUntil: 'domcontentloaded' });
      const video = page.locator('video');
      await video.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v && !v.paused && v.currentTime > 0; }, null, { timeout: 20000 });
      assert.equal(await video.evaluate(v => v.muted && v.loop && v.playsInline), true);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('video').paused);
      await video.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => !document.querySelector('video').paused);
      // A direct pause reproduces a native player control's pause event.
      await video.evaluate(v => v.pause());
      await page.waitForTimeout(100);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(100);
      await video.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      assert.equal(await video.evaluate(v => v.paused), true, 'explicit pause must survive scrolling');
      await page.close();
    }
    const reduced = await browser.newPage({ reducedMotion: 'reduce' });
    await reduced.goto(`${base}/work/lighthouse`, { waitUntil: 'domcontentloaded' });
    const video = reduced.locator('video');
    await video.scrollIntoViewIfNeeded();
    await reduced.waitForTimeout(500);
    assert.equal(await video.evaluate(v => v.paused && v.controls), true, 'reduced motion must remain manual');
    await video.evaluate(v => v.play());
    await reduced.waitForFunction(() => !document.querySelector('video').paused);
    console.log('PASS: desktop/mobile three-phone hero autoplay and pause control, portfolio tab autoplay, case-study automatic playback, offscreen pause/resume, sticky user pause, and reduced-motion manual playback.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
