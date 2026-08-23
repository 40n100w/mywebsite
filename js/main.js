const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const progressBar = document.getElementById('progress-bar');
const currentEra = document.getElementById('current-era');

const periodDetails = {
  prehistoric: ['Symbol-making grew beside language, ritual, and communal memory. Images helped early communities teach, mark identity, understand animals, and connect daily life with unseen forces.', 'Lascaux Cave Paintings — c. 17,000 BCE|Venus of Willendorf — c. 25,000 BCE|Chauvet Cave Paintings — c. 30,000 BCE'],
  ancient: ['Agriculture created cities, writing, organized religion, and powerful states. Rulers and communities used durable art to embody divine order, civic identity, and life beyond death.', 'Bust of Nefertiti — c. 1345 BCE|The Parthenon — 447–432 BCE|Augustus of Prima Porta — early 1st century CE'],
  medieval: ['As Rome fragmented and Christianity spread through Europe, monasteries and churches became centers of learning and patronage. Art prioritized spiritual truth over optical realism.', 'Book of Kells — c. 800|Bayeux Tapestry — c. 1070s|Chartres Cathedral — begun 1194'],
  renaissance: ['Growing cities, trade, classical scholarship, and wealthy patrons fueled a new humanism. Artists joined close observation with rediscovered Greek and Roman ideas.', 'The Birth of Venus — Botticelli, c. 1485|Mona Lisa — Leonardo, c. 1503–19|David — Michelangelo, 1501–04'],
  baroque: ['Religious conflict, global empires, and absolute monarchies demanded persuasive spectacle. Art became immediate and emotional—designed to move viewers rather than calmly instruct them.', 'The Calling of St Matthew — Caravaggio, 1599–1600|David — Bernini, 1623–24|Judith Slaying Holofernes — Artemisia Gentileschi, c. 1612–13'],
  neoclassicism: ['Archaeological discoveries at Pompeii met Enlightenment faith in reason and republican virtue. The classical past offered a visual language for a rapidly changing political world.', 'Oath of the Horatii — Jacques-Louis David, 1784|Cornelia, Mother of the Gracchi — Angelica Kauffman, c. 1785|George Washington — Horatio Greenough, 1840'],
  romanticism: ['Industrialization, revolution, and rationalism transformed society but also provoked resistance. Artists reclaimed emotion, imagination, national identity, and nature’s overwhelming power.', 'The Third of May 1808 — Goya, 1814|Wanderer above the Sea of Fog — Friedrich, c. 1818|The Slave Ship — J. M. W. Turner, 1840'],
  realism: ['Revolution, industrial labor, urban poverty, and photography made idealized history painting feel remote. Artists turned to contemporary life and people excluded from grand art.', 'The Stone Breakers — Courbet, 1849|The Gleaners — Jean-François Millet, 1857|The Horse Fair — Rosa Bonheur, 1852–55'],
  impressionism: ['Railways, rebuilt Paris, leisure culture, photography, portable paint, and new color science changed how artists saw. Independent exhibitions offered a route around the official Salon.', 'Impression, Sunrise — Monet, 1872|The Cradle — Berthe Morisot, 1872|The Ballet Class — Edgar Degas, 1874'],
  'post-impressionism': ['A younger generation found Impressionism’s fleeting vision too limited. They pushed toward structure, symbolism, scientific color, and personal emotion—opening paths into modern art.', 'A Sunday on La Grande Jatte — Seurat, 1884–86|The Starry Night — Van Gogh, 1889|Mont Sainte-Victoire — Cézanne, c. 1902–06'],
  modernism: ['Photography, mass media, machines, world wars, psychoanalysis, and rapid urban change shattered inherited certainties. Artists rebuilt visual language from its basic parts.', 'Les Demoiselles d’Avignon — Picasso, 1907|Composition VIII — Kandinsky, 1923|The Two Fridas — Frida Kahlo, 1939'],
  contemporary: ['Postwar globalization, civil-rights movements, feminism, decolonization, consumer culture, and digital technology displaced any single center. Medium and identity became open questions.', 'Untitled — Jean-Michel Basquiat, 1982|Infinity Mirror Rooms — Yayoi Kusama, 1965–present|A Subtlety — Kara Walker, 2014']
};

Object.entries(periodDetails).forEach(([id, [why, works]]) => {
  const copy = document.querySelector(`#${id} .era-copy`);
  const facts = copy?.querySelector('dl');
  if (!copy || !facts) return;
  const context = document.createElement('div');
  context.className = 'era-context';
  context.innerHTML = `<div><h3>Why it emerged</h3><p>${why}</p></div><div><h3>Works to know</h3><ul>${works.split('|').map((work) => `<li>${work}</li>`).join('')}</ul></div>`;
  copy.insertBefore(context, facts);
  const exploreLink = document.createElement('a');
  exploreLink.className = 'explore-link';
  exploreLink.href = `explore.html?era=${id}`;
  exploreLink.innerHTML = `Explore ${copy.closest('.era').dataset.era} <span>→</span>`;
  copy.insertBefore(exploreLink, facts);
});

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
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js');
