const fs = require('fs');
const path = require('path');

const targetPaths = [
  path.resolve(__dirname, '../public/.htaccess'),
  path.resolve(__dirname, '../.next/.htaccess'),
  path.resolve(__dirname, '../.next/standalone/.htaccess'),
  path.resolve(__dirname, '../.next/standalone/public/.htaccess'),
  path.resolve(__dirname, '../../../../public_html/.htaccess'),
  '/home/u340027669/domains/zestfeedx.com/public_html/.htaccess'
];

console.log('[fix-htaccess] Running htaccess cleanup script...');

for (const target of targetPaths) {
  try {
    if (fs.existsSync(target)) {
      let content = fs.readFileSync(target, 'utf8');
      const original = content;
      content = content.replace(/ErrorDocument 404 \/\r?\n?/g, '');
      content = content.replace(/# Any non-existent file or directory redirects[\s\S]*?RewriteRule \^\(\.\*\)\$ \/ \[R=302,L\]\r?\n?/g, '');
      content = content.replace(/RewriteCond %\{REQUEST_FILENAME\} !-f\r?\nRewriteCond %\{REQUEST_FILENAME\} !-d\r?\nRewriteRule \^\(\.\*\)\$ \/ \[R=302,L\]\r?\n?/g, '');
      
      if (content !== original) {
        fs.writeFileSync(target, content, 'utf8');
        console.log(`[fix-htaccess] Cleaned 302 rules from ${target}`);
      } else {
        console.log(`[fix-htaccess] Clean check passed: ${target}`);
      }
    } else {
      const cleanSource = path.resolve(__dirname, '../public/.htaccess');
      if (fs.existsSync(cleanSource) && target.includes('.next')) {
        const dir = path.dirname(target);
        if (fs.existsSync(dir)) {
          fs.copyFileSync(cleanSource, target);
          console.log(`[fix-htaccess] Copied clean .htaccess to ${target}`);
        }
      }
    }
  } catch (err) {
    console.warn(`[fix-htaccess] Note on ${target}: ${err.message}`);
  }
}
