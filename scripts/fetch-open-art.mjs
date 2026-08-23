import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const works = {
  lascaux:'Lascaux','venus-willendorf':'Venus of Willendorf',stonehenge:'Stonehenge',nefertiti:'Nefertiti Bust',parthenon:'Parthenon','augustus-prima-porta':'Augustus of Prima Porta','book-kells':'Book of Kells','bayeux-tapestry':'Bayeux Tapestry','chartres-cathedral':'Chartres Cathedral','birth-venus':'The Birth of Venus','mona-lisa':'Mona Lisa','michelangelo-david':'David (Michelangelo)','calling-st-matthew':'The Calling of St Matthew (Caravaggio)','bernini-david':'David (Bernini)','judith-holofernes':'Judith Slaying Holofernes (Artemisia Gentileschi, Florence)','oath-horatii':'Oath of the Horatii',cornelia:'Cornelia, Mother of the Gracchi','george-washington':'George Washington (Greenough)','third-may-1808':'The Third of May 1808','wanderer-sea-fog':'Wanderer above the Sea of Fog','slave-ship':'The Slave Ship','stone-breakers':'The Stone Breakers',gleaners:'The Gleaners','horse-fair':'The Horse Fair','impression-sunrise':'Impression, Sunrise',cradle:'The Cradle (Morisot)','ballet-class':'The Ballet Class (Degas, Metropolitan Museum of Art)','sunday-grande-jatte':'A Sunday Afternoon on the Island of La Grande Jatte','starry-night':'The Starry Night','mont-sainte-victoire':'Mont Sainte-Victoire (Cézanne)','composition-viii':'Composition VIII'
};

const headers = {'User-Agent':'ArtCompassOfflineCollection/1.0 (educational project)'};
const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const query = new URL('https://en.wikipedia.org/w/api.php');
query.search = new URLSearchParams({action:'query',titles:Object.values(works).join('|'),prop:'pageimages',piprop:'name|original|thumbnail',pithumbsize:'1600',format:'json',origin:'*'});
const response = await fetch(query, {headers});
if (!response.ok) throw new Error(`Wikipedia catalog: ${response.status}`);
const data = await response.json();
const byTitle = Object.fromEntries(Object.values(data.query.pages).map(page => [page.title, page]));
const candidates = {};
for (const [slug, title] of Object.entries(works)) {
  const page = byTitle[title];
  const imageUrl = page?.thumbnail?.source ?? page?.original?.source ?? null;
  const fileName = page?.pageimage ?? null;
  candidates[slug] = {
    articleTitle:title,
    articleUrl:`https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ','_'))}`,
    fileName,
    url:imageUrl,
    descriptionUrl:fileName ? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}` : null
  };
}

const fileTitles = Object.values(candidates).filter(item => item.fileName).map(item => `File:${item.fileName}`);
const commons = new URL('https://commons.wikimedia.org/w/api.php');
commons.search = new URLSearchParams({action:'query',titles:fileTitles.join('|'),prop:'imageinfo',iiprop:'url|mime|extmetadata',iiurlwidth:'1600',format:'json',origin:'*'});
const commonsResponse = await fetch(commons, {headers});
if (!commonsResponse.ok) throw new Error(`Commons catalog: ${commonsResponse.status}`);
const commonsData = await commonsResponse.json();
if (!commonsData.query) throw new Error(`Commons catalog: ${JSON.stringify(commonsData.error ?? commonsData)}`);
const normalizeFile = value => String(value ?? '').replace(/^File:/,'').replaceAll('_',' ').normalize('NFC');
const fileData = Object.fromEntries(Object.values(commonsData.query.pages).map(page => [normalizeFile(page.title), page.imageinfo?.[0]]));
const clean = value => String(value ?? '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
for (const item of Object.values(candidates)) {
  const info = fileData[normalizeFile(item.fileName)];
  if (!info) continue;
  item.url = info.thumburl ?? info.url;
  item.descriptionUrl = info.descriptionurl;
  item.license = clean(info.extmetadata?.LicenseShortName?.value);
  item.artist = clean(info.extmetadata?.Artist?.value);
  item.credit = clean(info.extmetadata?.Credit?.value);
}
await mkdir('tmp', {recursive:true});
await writeFile('tmp/open-art-candidates.json', JSON.stringify(candidates, null, 2));
console.log(`Saved ${Object.values(candidates).filter(item => item.url).length}/${Object.keys(candidates).length} candidates.`);

if (process.argv.includes('--download')) {
  const allowed = /^(Public domain|CC0|CC BY(?:-SA)?(?: \d\.\d)?)$/i;
  const manifest = {};
  await mkdir('assets/museum', {recursive:true});
  for (const [slug, item] of Object.entries(candidates)) {
    if (!item.url || !allowed.test(item.license ?? '')) continue;
    const mimeFromUrl = item.url.includes('.png') ? 'image/png' : 'image/jpeg';
    let extension = mimeFromUrl === 'image/png' ? 'png' : 'jpg';
    let path = `assets/museum/${slug}.${extension}`;
    if (existsSync(path)) {
      manifest[slug] = {path, license:item.license, artist:item.artist || 'Unknown', source:item.descriptionUrl};
      continue;
    }
    if (process.argv.includes('--existing-only')) continue;
    let imageResponse;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      imageResponse = await fetch(item.url, {headers});
      if (imageResponse.ok || imageResponse.status !== 429) break;
      await pause(Number(imageResponse.headers.get('retry-after') ?? 8) * 1000);
    }
    if (!imageResponse.ok) throw new Error(`${slug} image: ${imageResponse.status}`);
    const mime = imageResponse.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg';
    extension = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    path = `assets/museum/${slug}.${extension}`;
    await writeFile(path, Buffer.from(await imageResponse.arrayBuffer()));
    manifest[slug] = {path, license:item.license, artist:item.artist || 'Unknown', source:item.descriptionUrl};
    console.log(`Downloaded ${slug} (${item.license})`);
    await pause(1800);
  }
  await writeFile('js/artwork-media.js', `window.artworkMedia=${JSON.stringify(manifest, null, 2)};\n`);
  console.log(`Wrote ${Object.keys(manifest).length} licensed artwork records.`);
}
