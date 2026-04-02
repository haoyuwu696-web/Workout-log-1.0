const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pagesDir = path.join(root, 'pages');
const stylesPagesDir = path.join(root, 'styles', 'pages');

if (!fs.existsSync(pagesDir)) {
  console.error('pages directory not found:', pagesDir);
  process.exit(1);
}

fs.mkdirSync(stylesPagesDir, { recursive: true });

const pageFiles = fs
  .readdirSync(pagesDir)
  .filter((f) => f.endsWith('.html'));

const pageNames = ['index', 'workout', 'history', 'body', 'settings', 'timer', 'calories'];

for (const file of pageFiles) {
  const fullPath = path.join(pagesDir, file);
  let html = fs.readFileSync(fullPath, 'utf8');
  const base = file.replace('.html', '');

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    const css = `${styleMatch[1].trim()}\n`;
    fs.writeFileSync(path.join(stylesPagesDir, `${base}.css`), css, 'utf8');
    html = html.replace(styleMatch[0], '');
  }

  html = html.replace(
    /\s*<script src="https:\/\/modao\.cc\/agent-py\/static\/source\/js\/tailwindcss\.3\.4\.3\.js"><\/script>\s*/g,
    '\n'
  );

  if (!html.includes('../styles/output.css')) {
    html = html.replace(
      '</title>',
      '</title>\n<link rel="stylesheet" href="../styles/output.css"/>'
    );
  }

  const pageCssHref = `../styles/pages/${base}.css`;
  if (!html.includes(pageCssHref)) {
    html = html.replace(
      '</title>',
      `</title>\n<link rel="stylesheet" href="${pageCssHref}"/>`
    );
  }

  for (const name of pageNames) {
    html = html.replaceAll(`href="${name}.html"`, `href="./${name}.html"`);
  }

  html = html.replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(fullPath, html, 'utf8');
}

console.log(`Updated ${pageFiles.length} page files.`);



















