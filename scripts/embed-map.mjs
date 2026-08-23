import {readFile,writeFile} from 'node:fs/promises';
const data=JSON.parse(await readFile('assets/world-110m.geojson','utf8'));
await writeFile('js/world-map.js',`window.worldMapData=${JSON.stringify(data)};\n`);
console.log(`Embedded ${data.features.length} map features.`);
