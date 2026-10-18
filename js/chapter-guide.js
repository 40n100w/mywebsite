/* One reading route, with questions and transitions specific to each chapter. */
window.chapterSections = [
  ['works-section', 'works', 'Look at the works'],
  ['seeing', 'seeing', 'Read the visual language'],
  ['world', 'world', 'Place it in context'],
  ['ideas', 'ideas', 'Explore the ideas'],
  ['design', 'design', 'Follow it into daily life'],
  ['legacy', 'legacy', 'Compare and reflect']
];
window.chapterGuides = {
  prehistoric: {
    question: 'What can an object tell us when its makers left no written explanation?',
    scope: 'Cave painting in France, a carved figure from Austria, and a monument in Britain. These examples span thousands of years and distinct communities; they are a small part of a much wider history.',
    focus: 'Start with the difference between a surface, a handheld object, and a place you enter. Each offers a different kind of encounter; its original meaning may remain uncertain.',
    headings: ['A wall, a figure, a landscape', 'Read the material as well as the image', 'Different places, different times', 'Working with incomplete evidence', 'Making within a landscape', 'Compare what survives'],
    bridges: ['These works ask us to consider where an image was made and how a body met it.', 'Materials offer clues. Their meaning also depends on the communities and settings in which they were used.', 'Without written explanations, how can we distinguish a useful interpretation from an unsupported certainty?', 'Evidence of tools, shelters, and ornament places these exceptional survivals within a larger world of making.', 'Return to two very different objects and consider what their materials allow us to know.'],
    comparison: {slugs:['lascaux','venus-willendorf'], question:'How does the encounter change between a cave wall and an object held in the hand?', note:'Compare surface, size, and setting. A shared modern label does not establish a shared original purpose.'}
  },
  ancient: {
    question: 'How do images give authority a lasting form?',
    scope: 'Three examples from Egypt, Athens, and Rome. “Ancient art” covers many more societies; these works also differ greatly in date, function, and audience.',
    focus: 'Look for choices that make a person or institution seem composed, ideal, or enduring. Then ask where the work stood and who was meant to encounter it.',
    headings: ['Royal image, civic temple, imperial body', 'Look for constructed authority', 'Who could commission permanence?', 'Ideals and their limits', 'Order in buildings and objects', 'Two ways to picture a ruler'],
    bridges: ['Idealization works through specific choices of pose, proportion, material, and placement.', 'Those choices served different institutions in Egypt, Athens, and Rome.', 'Political and sacred ideals also entered debates about what images could show.', 'Ideas of order took practical form in buildings, furnishings, and ornament.', 'Compare two royal images without assuming that they addressed the same public.'],
    comparison: {slugs:['nefertiti','augustus-prima-porta'], question:'What kinds of authority do the face, pose, and costume invite you to recognize?', note:'The bust from a royal workshop and the imperial statue had different settings. Similar idealization does not imply the same use.'}
  },
  medieval: {
    question: 'How can images organize belief, memory, and power?',
    scope: 'A manuscript, an embroidered narrative, and a cathedral from western Europe, c. 800–1200s. Medieval art also includes secular subjects and many traditions beyond these examples.',
    focus: 'Follow how each work directs attention: around a page, along a story, or upward through a building. Sacred devotion and political storytelling share some visual tools.',
    headings: ['A page, a conquest, a cathedral', 'Follow the path of attention', 'Churches, courts, and workshops', 'Different accounts of a meaningful world', 'Many crafts, one setting', 'Sacred story and political memory'],
    bridges: ['Pattern, sequence, and light organize the experience of these works.', 'Such experiences depended on institutions, skilled makers, and the movement of materials.', 'Texts from different societies reveal distinct ways to connect visible life with larger meanings.', 'Those ideas reached people through rooms, textiles, books, and public ceremony.', 'Compare how a manuscript and an embroidery guide a viewer through a story.'],
    comparison: {slugs:['book-kells','bayeux-tapestry'], question:'How does the organization of the surface change the pace of looking?', note:'The Gospel book supports devotional reading; the embroidery narrates a contested conquest. “Medieval” includes both uses.'}
  },
  renaissance: {
    question: 'How do artists make a body or a space feel convincing?',
    scope: 'Three Italian works, c. 1485–1519, within a broader European Renaissance. Classical learning continued through the Middle Ages, and naturalistic representation has histories far beyond Europe.',
    focus: 'Compare Botticelli’s contour, Leonardo’s soft edges, and Michelangelo’s bodily tension. These are different artistic choices within the same broad period.',
    headings: ['Three approaches to the human figure', 'Contour, atmosphere, and measured space', 'Patrons and the public image', 'Humanism in practice', 'Designing a measured world', 'Compare two painted presences'],
    bridges: ['The artists do not share one formula: line, light, and anatomy produce different kinds of presence.', 'Workshops and patrons helped determine which subjects and skills received attention.', 'Humanist learning supplied ways to discuss human action, history, and judgment.', 'Drawing and print carried these habits of inquiry into buildings and daily objects.', 'Return to the paintings and distinguish a convincing image from a single standard of realism.'],
    comparison: {slugs:['birth-venus','mona-lisa'], question:'How do clear contour and softened edges create different kinds of presence?', note:'Botticelli’s decorative space and Leonardo’s atmospheric depth coexist within Renaissance painting.'}
  },
  baroque: {
    question: 'How does an artwork make you feel present at an event?',
    scope: 'Three Italian works, c. 1600–1624. Their dramatic religious subjects represent one strand of Baroque art; other regions supported different subjects, patrons, and markets.',
    focus: 'Trace a beam of light, a twist of the body, or a crossing of arms. Each work uses a visible action to position you in relation to the scene.',
    headings: ['Light, movement, and a decisive moment', 'Find the action beyond the frame', 'Persuasion and patronage', 'Belief, doubt, and appearance', 'The room becomes part of the work', 'David before and during action'],
    bridges: ['The drama is built from formal choices that you can trace through the image or sculpture.', 'The force of those choices mattered to patrons seeking devotion, prestige, or public attention.', 'Writers also explored how appearances persuade and how certainty can be tested.', 'Architecture and decoration extended this direction of attention into an entire room.', 'Two sculptures of David make the difference between anticipation and action especially clear.'],
    comparison: {slugs:['michelangelo-david','bernini-david'], question:'Where is the action, and where does each sculpture place the viewer?', note:'Michelangelo emphasizes poised anticipation; Bernini’s twisting body implies a target outside the sculpture. Both use tension.'}
  },
  neoclassicism: {
    question: 'Why can the same classical forms serve different political ideals?',
    scope: 'French, Swiss-born, and American artists working with Greek and Roman models, c. 1784–1840. Neoclassicism overlapped with Romanticism and other approaches.',
    focus: 'Look at the gestures that turn a historical or imagined scene into a public example. Consider whose conduct is praised and whose experience stays at the edge.',
    headings: ['Antiquity put to modern use', 'Read the gesture and the geometry', 'Excavation, exhibition, and revolution', 'Who belongs to the public?', 'Classical forms enter everyday life', 'Civic virtue and heroic authority'],
    bridges: ['Clear grouping and controlled gesture make these images easy to read as arguments.', 'Their apparent clarity served patrons and audiences with conflicting political aims.', 'Debates over citizenship exposed the limits of supposedly universal ideals.', 'Classical motifs also traveled through buildings, furnishings, and manufactured goods.', 'Compare how two works ask viewers to admire a public example.'],
    comparison: {slugs:['oath-horatii','george-washington'], question:'How does classical form lend authority to sacrifice or leadership?', note:'A narrative painting and a monumental portrait use antiquity differently. The style itself does not guarantee a republican message.'}
  },
  romanticism: {
    question: 'What can emotion make visible about history and the natural world?',
    scope: 'Works by Goya, Friedrich, and Turner, c. 1814–1840. Romanticism varied across regions and overlapped with Neoclassicism, Realism, and academic traditions.',
    focus: 'Notice the viewer’s position: close to an execution, behind a solitary figure, or facing a storm at sea. Each position changes how the subject is experienced.',
    headings: ['Witness, solitude, and catastrophe', 'Read distance, light, and scale', 'War, industry, and imagined nature', 'Imagination and responsibility', 'Ruin, garden, and remembered past', 'Two ways to confront violence'],
    bridges: ['Emotion emerges through composition, distance, and light as well as through subject matter.', 'The landscapes and historical scenes belong to a world shaped by war, industry, and empire.', 'Writers explored the possibilities and dangers of imagination within that changing world.', 'The same interest in memory and atmosphere affected designed landscapes and interiors.', 'Return to two images in which visual beauty is inseparable from violence.'],
    comparison: {slugs:['third-may-1808','slave-ship'], question:'How do Goya’s concentrated light and Turner’s turbulent color direct attention to suffering?', note:'Look for victims and agents of violence. The works address distinct events and should not be treated as interchangeable images of tragedy.'}
  },
  realism: {
    question: 'What changes when ordinary work becomes the subject of a major painting?',
    scope: 'Three French paintings, 1849–1857, within the wider nineteenth-century turn toward contemporary life. Everyday subjects existed long before the Realist movement.',
    focus: 'Compare the bodies, tasks, and spaces given prominence. The painters choose what to show; observation does not remove interpretation.',
    headings: ['Work in the foreground', 'Look at weight, effort, and scale', 'Who gets seen in public?', 'Lives shaped by social conditions', 'The designed world of industrial work', 'Different forms of labor'],
    bridges: ['Subject matter matters, but so does the space and attention a painting gives to it.', 'Scale and visibility took on particular force in exhibitions and debates about class.', 'Contemporary writers also connected individual lives with social arrangements.', 'Industry changed the spaces of work and the objects available to households.', 'Compare labor pictured as repetitive exertion with labor organized around a public market.'],
    comparison: {slugs:['stone-breakers','horse-fair'], question:'How do the composition and treatment of bodies change your sense of work?', note:'Courbet and Bonheur both make labor prominent, but their paintings differ in rhythm, subject, and public effect. Courbet’s original was destroyed in 1945.'}
  },
  impressionism: {
    question: 'How can a painting make looking itself part of the subject?',
    scope: 'Monet, Morisot, and Degas in France during the 1870s. Their work includes outdoor light, domestic interiors, and rehearsals; the group never followed one method.',
    focus: 'Notice what a few marks, a cropped edge, or a directed gaze lets you recognize. The apparent immediacy of a scene can be carefully composed.',
    headings: ['A harbor, a room, a rehearsal', 'Notice the act of looking', 'Modern life and independent exhibitions', 'Writing the changing city', 'Spaces of work and leisure', 'Looking at private and public life'],
    bridges: ['These paintings show several ways to make perception visible, beyond a shared interest in light.', 'Their subjects also reveal who could enter, work in, or move through modern spaces.', 'Contemporary writing adds perspectives on the crowds, commerce, and ambitions of that world.', 'Architecture, transport, and furnishing helped create these new settings for looking.', 'Compare two interiors and consider who watches, who works, and who is being watched.'],
    comparison: {slugs:['cradle','ballet-class'], question:'How do sightlines and framing organize attention in these two interiors?', note:'Morisot’s close domestic scene and Degas’s rehearsal room complicate the idea that Impressionism is only outdoor leisure.'}
  },
  'post-impressionism': {
    question: 'What else can color do besides record an appearance?',
    scope: 'Seurat, van Gogh, and Cézanne, c. 1884–1906. “Post-Impressionism” is a retrospective grouping of distinct practices, not a single movement with a shared program.',
    focus: 'Look closely at the mark: regular touches, directional strokes, or patches of color. Each artist uses it to organize a different experience of the scene.',
    headings: ['Dots, strokes, and planes', 'Compare three uses of color', 'Experiments outside a single school', 'Artists explaining their choices', 'From painted surface to designed object', 'Two different rhythms'],
    bridges: ['Changing the mark changes the structure and expressive force of the whole image.', 'Exhibitions, dealers, and personal networks helped these distinct experiments reach audiences.', 'Artists’ letters and optical writing offer different accounts of what color might accomplish.', 'Color, contour, and surface also informed experiments in print and decoration.', 'Compare a regular visual system with a surface organized by directional rhythm.'],
    comparison: {slugs:['sunday-grande-jatte','starry-night'], question:'What changes when marks repeat regularly or follow a strong direction?', note:'Seurat’s ordered surface and van Gogh’s animated strokes are different solutions. Neither stands for every artist grouped under this label.'}
  },
  modernism: {
    question: 'How many ways can an artwork reorganize experience?',
    scope: 'Works by Picasso, Kandinsky, and Kahlo, 1907–1939. The wider chapter spans many modernisms; abstraction is one approach among figurative, political, and experimental practices.',
    focus: 'Compare fractured space, autonomous geometry, and a doubled self-portrait. These artists investigate different questions rather than moving toward one common destination.',
    headings: ['Three different modernisms', 'Look for the rule each work invents', 'Schools, migration, and contested power', 'Form as a way to think', 'Modernism beyond the museum', 'Two uses of the figure'],
    bridges: ['The important question is what each alteration of form allows the work to say.', 'Experiments developed within specific institutions, political struggles, and networks of exchange.', 'Writers also tested new structures for experience, identity, and social criticism.', 'Some of these experiments moved into type, furniture, architecture, and mass communication.', 'Compare two figurative works to see why modern art cannot be reduced to abstraction.'],
    comparison: {slugs:['les-demoiselles-avignon','two-fridas'], question:'How do fractured space and a doubled self create different kinds of confrontation?', note:'Picasso and Kahlo use the figure for distinct purposes. Kahlo’s Mexican context and personal symbolism are essential to her work.'}
  },
  contemporary: {
    question: 'How do a work’s setting and audience help shape its meaning?',
    scope: 'Basquiat, Kusama, and Walker offer three approaches within a much larger global field. Kusama’s mirror environments began in 1965, before this chapter’s approximate 1970 boundary.',
    focus: 'Start with what each work asks you to do: read a painted surface, enter a reflected space, or confront a monument in an industrial site.',
    headings: ['Surface, room, and site', 'Read the encounter as well as the object', 'Visibility, institutions, and labor', 'Whose viewpoint shapes the account?', 'Design as a set of choices', 'Context changes the reading'],
    bridges: ['A work can ask for participation or make the conditions of looking part of its meaning.', 'Access to spaces, materials, and public attention remains uneven.', 'Critical writing offers tools for examining representation and the authority to interpret it.', 'Questions of access, resources, and responsibility also run through contemporary design.', 'Compare what a painted surface and a site-specific installation require you to know.'],
    comparison: {slugs:['untitled-basquiat','subtlety'], question:'What histories become legible through material, imagery, and location?', note:'The Basquiat entry introduces a broader body of work. Walker’s installation depended on its particular site, materials, and temporary existence.'}
  }
};
