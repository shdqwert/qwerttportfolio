// Decode lazy images about one and a half screens before they scroll in, so the
// first frame that shows a large screenshot does not wait for its decode.
export function initPredecode(root: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return
  const io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue
        const img = e.target as HTMLImageElement
        io.unobserve(img)
        img.loading = 'eager'
        img.decode?.().catch(() => {})
      }
    },
    { rootMargin: '150% 0px' }
  )
  const scan = (n: ParentNode) => n.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => io.observe(img))
  scan(root)
  new MutationObserver((ms) => {
    for (const m of ms) m.addedNodes.forEach((n) => n instanceof HTMLElement && (n.tagName === 'IMG' ? n.getAttribute('loading') === 'lazy' && io.observe(n) : scan(n)))
  }).observe(root, { childList: true, subtree: true })
}
