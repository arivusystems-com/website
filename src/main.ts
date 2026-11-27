import { createApp } from 'vue'
import App from './App.vue'
import { vReveal } from './composables/useReveal'
import './style.css'

createApp(App).directive('reveal', vReveal).mount('#app')

// Keep the reader where they were on refresh. The browser's own restoration races with
// late layout changes (fonts, the scaled product window) and with `scroll-behavior: smooth`,
// which made the page drift back up. We restore the position ourselves, instantly.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const KEY = 'arivu:scrollY'
let saveTimer = 0
window.addEventListener(
  'scroll',
  () => {
    clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => sessionStorage.setItem(KEY, String(Math.round(window.scrollY))), 100)
  },
  { passive: true },
)

const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
const isReload = nav?.type === 'reload' || nav?.type === 'back_forward'
const saved = Number(sessionStorage.getItem(KEY) ?? 0)
const jump = (top: number) => window.scrollTo({ top, left: 0, behavior: 'instant' as ScrollBehavior })

if (isReload && saved > 0) {
  // restore now, then again once fonts/images have settled, unless the reader has moved
  let moved = false
  const mark = () => (moved = true)
  ;['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((e) => window.addEventListener(e, mark, { once: true, passive: true }))
  jump(saved)
  const again = () => !moved && jump(saved)
  document.fonts?.ready.then(again)
  window.addEventListener('load', () => setTimeout(again, 50), { once: true })
} else if (location.hash) {
  // fresh visit to a deep link: go straight to the section, no animation
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
  if (target) requestAnimationFrame(() => jump(target.getBoundingClientRect().top + window.scrollY - 80))
}
