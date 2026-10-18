# Art Compass — Navigate Art History

A handcrafted, responsive journey through 40,000 years of art history. Twelve immersive chapters lead visitors from prehistoric cave art through the contemporary period. Built with semantic HTML, modern CSS, and vanilla JavaScript—no framework or build step required.

## Preview locally

From the repository root, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)`, then save.

All internal assets use relative paths, so the site works at both a user/organization root domain and a project subpath such as `username.github.io/repository-name/`.

## Structure

```text
.
├── index.html
├── 404.html
├── assets/
│   ├── art/
│   ├── explore/
│   ├── works/
│   └── favicon.svg
├── css/
│   └── styles.css
└── js/
    └── main.js
```

## Experience

- Chronological, scroll-driven narrative
- Twelve original AI-generated, period-specific visual environments
- Dedicated explorer view for every period with 36 featured works
- Locally stored public-domain and Creative Commons reproductions where reuse is verified, with clearly labeled interpretive studies elsewhere
- Persistent reading progress and current-era indicator
- Full period index for non-linear exploration
- Dates, defining characteristics, historical context, landmark works, and artists
- Political, social, economic, and military impact analysis
- Two-way historical analysis across belief, culture, economics, power, and technology: what shaped each period and what its art changed in return
- Key literary, philosophical, religious, and oral works that shaped each period’s thinking
- A defining intellectual shift for every period, including an illustrated explanation of Plato’s ideal Forms
- Local, privacy-safe world maps showing representative centers and wider zones of influence or exchange
- Architecture, furniture, decorative design, and graphic-design context
- Responsive layout and reduced-motion support
- Twelve distinct chapter compositions, from illuminated manuscript and measured folio to illustrated journal and experimental publication
- Twelve generated architectural surrounds, from cave mouths and carved portals to garden arbors and experimental pavilions; image-based chapter entrances and homepage previews
- An artwork-led opening, chapter contents, numbered time rail, and bottom navigation for mobile periods and contents
- Locally hosted, licensed typography and responsive layouts with reduced-motion support
- A visual homepage index previewing all twelve chapter designs
- Keyboard-operable teaching studies for perspective, composition, scale, color, and viewing context
- A period-specific eight-act narrative that moves from historical setting and intellectual catalyst through visual breakthroughs, makers, cultural consequences, legacy, and transition
- Era-level museum and heritage sources, reflection prompts, a public glossary, accessible map text, and a visible motion control
- Explicit source, medium, location, dimensions where available, and two close-looking prompts for every featured work
- Full-image viewing that preserves each work’s natural proportions
- Previous-era comparisons and live act progress throughout each eight-part chapter
- Era-specific visual ruptures, visual DNA, emotional arcs, physical-scale studies, and animated exchange-route narratives
- Guided close-looking reveals and cross-era page transitions with reduced-motion fallbacks
- Three-item chapter synthesis, a knowledge check, and optional progress stored only in the visitor’s browser
- Embedded map data for direct offline reading plus an installable service-worker shell when served over HTTP

## Notes

The works-and-makers sections combine licensed reproductions with AI-generated studies where reusable imagery is unavailable or uncertain. Reproductions display their image license, creator credit, and provenance link. Chapter, architecture, design, and any explicitly labeled study images are AI-generated editorial interpretations rather than documentary evidence.

Historical dates and interpretations are provided for general educational use. Visitors should consult museum, archive, or scholarly sources before relying on the site for academic research.

World boundaries are derived from the public-domain Natural Earth 1:110m dataset. Modern national boundaries are used only as geographic orientation for historical regions and do not imply that present-day states existed during the period shown.

## Privacy and security

- The site has no analytics, advertising, cookies, forms, accounts, or user tracking.
- It does not collect, transmit, or store visitor information.
- Fonts and all other assets are served from the repository; the site makes no third-party requests.
- A restrictive Content Security Policy limits the resources that pages can load.

Never commit credentials, private keys, personal information, or environment files. The included `.gitignore` blocks common local and secret-bearing files, but contributors should still review staged changes before publishing.

## Editorial and rights information

- `about.html` explains the project’s method, generated imagery, geographic framework, and limitations.
- `sources.html` collects museum and cultural-heritage sources used by the era pages.
- `js/work-records.js` keeps all 36 work records keyed to their own source so citations cannot drift by display order.
- `glossary.html` defines recurring visual concepts.
- `corrections.html` describes the public correction process without adding a tracking form.
- `review.html` states the current independent-review status and the criteria for future specialist sign-off.
- `NOTICE.md` records current rights and third-party attribution. Creative Commons terms apply to the individual files identified in `js/artwork-media.js`; no broader open license is granted unless a separate license is added later.
- `scripts/fetch-open-art.mjs` rebuilds the licensed-image candidate records and can download verified reproductions for offline use.

Run `sh scripts/validate.sh` before publishing. The same validation runs automatically through GitHub Actions.

## Design and browser checks

`js/art-direction.js` describes each chapter’s visual interpretation and featured artwork. `js/period-experience.js` adds its opening composition and interactive teaching study; `css/explore.css` carries each visual language through the full chapter. Keep artwork attribution and interpretive-study labels visible when changing images. The homepage index is static HTML and remains navigable without JavaScript.

`css/architecture.css` builds the chapter entrances from the twelve transparent WebP illustrations in `assets/architecture/`. These AI-generated architectural studies are labeled as imagined settings. On desktop the structures surround live text and artwork; on phones they frame the artwork directly beneath the chapter title. The homepage loads chapter-preview images lazily. The service worker caches images as they are visited instead of downloading the entire image set at install time.

The optional browser smoke check requires Playwright and Chromium (both supplied in the prepared cloud environment). Start the Python server above, then run `node scripts/smoke-browser.cjs`. Set `SITE_URL` or `CHROMIUM_PATH` when using a different local server or browser binary. It checks all chapters, mobile layouts, visual-study controls, viewing images, quiz feedback, saved progress, navigation, and offline reading.

`css/mobile.css` provides the phone reading layout: compact period previews, 16px body text, native bottom-sheet menus, expandable image/object records, and a full-screen image viewer with zoom. `js/mobile.js` preserves keyboard focus, real anchor links, and desktop navigation when the viewport changes. Run `node scripts/smoke-mobile.cjs` for touch journeys at 320, 390, and 430px, image delivery, viewer zoom, and reference-page checks. Browser checks use Chromium emulation; physical iOS/Safari testing remains a separate device check.

Inline artworks use responsive WebP derivatives in `assets/responsive/`; the viewer keeps the full original files. To regenerate them after changing source images, install ImageMagick 7 and run `node scripts/build-responsive-images.mjs`. This updates the image manifest/helpers, mobile architectural CSS, and static homepage image attributes. The derivatives are committed, so serving or deploying the site still requires no build step.

`js/motion.js` and `css/motion.css` add period-specific atmosphere, one-time artwork and heading reveals, mobile dialog entrances, and native page fades where supported. Firelight, stained light, theatrical illumination, mist, garden light, and geometric planes follow each chapter’s visual language; Neoclassicism and Realism use restrained daylight. The decorative layers sit behind the content, and the artwork remains unchanged.

The motion control appears on the homepage and chapters. Its preference stays in local storage and follows navigation; system reduced-motion preferences take priority and update immediately. Ambient animation pauses outside the viewport, behind dialogs, and when the tab is hidden. Pointer response is limited to mouse devices, phone depth movement is capped at six pixels, and JavaScript schedules frames only for input events. No animation library, video assets, additional image downloads, or continuous JavaScript animation loop is used.

Run `node scripts/smoke-motion.cjs` to verify actual movement, pause/resume, off-screen and dialog suspension, preference persistence, live reduced-motion changes, browser back navigation, desktop pointer response, and controls when storage is unavailable.
