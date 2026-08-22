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
- Dedicated explorer view for every period with 36 total original images
- 36 standalone artist and maker studies explaining what each featured work contributed to its period
- Persistent reading progress and current-era indicator
- Full period index for non-linear exploration
- Dates, defining characteristics, historical context, landmark works, and artists
- Political, social, economic, and military impact analysis
- Two-way historical analysis across belief, culture, economics, power, and technology: what shaped each period and what its art changed in return
- Key literary, philosophical, religious, and oral works that shaped each period’s thinking
- Local, privacy-safe world maps showing representative centers and wider zones of influence or exchange
- Architecture, furniture, decorative design, and graphic-design context
- Responsive layout and reduced-motion support

## Notes

The chapter images are AI-generated, historically inspired editorial interpretations rather than reproductions of existing artworks. They are illustrative and should not be treated as primary sources or exact reconstructions of historical objects, people, or places.

Historical dates and interpretations are provided for general educational use. Visitors should consult museum, archive, or scholarly sources before relying on the site for academic research.

World boundaries are derived from the public-domain [Natural Earth](https://www.naturalearthdata.com/) 1:110m dataset. Modern national boundaries are used only as geographic orientation for historical regions and do not imply that present-day states existed during the period shown.

## Privacy and security

- The site has no analytics, advertising, cookies, forms, accounts, or user tracking.
- It does not collect, transmit, or store visitor information.
- Fonts and all other assets are served from the repository; the site makes no third-party requests.
- A restrictive Content Security Policy limits the resources that pages can load.

Never commit credentials, private keys, personal information, or environment files. The included `.gitignore` blocks common local and secret-bearing files, but contributors should still review staged changes before publishing.
