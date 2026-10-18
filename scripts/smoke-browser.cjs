/* Optional integration checks: start the site's Python server before running. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
const eras = ['prehistoric','ancient','medieval','renaissance','baroque','neoclassicism','romanticism','realism','impressionism','post-impressionism','modernism','contemporary'];

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
  let pages = 0;
  try {
    const context = await browser.newContext({reducedMotion: 'reduce', serviceWorkers: 'block'});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if(response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
    page.on('request', request => { if(new URL(request.url()).origin !== new URL(base).origin) errors.push(`Third-party request: ${request.url()}`); });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({width, height: width > 1000 ? 1000 : 844});
      for (const era of ['home', ...eras]) {
        await page.goto(`${base}/${era === 'home' ? '' : `explore.html?era=${era}`}`);
        await page.evaluate(() => document.fonts.ready);
        {
          await page.evaluate(() => document.querySelectorAll('img[src]').forEach(img => { img.loading = 'eager'; }));
          await page.waitForFunction(() => Array.from(document.querySelectorAll('img[src]')).filter(img => img.getAttribute('src')).every(img => img.complete && img.naturalWidth > 0));
        }
        assert.equal(await page.locator('h1').count(), 1, `${era}: one page heading`);
        const layout = await page.evaluate(() => {
          const range = document.createRange();
          range.selectNodeContents(document.querySelector('h1'));
          return {width:innerWidth, scroll:document.documentElement.scrollWidth,
            headingRects:Array.from(range.getClientRects(), r=>({left:r.left,right:r.right}))};
        });
        assert(layout.scroll <= layout.width + 1, `${era} at ${width}px overflows to ${layout.scroll}px`);
        assert(layout.headingRects.every(r => r.left >= -1 && r.right <= layout.width + 1), `${era} at ${width}px clips its heading: ${JSON.stringify(layout.headingRects)}`);
        if (era === 'home') {
          assert.equal(await page.locator('.chapter-card').count(), 12);
          await page.locator('.menu-toggle').click();
          assert(await page.locator('#period-dialog').isVisible());
          await page.keyboard.press('Escape');
          assert(!await page.locator('#period-dialog').isVisible());
          assert(await page.locator('.menu-toggle').evaluate(el => el === document.activeElement));
        } else {
          assert.equal(await page.locator('.story-act').count(), 8);
          assert.equal(await page.locator('#works .image-open').count(), 3);
          assert(await page.locator('#map-countries path').count() > 100);
          await page.waitForFunction(() => {const img=document.querySelector('.hero-artwork img');return img.complete && img.naturalWidth > 0;});
          assert(await page.locator('.hero-artwork figcaption').textContent());
          const captionVisible = await page.evaluate(() => document.querySelector('.hero-artwork figcaption').getBoundingClientRect().bottom <= document.querySelector('.explore-hero').getBoundingClientRect().bottom + 1);
          assert(captionVisible, `${era}: opening artwork caption must not be clipped`);
          if (width === 1440) {
            await page.locator('.hero-image-button').click();
            assert(await page.locator('#image-viewer').isVisible());
            await page.keyboard.press('Escape');
            assert(!await page.locator('#image-viewer').isVisible());
            const slider = page.locator('#study-range');
            if(await slider.count()) {
              await slider.focus();
              const before = await slider.inputValue();
              await page.keyboard.press('ArrowRight');
              assert.notEqual(await slider.inputValue(), before);
              assert(await slider.getAttribute('aria-valuetext'));
            } else if(era === 'post-impressionism') {
              for(const mode of ['plane','gesture','dot']) {
                await page.locator(`[data-study-mode=${mode}]`).click();
                assert.equal(await page.locator(`[data-study-mode=${mode}]`).getAttribute('aria-pressed'), 'true');
                assert.equal(await page.locator('[data-study-mode][aria-pressed=true]').count(), 1);
              }
            } else {
              const before = await page.locator('.lab-status').textContent();
              await page.locator('#study-toggle').click();
              assert.notEqual(await page.locator('.lab-status').textContent(), before);
              if(era !== 'contemporary') assert.equal(await page.locator('#study-toggle').getAttribute('aria-pressed'), 'true');
            }
            await page.locator('#knowledge-check button[type=submit]').click();
            assert.match(await page.locator('#quiz-result').textContent(), /Choose an answer/);
            const correct = await page.evaluate(id => window.studyData[id].quiz[2], era);
            await page.locator(`#quiz-options input[value="${correct}"]`).check();
            await page.locator('#knowledge-check button[type=submit]').click();
            assert.match(await page.locator('#quiz-result').textContent(), /^Correct/);
            await page.locator('#mark-complete').click();
            await page.reload();
            assert.equal(await page.locator('#mark-complete').textContent(), 'Chapter complete ✓');
          }
        }
        pages++;
      }
      console.log(`Passed: home and all 12 chapters at ${width}px`);
    }
    assert.deepEqual(errors, [], 'Browser runtime/network errors');
    await page.goto(`${base}/explore.html?era=renaissance`);
    await page.locator('[data-sheet=mobile-periods]').click();
    await page.locator('#mobile-periods a[href="explore.html?era=baroque"]').click();
    await page.waitForURL('**/explore.html?era=baroque');
    assert.equal(await page.locator('body').getAttribute('data-era'), 'baroque');
    await context.close();

    const offline = await browser.newContext({reducedMotion:'reduce'});
    const offlinePage = await offline.newPage();
    await offlinePage.goto(`${base}/explore.html?era=renaissance`);
    await offlinePage.evaluate(async () => { await navigator.serviceWorker.ready; });
    await offlinePage.reload();
    await offlinePage.waitForFunction(() => navigator.serviceWorker.controller);
    await offlinePage.evaluate(async () => {
      for(let i=0;i<100;i++) {
        if(await caches.match(location.href)) return;
        await new Promise(resolve=>setTimeout(resolve,50));
      }
      throw new Error('Visited chapter was not cached');
    });
    await offline.setOffline(true);
    await offlinePage.reload();
    await offlinePage.locator('#study-toggle').click();
    assert.equal(await offlinePage.locator('#study-toggle').getAttribute('aria-pressed'), 'true');
    assert.equal(await offlinePage.locator('#works .image-open').count(), 3);
    await offline.close();
    console.log(`Passed: ${pages} page/viewport checks; all 12 visual studies, quizzes and progress; image dialogs; chapter navigation; cached offline chapter.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
