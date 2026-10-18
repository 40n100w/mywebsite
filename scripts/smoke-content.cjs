/* Reading journeys: run with the local site server and Playwright available. */
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
const sections = ['works-section', 'seeing', 'world', 'ideas', 'design', 'legacy'];

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    const page = await browser.newPage({viewport:{width:390, height:844}, reducedMotion:'reduce', serviceWorkers:'block'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/explore.html?era=prehistoric`);
    const eras = await page.evaluate(() => window.periods.map(period => period.id));
    const references = new Set();
    for (const era of eras) {
      await page.goto(`${base}/explore.html?era=${era}`);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.section-bridge a').count(), 5);
      assert.deepEqual(await page.locator('#chapter-contents a').evaluateAll(links => links.map(link => link.hash.slice(1))), sections);
      assert.deepEqual(await page.locator('#mobile-contents a').evaluateAll(links => links.map(link => link.hash.slice(1))), ['title', ...sections, 'synthesis', 'sources']);
      const broken = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => link.hash && !document.getElementById(link.hash.slice(1))).map(link => link.hash));
      assert.deepEqual(broken, [], `${era}: broken section link`);
      assert(!/undefined|\[object Object\]/.test(await page.locator('main').innerText()), `${era}: unresolved copy`);
      assert.match(await page.locator('#reading-length').textContent(), /About \d+ minutes/);
      const headingOverflow = await page.locator('main h2, main h3').evaluateAll(headings => headings.filter(heading => {
        const range = document.createRange(); range.selectNodeContents(heading);
        return [...range.getClientRects()].some(rect => rect.left < -1 || rect.right > innerWidth + 1);
      }).map(heading => heading.textContent));
      assert.deepEqual(headingOverflow, [], `${era}: heading overflow`);

      // Follow each bridge through the chapter instead of checking only its markup.
      for (const destination of sections.slice(1)) {
        await page.locator(`.section-bridge a[href="#${destination}"]`).click();
        assert.equal(new URL(page.url()).hash, `#${destination}`);
      }
      assert.equal(await page.locator('#era-compare .image-open').count(), 2);
      for (const image of await page.locator('#era-compare .image-open').all()) {
        const original = await image.getAttribute('data-image');
        await image.click();
        assert(await page.locator('#image-viewer').isVisible());
        assert.equal(await page.locator('#viewer-image').getAttribute('src'), original);
        assert.equal(await page.locator('#viewer-caption').textContent(), await image.getAttribute('data-caption'));
        await page.keyboard.press('Escape');
      }

      for (const href of await page.locator('#works .collection-link a').evaluateAll(links => links.map(link => link.hash))) references.add(href);
      console.log(`Passed reading route and comparisons: ${era}`);
    }
    await page.goto(`${base}/sources.html`);
    assert.equal(references.size, 36);
    for (const hash of references) {
      const record = page.locator(hash);
      assert.equal(await record.count(), 1, `Missing source ${hash}`);
      assert.match(await record.locator('.source-address').textContent(), /^https:\/\//);
      const returnLink = await record.locator('.source-return').getAttribute('href');
      assert(returnLink.endsWith(`#work-${hash.slice('#source-'.length)}`));
    }
    // Check the complete return journey for a cross-period comparison.
    await page.goto(`${base}/explore.html?era=baroque#legacy`);
    await page.locator('#era-compare a[href*="renaissance"]').click();
    await page.waitForURL('**/explore.html?era=renaissance#work-michelangelo-david');
    await page.locator('#work-michelangelo-david .collection-link a').click();
    await page.waitForURL('**/sources.html#source-michelangelo-david');
    await page.locator('#source-michelangelo-david .source-return').click();
    await page.waitForURL('**/explore.html?era=renaissance#work-michelangelo-david');
    assert.deepEqual(errors, []);
    console.log('Passed all 36 source references and a comparison → work → source → work journey.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
