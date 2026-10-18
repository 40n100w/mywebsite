# Responsive image derivatives

These WebP files are resized delivery copies of the corresponding images in `assets/museum/`, `assets/works/`, `assets/explore/`, and `assets/architecture/`. Their source attribution, licenses, and AI-generated labels still apply; see `js/artwork-media.js`, the source folders, and `NOTICE.md`. The original files remain unchanged and are used for full-image viewing.

Regenerate with `node scripts/build-responsive-images.mjs` using ImageMagick 7. Artwork widths are 480 and 960 pixels, capped at the original width; architectural surrounds are 768 pixels wide. Encoding uses WebP quality 82 and preserves transparency. The browser chooses artwork variants according to display size and pixel density.
