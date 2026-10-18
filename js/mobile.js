/* Phone navigation uses native dialogs, real links, and the existing chapter data. */
(() => {
  const phone = matchMedia('(max-width: 760px)');
  const era = document.body.dataset.era;
  const responsiveDetails = [...document.querySelectorAll('.responsive-details')];
  const sheets = [];
  const syncLayout = () => {
    responsiveDetails.forEach(details => { details.open = !phone.matches; });
    if (!phone.matches) sheets.forEach(sheet => sheet.close());
  };
  syncLayout();
  phone.addEventListener('change', syncLayout);

  // A magnified image scrolls in its own viewport; the close control stays reachable.
  const viewer = document.getElementById('image-viewer');
  if (viewer) {
    const zoom = document.getElementById('viewer-zoom');
    const stage = document.querySelector('.viewer-image-stage');
    const resetZoom = () => {
      viewer.classList.remove('is-zoomed');
      zoom.setAttribute('aria-pressed', 'false');
      zoom.textContent = 'Zoom in';
      stage.scrollTo(0, 0);
    };
    zoom.addEventListener('click', () => {
      const enlarged = viewer.classList.toggle('is-zoomed');
      zoom.setAttribute('aria-pressed', String(enlarged));
      zoom.textContent = enlarged ? 'Fit image' : 'Zoom in';
      stage.scrollTo(0, 0);
    });
    viewer.addEventListener('close', resetZoom);
  }
  if (!era) return;

  const design = window.eraDesigns[era];
  const icons = {
    periods: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    contents: '<path d="M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01"/>',
    next: '<path d="M4 12h16m-6-6 6 6-6 6"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  const createSheet = (id, title, content) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'mobile-sheet';
    dialog.id = id;
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.innerHTML = `<div class="sheet-heading"><div><p>${design.name}</p><h2 id="${id}-title">${title}</h2></div><button type="button" class="sheet-close" aria-label="Close ${title.toLowerCase()}">Close ×</button></div>${content}`;
    document.body.append(dialog);
    dialog.querySelector('.sheet-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        if (event.clientY < rect.top || event.clientY > rect.bottom || event.clientX < rect.left || event.clientX > rect.right) dialog.close();
      }
      const link = event.target.closest('a');
      if (!link) return;
      dialog.close();
      if (link.hash && link.pathname === location.pathname && link.search === location.search) {
        const target = document.getElementById(link.hash.slice(1));
        if (target) {
          target.tabIndex = -1;
          requestAnimationFrame(() => target.focus({preventScroll: true}));
        }
      }
    });
    sheets.push(dialog);
    return dialog;
  };
  const periods = createSheet('mobile-periods', 'Choose a period', `<nav aria-label="Art periods">${Object.entries(window.eraDesigns).map(([id, item], i) => `<a href="explore.html?era=${id}"${id === era ? ' aria-current="page"' : ''}><span class="sheet-number">${String(i + 1).padStart(2, '0')}</span><span>${item.name}<small>${item.date}</small></span>${id === era ? '<span class="sheet-current">Here</span>' : ''}</a>`).join('')}</nav><a class="sheet-home" href="./">Back to the visual index</a>`);
  const acts = [...document.querySelectorAll('.story-act')];
  acts.forEach((act, i) => { if (!act.id) act.id = `chapter-act-${i + 1}`; });
  const contents = createSheet('mobile-contents', 'In this chapter', `<nav aria-label="Chapter sections"><a href="#title"><span class="sheet-number">↑</span><span>The opening</span></a>${acts.map((act, i) => `<a href="#${act.id}"><span class="sheet-number">${String(i + 1).padStart(2, '0')}</span><span>${act.dataset.act.split(' · ')[1]}</span></a>`).join('')}<a href="#synthesis"><span class="sheet-number">✓</span><span>Takeaways &amp; reading progress</span></a><a href="#sources"><span class="sheet-number">↗</span><span>Sources &amp; further study</span></a></nav>`);
  const next = document.getElementById('next');
  const dock = document.createElement('nav');
  dock.className = 'mobile-dock';
  dock.setAttribute('aria-label', 'Reading navigation');
  dock.innerHTML = `<button type="button" data-sheet="mobile-periods" aria-haspopup="dialog" aria-controls="mobile-periods">${icon('periods')}<span>Periods</span></button><button type="button" data-sheet="mobile-contents" aria-haspopup="dialog" aria-controls="mobile-contents">${icon('contents')}<span>Contents</span></button><a href="${next.getAttribute('href')}" aria-label="Next period: ${next.textContent.replace(' →', '')}">${icon('next')}<span>${era === 'contemporary' ? 'Start again' : 'Next era'}</span></a>`;
  document.body.append(dock);
  document.body.classList.add('has-mobile-navigation');
  dock.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    const sheet = button.dataset.sheet === 'mobile-periods' ? periods : contents;
    sheet.showModal();
    sheet.scrollTop = 0;
  }));

  // Highlight the section at the reading position without moving focus or announcing scroll.
  const links = [...contents.querySelectorAll('a[href^="#"]')];
  const observed = [document.querySelector('.explore-hero'), ...acts, document.getElementById('synthesis'), document.getElementById('sources')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.classList.contains('explore-hero') ? 'title' : entry.target.id;
      links.forEach(link => {
        if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin: '-10% 0px -70% 0px', threshold: 0});
  observed.filter(Boolean).forEach(section => observer.observe(section));
})();
