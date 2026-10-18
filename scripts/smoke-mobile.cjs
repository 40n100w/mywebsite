/* Touch journeys: start the static server, then node scripts/smoke-mobile.cjs. */
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    const context = await browser.newContext({viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true, reducedMotion:'reduce', serviceWorkers:'block'});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
    for (const width of [320,390,430]) {
      await page.setViewportSize({width,height:844});
      await page.goto(base);
      await page.evaluate(() => document.fonts.ready);
      assert(await page.locator('#chapters').evaluate(el => el.getBoundingClientRect().top < 844), 'Home index begins within one screen');
      await page.locator('.menu-toggle').tap();
      await page.locator('#period-dialog a[href="explore.html?era=medieval"]').tap();
      await page.waitForURL('**/explore.html?era=medieval');
      await page.evaluate(() => document.fonts.ready);
      assert(await page.locator('.hero-artwork').evaluate(el => el.getBoundingClientRect().top < 300), 'Opening art appears promptly');
      assert(await page.locator('#summary').evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 16), 'Readable body text');
      for (const control of await page.locator('.mobile-dock > *').all()) {
        const bounds = await control.boundingBox();
        assert(bounds.width >= 44 && bounds.height >= 44, 'Comfortable dock touch targets');
      }
      assert.equal(await page.locator('.responsive-details[open]').count(), 0);
      await page.locator('[data-sheet=mobile-contents]').tap();
      assert(await page.locator('#mobile-contents').isVisible());
      assert(await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden'), 'Background reading is locked while a sheet is open');
      await page.locator('#mobile-contents a[href="#works-section"]').tap();
      await page.waitForFunction(() => document.activeElement.id === 'works-section');
      assert(!(await page.locator('#mobile-contents').isVisible()));
      const act = await page.locator('#works-section').boundingBox();
      assert(act.y >= 0 && act.y < 100, 'Contents jump lands at the selected section');
      await page.locator('.object-details summary').first().tap();
      assert(await page.locator('.object-details').first().evaluate(el => el.open));
      await page.locator('.image-open').first().tap();
      await page.waitForFunction(() => document.getElementById('viewer-image').naturalWidth > 0);
      assert(await page.locator('#image-viewer').isVisible());
      assert.match(await page.locator('#viewer-image').getAttribute('src'), /^assets\/(museum|works)\//, 'Viewer keeps the original image');
      await page.locator('#viewer-zoom').tap();
      assert.equal(await page.locator('#viewer-zoom').getAttribute('aria-pressed'), 'true');
      assert(await page.locator('.viewer-image-stage').evaluate(el => el.scrollWidth > el.clientWidth * 1.9), 'Zoom creates a pannable image');
      const close = await page.locator('#viewer-close').boundingBox();
      assert(close.y >= 0 && close.y + close.height < 844, 'Close remains reachable while zoomed');
      await page.locator('#viewer-close').tap();
      assert(await page.locator('.image-open').first().evaluate(el => el === document.activeElement), 'Viewer restores focus');
      await page.locator('.image-open').first().tap();
      assert.equal(await page.locator('#viewer-zoom').getAttribute('aria-pressed'), 'false', 'Reopening starts fitted');
      await page.keyboard.press('Escape');
      await page.locator('[data-sheet=mobile-periods]').tap();
      assert.equal(await page.locator('#mobile-periods a[aria-current=page]').getAttribute('href'), 'explore.html?era=medieval');
      await page.keyboard.press('Escape');
      assert(await page.locator('[data-sheet=mobile-periods]').evaluate(el => el === document.activeElement));
      await page.locator('[data-sheet=mobile-periods]').tap();
      await page.locator('#mobile-periods a[href="explore.html?era=renaissance"]').tap();
      await page.waitForURL('**/explore.html?era=renaissance');
      await page.locator('.mobile-dock > a').tap();
      await page.waitForURL('**/explore.html?era=baroque');
      console.log(`Passed touch journey at ${width}px, 3× screen density`);
    }
    await page.locator('[data-sheet=mobile-contents]').tap();
    await page.setViewportSize({width:900,height:900});
    assert(!(await page.locator('#mobile-contents').isVisible()), 'Phone sheets close when moving to desktop');
    assert.equal(await page.locator('.responsive-details:not([open])').count(), 0, 'Desktop records are expanded');
    await page.locator('#time-stops a[href="explore.html?era=ancient"]').click();
    await page.waitForURL('**/explore.html?era=ancient');
    await page.setViewportSize({width:390,height:844});
    const imageRequests = [];
    page.on('request', request => { if (request.resourceType() === 'image') imageRequests.push(request.url()); });
    await page.goto(`${base}/explore.html?era=medieval`);
    await page.locator('.work-image').first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.hero-artwork img, .work-image')].slice(0,2).every(img => img.complete && img.naturalWidth));
    assert(await page.locator('.hero-artwork img').evaluate(el => el.currentSrc.includes('/responsive/')));
    assert(!imageRequests.some(url => /\/assets\/(museum|works|explore)\//.test(url)), 'Inline artwork avoids original large image downloads');
    for (const file of ['about','glossary','sources','corrections','review']) {
      await page.setViewportSize({width:320,height:844});
      await page.goto(`${base}/${file}.html`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${file}: no phone overflow`);
    }
    assert.deepEqual(errors, [], 'No browser or network errors');
    console.log('Passed image delivery, desktop transition, focus restoration, viewer zoom, and all five reference pages.');
    await context.close();
    const noScript = await browser.newContext({javaScriptEnabled:false, viewport:{width:390,height:844}});
    const staticPage = await noScript.newPage();
    await staticPage.goto(base);
    await staticPage.locator('#medieval').click();
    await staticPage.waitForURL('**/explore.html?era=medieval');
    assert(await staticPage.locator('.noscript-note').isVisible());
    await noScript.close();
    console.log('Passed homepage navigation without JavaScript.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
