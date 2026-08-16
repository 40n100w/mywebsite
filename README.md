# Northline Studio

A handcrafted, responsive static portfolio website for an independent digital studio. Built with semantic HTML, modern CSS, and a small amount of vanilla JavaScript—no framework or build step required.

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

## Customize

- Replace the studio name and copy in `index.html`.
- Update `hello@northline.studio` to a working email address.
- Adjust the color variables at the top of `css/styles.css`.
- Replace the placeholder social profile links in the footer.

## Notes

The site uses Google Fonts with robust local fallbacks. If visitors are offline or Google Fonts is unavailable, the layout remains functional using system fonts.
