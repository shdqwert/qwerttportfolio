// Image pipeline: every JPEG/PNG under public/assets gets AVIF + WebP variants
// at 1× (640 px) and 2× (1200 px, or the original width if smaller), plus a
// manifest with intrinsic sizes used by <Img>. Run: npm run images
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(root, 'public/assets')
const OUT = join(root, 'public/assets/opt')
const WIDTHS = [640, 1200]

async function walk(dir) {
  const out = []
  for (const name of await readdir(dir)) {
    const p = join(dir, name)
    if (p.startsWith(OUT)) continue
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)))
    else if (/\.(jpe?g|png)$/i.test(name)) out.push(p)
  }
  return out
}

const manifest = {}
for (const file of await walk(SRC)) {
  const rel = relative(SRC, file).replace(/\\/g, '/')
  const key = rel.replace(/\.(jpe?g|png)$/i, '')
  const meta = await sharp(file).metadata()
  const entry = { src: `/assets/${rel}`, w: meta.width, h: meta.height, avif: [], webp: [] }
  const pixel = /pixel/.test(rel)
  for (const w of WIDTHS) {
    const width = Math.min(w, meta.width)
    if (entry.avif.some((x) => x.w === width)) continue
    const base = join(OUT, `${key}-${width}`)
    await mkdir(join(base, '..'), { recursive: true })
    const resized = () => sharp(file).resize({ width, kernel: pixel ? 'nearest' : 'lanczos3' })
    await resized().avif({ quality: 52, effort: 4 }).toFile(`${base}.avif`)
    await resized().webp({ quality: 74 }).toFile(`${base}.webp`)
    entry.avif.push({ w: width, src: `/assets/opt/${key}-${width}.avif` })
    entry.webp.push({ w: width, src: `/assets/opt/${key}-${width}.webp` })
  }
  manifest[key] = entry
  process.stdout.write('.')
}
await writeFile(join(root, 'src/content/images.json'), JSON.stringify(manifest, null, 1))
console.log(`\n${Object.keys(manifest).length} images → src/content/images.json`)
