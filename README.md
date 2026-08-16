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
- Persistent reading progress and current-era indicator
- Full period index for non-linear exploration
- Dates, defining characteristics, historical context, landmark works, and artists
- Political, social, economic, and military impact analysis
- Architecture, furniture, decorative design, and graphic-design context
- Responsive layout and reduced-motion support

## Notes

The chapter images are original, historically inspired editorial interpretations rather than reproductions of existing artworks. CSS provides the surrounding period-specific visual system. The site uses Google Fonts with robust local fallbacks.
