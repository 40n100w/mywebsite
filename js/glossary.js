const termId=term=>`term-${term.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;
document.getElementById('terms').innerHTML=Object.entries(glossary).map(([term,definition])=>`<div id="${termId(term)}"><dt>${term}</dt><dd>${definition}</dd></div>`).join('');
