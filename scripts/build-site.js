/**
 * Assembles _site/ for GitHub Pages (no node_modules or dev-only files).
 * Run after: npm run build:css
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, '_site');

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, ent.name);
    const to = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

const dirsToCopy = ['pages', 'styles', 'scripts', 'data', 'assets'];

rmrf(outDir);
fs.mkdirSync(outDir, { recursive: true });

for (const name of dirsToCopy) {
  const src = path.join(root, name);
  if (fs.existsSync(src)) {
    copyDir(src, path.join(outDir, name));
  }
}

const rootIndex = path.join(root, 'index.html');
if (!fs.existsSync(rootIndex)) {
  console.error('Missing root index.html');
  process.exit(1);
}
fs.copyFileSync(rootIndex, path.join(outDir, 'index.html'));
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

console.log('Wrote', outDir);
