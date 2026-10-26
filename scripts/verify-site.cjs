const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://127.0.0.1:3105';
(async () => {
 const browser = await chromium.launch({headless: true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
 try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  for (const path of ['/', '/work', '/work/lighthouse', '/solutions', '/solutions/clinics', '/privacy']) {
   const response = await page.goto(base+path,{waitUntil:'domcontentloaded'}); assert.equal(response.status(),200,path);
   await page.waitForTimeout(150);
   assert.equal(await page.locator('main').count(),1,path);
   assert.equal(await page.locator('h1').count(),1,path);
   for(const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:844});
    const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.equal(dimensions.scroll,dimensions.width,`${path} overflows at ${width}`);
   }
  }
  await page.goto(base,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('iframe').count(),0,'calendar must load only on request');
  assert.equal(await page.locator('#top video').count(),3,'three automatic showcase videos');
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Open menu'}).click(); await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
  await page.getByRole('tab',{name:'Lighthouse Church'}).press('ArrowRight');
  assert.equal(await page.getByRole('tab',{name:'Guerrier Inc.'}).getAttribute('aria-selected'),'true');
  const missing = await page.goto(base+'/this-page-does-not-exist',{waitUntil:'domcontentloaded'}); assert.equal(missing.status(),404);
  assert.deepEqual(errors,[]);
  console.log('PASS: six routes, four viewport widths, keyboard menu/tabs, deferred calendar, showcase media, custom 404, no runtime errors.');
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
