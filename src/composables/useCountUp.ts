import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

/** Tweens a number toward `target` with an ease-out curve. */
export function useCountUp(target: Ref<number>, duration = 700) {
  const display = ref(target.value)
  let raf = 0

  watch(target, (to) => {
    cancelAnimationFrame(raf)
    const from = display.value
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      display.value = Math.round(from + (to - from) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => cancelAnimationFrame(raf))
  return display
}

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')
