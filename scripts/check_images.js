const fs = require('fs');
const txt = fs.readFileSync('frontend/src/data/seedArticles.ts', 'utf8');
const regex = /image_url:\s*[`'"]([^`'"]+)[`'"]/g;
const imgs = [];
let match;
while ((match = regex.exec(txt)) !== null) {
  imgs.push(match[1]);
}
console.log('Total images found:', imgs.length);
const counts = {};
imgs.forEach(i => counts[i] = (counts[i] || 0) + 1);
const repeating = Object.entries(counts).filter(([k, v]) => v > 1);
console.log('Unique images:', Object.keys(counts).length);
console.log('Repeating images count:', repeating.length);
repeating.sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => console.log(`${v}x: ${k}`));
