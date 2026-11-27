<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { APPS, type AppKey } from '../data/apps'

const app = (k: AppKey) => APPS.find((a) => a.key === k)!

// One customer question, answered two ways. Illustrative, not real customer data.
const W = 1000 // lane coordinate space (x)
const H = 84 // lane height in px (y)
const X0 = 40
const X1 = 960

const without = [
  { app: 'sales', title: 'Sales sheet', note: 'Ask Priya, she owns it', x: 100 },
  { app: 'helpdesk', title: 'Shared inbox', note: '1,204 emails to search', x: 300 },
  { app: 'inventory', title: 'Stock sheet', note: 'Last updated in May', x: 500 },
  { app: 'audit', title: 'Accounts', note: 'Needs the invoice no.', x: 700 },
  { app: 'portal', title: 'Email reply', note: 'Customer asked twice', x: 900 },
] as const
const withArivu = [
  { app: 'sales', title: 'Customer record', note: 'Every app, one place', x: 300 },
  { app: 'inventory', title: 'Order + stock + invoice', note: 'Shipped · INV-0231 paid', x: 560 },
  { app: 'portal', title: 'Answer sent', note: 'Address updated', x: 820 },
] as const

// the winding road the question takes without Arivu
const yL = (x: number) => H / 2 + 22 * Math.sin((x / W) * Math.PI * 5 + 0.5)
const roadD = (() => {
  let d = ''
  for (let x = X0; x <= X1; x += 8) d += `${d ? 'L' : 'M'}${x} ${yL(x).toFixed(1)} `
  return d
})()

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

// The race plays once on its own when the section scrolls into view (no scroll-jacking).
const DURATION = 3500 // ms for the whole story
// observe the lanes (not the whole section) so it also starts on short viewports
const el = ref<HTMLElement | null>(null)
const p = ref(0) // timeline progress 0..1
const played = ref(false)
let raf = 0
let io: IntersectionObserver | null = null

const play = () => {
  cancelAnimationFrame(raf)
  played.value = true
  const t0 = performance.now()
  const tick = (now: number) => {
    p.value = clamp((now - t0) / DURATION)
    if (p.value < 1) raf = requestAnimationFrame(tick)
  }
  p.value = 0
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    played.value = true
    p.value = 1
    return
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && !played.value) {
        play()
        io?.disconnect()
      }
    },
    { threshold: 0.05 },
  )
  if (el.value) io.observe(el.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  cancelAnimationFrame(raf)
})

// timeline: the right lane finishes by p=0.17, the left crawls until p=0.74
const rp = computed(() => easeOut(clamp(p.value / 0.17)))
const lp = computed(() => clamp(p.value / 0.74))
const rx = computed(() => X0 + rp.value * (X1 - X0))
const lx = computed(() => X0 + lp.value * (X1 - X0))
const ly = computed(() => yL(lx.value))

const rightDone = computed(() => rp.value >= 1)
const leftDone = computed(() => lp.value >= 1)

const pad = (n: number) => String(n).padStart(2, '0')
const rightClock = computed(() => `00:${pad(Math.min(12, Math.round(rp.value * 12)))}`)
const leftClock = computed(() => {
  if (leftDone.value) return '4 days'
  const h = Math.floor(lp.value * 96)
  return `${Math.floor(h / 24)}d ${pad(h % 24)}h`
})
const helped = computed(() => (rightDone.value ? Math.min(9, 1 + Math.floor(clamp((p.value - 0.2) / 0.6) * 9)) : 0))
const chased = computed(() => Math.max(0, without.filter((n) => lx.value >= n.x).length - 2))
const showEnd = computed(() => p.value > 0.77)
</script>

<template>
  <section id="why" class="relative">
    <!-- soft ambient glow -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(79_70_229/0.07),transparent)]"
      aria-hidden="true"
    />
    <div class="relative flex flex-col justify-center overflow-hidden px-5 py-20 sm:py-28">
      <div class="mx-auto w-full max-w-5xl">
        <!-- heading + the question -->
        <div class="text-center">
          <p class="mb-3 flex items-center justify-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-mute sm:text-xs">
            <span class="h-px w-6 bg-ink/20" />Why one record matters<span class="h-px w-6 bg-ink/20" />
          </p>
          <h2 class="text-balance font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] text-ink">
            One customer question.
            <span class="gradient-text">Two ways to answer it.</span>
          </h2>
          <div class="mt-6 inline-flex max-w-full items-center gap-3 rounded-3xl bg-white/80 py-1.5 pl-1.5 pr-5 text-left shadow-[0_1px_2px_rgb(26_31_54/0.05),0_8px_24px_-12px_rgb(26_31_54/0.18)] ring-1 ring-ink/[0.07] backdrop-blur">
            <span class="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">P</span>
            <span class="text-xs leading-snug text-ink/80 sm:truncate sm:text-sm">
              <span class="font-semibold text-ink">Priya, Acme Textiles</span>
              <span class="mx-1.5 text-ink/25">/</span>“Where is my order? Can you change the delivery address?”
            </span>
          </div>
        </div>

        <div ref="el" class="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
          <!-- WITHOUT -->
          <div class="rounded-2xl bg-white/50 px-4 pb-3 pt-4 ring-1 ring-ink/[0.07] sm:px-7 sm:pt-5">
            <div class="mb-2 flex items-center justify-between gap-3">
              <p class="flex items-center gap-2 whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ink/55 sm:text-xs sm:tracking-[0.2em]">
                <span class="size-1.5 rounded-full bg-rose-400" />Without Arivu
              </p>
              <div class="flex items-center gap-3">
                <span
                  v-if="chased"
                  class="whitespace-nowrap rounded-full bg-rose-50 px-2.5 py-0.5 text-[0.65rem] font-medium text-rose-700/80 ring-1 ring-rose-200/60 sm:text-[0.7rem]"
                >
                  <span class="sm:hidden">Chased {{ chased }}×</span><span class="hidden sm:inline">Customer chased {{ chased }}×</span>
                </span>
                <span
                  class="whitespace-nowrap font-display text-2xl font-bold tabular-nums leading-none transition-colors duration-300 sm:text-[2rem]"
                  :class="leftDone ? 'text-rose-600' : 'text-ink/35'"
                >
                  {{ leftClock }}
                </span>
              </div>
            </div>

            <div class="relative" :style="{ height: H + 'px' }">
              <svg class="absolute inset-0 size-full" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <clipPath id="race-l">
                    <rect x="0" y="0" :width="lx" :height="H" />
                  </clipPath>
                </defs>
                <path :d="roadD" fill="none" stroke="#1a1f36" stroke-opacity=".12" stroke-width="1.5" stroke-dasharray="2 6" stroke-linecap="round" vector-effect="non-scaling-stroke" />
                <path :d="roadD" fill="none" stroke="#e11d48" stroke-opacity=".75" stroke-width="2" stroke-linecap="round" clip-path="url(#race-l)" vector-effect="non-scaling-stroke" />
              </svg>

              <span
                v-for="n in without"
                :key="n.title"
                class="absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white ring-1 transition-all duration-300 ease-out"
                :class="lx >= n.x ? 'scale-100 text-rose-500/80 shadow-sm ring-rose-200' : 'scale-90 text-ink/20 ring-ink/10'"
                :style="{ left: n.x / 10 + '%', top: yL(n.x) + 'px' }"
              >
                <AppIcon :path="app(n.app).icon" :size="15" :stroke="1.75" />
              </span>

              <!-- the question -->
              <span
                class="absolute z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-[0.65rem] font-semibold text-white shadow-md ring-2 ring-white"
                :style="{ left: lx / 10 + '%', top: ly + 'px' }"
              >
                P
                <span v-if="lp > 0 && !leftDone" class="absolute inset-0 animate-ping rounded-full bg-ink/25" />
              </span>
            </div>

            <div class="relative h-9 sm:h-10">
              <div
                v-for="n in without"
                :key="n.title"
                class="absolute top-0 w-[19%] -translate-x-1/2 text-center leading-tight"
                :style="{ left: n.x / 10 + '%' }"
              >
                <p class="text-[0.6rem] font-medium transition-colors duration-300 sm:text-xs" :class="lx >= n.x ? 'text-ink' : 'text-ink/30'">{{ n.title }}</p>
                <p class="mt-0.5 hidden text-[0.65rem] text-rose-600/70 transition-opacity duration-300 sm:block" :class="lx >= n.x ? 'opacity-100' : 'opacity-0'">
                  {{ n.note }}
                </p>
              </div>
            </div>
          </div>

          <!-- WITH -->
          <div class="relative rounded-2xl bg-white px-4 pb-3 pt-4 shadow-[0_1px_2px_rgb(26_31_54/0.04),0_30px_60px_-30px_rgb(79_70_229/0.35)] ring-1 ring-ink/[0.08] sm:px-7 sm:pt-5">
            <span class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sales/60 to-transparent" />
            <div class="mb-2 flex items-center justify-between gap-3">
              <p class="flex items-center gap-2 whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sales sm:text-xs sm:tracking-[0.2em]">
                <span class="size-1.5 rounded-full bg-sales" />With Arivu
              </p>
              <div class="flex items-center gap-3">
                <span
                  v-if="helped"
                  class="whitespace-nowrap rounded-full bg-sales/[0.07] px-2.5 py-0.5 text-[0.65rem] font-medium tabular-nums text-sales ring-1 ring-sales/15 sm:text-[0.7rem]"
                >
                  <span class="sm:hidden">+{{ helped }} helped</span><span class="hidden sm:inline">+{{ helped }} more customers helped</span>
                </span>
                <span
                  class="whitespace-nowrap font-display text-2xl font-bold tabular-nums leading-none transition-colors duration-300 sm:text-[2rem]"
                  :class="rightDone ? 'text-sales' : 'text-ink/35'"
                >
                  {{ rightClock }}
                </span>
              </div>
            </div>

            <div class="relative" :style="{ height: H + 'px' }">
              <svg class="absolute inset-0 size-full" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="race-g" gradientUnits="userSpaceOnUse" :x1="X0" :x2="X1" y1="0" y2="0">
                    <stop offset="0" stop-color="#4f46e5" />
                    <stop offset="1" stop-color="#8b5cf6" />
                  </linearGradient>
                </defs>
                <line :x1="X0" :y1="H / 2" :x2="X1" :y2="H / 2" stroke="#1a1f36" stroke-opacity=".12" stroke-width="1.5" stroke-dasharray="2 6" stroke-linecap="round" vector-effect="non-scaling-stroke" />
                <line :x1="X0" :y1="H / 2" :x2="rx" :y2="H / 2" stroke="url(#race-g)" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke" />
              </svg>

              <span
                v-for="n in withArivu"
                :key="n.title"
                class="absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white transition-all duration-300 ease-out"
                :class="rx >= n.x ? 'scale-100' : 'scale-90 text-ink/20 ring-1 ring-ink/10'"
                :style="{
                  left: n.x / 10 + '%',
                  top: H / 2 + 'px',
                  color: rx >= n.x ? app(n.app).color : undefined,
                  boxShadow:
                    rx >= n.x
                      ? `0 0 0 1px ${app(n.app).color}55, 0 0 0 6px ${app(n.app).color}14, 0 8px 16px -6px ${app(n.app).color}66`
                      : undefined,
                }"
              >
                <AppIcon :path="app(n.app).icon" :size="16" :stroke="1.75" />
              </span>

              <span
                class="absolute z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-[0.65rem] font-semibold text-white shadow-md ring-2 ring-white"
                :style="{ left: rx / 10 + '%', top: H / 2 + 'px' }"
              >
                P
              </span>
              <span
                v-if="rightDone"
                class="absolute right-[1%] top-0 z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-sales/[0.08] px-2.5 py-0.5 text-[0.7rem] font-semibold text-sales ring-1 ring-sales/20"
                style="animation: pop 0.4s ease both"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                Answered
              </span>
            </div>

            <div class="relative h-9 sm:h-10">
              <div
                v-for="n in withArivu"
                :key="n.title"
                class="absolute top-0 w-[24%] -translate-x-1/2 text-center leading-tight"
                :style="{ left: n.x / 10 + '%' }"
              >
                <p class="text-[0.6rem] font-medium transition-colors duration-300 sm:text-xs" :class="rx >= n.x ? 'text-ink' : 'text-ink/30'">{{ n.title }}</p>
                <p class="mt-0.5 hidden text-[0.65rem] text-sales/75 transition-opacity duration-300 sm:block" :class="rx >= n.x ? 'opacity-100' : 'opacity-0'">
                  {{ n.note }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- the punchline -->
        <div class="relative mt-8 h-28 text-center sm:mt-10 sm:h-24">
          <div
            class="absolute inset-x-0 top-0 transition-all duration-700 ease-out"
            :class="showEnd ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'"
          >
            <p class="text-balance font-display text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-tight text-ink">
              Same question. <span class="whitespace-nowrap text-rose-600">4 days</span> <span class="text-ink/35">vs</span> <span class="whitespace-nowrap text-sales">12 seconds.</span>
            </p>
            <a href="#record" class="group mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-sales">
              See how one record does it
              <span class="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
            <p class="mt-1 text-[0.65rem] text-mute">
              Illustrative example ·
              <button type="button" class="font-medium underline-offset-2 hover:text-ink hover:underline" @click="play">Replay</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
