<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { APPS } from '../data/apps'
import { useInView } from '../composables/useInView'

const services = [
  { name: 'Automation', icon: 'M13 2L4 14h7l-1 8 9-12h-7z' },
  { name: 'Permissions', icon: 'M6 11V8a6 6 0 0112 0v3M5 11h14v10H5zM12 15v2' },
  { name: 'Documents', icon: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6' },
  { name: 'Search', icon: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4' },
  { name: 'Astra AI', icon: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z' },
  { name: 'Notifications', icon: 'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 21h4' },
  { name: 'Analytics', icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2' },
]
const data = [
  { name: 'People', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-7 8-7s8 3 8 7' },
  { name: 'Organizations', icon: 'M4 21V5l8-2v18M12 9h8v12M7 9h2M7 13h2M7 17h2M15 13h2M15 17h2' },
  { name: 'Activity', icon: 'M3 12h4l3-8 4 16 3-8h4' },
  { name: 'Relationships', icon: 'M7 7a3 3 0 100 .01M17 17a3 3 0 100 .01M9.5 9.5l5 5' },
  { name: 'Audit trail', icon: 'M12 8v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z' },
]

const active = ref(0)
const section = ref<HTMLElement | null>(null)
const visible = useInView(section, 0.3)
const hovering = ref(false)
let timer = 0
const stop = () => clearInterval(timer)
const start = () => {
  stop()
  timer = window.setInterval(() => !hovering.value && (active.value = (active.value + 1) % APPS.length), 2200)
}
watch(visible, (v) => (v ? start() : stop()))
onBeforeUnmount(stop)
const cur = computed(() => APPS[active.value])
const pick = (i: number) => {
  hovering.value = true
  active.value = i
}
</script>

<template>
  <section id="platform" ref="section" class="relative isolate overflow-hidden px-5 py-20 sm:py-28">
    <div class="pointer-events-none absolute -left-40 top-10 -z-10 size-[34rem] rounded-full bg-sales/15 blur-[120px]" />
    <div class="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_1.15fr]">
      <div v-reveal>
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-mute">The Arivu platform</p>
        <h2 class="font-display text-[clamp(2rem,4.4vw,3.7rem)] font-extrabold leading-[0.95]">
          One platform.<br /><span class="gradient-text">Every essential business process.</span>
        </h2>
        <p class="mt-6 max-w-md text-base text-ink/65 sm:text-lg">
          Build with the apps you need today. Add more tomorrow. They all sit on the same services
          and the same data, so nothing is ever rebuilt.
        </p>

        <ul class="mt-9 space-y-5">
          <li v-for="p in [
            ['One platform', 'All apps. One unified experience.', '#4f46e5'],
            ['One process', 'Process-first design that matches how you work.', '#00b894'],
            ['One source', 'One source of truth across your entire business.', '#ff9f1c'],
            ['One outcome', 'Clarity to execute. Confidence to grow.', '#ff4d8d'],
          ]" :key="p[0]" class="flex items-start gap-4">
            <span class="mt-1 size-3 shrink-0 rounded-full" :style="{ background: p[2], boxShadow: `0 0 0 5px ${p[2]}22` }" />
            <span><b class="font-display text-xl">{{ p[0] }}</b><span class="block text-ink/60">{{ p[1] }}</span></span>
          </li>
        </ul>
      </div>

      <!-- the stack -->
      <div v-reveal="150" class="lego-stack" @mouseleave="hovering = false">
        <!-- callout -->
        <div class="mb-9 flex h-14 items-end justify-center">
          <Transition name="fade-slide" mode="out-in">
            <div :key="cur.key" class="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-lg ring-1 ring-ink/5">
              <span class="size-2.5 rounded-full" :style="{ background: cur.color }" />
              <span class="text-sm"><b>{{ cur.name }}</b> <span class="text-ink/55">· {{ cur.blurb }}</span></span>
            </div>
          </Transition>
        </div>

        <!-- tier 1: apps -->
        <div class="relative z-20 mx-auto grid max-w-[34rem] grid-cols-4 gap-x-2.5 gap-y-5 sm:grid-cols-7">
          <button
            v-for="(a, i) in APPS"
            :key="a.key"
            class="lego lego-drop"
            :class="{ 'is-active': i === active }"
            :style="{ '--c': a.color, '--i': i }"
            :aria-label="a.name"
            @mouseenter="pick(i)"
            @focus="pick(i)"
            @click="pick(i)"
          >
            <AppIcon :path="a.icon" :size="22" />
            <span class="mt-1 text-[0.68rem] font-bold leading-none">{{ a.name }}</span>
          </button>
        </div>

        <!-- tier 2: services -->
        <div class="relative z-10 mx-auto -mt-1 max-w-[38rem] rounded-[1.6rem] border border-ink/10 bg-white p-4 pt-5 shadow-[0_20px_40px_-25px_rgb(26_31_54/0.4)] lego-slab" style="--i: 8">
          <div class="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.25em] text-sales">Platform services</div>
          <div class="grid grid-cols-4 gap-2 sm:grid-cols-7">
            <div v-for="s in services" :key="s.name" class="flex flex-col items-center gap-1.5 rounded-xl py-2 text-center transition hover:-translate-y-0.5 hover:bg-sales/5">
              <AppIcon :path="s.icon" :size="19" class="text-sales" />
              <span class="text-[0.65rem] font-semibold leading-tight text-ink/70">{{ s.name }}</span>
            </div>
          </div>
        </div>

        <!-- tier 3: data -->
        <div class="relative mx-auto -mt-1 max-w-[42rem] rounded-[1.8rem] bg-ink p-4 pt-5 text-white shadow-[0_30px_50px_-25px_rgb(26_31_54/0.8)] lego-slab" style="--i: 10">
          <div class="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/50">Shared data foundation</div>
          <div class="grid grid-cols-3 gap-2 sm:grid-cols-5">
            <div v-for="d in data" :key="d.name" class="flex flex-col items-center gap-1.5 rounded-xl bg-white/[0.07] py-2.5 text-center transition hover:bg-white/15">
              <AppIcon :path="d.icon" :size="19" class="text-white/90" />
              <span class="text-[0.65rem] font-semibold leading-tight text-white/80">{{ d.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.lego {
  --c: #4f46e5;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 0.98;
  border-radius: 0.9rem;
  color: white;
  cursor: pointer;
  background: linear-gradient(180deg, color-mix(in oklab, var(--c) 78%, white), var(--c));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.5),
    inset 0 -4px 0 rgb(0 0 0 / 0.14),
    0 12px 20px -10px color-mix(in oklab, var(--c) 80%, black);
  transition:
    transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1),
    box-shadow 0.4s;
}
/* studs */
.lego::before,
.lego::after {
  content: '';
  position: absolute;
  top: -7px;
  width: 26%;
  height: 9px;
  border-radius: 5px 5px 0 0;
  background: linear-gradient(180deg, color-mix(in oklab, var(--c) 70%, white), var(--c));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.5);
}
.lego::before {
  left: 16%;
}
.lego::after {
  right: 16%;
}
.lego.is-active {
  transform: translateY(-12px) scale(1.07);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.5),
    inset 0 -4px 0 rgb(0 0 0 / 0.14),
    0 26px 30px -12px color-mix(in oklab, var(--c) 90%, black);
}

/* blocks drop onto the stack once revealed */
.lego-drop,
.lego-slab {
  opacity: 0;
}
.lego-stack.in .lego-drop {
  animation: lego-drop 0.9s calc(0.9s + var(--i) * 90ms) cubic-bezier(0.3, 1.4, 0.5, 1) both;
}
.lego-stack.in .lego-slab {
  animation: lego-drop 0.9s calc(0.6s + var(--i) * 40ms) cubic-bezier(0.3, 1.2, 0.5, 1) both;
}
/* uses the individual translate/scale properties so the hover/active `transform` is unaffected */
@keyframes lego-drop {
  0% {
    opacity: 0;
    translate: 0 -120px;
    scale: 0.9;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    translate: 0 0;
    scale: 1;
  }
}
</style>
