import type { DependencyList, RefObject } from 'react'
import { gsap } from './engine'
import { useIsoLayoutEffect } from './hooks'

// Drop-in for @gsap/react's useGSAP (callback + { scope, dependencies }).
// Instead of running every component's GSAP setup inside the hydration commit
// — one long task that blocks input — setups queue up and run one per task,
// yielding to the browser in between. Registration and cleanup stay in a layout
// effect: the revert must run before React removes the DOM (pinned elements
// sit inside ScrollTrigger's pin-spacers until reverted).
type Config = { scope?: RefObject<Element | null>; dependencies?: DependencyList }
type Job = { run: () => void; dead: boolean }

const queue: Job[] = []
let pumping = false
const channel = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null

const post = () => (channel ? channel.port2.postMessage(0) : void setTimeout(pump))

function pump() {
  const job = queue.shift()
  if (job && !job.dead) job.run()
  if (queue.length) post()
  else pumping = false
}
if (channel) channel.port1.onmessage = pump

function schedule(job: Job) {
  queue.push(job)
  if (pumping) return
  pumping = true
  post()
}

export function useGSAP(setup: () => void | (() => void), config: Config = {}) {
  const { scope, dependencies = [] } = config
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {}, scope?.current ?? undefined)
    const job: Job = { dead: false, run: () => ctx.add(setup) }
    schedule(job)
    return () => {
      job.dead = true
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
