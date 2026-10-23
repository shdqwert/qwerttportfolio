// Prerenders every route in both languages into dist/**/index.html so the
// content is in the HTML before any JavaScript runs (and without JS).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render, meta, prepare } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)
await prepare()
const template = await readFile(`${root}dist/index.html`, 'utf8')
const marker = '<div id="root"></div>'
if (!template.includes(marker)) throw new Error('Root marker not found in dist/index.html')
// Each route's page chunk (and the RU copy) is loaded before the first render;
// link its CSS and JS up front so the prerendered HTML is styled from the
// first paint (no layout shift when the chunk's CSS would arrive) and the JS
// downloads in parallel with the entry.
const manifest = JSON.parse(await readFile(`${root}dist/.vite/manifest.json`, 'utf8'))
const PAGE_SRC = { '/': 'src/pages/Home.tsx', '/work/qwerttclients': 'src/pages/CaseQc.tsx', '/work/kinoqwertt': 'src/pages/CaseKino.tsx', '/lab': 'src/pages/Lab.tsx' }
const entryFiles = new Set()
const walk = (key, out, seen = new Set()) => {
  if (seen.has(key) || !manifest[key]) return out
  seen.add(key)
  const c = manifest[key]
  out.js.add(c.file)
  for (const css of c.css || []) out.css.add(css)
  for (const i of c.imports || []) walk(i, out, seen)
  return out
}
const entry = walk('index.html', { js: new Set(), css: new Set() })
entry.js.forEach((f) => entryFiles.add(f))
entry.css.forEach((f) => entryFiles.add(f))
function routeLinks(lang, path) {
  const out = walk(PAGE_SRC[path], { js: new Set(), css: new Set() })
  if (lang === 'ru') walk('src/content/ru.ts', out)
  if (path === '/') walk(`src/content/pages/home.${lang}.ts`, out)
  const css = [...out.css].filter((f) => !entryFiles.has(f)).map((f) => `<link rel="stylesheet" crossorigin href="/${f}">`)
  const js = [...out.js].filter((f) => !entryFiles.has(f)).map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`)
  return [...css, ...js].map((l) => `  ${l}
`).join('')
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const ROUTES = ['/', '/work/qwerttclients', '/work/kinoqwertt', '/lab']
for (const lang of ['en', 'ru']) {
  for (const path of ROUTES) {
    const m = meta(lang, path)
    const url = (lang === 'ru' ? '/ru' : '') + (path === '/' ? '' : path) || '/'
    const html = template
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(m.description)}" />`)
      .replace('</head>', `${routeLinks(lang, path)}</head>`)
      .replace(marker, `<div id="root" data-route="${url}">${render(lang, path)}</div>`)
    const dir = `${root}dist${lang === 'ru' ? '/ru' : ''}${path === '/' ? '' : path}`
    await mkdir(dir, { recursive: true })
    await writeFile(`${dir}/index.html`, html)
    console.log(`prerendered ${dir.replace(root, '')}/index.html`)
  }
}
await rm(`${root}dist-ssr`, { recursive: true, force: true })
