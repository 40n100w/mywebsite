/* Chapter art direction and keyboard-operable visual studies. */
(() => {
  const era = document.body.dataset.era;
  const design = window.eraDesigns[era];
  const artwork = window.eraArtwork(design.slug);
  const get = id => document.getElementById(id);
  // Generated architectural studies frame live content; they are not historical evidence.
  const surroundPath = `assets/architecture/${era}.webp`;
  document.querySelector('.explore-hero').insertAdjacentHTML('afterbegin', `<div class="architectural-surround" aria-hidden="true"></div>`);
  document.querySelector('.design-note').insertAdjacentHTML('afterbegin', `<figure class="architecture-study"><img ${window.responsiveImageAttributes(surroundPath, "(max-width: 760px) calc(100vw - 40px), 40vw")} alt="${design.structure}" loading="lazy" decoding="async"><figcaption>${design.treatment}</figcaption></figure>`);
  const headingParts = {
    prehistoric: ['Prehistoric', 'Art'], ancient: ['Ancient', 'Art'], medieval: ['Medieval', 'Art'],
    renaissance: ['The', 'Renaissance'], 'post-impressionism': ['Post-', 'Impressionism'],
    modernism: ['Modern', 'ism'], contemporary: ['Contemporary', 'Art']
  };
  if (headingParts[era]) {
    get('title').replaceChildren(...headingParts[era].map(part => {
      const span = document.createElement('span');
      span.textContent = part;
      return span;
    }));
    get('title').setAttribute('aria-label', design.name === 'Prehistoric' ? 'Prehistoric Art' : design.name);
  }
  get('hero-edition').textContent = design.label;
  get('story-thesis').textContent = design.phrase;
  get('design-treatment').textContent = design.treatment;
  get('hero-vocabulary').textContent = design.vocabulary.join(' / ');
  get('design-note').textContent = design.note;
  get('hero-artwork').innerHTML = `
    <button class="hero-image-button" type="button" aria-label="Open a full view: ${artwork.title}">
      <img ${window.responsiveImageAttributes(artwork.src, "(max-width: 760px) 60vw, 36vw")} alt="${artwork.alt}" fetchpriority="high" decoding="async">
    </button>
    <figcaption><b>${artwork.title}</b>${artwork.type ? `<span>${artwork.type}</span>` : ''}<span class="hero-credit">${artwork.credit ? `${artwork.credit} · ` : ''}Select image to view in full</span></figcaption>`;
  get('hero-artwork').querySelector('button').addEventListener('click', () => {
    window.openArtworkImage({src:artwork.src, preview:get('hero-artwork').querySelector('img').currentSrc, alt:artwork.alt, caption:[artwork.title, artwork.type, artwork.credit].filter(Boolean).join(' · ')});
  });
  get('era-select').replaceChildren(...Object.entries(window.eraDesigns).map(([id, item], position) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = `${String(position + 1).padStart(2, '0')} · ${item.name}`;
    option.selected = id === era;
    return option;
  }));
  get('era-select').addEventListener('change', event => {
    location.href = `explore.html?era=${encodeURIComponent(event.target.value)}`;
  });

  const svg = content => `<svg viewBox="0 0 600 400" role="img" aria-label="${design.lab}: an illustrative teaching diagram" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  const lineStyle = 'fill="none" stroke="currentColor" stroke-width="2"';
  const diagramLabel = (x, y, text) => `<text x="${x}" y="${y}" fill="currentColor" font-family="DM Mono, monospace" font-size="13">${text}</text>`;
  const mountain = '<path d="M0 330 100 185 170 250 300 80 425 250 500 160 600 290V400H0Z" fill="#a3b6ac"/><path d="m0 355 135-95 95 70 130-120 105 115 135-65v140H0Z" fill="#708e80"/><path d="m0 400 170-80 110 30 105-65 215 115Z" fill="#36594d"/>';
  const figure = '<circle cx="0" cy="-65" r="9"/><path d="m-8-53-5 36 8 1-7 35h9L2-12l7 31h9L9-20 6-53Z"/>';
  const colonnade = `<path d="M70 130 300 50 530 130Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M70 145H530M60 340H540M60 355H540" ${lineStyle}/>${[100,180,260,340,420,500].map(x => `<path d="M${x-10} 150V330H${x+10}V150ZM${x-15} 155H${x+15}M${x-15} 325H${x+15}" ${lineStyle}/>`).join('')}`;
  const workers = `<g class="study-workers" fill="#534733"><g transform="translate(240 290) rotate(22)">${figure}</g><g transform="translate(315 300) rotate(30)">${figure}</g><g transform="translate(390 280) rotate(-18)">${figure}</g></g>`;
  const architecture = `<path d="M50 50H550V350H50Z M200 140H400V260H200Z M50 50 200 140M550 50 400 140M50 350 200 260M550 350 400 260" ${lineStyle}/><path d="M110 350 224 260M490 350 376 260M125 305H475M83.3 330H516.7" fill="none" stroke="currentColor" opacity=".35"/><path d="M275 260V195Q300 165 325 195V260" ${lineStyle}/>`;

  function colorLandscape(mode = 'touch') {
    let content = '<rect width="600" height="400" fill="#dbe3d3"/>';
    if (mode === 'plane') {
      return svg(content + '<path d="M0 230 140 80 260 195 400 45 600 230Z" fill="#6d8d9d"/><path d="M140 80 200 245 260 195Z" fill="#a9bd9a"/><path d="M400 45 375 230 600 230Z" fill="#9ba99b"/><path d="M0 230H600V400H0Z" fill="#96b4b3"/><path d="M0 280 260 240 500 400H0Z" fill="#6d9584"/><path d="M280 300 600 245V400Z" fill="#d1b46b"/>');
    }
    if (mode === 'gesture') {
      content = '<rect width="600" height="400" fill="#213e6b"/>';
      for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 17; col++) {
          const x = col * 38 - 10, y = row * 28;
          const colors = ['#d8bd54','#699bb2','#4e78a3','#b1ba79'];
          content += `<path d="M${x} ${y}q22 -22 36 -6" fill="none" stroke="${colors[(col+row*3)%4]}" stroke-width="5"/>`;
        }
      }
      return svg(content + '<circle cx="440" cy="110" r="32" fill="#edcc65"/>' + '<path d="M0 355Q150 230 280 320T600 285V400H0Z" fill="#344e49"/>');
    }
    const colors = ['#a8c7cc','#e4d6ae','#bacbbb','#85aaa4','#ede2bd','#749baa'];
    for (let row = 0; row < 22; row++) {
      for (let col = 0; col < 32; col++) {
        const x = col * 20 + (row % 2) * 7;
        const y = row * 19;
        let color = colors[(col*7+row*3)%colors.length];
        if (y > 215) color = ['#6f9f9d','#95b3a2','#d1bd8b','#69919f'][(row+col*3)%4];
        if (Math.hypot(x-410,y-125) < 42) color = ['#e4a05f','#e7b665','#d68655'][col%3];
        content += mode === 'dot'
          ? `<circle cx="${x}" cy="${y}" r="7" fill="${color}"/>`
          : `<path d="m${x-7} ${y+3} 17-5" stroke="${color}" stroke-width="9"/>`;
      }
    }
    return svg(content);
  }
  const diagrams = {
    prehistoric: () => svg(`<rect x="20" y="35" width="560" height="330" rx="50" fill="#30251d"/><g class="study-light" stroke="#d3a06c" fill="none" stroke-width="5"><path d="M120 235q-20-110 120-100 60-40 120 10l80-10 35 65-70 5q-50 60-155 35ZM170 240l-10 80m50-77-5 73m145-90 15 85m-240-80-30-40m330-48 5-50 30 37"/><path d="m90 95 15-30m15 30 15-30m15 30 15-30m310 215 15-30m15 30 15-30"/></g><g class="study-overlay">${diagramLabel(60,355,'Contour · repetition · surface')}</g>`),
    ancient: () => svg(colonnade + `<g class="study-overlay"><path d="M300 25V375" stroke="#b65a39" stroke-width="3" stroke-dasharray="6 6"/><path d="M95 220H505" stroke="#b65a39" stroke-dasharray="4 6"/>${diagramLabel(310,30,'Central axis')}</g>`),
    medieval: () => svg(`<rect x="155" y="15" width="290" height="370" fill="#efe1bb" stroke="#9d7333" stroke-width="6"/><rect x="175" y="35" width="250" height="330" fill="none" stroke="#934039" stroke-width="2"/><rect x="195" y="60" width="75" height="100" fill="#233c60"/><text x="210" y="140" font-size="85" fill="#ead08a" font-family="UnifrakturMaguntia, serif">A</text>${Array.from({length:17},(_,i)=>`<path d="M${i<5?290:195} ${72+i*16}H405" stroke="#635e4e" stroke-width="3"/>`).join('')}<g class="study-overlay" fill="none" stroke="#af4b37" stroke-width="2"><path d="M65 105H195M425 200H540M320 285H540"/></g><g class="study-overlay">${diagramLabel(35,92,'Initial')}${diagramLabel(455,187,'Border')}${diagramLabel(455,272,'Text')}</g>`),
    renaissance: () => svg(architecture + `<g class="study-overlay"><path d="M50 50 300 200 550 50M50 350 300 200 550 350M10 200H590" fill="none" stroke="#ae4c3d" stroke-width="2" stroke-dasharray="6 5"/><circle cx="300" cy="200" r="6" fill="#ae4c3d"/>${diagramLabel(315,185,'Vanishing point')}</g>`),
    baroque: () => svg('<rect width="600" height="400" fill="#181313"/><path d="M20 20 580 210 360 390Z" fill="#d0a164" opacity=".15"/><ellipse cx="285" cy="210" rx="50" ry="95" transform="rotate(-25 285 210)" fill="#9d6951"/><circle cx="245" cy="120" r="34" fill="#e4bd83"/><path d="m280 180 120 90-30 28-110-70Z" fill="#bc8b62"/><path d="m235 220 90 95-70 75-110-80Z" fill="#703b36"/><g class="study-overlay"><path d="M45 45 530 345m-10-35 10 35-38-4" fill="none" stroke="#f3d99f" stroke-width="3"/>'+diagramLabel(340,85,'The eye follows the light')+'</g>'),
    neoclassicism: () => svg(colonnade + `<g class="study-overlay" fill="none" stroke="#a45c3c" stroke-width="1.5">${[100,180,260,340,420,500].map(x=>`<path d="M${x} 30V375" stroke-dasharray="3 5"/>`).join('')}<path d="M100 375H500m-400-5v10m80-10v10m80-10v10m80-10v10m80-10v10m80-10v10"/></g><g class="study-overlay">${diagramLabel(210,395,'Repeated module')}</g>`),
    romanticism: () => svg('<rect width="600" height="400" fill="#d4ddd4"/>' + mountain + `<g id="scale-person" transform="translate(280 315) scale(.5)" fill="#1e302d">${figure}</g>`),
    realism: () => svg('<rect width="600" height="400" fill="#ded5b4"/><path d="M0 190Q150 150 300 200T600 180V400H0Z" fill="#ac9c72"/><path d="M0 330 600 260M0 370 600 300" stroke="#8b7b55" stroke-width="2"/>'+workers),
    impressionism: () => colorLandscape(),
    'post-impressionism': () => colorLandscape('dot'),
    modernism: () => svg('<rect width="600" height="400" fill="#e7dec9"/><g class="study-plane"><path d="M190 65 325 45 380 175 335 335 210 320 160 170Z" fill="#c88e63"/></g><g class="study-plane"><path d="M300 60 365 150 300 205 340 300 275 325 265 180Z" fill="#466a84"/><path d="m305 140 30 7-20 10Z" fill="#eee7d5"/></g><g class="study-plane"><path d="M180 160 265 145 280 240 220 290 180 235Z" fill="#e5bd78"/><path d="m200 175 35-8 17 13-35 10Z" fill="#333533"/><path d="m230 252 55-10-20 20Z" fill="#9e4838"/></g><g class="study-overlay">'+diagramLabel(370,350,'Multiple planes')+'</g>'),
    contemporary: () => svg('<path d="M35 35H565V365H35ZM35 365 160 260H455L565 365M160 260V35M455 260V35" fill="none" stroke="#b1a9b8"/><g id="exhibition-forms"><circle cx="210" cy="200" r="65" fill="#9e4f77"/><path d="M330 130H420V270H330Z" fill="#bdd178"/><path d="m270 290 70-120 70 120Z" fill="#7c78a5"/></g>')
  };
  const range = era === 'romanticism' || era === 'impressionism';
  const variants = era === 'post-impressionism';
  const controls = range
    ? `<label for="study-range">${design.action}</label><input id="study-range" type="range" min="0" max="100" value="50"><div class="lab-scale"><span>${era==='romanticism'?'Small figure':'Near'}</span><span>${era==='romanticism'?'Large figure':'Far'}</span></div>`
    : variants
      ? ['Dot','Plane','Gesture'].map((name,i)=>`<button type="button" data-study-mode="${['dot','plane','gesture'][i]}" aria-pressed="${i===0}">${name} <span aria-hidden="true">+</span></button>`).join('')
      : `<button type="button" id="study-toggle" ${era==='contemporary'?'':'aria-pressed="false"'}>${design.action} <span aria-hidden="true">+</span></button>`;
  get('visual-lab').innerHTML = `<div class="lab-canvas">${diagrams[era]()}</div><div class="lab-copy"><p class="overline">A small experiment in seeing</p><h3 id="lab-title">${design.lab}</h3><p>${design.before}</p><div class="lab-controls" role="group" aria-label="${design.action}">${controls}</div><p class="lab-status" role="status" aria-live="polite">${range?design.after:'An original teaching diagram; explore it using the controls.'}</p></div>`;
  const lab = get('visual-lab');
  const status = lab.querySelector('.lab-status');
  if (range) {
    const updateStudy = () => {
      const value = Number(get('study-range').value);
      if (era === 'romanticism') {
        get('scale-person').setAttribute('transform', `translate(280 315) scale(${.2 + value / 85})`);
        get('study-range').setAttribute('aria-valuetext', `${value}% human scale`);
      } else {
        lab.querySelector('svg').style.width = `${100-value*.55}%`;
        get('study-range').setAttribute('aria-valuetext', `${value}% distance, ${Math.round(100-value*.55)}% image size`);
      }
    };
    get('study-range').addEventListener('input', updateStudy);
    updateStudy();
  } else if (variants) {
    const explanations = {
      dot: 'Dot — Separate color marks suggest Seurat’s systematic approach to optical mixture.',
      plane: 'Plane — Interlocking areas of color suggest Cézanne’s interest in constructing form.',
      gesture: 'Gesture — Repeated directional marks suggest the expressive rhythms of Van Gogh.'
    };
    lab.querySelectorAll('[data-study-mode]').forEach(button => button.addEventListener('click', () => {
      lab.querySelectorAll('[data-study-mode]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      lab.querySelector('.lab-canvas').innerHTML = colorLandscape(button.dataset.studyMode);
      status.textContent = explanations[button.dataset.studyMode];
    }));
    status.textContent = explanations.dot;
  } else if (era === 'contemporary') {
    let arrangement = 0;
    const descriptions = ['Gathered together: the forms read as a group.', 'Separated: each form claims its own space.', 'Overlapping: relationships compete for attention.'];
    get('study-toggle').addEventListener('click', () => {
      arrangement = (arrangement + 1) % 3;
      const translations = [[0,0,0],[-80,70,0],[100,-60,35]][arrangement];
      Array.from(get('exhibition-forms').children).forEach((form,i)=>form.setAttribute('transform',`translate(${translations[i]} 0)`));
      status.textContent = descriptions[arrangement] + ' ' + design.after;
    });
  } else {
    get('study-toggle').addEventListener('click', event => {
      const revealed = lab.classList.toggle('is-revealed');
      event.currentTarget.setAttribute('aria-pressed', String(revealed));
      event.currentTarget.textContent = revealed ? 'Return to the first view' : design.action;
      status.textContent = revealed ? design.after : design.before;
    });
  }
})();
