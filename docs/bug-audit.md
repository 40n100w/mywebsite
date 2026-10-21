# Site bug audit

Audited the homepage, all twelve chapters, five reference pages, and the missing-page screen against repository revision `7671d42`. The existing happy-path checks passed, so this pass focused on failure cases, offline use, stored state, deployment paths, and accessibility. The fixes below accompany this audit.

## Findings and fixes

| Priority | Problem | Result |
| --- | --- | --- |
| High | Service-worker activation deleted every other cache on the origin, including caches belonging to unrelated apps. | Cache names now include deployment scope. Cleanup only removes older versions in that scope. Tests preserve another app’s cache and another Art Compass deployment’s cache. |
| High | Opening an unvisited period offline returned the homepage under the chapter URL. | Navigation falls back to the cached chapter shell while preserving the requested period. Unknown routes return the missing-page screen. |
| Medium | HTTP server errors bypassed cached content even when a usable copy existed. | Cached responses now cover HTTP 5xx failures as well as lost connections. |
| Medium | The image viewer showed a broken image offline when only the responsive preview had been cached. Failed loads had no useful recovery message, and clicks on dialog padding dismissed it. | All artwork entrances share a viewer with preview fallback, explicit loading/error states, and dismissal only from the actual backdrop or close controls. Loading hides the previous image and disables zoom until an image is ready. |
| Medium | Duplicate or unknown saved chapter IDs inflated completion counts; another tab’s changes left the displayed count stale. | Counts include only unique valid periods and refresh on storage changes and restored page visits. Storage-denied mode continues to allow reading. |
| Medium | Sources and Glossary displayed zero entries without JavaScript, despite the explorer directing those visitors to these pages. | Generated HTML includes all 36 work references, contextual references, seven image credits, and twelve glossary definitions. Validation detects stale generated pages. |
| Medium | A nested missing URL resolved both the stylesheet and return link inside the missing directory. | The 404 page carries its own styles and routes readers back to the root or `/mywebsite/` index. The small script is restricted by a checked CSP hash. |
| Medium | At 200% text size on a 390-pixel viewport, all twelve chapters overflowed horizontally; some headings were clipped. | Headers and text can wrap within available space. All nineteen pages pass enlarged-text layout checks on phone and desktop viewports. |

## Verification

- Static validation, generated-reference freshness, CSP hash checks, and whitespace checks pass.
- The browser suite passes 52 homepage/chapter viewport checks, including all visual studies, saved progress, image dialogs, navigation, and offline reading.
- Mobile touch journeys pass at 320, 390, and 430 pixels, including zoom, focus restoration, responsive images, and reference pages.
- Motion, pause/resume, reduced-motion preferences, background suspension, browser-back navigation, and storage fallbacks pass.
- All twelve reading routes, comparison viewing, 36 source references, and a complete comparison → work → source → work journey pass.
- The new regression suite passes cache isolation, offline chapters and previews, HTTP errors, root/project 404 recovery, malformed progress, cross-tab updates, failed image loads, script-disabled references, denied storage, and 38 enlarged-text layouts.
- A rendered crawl checked 958 internal links across nineteen pages, with no missing destinations, duplicate IDs, or unresolved accessibility references.
- Automated WCAG 2 A/AA, 2.1 AA, and 2.2 AA audits found no violations across desktop, narrow phone, and landscape views. Enlarged-text overflow was checked separately and fixed.

## Limits and maintenance

Browser checks used Chromium, including touch emulation. Physical iOS/Safari, Firefox, assistive-technology sessions, and the eventual production deployment have not been tested in this pass. Automated accessibility checks do not constitute a full manual accessibility review.

Offline text navigation works once the app shell is installed. Offline artwork depends on images previously loaded; the viewer can use a cached preview when the original is unavailable. Legacy caches without a deployment namespace are left alone because their ownership cannot be established safely.

The reference-page generator and regression suite are documented in the README. The current GitHub workflow runs static validation, including generated-page freshness; browser suites require the prepared environment or another installation of Playwright and Chromium.
