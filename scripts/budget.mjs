// Initial-JS budget gate: for every prerendered page, sums the gzip size of the
// entry script + its modulepreloads + the chunks main.tsx awaits before the
// first render (route page, RU copy). Fails above BUDGET_KB.
import { readFileSync, readdirSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BUDGET_KB = 180
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const assets = readdirSync(join(dist, 'assets'))
const gz = (f) => gzipSync(readFileSync(join(dist, 'assets', f))).length
const chunk = (prefix) => assets.find((a) => a.startsWith(prefix + '-') && a.endsWith('.js'))

const PAGES = { '': 'Home', 'work/qwerttclients/': 'CaseQc', 'work/kinoqwertt/': 'CaseKino', 'lab/': 'Lab' }
let fail = false
for (const lang of ['', 'ru/']) {
  for (const [path, page] of Object.entries(PAGES)) {
    const html = readFileSync(join(dist, lang, path, 'index.html'), 'utf8')
    const files = new Set([...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)].map((m) => m[1]))
    if (page) files.add(chunk(page))
    if (lang) files.add(chunk('ru'))
    const kb = [...files].filter(Boolean).reduce((n, f) => n + gz(f), 0) / 1024
    if (kb > BUDGET_KB) fail = true
    console.log(`${kb > BUDGET_KB ? 'FAIL' : 'ok  '} /${lang}${path}`.padEnd(34), `${kb.toFixed(1)} KB gzip`)
  }
}
console.log(`budget ${BUDGET_KB} KB`)
process.exit(fail ? 1 : 0)
