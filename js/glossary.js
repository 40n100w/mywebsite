document.getElementById('terms').innerHTML=Object.entries(glossary).map(([term,definition])=>`<div><dt>${term}</dt><dd>${definition}</dd></div>`).join('');
