#!/bin/sh
set -eu
for file in js/main.js js/context.js js/books-maps.js js/story.js js/learning.js js/study-data.js js/experience-data.js js/work-records.js js/artwork-media.js js/world-map.js js/explore.js js/glossary.js js/sources.js sw.js; do node --check "$file"; done
node - <<'NODE'
const fs=require('fs'),vm=require('vm'),box={window:{}};
vm.runInNewContext(fs.readFileSync('js/work-records.js','utf8'),box);
const records=box.window.workRecords,slugs=Object.values(box.window.periodWorkSlugs).flat();
if(Object.keys(records).length!==36||slugs.length!==36||new Set(slugs).size!==36)throw new Error('Expected 36 unique keyed work records');
for(const slug of slugs){const item=records[slug];if(!item?.medium||!item?.location||!item?.source?.[2]||item.notice?.length!==2)throw new Error(`Incomplete work record: ${slug}`)}
NODE
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]
    def handle_starttag(self,tag,attrs):
        data=dict(attrs)
        for key in ('href','src'):
            if data.get(key): self.links.append(data[key])
for page in Path('.').glob('*.html'):
    parser=Parser(); parser.feed(page.read_text())
    for link in parser.links:
        parsed=urlsplit(link)
        if parsed.scheme or parsed.netloc or link.startswith('#'): continue
        target=(page.parent/parsed.path)
        if parsed.path in ('','.'): target=Path('index.html')
        assert target.exists(), f'broken local link in {page}: {link}'
for stylesheet in Path('css').glob('*.css'):
    css=stylesheet.read_text(); assert css.count('{')==css.count('}'), f'unbalanced braces: {stylesheet}'
for path in ['about.html','sources.html','glossary.html','corrections.html','review.html','manifest.webmanifest','sw.js','assets/world-110m.geojson','js/world-map.js','js/work-records.js','js/artwork-media.js','js/experience-data.js']:
    assert Path(path).is_file(), f'missing {path}'
assert len(list(Path('assets/works').glob('*.jpg')))==36
print('Static validation passed')
PY
if command -v rg >/dev/null 2>&1; then
  if rg -n "href=[\"'][[:space:]]*https?://|\\]\\(https?://" -g '*.html' -g '*.js' -g '*.md' .; then echo 'Outbound public link detected' >&2; exit 1; fi
  if rg -n -i --hidden -g '!.git/**' -g '!*.jpg' -g '!scripts/validate.sh' '(BEGIN [A-Z ]*PRIVATE|github_pat_|ghp_|sk-[A-Za-z0-9])' .; then echo 'Potential secret detected' >&2; exit 1; fi
fi
