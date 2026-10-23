// Writes the server-rendered page into dist/index.html (English) and
// dist/ru/index.html (Russian), so content is in the HTML before any JS runs.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render, meta } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)

const template = await readFile(`${root}dist/index.html`, 'utf8')
const marker = '<div id="root"></div>'
if (!template.includes(marker)) throw new Error('Root marker not found in dist/index.html')

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

for (const [lang, out] of [['en', 'dist/index.html'], ['ru', 'dist/ru/index.html']]) {
  const m = meta(lang)
  const html = template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<title>.*?<\/title>/, `<title>${escape(m.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escape(m.description)}" />`)
    .replace(marker, `<div id="root">${render(lang)}</div>`)
  if (lang === 'ru') await mkdir(`${root}dist/ru`, { recursive: true })
  await writeFile(`${root}${out}`, html)
  console.log(`prerendered ${out}`)
}

await rm(`${root}dist-ssr`, { recursive: true, force: true })
