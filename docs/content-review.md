# Content and reading-flow review

This pass covers the twelve chapters and 36 featured entries, the homepage reading guidance, and source presentation. The period-specific visual environments remain the setting for a clearer reading sequence.

## Reading structure

Each chapter opens with a question and a short scope note. Six sections follow: look at the works; read the visual language; place it in context; explore the ideas; follow it into daily life and design; compare and reflect. Section headings and transitions are written for the individual period. Contents, progress, and mobile navigation use the same route.

Repeated lists of historical causes and consequences have become three connections to the featured works. Contextual texts sit beside interpretive questions, with archaeological evidence replacing anachronistic books in the prehistoric chapter. Comparisons use selected pairs rather than automatically selecting the previous period’s last work. Reflection returns to the opening question. Chapters close with three takeaways and optional reading progress.

## Editorial changes

- Separate observable form from proposed meaning, especially for prehistoric objects.
- Treat movements as overlapping and internally varied. Remove claims that a later style had to replace an earlier one.
- Explain the limited geographic and chronological scope of each selection.
- Connect social and political context to particular patrons, sites, exhibitions, and works.
- Identify Gentileschi’s Judith entry as the Uffizi version, c. 1620. Describe the Basquiat entry as a body of early-1980s paintings and the Cézanne entry as late mountain paintings, since the existing study images and references do not establish one specific original.
- Replace generic scale silhouettes with written notes about size and setting.
- Close-looking prompts concern original works. Following the presentation update, image captions use titles and descriptive alt text without AI-generation labels; reproduction credits and source records remain available.
- Provide individual source anchors, copyable reference addresses, version notes, image provenance, and return links to the works.

## Research limits

This is an editorial and internal-consistency review, not specialist peer review. Museum and heritage references already held in the repository were retained. Attempts to retrieve external collection pages during this pass were blocked by the environment’s network proxy (HTTP 403); their current availability and record details were not independently verified live. The public review-status page continues to state that historian review is outstanding.

Generated studies still stand in for many featured originals. They support the visual presentation but remain a substantial limit on close analysis. Future image work should prioritize documented reproductions tied to the precise work or version discussed.

## Checks

Use `scripts/validate.sh` for syntax and local resources, `scripts/smoke-browser.cjs` for all chapter layouts and learning controls, `scripts/smoke-mobile.cjs` for touch journeys, and `scripts/smoke-motion.cjs` for movement and reduced-motion behavior. `scripts/smoke-content.cjs` checks the six-section journeys, comparisons, mobile contents, and all 36 source references. These browser checks require the local HTTP server, Playwright, and Chromium described in the README.

Validation completed for this pass:

- Static validation and whitespace checks passed.
- All 52 homepage/chapter viewport checks passed, including cached offline reading.
- Mobile touch journeys at 320, 390, and 430 pixels, image delivery, viewer controls, and reference pages passed.
- Motion, pause, reduced-motion preferences, navigation, and storage fallbacks passed.
- All twelve reading routes, 36 source references, and a cross-period source-return journey passed.
- Automated WCAG A/AA audits found no violations across 26 homepage/chapter audits and nine final chapter/reference-page audits. These do not replace manual accessibility or physical-device testing.
- Four sampled chapters at 390 pixels required roughly 15% less vertical scrolling after the restructure. This measurement includes layout and disclosure changes; it is not a claim that all text was reduced by the same amount.
