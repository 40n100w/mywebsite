/* Small, local effects. Content is visible even if animation is unavailable. */
(() => {
  const body = document.body;
  const root = document.documentElement;
  const button = document.getElementById('motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const phone = matchMedia('(max-width: 760px)');
  const storageKey = 'art-compass-motion';
  let paused = false;
  try { paused = localStorage.getItem(storageKey) === 'paused'; } catch { /* Session-only controls still work. */ }
  let enabled = false;
  let suspended = false;
  let frame = 0;
  const active = new Map();
  const scene = document.querySelector('.explore-hero, .hero');
  const sceneState = {visible: false, top: 0, height: 1, x: 0, y: 0};
  const era = body.dataset.era || 'home';
  const restrained = ['neoclassicism', 'realism'].includes(era);

  function animate(element, frames, options = {}) {
    if (!enabled || suspended || !element?.animate) return;
    active.get(element)?.cancel();
    const animation = element.animate(frames, {duration: restrained ? 500 : 800, easing:'cubic-bezier(.2,.7,.2,1)', ...options});
    active.set(element, animation);
    const forget = () => { if (active.get(element) === animation) active.delete(element); };
    animation.addEventListener('finish', forget, {once:true});
    animation.addEventListener('cancel', forget, {once:true});
  }
  function reveal(element, delay = 0) {
    const x = era === 'modernism' ? -16 : 0;
    const y = restrained ? 6 : era === 'modernism' ? 0 : 18;
    animate(element, [{opacity:.4, transform:`translate(${x}px, ${y}px)`}, {opacity:1, transform:'none'}], {delay});
  }
  function stopTransientMotion() {
    active.forEach(animation => animation.cancel());
    active.clear();
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function sync() {
    enabled = !paused && !preference.matches;
    root.classList.toggle('motion-paused', !enabled);
    body.classList.toggle('motion-paused', !enabled);
    body.classList.toggle('motion-enabled', enabled);
    if (button) {
      button.disabled = preference.matches;
      button.textContent = preference.matches ? 'Motion reduced' : paused ? 'Resume motion' : 'Pause motion';
      button.setAttribute('aria-pressed', String(!enabled));
    }
    if (!enabled) {
      stopTransientMotion();
      scene?.style.removeProperty('--depth-y');
      scene?.style.removeProperty('--light-x');
      scene?.style.removeProperty('--light-y');
    } else requestSceneFrame();
  }
  button?.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(storageKey, paused ? 'paused' : 'running'); } catch { /* No storage dependency. */ }
    sync();
  });
  preference.addEventListener('change', sync);
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      paused = event.newValue === 'paused';
      sync();
    }
  });

  // Only schedule a frame in response to scrolling or pointing; there is no JS animation loop.
  function requestSceneFrame() {
    if (!scene || !enabled || suspended || !sceneState.visible || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const progress = Math.max(0, Math.min(1, (scrollY - sceneState.top) / sceneState.height));
      scene.style.setProperty('--depth-y', `${(progress * (phone.matches ? 6 : restrained ? 5 : 16)).toFixed(2)}px`);
      scene.style.setProperty('--light-x', `${sceneState.x.toFixed(2)}px`);
      scene.style.setProperty('--light-y', `${sceneState.y.toFixed(2)}px`);
    });
  }
  if (scene) {
    scene.classList.add('motion-scene');
    scene.dataset.atmosphere = era;
    const atmosphere = document.createElement('div');
    atmosphere.className = 'era-atmosphere';
    atmosphere.setAttribute('aria-hidden', 'true');
    atmosphere.innerHTML = '<i class="atmosphere-light"></i><i class="atmosphere-echo"></i>';
    if (['prehistoric', 'ancient', 'impressionism'].includes(era)) {
      atmosphere.insertAdjacentHTML('beforeend', '<div class="atmosphere-motes">' + Array.from({length:6}, (_,i) => `<i style="--mote:${i}"></i>`).join('') + '</div>');
    }
    scene.prepend(atmosphere);
    const measure = () => {
      const rect = scene.getBoundingClientRect();
      sceneState.top = rect.top + scrollY;
      sceneState.height = rect.height;
      requestSceneFrame();
    };
    new ResizeObserver(measure).observe(scene);
    new IntersectionObserver(entries => {
      sceneState.visible = entries[0].isIntersecting;
      scene.classList.toggle('scene-visible', sceneState.visible);
      if (sceneState.visible) requestSceneFrame();
      else { cancelAnimationFrame(frame); frame = 0; }
    }).observe(scene);
    scene.addEventListener('pointermove', event => {
      if (!enabled || suspended || !finePointer.matches || event.pointerType !== 'mouse') return;
      sceneState.x = (event.clientX / innerWidth - .5) * 20;
      sceneState.y = (event.clientY / innerHeight - .5) * 12;
      requestSceneFrame();
    }, {passive:true});
    scene.addEventListener('pointerleave', () => { sceneState.x = sceneState.y = 0; requestSceneFrame(); });
    window.addEventListener('scroll', requestSceneFrame, {passive:true});
    window.addEventListener('resize', measure, {passive:true});
    measure();
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      // Do not move a control that has just received keyboard/anchor focus.
      if (!entry.target.contains(document.activeElement)) reveal(entry.target);
    });
  }, {threshold:0, rootMargin:'0px 0px -32px 0px'});
  document.querySelectorAll('.story-act h2, .work-study, .architecture-study, .visual-gallery figure, .chapter-card, .atlas-intro h2, .human-question h2, .learning-lab h2').forEach(element => revealObserver.observe(element));
  document.addEventListener('focusin', event => {
    active.forEach((animation, element) => { if (element.contains(event.target)) animation.cancel(); });
  });

  // Native dialogs keep their focus handling; their entry animation never delays interaction.
  const dialogs = [...document.querySelectorAll('dialog')];
  const updateSuspension = () => {
    suspended = document.hidden || dialogs.some(dialog => dialog.open);
    body.classList.toggle('motion-suspended', suspended);
    if (suspended) stopTransientMotion();
    else requestSceneFrame();
  };
  const dialogObserver = new MutationObserver(records => {
    updateSuspension();
    if (!enabled || document.hidden) return;
    records.forEach(({target:dialog}) => {
      if (!dialog.open || !dialog.animate) return;
      const animation = dialog.animate([
        {opacity:.6, transform:phone.matches && !dialog.classList.contains('image-viewer') ? 'translateY(24px)' : 'translateY(8px)'},
        {opacity:1, transform:'none'}
      ], {duration:240, easing:'cubic-bezier(.2,.7,.2,1)'});
      active.set(dialog, animation);
      animation.addEventListener('finish', () => active.delete(dialog), {once:true});
    });
  });
  dialogs.forEach(dialog => dialogObserver.observe(dialog, {attributes:true, attributeFilter:['open']}));
  document.addEventListener('visibilitychange', updateSuspension);
  window.addEventListener('pageswap', event => {
    if (!enabled) event.viewTransition?.skipTransition();
    stopTransientMotion();
  });
  window.addEventListener('pagereveal', event => { if (!enabled) event.viewTransition?.skipTransition(); });
  window.addEventListener('pageshow', () => { sync(); updateSuspension(); });
  sync();
  updateSuspension();
  document.querySelectorAll('.hero h1, .explore-hero h1, .hero-artwork img, .cover-piece').forEach((element, i) => reveal(element, i * 70));
})();
