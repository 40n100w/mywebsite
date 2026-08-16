const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const progressBar = document.getElementById('progress-bar');
const currentEra = document.getElementById('current-era');

// Treat #top as a UI action rather than a deep link. Normalize it immediately
// so a restored scroll position cannot produce a visible smooth-scroll jump.
if (window.location.hash === '#top') {
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    closeMenu();
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const eraObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) currentEra.textContent = entry.target.dataset.era; });
}, { rootMargin: '-45% 0px -45% 0px' });
document.querySelectorAll('[data-era]').forEach((section) => eraObserver.observe(section));

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const progress = scrollable > 0 ? scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
document.getElementById('year').textContent = new Date().getFullYear();
