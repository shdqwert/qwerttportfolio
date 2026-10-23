import { useEffect, useLayoutEffect, useSyncExternalStore } from 'react'

export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function subscribe(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }
}

// Server snapshot is the "full motion desktop" variant so hydration matches;
// the client re-renders immediately if the query differs.
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(subscribe(query), () => window.matchMedia(query).matches, () => serverValue)
}

export const useReduced = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useNarrow = () => useMediaQuery('(max-width: 1023px)')
export const useStatic = () => {
  const r = useReduced()
  const n = useNarrow()
  return r || n
}

export const rnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
