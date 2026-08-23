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
- Twelve individually art-directed explorer themes, each using the visual language of its period while sharing an accessible content system
- A navigable time rail, period-specific 3D hero portals, pointer parallax, and scroll-depth transitions with reduced-motion fallbacks
- A period-specific eight-act narrative that moves from historical setting and intellectual catalyst through visual breakthroughs, makers, cultural consequences, legacy, and transition
- Era-level museum and heritage sources, reflection prompts, a public glossary, accessible map text, and a visible motion control

## Notes

The works-and-makers sections combine licensed reproductions with AI-generated studies where reusable imagery is unavailable or uncertain. Reproductions display their image license, creator credit, and provenance link. Chapter, architecture, design, and any explicitly labeled study images are AI-generated editorial interpretations rather than documentary evidence.

Historical dates and interpretations are provided for general educational use. Visitors should consult museum, archive, or scholarly sources before relying on the site for academic research.

World boundaries are derived from the public-domain [Natural Earth](https://www.naturalearthdata.com/) 1:110m dataset. Modern national boundaries are used only as geographic orientation for historical regions and do not imply that present-day states existed during the period shown.

## Privacy and security

- The site has no analytics, advertising, cookies, forms, accounts, or user tracking.
- It does not collect, transmit, or store visitor information.
- Fonts and all other assets are served from the repository; the site makes no third-party requests.
- A restrictive Content Security Policy limits the resources that pages can load.

Never commit credentials, private keys, personal information, or environment files. The included `.gitignore` blocks common local and secret-bearing files, but contributors should still review staged changes before publishing.

## Editorial and rights information

- `about.html` explains the project’s method, generated imagery, geographic framework, and limitations.
- `sources.html` collects museum and cultural-heritage sources used by the era pages.
- `glossary.html` defines recurring visual concepts.
- `corrections.html` describes the public correction process without adding a tracking form.
- `NOTICE.md` records current rights and third-party attribution. Creative Commons terms apply to the individual files identified in `js/artwork-media.js`; no broader open license is granted unless a separate license is added later.
- `scripts/fetch-open-art.mjs` rebuilds the licensed-image candidate records and can download verified reproductions for offline use.

Run `sh scripts/validate.sh` before publishing. The same validation runs automatically through GitHub Actions.
