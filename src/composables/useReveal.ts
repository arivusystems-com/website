import type { Directive } from 'vue'

const io =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io!.unobserve(e.target)
            }
          }
        },
        { threshold: 0.06, rootMargin: '0px 0px -4% 0px' },
      )
    : null

/** v-reveal or v-reveal="delayMs" — fades/blurs an element in when it scrolls into view. */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    if (io) io.observe(el)
    else el.classList.add('in')
  },
  unmounted(el) {
    io?.unobserve(el)
  },
}
