#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, 'content');
const BLOG_SLUG = 'writings';
const WORK_SLUG = 'work';
const BLOG_DIR = path.join(ROOT, BLOG_SLUG);
const WORK_DIR = path.join(ROOT, WORK_SLUG);

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, content: md };
  const fmText = match[1];
  const content = md.slice(match[0].length).trim();
  const fm = {};
  fmText.split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i > 0) {
      let key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[key] = val;
    }
  });
  return { frontmatter: fm, content };
}

function mdToHtml(md) {
  const codeBlocks = [];
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const id = `%%CB${codeBlocks.length}%%`;
    codeBlocks.push('<pre><code class="language-' + lang + '">' + esc(code.trimEnd()) + '</code></pre>');
    return id;
  });

  const inlineCodes = [];
  md = md.replace(/`([^`]+)`/g, (_, code) => {
    const id = `%%IC${inlineCodes.length}%%`;
    inlineCodes.push('<code>' + esc(code) + '</code>');
    return id;
  });

  md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  md = md.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  md = md.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  md = md.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/\*(.+?)\*/g, '<em>$1</em>');
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  md = md.replace(/^---$/gm, '<hr />');
  md = md.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');
  md = md.replace(/^- \[x\] (.+)$/gm, '<li class="task"><input type="checkbox" checked disabled /> $1</li>');
  md = md.replace(/^- \[ \] (.+)$/gm, '<li class="task"><input type="checkbox" disabled /> $1</li>');
  md = md.replace(/^- (.+)$/gm, '<li>$1</li>');
  md = md.replace(/((?:<li(?:\s+class="task")?>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  md = md.replace(/(?:^|\n)((?:\|.+\|\n)+)/g, (match) => {
    const rows = match.trim().split('\n');
    if (rows.length < 2) return match;
    const isSep = (r) => /^\|[\s|-]+\|$/.test(r);
    if (!isSep(rows[1])) return match;
    const parseRow = (r) => r.split('|').slice(1, -1).map(s => s.trim());
    const ths = parseRow(rows[0]).map(s => '<th>' + s + '</th>').join('');
    const trs = rows.slice(2).filter(r => !isSep(r)).map(r => {
      return '<tr>' + parseRow(r).map(s => '<td>' + s + '</td>').join('') + '</tr>';
    }).join('');
    return '\n<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>\n';
  });

  const lines = md.split('\n');
  const result = [];
  let inP = false;

  for (const line of lines) {
    const t = line.trim();
    if (!t) { if (inP) { result.push('</p>'); inP = false; } continue; }
    if (/^<(h[1-6]|ul|ol|li|pre|blockquote|table|thead|tbody|tr|th|td|hr|div)/.test(t)) {
      if (inP) { result.push('</p>'); inP = false; }
      result.push(line); continue;
    }
    if (/^<\/(ul|ol|pre|blockquote|table|div|p)>/.test(t)) {
      if (inP) { result.push('</p>'); inP = false; }
      result.push(line); continue;
    }
    if (!inP) { result.push('<p>' + t); inP = true; } else { result.push(t); }
  }
  if (inP) result.push('</p>');

  let html = result.join('\n');
  codeBlocks.forEach((b, i) => { html = html.replace('%%CB' + i + '%%', b); });
  inlineCodes.forEach((c, i) => { html = html.replace('%%IC' + i + '%%', c); });
  html = html.replace(/<p>\s*<\/p>/g, '').replace(/\n{3,}/g, '\n\n');
  return html.trim();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function createSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    const m = tags.match(/^\[(.*)\]$/);
    if (m) return m[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
    return [tags];
  }
  return [];
}

function renderTags(tags) {
  return parseTags(tags).map(t => '<span class="tag">#' + t + '</span>').join('');
}

function postPage(fm, htmlContent) {
  return '<!doctype html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    '<title>' + fm.title + ' — HEYNG</title>\n' +
    '<meta name="description" content="' + fm.title + '" />\n' +
    '<link rel="icon" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>⚡</text></svg>" />\n' +
    '<meta name="theme-color" content="#0d0c0c" />\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com" />\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />\n' +
    '<link rel="stylesheet" href="/styles.css" />\n' +
    '</head>\n<body>\n<div class="page-shell">\n<main>\n' +
    '<article class="post-full">\n' +
    '<header class="post-full-header">\n' +
    '<a href="/' + BLOG_SLUG + '/" class="back-link">&larr; All posts</a>\n' +
    '<time class="post-date" datetime="' + fm.date + '">' + formatDate(fm.date) + '</time>\n' +
    '<h1 class="post-title">' + fm.title + '</h1>\n' +
    (renderTags(fm.tags) ? '<div class="post-tags">' + renderTags(fm.tags) + '</div>\n' : '') +
    '</header>\n' +
    '<div class="post-content">' + htmlContent + '</div>\n' +
    '</article>\n</main>\n' +
    '<footer class="site-footer"><p><a href="/">&larr; Home</a></p></footer>\n' +
    '</div>\n</body>\n</html>';
}

function blogIndexPage(postsHtml) {
  return '<!doctype html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    '<title>Writings from Blog — HEYNG</title>\n' +
    '<meta name="description" content="Writing on building tools and engineering." />\n' +
    '<link rel="icon" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>⚡</text></svg>" />\n' +
    '<meta name="theme-color" content="#0d0c0c" />\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com" />\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />\n' +
    '<link rel="stylesheet" href="/styles.css" />\n' +
    '</head>\n<body>\n<div class="page-shell">\n<main>\n' +
    '<header class="page-header">\n' +
    '<p class="page-label"><a href="/">HEYNG</a> / Writings from Blog</p>\n' +
    '<h1>Writings from Blog</h1>\n' +
    '</header>\n' +
    '<section class="post-list">\n' + postsHtml + '\n</section>\n' +
    '</main>\n' +
    '<footer class="site-footer"><p><a href="/">← Home</a></p></footer>\n' +
    '</div>\n</body>\n</html>';
}

function workIndexPage(projectsHtml) {
  return '<!doctype html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    '<title>Work — HEYNG</title>\n' +
    '<meta name="description" content="Projects and tools by HEYNG." />\n' +
    '<link rel="icon" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>⚡</text></svg>" />\n' +
    '<meta name="theme-color" content="#0d0c0c" />\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com" />\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />\n' +
    '<link rel="stylesheet" href="/styles.css" />\n' +
    '</head>\n<body>\n<div class="page-shell">\n<main>\n' +
    '<header class="page-header">\n' +
    '<p class="page-label"><a href="/">HEYNG</a> / Work</p>\n' +
    '<h1>Work</h1>\n' +
    '</header>\n' +
    '<section class="post-list project-list">\n' + projectsHtml + '\n</section>\n' +
    '</main>\n' +
    '<footer class="site-footer"><p><a href="/">&larr; Home</a></p></footer>\n' +
    '</div>\n</body>\n</html>';
}

function main() {
  const index = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'index.json'), 'utf-8'));
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf-8'));
  const posts = [];

  for (const file of index.blog || []) {
    const md = fs.readFileSync(path.join(CONTENT_DIR, 'blog', file), 'utf-8');
    const { frontmatter, content } = parseFrontmatter(md);
    const slug = createSlug(frontmatter.title || file.replace('.md', ''));
    const htmlContent = mdToHtml(content);
    posts.push({ fm: frontmatter, html: htmlContent, slug });
  }

  posts.sort((a, b) => new Date(b.fm.date) - new Date(a.fm.date));

  for (const post of posts) {
    const dir = path.join(BLOG_DIR, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), postPage(post.fm, post.html));
    console.log('/' + BLOG_SLUG + '/' + post.slug + '/');
  }

  const postsHtml = posts.map(p =>
    '<a href="/' + BLOG_SLUG + '/' + p.slug + '/">' + p.fm.title + '</a>'
  ).join('\n');

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), blogIndexPage(postsHtml));
  console.log('/' + BLOG_SLUG + '/');

  const projectsHtml = data.projects.map(p =>
    '<div class="project"><a href="' + (p.href || '#') + '" class="project-title">' + p.title + '</a>' +
    '<span class="project-desc">' + p.description + '</span></div>'
  ).join('\n');
  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.writeFileSync(path.join(WORK_DIR, 'index.html'), workIndexPage(projectsHtml));
  console.log('/' + WORK_SLUG + '/');
}

main();
