import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import { ScrollTrigger } from '../motion/engine'

// Progressive hydration for heavy blocks far down the page (finale, footer,
// playground). The prerender renders them in full; in the browser they sit in
// their own chunk behind a Suspense boundary, so the server HTML stays on
// screen and hydrates when the chunk arrives — off the critical path.
const ssrWait: Promise<unknown>[] = []
export const deferredReady = () => Promise.all(ssrWait)

export function deferred<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  if (import.meta.env.SSR) {
    let C: ComponentType<P> | null = null
    ssrWait.push(load().then((m) => (C = m.default)))
    // same tree as the client (Suspense boundary + Refresh) so hydration matches
    return function DeferredSsr(props: P) {
      return (
        <Suspense fallback={null}>
          {C && <C {...props} />}
          <Refresh />
        </Suspense>
      )
    }
  }
  const L = lazy(load)
  return function Deferred(props: P) {
    return (
      <Suspense fallback={null}>
        <L {...props} />
        <Refresh />
      </Suspense>
    )
  }
}

// a late block may add pins / height: re-measure every trigger once it is in
function Refresh() {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [])
  return null
}
