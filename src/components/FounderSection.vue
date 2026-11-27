<script setup lang="ts">
import { APPS, DEMO_URL, TRIAL_URL } from '../data/apps'
import { FOUNDER_LOCK_MONTHS, FOUNDER_SPOTS, TRIAL_DAYS } from '../data/pricing'

const dots = Array.from({ length: FOUNDER_SPOTS }, (_, i) => {
  const row = Math.floor(i / 20)
  const col = i % 20
  return { i, delay: (row + col) * 90, color: APPS[i % APPS.length].color }
})
</script>

<template>
  <section id="founders" class="relative isolate px-5 pb-20 pt-6 sm:pb-28">
    <div class="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-ink px-6 py-20 text-center text-white sm:px-14 sm:py-28 noise">
      <div class="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div class="absolute -left-20 -top-20 size-[28rem] rounded-full bg-sales/50 blur-[120px]" style="animation: blob 18s ease-in-out infinite" />
        <div class="absolute -right-20 bottom-[-6rem] size-[28rem] rounded-full bg-marketing/40 blur-[120px]" style="animation: blob 22s ease-in-out infinite reverse" />
      </div>

      <div class="relative">
        <p v-reveal class="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Founder's Launch</p>
        <h2 v-reveal="80" class="font-display text-[clamp(2.2rem,5vw,4.3rem)] font-extrabold leading-[0.92]">
          Be one of the first <span class="gradient-text">{{ FOUNDER_SPOTS }}.</span>
        </h2>
        <p v-reveal="160" class="mx-auto mt-7 max-w-xl text-base text-white/65 sm:text-lg">
          The first {{ FOUNDER_SPOTS }} customers lock today's prices for {{ FOUNDER_LOCK_MONTHS }}
          months. Whatever we charge later, you don't.
        </p>

        <!-- 100 spots -->
        <div v-reveal="200" class="mx-auto mt-12 grid max-w-md grid-cols-20 gap-1.5 sm:gap-2" style="grid-template-columns: repeat(20, minmax(0, 1fr))" aria-label="100 founder spots">
          <span v-for="d in dots" :key="d.i" class="aspect-square rounded-full" :style="{ background: d.color, animation: `wave 2.4s ${d.delay}ms ease-in-out infinite` }" />
        </div>

        <div v-reveal="260" class="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a :href="TRIAL_URL" class="btn btn-light">Start {{ TRIAL_DAYS }}-day trial</a>
          <a :href="DEMO_URL" class="btn border border-white/25 text-white hover:bg-white/10">Talk to us</a>
        </div>

        <ul v-reveal="320" class="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
          <li>✦ {{ TRIAL_DAYS }}-day free trial</li>
          <li>✦ {{ FOUNDER_LOCK_MONTHS }}-month price lock</li>
          <li>✦ Annual = 2 months free</li>
          <li>✦ Priced in ₹, per seat</li>
        </ul>
      </div>
    </div>
  </section>
</template>
