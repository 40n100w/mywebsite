/* Render one chapter from its shared records and editorial reading guide. */
const periods = window.periods;
const workImages = window.periodWorkSlugs;
const params = new URLSearchParams(location.search);
let index = periods.findIndex(period => period.id === params.get('era'));
if (index < 0) index = 0;
const p = periods[index];
const story = window.periodStories[p.id];
const guide = window.chapterGuides[p.id];
const experience = window.experienceData[p.id];
const resources = window.periodResources[p.id];
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const workInfo = slug => {
  const period = periods.find(item => workImages[item.id].includes(slug));
  const [title, maker, reading] = period.works[workImages[period.id].indexOf(slug)].split('|');
  const media = window.artworkMedia?.[slug];
  return {slug, period, title, maker, reading, media, record:window.workRecords[slug], src:media?.path || `assets/works/${slug}.jpg`, type:media ? 'Artwork reproduction' : '', alt:`${media ? 'Reproduction of' : 'Illustration inspired by'} ${title}`};
};
const imageButton = (work, sizes, className = '') => `<button class="image-open" type="button" data-image="${escapeHTML(work.src)}" data-alt="${escapeHTML(work.alt)}" data-caption="${escapeHTML([work.title, work.maker, work.type].filter(Boolean).join(' · '))}" aria-label="Open a larger view of ${escapeHTML(work.title)}"><img class="${className}" ${window.responsiveImageAttributes(work.src, sizes)} alt="${escapeHTML(work.alt)}" loading="lazy" decoding="async"><i>Open full image</i></button>`;

document.body.dataset.era = p.id;
document.title = `${p.name} — Art Compass`;
document.documentElement.style.setProperty('--accent', ['#b7442a','#d7a63f','#e7c654','#d9d0b8','#8b151b','#c7b88e','#566d61','#9c8661','#a7c9df','#e9bd24','#e32822','#dcff44'][index]);
$('chapter').textContent = `Chapter ${String(index + 1).padStart(2, '0')} · ${p.date}`;
$('title').textContent = p.name;
$('summary').textContent = p.summary;
$('back-link').href = `./#${p.id}`;
$('chapter-question').textContent = guide.question;
$('chapter-scope').textContent = guide.scope;
$('works-intro').textContent = guide.focus;
$('story-world').textContent = story.world;
$('story-seeing').textContent = story.seeing;
$('story-legacy').textContent = story.legacy;
$('story-transition').textContent = story.transition;
$('reflection-prompt').textContent = guide.question;
window.chapterSections.forEach(([id, key, label], position) => {
  $(id).dataset.act = `${String(position + 1).padStart(2, '0')} · ${label}`;
  $(`${key}-heading`).textContent = guide.headings[position];
  if (guide.bridges[position]) {
    const [nextId, , nextLabel] = window.chapterSections[position + 1];
    $(id).insertAdjacentHTML('beforeend', `<p class="section-bridge"><span>${escapeHTML(guide.bridges[position])}</span><a href="#${nextId}">${escapeHTML(nextLabel)} <span aria-hidden="true">→</span></a></p>`);
  }
});
$('chapter-contents').innerHTML = window.chapterSections.map(([id, , label], position) => `<a href="#${id}"><span aria-hidden="true">${String(position + 1).padStart(2, '0')}</span>${label}</a>`).join('');
$('glossary-jump').innerHTML = `Useful terms: ${window.eraGlossary[p.id].map(term => `<a href="glossary.html#term-${term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}">${escapeHTML(term)}</a>`).join(' · ')}`;
$('visual-dna').innerHTML = experience.dna.map(cue => `<span>${escapeHTML(cue)}</span>`).join('');
$('time-now').textContent = `${p.name} · ${p.date}`;
$('time-stops').innerHTML = periods.map((period, position) => `<a href="explore.html?era=${period.id}" aria-label="${escapeHTML(`${period.name}, ${period.date}`)}" ${position === index ? 'aria-current="page"' : ''}><i>${String(position + 1).padStart(2, '0')}</i><span>${escapeHTML(period.name)}</span><small>${escapeHTML(period.date)}</small></a>`).join('');

$('works').innerHTML = workImages[p.id].map((slug, position) => {
  const work = workInfo(slug);
  const credit = work.media ? `${work.media.license} · Image: ${work.media.artist}` : '';
  const metadata = [work.record.medium, work.record.dimensions, work.record.location, work.record.versionNote].filter(Boolean);
  return `<article class="work-row" id="work-${slug}"><span>${String(position + 1).padStart(2, '0')}</span><figure class="work-study">${imageButton(work, '(max-width: 760px) calc(100vw - 40px), 45vw', 'work-image')}${credit ? `<figcaption><b>${work.type}</b><span>${escapeHTML(credit)}</span></figcaption>` : ''}</figure><div class="work-title"><h3>${escapeHTML(work.title)}<small>${escapeHTML(work.maker)}</small></h3><details class="responsive-details object-details" open><summary>Object and reference details</summary><ul class="object-meta">${metadata.map(value => `<li>${escapeHTML(value)}</li>`).join('')}</ul></details></div><div class="work-reading"><b class="work-role">${escapeHTML(story.roles[position])}</b><h4>Look, then consider</h4><p>${escapeHTML(work.reading)}</p><details class="looking-reveal"><summary>Two cues for looking at the original</summary><ul class="notice-list">${work.record.notice.map(cue => `<li>${escapeHTML(cue)}</li>`).join('')}</ul></details><span class="collection-link"><a href="sources.html#source-${slug}">Source: ${escapeHTML(work.record.source[1])}</a></span></div></article>`;
}).join('');
$('works').insertAdjacentHTML('afterend', `<aside class="scale-study"><p class="overline">What a screen changes</p><h3>${escapeHTML(experience.scale[0])}</h3><b>${escapeHTML(experience.scale[1])}</b><p>${escapeHTML(experience.scale[2].replace(/[.!?]$/, ''))}. Consider how the original size or setting changes the encounter.</p></aside>`);

$('exchange-list').innerHTML = window.periodContext[p.id].map(([title, context, connection]) => `<article class="context-case"><h4>${escapeHTML(title)}</h4><p>${escapeHTML(context)}</p><p>${escapeHTML(connection)}</p></article>`).join('');
$('parallel-worlds').innerHTML = window.parallelWorlds[p.id].map(([title, text]) => `<article><h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p></article>`).join('');
$('exchange-route').innerHTML = `<b>${escapeHTML(experience.route[0])}</b>${escapeHTML(experience.route[1])}`;
const coreLabel = p.id === 'prehistoric' ? 'Featured sites' : 'Selected centers and traditions';
const influenceLabel = p.id === 'prehistoric' ? 'Other prehistoric traditions' : 'Exchange and reception';
$('map-core-label').textContent = coreLabel;
$('map-influence-label').textContent = influenceLabel;
const projectPoint = ([longitude, latitude]) => [(longitude + 180) / 360 * 1000, (90 - latitude) / 180 * 500];
const ringPath = ring => ring.map((point, position) => { const [x, y] = projectPoint(point); return `${position ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`; }).join('') + 'Z';
const geometryPath = geometry => geometry.type === 'Polygon' ? geometry.coordinates.map(ringPath).join('') : geometry.coordinates.map(polygon => polygon.map(ringPath).join('')).join('');
Promise.resolve(window.worldMapData).then(world => {
  const core = new Set(resources.core);
  const influence = resources.influence === 'all' ? null : new Set(resources.influence);
  world.features.forEach(feature => {
    const code = feature.properties.ADM0_A3;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', geometryPath(feature.geometry));
    path.setAttribute('class', core.has(code) ? 'map-core' : resources.influence === 'all' || influence.has(code) ? 'map-influence' : 'map-land');
    path.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'title')).textContent = feature.properties.ADMIN;
    $('map-countries').appendChild(path);
  });
  const namesFor = set => world.features.filter(feature => set.has(feature.properties.ADM0_A3)).map(feature => feature.properties.ADMIN).sort().join(', ');
  $('map-regions').innerHTML = `<p><b>${coreLabel}:</b> ${escapeHTML(namesFor(core))}</p><p><b>${influenceLabel}:</b> ${resources.influence === 'all' ? 'Globally networked; emphasis varies by institution, market, and local history.' : escapeHTML(namesFor(influence))}</p>`;
}).catch(() => { $('map-countries').innerHTML = '<text x="500" y="250" text-anchor="middle">Map unavailable</text>'; });
$('map-title').textContent = `World context for ${p.name}`;
$('map-description').textContent = `${coreLabel} and ${influenceLabel.toLowerCase()} within the chapter’s wider geography. Modern country borders provide orientation, not historical boundaries.`;
$('map-note').textContent = `${resources.note} Modern borders are used for orientation; the highlights do not describe uniform participation within a country.`;

$('ideas-label').textContent = p.id === 'prehistoric' ? 'Evidence and interpretation' : 'Texts and questions';
$('ideas-intro').textContent = p.id === 'prehistoric' ? 'No written explanation survives from the makers of these featured works. The following kinds of evidence help frame questions and identify limits.' : 'Read these texts alongside the artworks for context and contrasting arguments. Their inclusion does not establish direct influence on every featured artist.';
const idea = window.periodIdeas[p.id];
$('idea-study').innerHTML = `<div><p class="overline">An idea to consider</p><h3>${escapeHTML(idea[0])}</h3><p>${escapeHTML(idea[1])}</p></div>${p.id === 'ancient' ? '<figure class="forms-study" aria-label="A drawn circle compared with the concept of a mathematically perfect circle"><div><i class="drawn-circle"></i><b>The drawn circle</b><span>A material example</span></div><em aria-hidden="true">→</em><div><i class="ideal-circle"></i><b>The ideal circle</b><span>A concept grasped through reason</span></div><figcaption>A teaching analogy for ideal form, not an explanation of every ancient image.</figcaption></figure>' : ''}`;
$('books-list').innerHTML = resources.books.map(([title, meta, why], position) => `<article class="book-row"><span>${String(position + 1).padStart(2, '0')}</span><h3>${escapeHTML(title)}<small>${escapeHTML(meta)}</small></h3><p>${escapeHTML(why)}</p></article>`).join('');

for (const kind of ['architecture', 'design']) {
  window.setResponsiveImage($(`${kind}-image`), `assets/explore/${p.id}-${kind}.jpg`, '(max-width: 760px) calc(100vw - 40px), 40vw');
  $(`${kind}-image`).alt = `${kind === 'architecture' ? 'Architectural' : 'Design'} illustration inspired by ${p.name}`;
}
$('design-notes').innerHTML = p.design.map(item => { const [title, text] = item.split('|'); return `<article><h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p></article>`; }).join('');

const previous = periods[(index - 1 + periods.length) % periods.length];
const next = periods[(index + 1) % periods.length];
$('previous').href = `explore.html?era=${previous.id}`;
$('previous').textContent = `← ${previous.name}`;
$('next').href = `explore.html?era=${next.id}`;
$('next').textContent = `${next.name} →`;
$('next-reading-title').textContent = p.id === 'contemporary' ? 'Keep exploring' : `Next: ${next.name}`;
$('next-reading').href = p.id === 'contemporary' ? './#chapters' : `explore.html?era=${next.id}`;
$('next-reading').textContent = p.id === 'contemporary' ? 'Return to the visual index →' : `Read ${next.name} →`;
const compareFigure = slug => {
  const work = workInfo(slug);
  return `<figure>${imageButton(work, '(max-width: 760px) 40vw, 28vw')}<figcaption><b>${escapeHTML(work.title)}</b><small>${escapeHTML(work.maker)}</small>${work.type ? `<span>${work.type}</span>` : ''}${work.media ? `<span>${escapeHTML(work.media.license)} · ${escapeHTML(work.media.artist)}</span>` : ''}<a href="explore.html?era=${work.period.id}#work-${slug}">Work and context <span aria-hidden="true">↗</span></a></figcaption></figure>`;
};
$('era-compare').innerHTML = `<p class="comparison-question">${escapeHTML(guide.comparison.question)}</p><div class="compare-images">${compareFigure(guide.comparison.slugs[0])}<i aria-hidden="true">↔</i>${compareFigure(guide.comparison.slugs[1])}</div><p class="comparison-note">${escapeHTML(guide.comparison.note)}</p>`;
$('era-sources').innerHTML = workImages[p.id].map(slug => { const work = workInfo(slug); return `<li><div><a href="sources.html#source-${slug}"><b>${escapeHTML(work.title)}</b></a><span>${escapeHTML(work.record.source[1])} · reference details</span></div></li>`; }).join('');

const viewer = $('image-viewer');
$('content').addEventListener('click', event => {
  const button = event.target.closest('.image-open');
  if (!button) return;
  $('viewer-image').src = button.dataset.image;
  $('viewer-image').alt = button.dataset.alt;
  $('viewer-caption').textContent = button.dataset.caption;
  viewer.showModal();
});
$('viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
const study = window.studyData[p.id];
$('takeaways').innerHTML = study.takeaways.map(item => `<li>${escapeHTML(item)}</li>`).join('');
const progressKey = 'art-compass-progress';
const getProgress = () => { try { const saved = JSON.parse(localStorage.getItem(progressKey) || '[]'); return Array.isArray(saved) ? saved : []; } catch { return []; } };
const showProgress = () => {
  const done = getProgress();
  $('progress-status').textContent = `${done.length} of ${periods.length} chapters marked complete. Progress stays only on this device.`;
  $('mark-complete').textContent = done.includes(p.id) ? 'Chapter complete ✓' : 'Mark chapter complete';
};
$('mark-complete').addEventListener('click', () => {
  const done = new Set(getProgress());
  done.add(p.id);
  try { localStorage.setItem(progressKey, JSON.stringify([...done])); showProgress(); }
  catch { $('progress-status').textContent = 'Progress storage is unavailable in this browser mode.'; }
});
showProgress();
const acts = [...document.querySelectorAll('.story-act')];
const actObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) $('time-now').textContent = `${p.name} · Section ${acts.indexOf(entry.target) + 1} of ${acts.length}`;
}), {rootMargin:'-35% 0px -55%', threshold:0});
acts.forEach(act => actObserver.observe(act));
document.addEventListener('DOMContentLoaded', () => {
  let words = 0;
  document.querySelectorAll('.story-act, .learning-lab').forEach(section => {
    const copy = section.cloneNode(true);
    copy.querySelectorAll('svg, nav, button, details, .section-bridge').forEach(element => element.remove());
    words += copy.textContent.trim().split(/\s+/).length;
  });
  $('reading-length').textContent = `Six sections · About ${Math.ceil(words / 200)} minutes of reading, plus time to look`;
}, {once:true});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js');
