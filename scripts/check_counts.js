const fs = require('fs');
const s = fs.readFileSync('frontend/src/data/seedArticles.ts', 'utf8');
const m = s.match(/category:\s*[`"']([^`"']+)/g) || [];
const counts = {};
m.forEach(x => {
  const c = x.split(/[`"']/)[1];
  counts[c] = (counts[c] || 0) + 1;
});
console.log("Total articles:", m.length);
console.log("Counts per category:", JSON.stringify(counts, null, 2));

