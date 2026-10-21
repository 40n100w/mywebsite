/* Commit the rendered HTML so reference pages also work without JavaScript. */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const elements = new Map();
const box = {document:{getElementById(id) {
  if (!elements.has(id)) elements.set(id, {innerHTML:''});
  return elements.get(id);
}}};
box.window = box;
vm.createContext(box);
for (const file of ['learning', 'work-records', 'artwork-media', 'sources', 'glossary']) {
  vm.runInContext(fs.readFileSync(path.join(root, `js/${file}.js`), 'utf8'), box, {filename:file});
}
let stale = false;
for (const [file, ids] of [['sources.html', ['source-groups', 'image-rights-list']], ['glossary.html', ['terms']]]) {
  const filename = path.join(root, file);
  const current = fs.readFileSync(filename, 'utf8');
  let rendered = current;
  for (const id of ids) {
    const pattern = new RegExp(`<!-- reference:${id} -->[\\s\\S]*?<!-- /reference:${id} -->`);
    if (!pattern.test(rendered)) throw new Error(`Missing reference marker: ${file} / ${id}`);
    rendered = rendered.replace(pattern, () => `<!-- reference:${id} -->\n${elements.get(id).innerHTML}\n<!-- /reference:${id} -->`);
  }
  if (process.argv.includes('--check')) {
    if (rendered !== current) { console.error(`${file} needs rebuilding: node scripts/build-reference-pages.mjs`); stale = true; }
  } else fs.writeFileSync(filename, rendered);
}
if (stale) process.exitCode = 1;
else console.log(process.argv.includes('--check') ? 'Reference pages are up to date' : 'Reference pages rendered');
