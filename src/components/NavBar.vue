<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ArivuLogo from './ArivuLogo.vue'
import { DEMO_URL, LOGIN_URL, TRIAL_URL } from '../data/apps'

const progress = ref(0)
const scrolled = ref(false)
const open = ref(false)
const current = ref('')

const links = [
  { id: 'product', label: 'Product' },
  { id: 'platform', label: 'Platform' },
  { id: 'flow', label: 'Quote to cash' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'industries', label: 'Industries' },
  { id: 'astra', label: 'Astra' },
  { id: 'faq', label: 'FAQ' },
]

const onScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? window.scrollY / max : 0
  scrolled.value = window.scrollY > 24

  // back at the very top: drop any stale #section from the address bar
  if (window.scrollY < 8 && location.hash) history.replaceState(null, '', location.pathname + location.search)

  // highlight the link whose section currently covers the middle of the viewport (none at the top)
  const mid = window.innerHeight * 0.45
  let found = ''
  for (const l of links) {
    const r = document.getElementById(l.id)?.getBoundingClientRect()
    if (r && r.top <= mid && r.bottom > mid) found = l.id
  }
  current.value = found
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})

watch(open, (v) => (document.body.style.overflow = v ? 'hidden' : ''))
const close = () => (open.value = false)
</script>

<template>
  <div
    class="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-sales via-marketing to-audit"
    :style="{ transform: `scaleX(${progress})` }"
  />
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="
      scrolled || open
        ? 'bg-white/80 backdrop-blur-2xl backdrop-saturate-[1.8]'
        : 'bg-transparent'
    "
  >
    <nav class="mx-auto flex max-w-6xl items-center justify-between py-3.5" aria-la\bel="Main">
      <ArivuLogo />

      <ul class="hidden items-center gap-0.5 lg:flex">
        <li v-for="l in links" :key="l.id">
          <a
            :href="`#${l.id}`"
            class="relative rounded-lg px-3.5 py-2 text-sm font-medium transition"
            :class="current === l.id ? 'bg-sales/10 text-sales' : 'text-ink/65 hover:bg-ink/5 hover:text-ink'"
            >{{ l.label }}</a
          >
        </li>
      </ul>

      <div class="flex items-center gap-1.5">
        <a :href="LOGIN_URL" class="hidden rounded-lg px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-ink/5 hover:text-ink sm:block">Log in</a>
        <a :href="DEMO_URL" class="hidden rounded-lg border border-ink/15 bg-white px-4 py-2 text-sm font-semibold transition hover:border-ink/40 xl:block">Get a demo</a>
        <a :href="TRIAL_URL" class="btn btn-primary !px-5 !py-2.5 text-sm">Start free trial</a>
        <button
          class="grid size-10 place-items-center rounded-lg transition hover:bg-ink/5 lg:hidden"
          :aria-expanded="open"
          aria-label="Menu"
          @click="open = !open"
        >
          <span class="relative block h-3.5 w-5">
            <span class="absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-300" :class="open ? 'top-1.5 rotate-45' : 'top-0'" />
            <span class="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-ink transition-all duration-300" :class="open ? 'opacity-0' : ''" />
            <span class="absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-300" :class="open ? 'top-1.5 -rotate-45' : 'top-3'" />
          </span>
        </button>
      </div>
    </nav>
  </header>

  <!-- mobile menu -->
  <Transition name="menu">
    <div v-if="open" class="fixed inset-0 z-40 flex flex-col bg-paper/95 px-6 pb-8 pt-28 backdrop-blur-2xl lg:hidden">
      <ul class="space-y-1">
        <li v-for="(l, i) in links" :key="l.id" :style="{ animation: `rise .6s ${i * 60}ms cubic-bezier(.2,.8,.2,1) both` }">
          <a :href="`#${l.id}`" class="block rounded-xl px-3 py-3 font-display text-3xl font-bold" @click="close">{{ l.label }}</a>
        </li>
      </ul>
      <div class="mt-auto grid gap-3">
        <a :href="TRIAL_URL" class="btn btn-primary justify-center text-lg">Start free trial</a>
        <a :href="DEMO_URL" class="btn btn-ghost justify-center text-lg">Get a demo</a>
        <a :href="LOGIN_URL" class="py-2 text-center font-semibold text-ink/60">Log in</a>
      </div>
    </div>
  </Transition>
</template>

<style>
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
