// Injects the server-rendered page into dist/index.html so the content is in
// the HTML before any JavaScript runs (no empty hero, works without JS).
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)

const file = `${root}dist/index.html`
const html = await readFile(file, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) throw new Error('Root marker not found in dist/index.html')

await writeFile(file, html.replace(marker, `<div id="root">${render()}</div>`))
await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log('prerendered dist/index.html')
