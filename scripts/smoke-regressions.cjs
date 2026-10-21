/* Failure-path checks use a private server at both / and /mywebsite/. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');
const failures = new Set();
const types = {'.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2'};
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (failures.has(url.pathname)) { response.writeHead(503); response.end('Temporary failure'); return; }
  let relative = decodeURIComponent(url.pathname).replace(/^\/mywebsite\//, '/');
  if (relative.endsWith('/')) relative += 'index.html';
  const filename = path.resolve(root, `.${relative}`);
  if (!filename.startsWith(`${root}${path.sep}`)) { response.writeHead(403); response.end(); return; }
  try {
    const contents = await fs.readFile(filename);
    response.writeHead(200, {'Content-Type':types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    response.end(contents);
  } catch {
    response.writeHead(404, {'Content-Type':'text/html', 'Cache-Control':'no-store'});
    response.end(await fs.readFile(path.join(root, '404.html')));
  }
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    const errors = [];
    const context = await browser.newContext({viewport:{width:390,height:844}, reducedMotion:'reduce'});
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    const page = await context.newPage();
    // Seed unrelated caches before the site's worker can activate.
    await page.goto(`${base}/about.html`);
    const cachePrefix = `art-compass:${base}/:`;
    const otherScope = `art-compass:${base}/mywebsite/:previous-test-version`;
    const previousCache = `${cachePrefix}previous-test-version`;
    await page.evaluate(async ({otherScope, previousCache}) => {
      for (const name of ['another-app-offline', otherScope, previousCache]) {
        await (await caches.open(name)).put('/sentinel', new Response(name));
      }
    }, {otherScope, previousCache});
    await page.goto(base);
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    const cacheNames = await page.evaluate(() => caches.keys());
    const cacheName = cacheNames.find(name => name.startsWith(cachePrefix));
    assert(cacheName, 'The worker creates a cache for its own deployment');
    assert(cacheNames.includes('another-app-offline'), 'Activation must preserve other apps’ data');
    assert(cacheNames.includes(otherScope), 'Activation must preserve another deployment’s cache');
    assert(!cacheNames.includes(previousCache), 'Only the previous cache in this scope is removed');

    await page.goto(`${base}/explore.html?era=renaissance`);
    await page.locator('.hero-artwork img').evaluate(image => image.decode());
    const preview = await page.locator('.hero-artwork img').evaluate(image => image.currentSrc);
    await page.waitForFunction(async ({cacheName, preview}) => !!(await (await caches.open(cacheName)).match(preview)), {cacheName, preview});
    await context.setOffline(true);
    await page.locator('.hero-image-button').click();
    await page.waitForFunction(() => document.getElementById('viewer-image').naturalWidth > 0);
    assert.equal(await page.locator('#viewer-image').getAttribute('src'), preview);
    assert.match(await page.locator('#viewer-status').textContent(), /Showing the preview/);
    await page.keyboard.press('Escape');
    await page.goto(`${base}/explore.html?era=baroque`);
    assert.equal(await page.locator('body').getAttribute('data-era'), 'baroque', 'An unvisited offline chapter must keep its requested era');
    await page.goto(`${base}/missing/deep/page`);
    assert.match(await page.title(), /Page not found/);
    await page.locator('#return-home').click();
    await page.waitForURL(`${base}/`);
    assert.equal(await page.locator('.chapter-card').count(), 12);
    await context.setOffline(false);

    failures.add('/explore.html');
    failures.add('/js/explore.js');
    await page.goto(`${base}/explore.html?era=ancient`);
    assert.equal(await page.locator('body').getAttribute('data-era'), 'ancient', 'Cached content survives HTTP 503 responses');
    failures.clear();

    // Exercise the same cache and URL rules under GitHub Pages' project path.
    await page.goto(`${base}/mywebsite/explore.html?era=medieval`);
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => navigator.serviceWorker.controller?.scriptURL.endsWith('/mywebsite/sw.js'));
    assert(await page.evaluate(name => caches.has(name), cacheName), 'Project activation must preserve the root deployment');
    await context.setOffline(true);
    await page.goto(`${base}/mywebsite/explore.html?era=modernism`);
    assert.equal(await page.locator('body').getAttribute('data-era'), 'modernism');
    await page.goto(`${base}/mywebsite/missing/deep/page`);
    assert.match(await page.title(), /Page not found/);
    await page.locator('#return-home').click();
    await page.waitForURL(`${base}/mywebsite/`);
    assert.equal(await page.locator('.chapter-card').count(), 12);
    await context.close();
    console.log('Passed offline chapters, preview fallback, HTTP errors, cache isolation, and project-path recovery.');

    const reading = await browser.newContext({viewport:{width:1440,height:1000}, reducedMotion:'reduce', serviceWorkers:'block'});
    reading.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    const first = await reading.newPage();
    await first.goto(`${base}/explore.html?era=prehistoric`);
    const eras = await first.evaluate(() => window.periods.map(period => period.id));
    await first.evaluate(() => localStorage.setItem('art-compass-progress', JSON.stringify(['prehistoric','prehistoric',null,'unknown',42])));
    await first.reload();
    assert.match(await first.locator('#progress-status').textContent(), /^1 of 12/);
    const second = await reading.newPage();
    await second.goto(`${base}/explore.html?era=ancient`);
    await second.locator('#mark-complete').click();
    await first.waitForFunction(() => document.getElementById('progress-status').textContent.startsWith('2 of 12'));
    await second.evaluate(() => localStorage.removeItem('art-compass-progress'));
    await first.waitForFunction(() => document.getElementById('progress-status').textContent.startsWith('0 of 12'));
    assert.equal(await first.locator('#mark-complete').textContent(), 'Mark chapter complete');

    await first.locator('.hero-image-button').click();
    await first.waitForFunction(() => document.getElementById('viewer-image').naturalWidth > 0);
    const bounds = await first.locator('#image-viewer').boundingBox();
    await first.mouse.click(bounds.x + 8, bounds.y + bounds.height / 2);
    assert(await first.locator('#image-viewer').isVisible(), 'Dialog padding is not its backdrop');
    await first.mouse.click(1, 1);
    assert(!await first.locator('#image-viewer').isVisible(), 'The actual backdrop closes the viewer');
    // A new request must hide the previous work while loading, then show a useful error.
    let releaseImage;
    const imageGate = new Promise(resolve => { releaseImage = resolve; });
    await first.route('**/assets/works/calling-st-matthew.jpg', async route => { await imageGate; await route.abort(); });
    await first.route('**/assets/responsive/works/calling-st-matthew-*', route => route.abort());
    await first.goto(`${base}/explore.html?era=baroque`);
    await first.locator('.hero-image-button').click();
    await first.waitForFunction(() => document.getElementById('viewer-image').naturalWidth > 0);
    await first.keyboard.press('Escape');
    await first.locator('#work-calling-st-matthew .image-open').click();
    assert(await first.locator('#viewer-image').isHidden(), 'A previous image must not appear with the new caption');
    assert(await first.locator('#viewer-zoom').isDisabled());
    releaseImage();
    await first.waitForFunction(() => document.getElementById('viewer-status').textContent.startsWith('This image is unavailable'));
    await first.locator('#viewer-close').click();
    await reading.close();
    console.log('Passed progress repair and cross-tab updates, viewer padding, loading state, and image-error recovery.');

    const noScript = await browser.newContext({javaScriptEnabled:false, viewport:{width:320,height:844}, serviceWorkers:'block'});
    const reference = await noScript.newPage();
    for (const prefix of ['', '/mywebsite']) {
      await reference.goto(`${base}${prefix}/sources.html#source-michelangelo-david`);
      assert.equal(await reference.locator('[id^="source-"] li[id]').count(), 36);
      assert.equal(await reference.locator('#image-rights-list li').count(), 7);
      await reference.goto(`${base}${prefix}/glossary.html#term-linear-perspective`);
      assert(await reference.locator('#term-linear-perspective').isVisible());
      assert(await reference.locator('#terms dt').count() >= 12);
      assert(await reference.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await noScript.close();
    // With storage denied, reading and the completion control still respond.
    const privateContext = await browser.newContext({serviceWorkers:'block'});
    privateContext.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    await privateContext.addInitScript(() => Object.defineProperty(window, 'localStorage', {get() { throw Error('Storage unavailable'); }}));
    const privatePage = await privateContext.newPage();
    await privatePage.goto(`${base}/explore.html?era=ancient`);
    await privatePage.locator('#mark-complete').click();
    assert.match(await privatePage.locator('#progress-status').textContent(), /storage is unavailable/);
    await privateContext.close();
    const reflow = await browser.newContext({reducedMotion:'reduce', serviceWorkers:'block'});
    reflow.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    const largeText = await reflow.newPage();
    const pages = ['', ...eras.map(era => `explore.html?era=${era}`), ...['about','sources','glossary','corrections','review','404'].map(name => `${name}.html`)];
    for (const width of [390, 1440]) {
      await largeText.setViewportSize({width, height:844});
      for (const file of pages) {
        await largeText.goto(`${base}/${file}`);
        await largeText.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
        await largeText.evaluate(() => document.fonts.ready);
        const layout = await largeText.evaluate(() => ({
          overflow:document.documentElement.scrollWidth > innerWidth + 1,
          clipped:[...document.querySelectorAll('main h1, main h2, main h3, main h4')].filter(heading => {
            const range = document.createRange(); range.selectNodeContents(heading);
            return [...range.getClientRects()].some(rect => rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1));
          }).map(heading => heading.textContent)
        }));
        assert(!layout.overflow, `${file} at ${width}px: enlarged text must reflow`);
        assert.deepEqual(layout.clipped, [], `${file}: enlarged headings must remain readable`);
      }
    }
    await reflow.close();
    assert.deepEqual(errors, [], 'No unexpected JavaScript failures');
    console.log('Passed complete references without JavaScript, reading without storage, and 38 enlarged-text layouts.');
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
