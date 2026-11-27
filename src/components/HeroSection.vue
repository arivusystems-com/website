<script setup lang="ts">
import { ref } from 'vue'
import ProductTour from './ProductTour.vue'
import { DEMO_URL, TRIAL_URL } from '../data/apps'
import { FOUNDER_SPOTS, TRIAL_DAYS } from '../data/pricing'

const hero = ref<HTMLElement | null>(null)

// cursor parallax -> CSS vars on the hero (drives a gentle tilt of the product window)
const onMove = (e: PointerEvent) => {
  const el = hero.value
  if (!el) return
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
  el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
}
const onLeave = () => {
  hero.value?.style.setProperty('--mx', '0')
  hero.value?.style.setProperty('--my', '0')
}

const headline1 = ['One', 'customer.']
const headline2 = ['Every', 'app.']
</script>

<template>
  <section
    id="top"
    ref="hero"
    class="relative isolate overflow-hidden px-5 pb-14 pt-24 sm:pt-28 lg:pb-16"
    style="--mx: 0; --my: 0"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <!-- aurora blobs -->
    <div class="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" aria-hidden="true">
      <div class="absolute -left-32 top-10 size-[34rem] rounded-full bg-sales/30 blur-[110px]" style="animation: blob 18s ease-in-out infinite" />
      <div class="absolute right-[-8rem] top-32 size-[30rem] rounded-full bg-marketing/25 blur-[110px]" style="animation: blob 22s ease-in-out infinite reverse" />
      <div class="absolute bottom-[-8rem] left-1/3 size-[28rem] rounded-full bg-audit/25 blur-[110px]" style="animation: blob 26s ease-in-out infinite" />
    </div>

    <!-- copy -->
    <div class="mx-auto max-w-4xl text-center">
      <a
        href="#founders"
        class="mb-7 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-white/80 py-1.5 pl-2 pr-4 text-sm font-medium shadow-sm backdrop-blur transition hover:-translate-y-0.5"
        style="animation: pop 0.8s 0.1s both"
      >
        <span class="relative grid place-items-center">
          <span class="size-2.5 rounded-full bg-helpdesk" />
          <span class="absolute size-2.5 rounded-full bg-helpdesk" style="animation: ping-soft 1.8s ease-out infinite" />
        </span>
        Founder's Launch · {{ FOUNDER_SPOTS }} spots · 24-month price lock →
      </a>

      <h1 class="font-display text-[clamp(2.6rem,6.4vw,5rem)] font-extrabold leading-[0.92]" aria-label="One customer. Every app.">
        <span class="block overflow-hidden pb-[0.25em] -mb-[0.17em] sm:mr-[0.25em] sm:inline-block">
          <span
            v-for="(w, i) in headline1"
            :key="w"
            class="mr-[0.22em] inline-block last:mr-0"
            :style="{ animation: `rise 1s ${0.15 + i * 0.1}s cubic-bezier(.2,.8,.2,1) both` }"
            >{{ w }}</span
          >
        </span>
        <span class="block overflow-hidden pb-[0.25em] -mb-[0.17em] sm:inline-block">
          <span
            v-for="(w, i) in headline2"
            :key="w"
            class="gradient-text mr-[0.22em] inline-block pb-[0.2em] -mb-[0.2em] last:mr-0"
            :style="{ animation: `rise 1s ${0.4 + i * 0.1}s cubic-bezier(.2,.8,.2,1) both, gradient-pan 7s linear infinite` }"
            >{{ w }}</span
          >
        </span>
      </h1>

      <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg" style="animation: rise 1s 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both">
        Arivu is the business platform built around your customer, not your departments. Sales,
        Helpdesk, Audit, Inventory and Marketing share one record, from first enquiry to final
        payment.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-4" style="animation: rise 1s 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) both">
        <a :href="TRIAL_URL" class="btn btn-primary">
          Start {{ TRIAL_DAYS }}-day trial
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
        <a href="#pricing" class="btn btn-ghost">Build your price</a>
      </div>
      <p class="mt-5 text-sm text-ink/55" style="animation: rise 1s 1s cubic-bezier(0.2, 0.8, 0.2, 1) both">
        {{ TRIAL_DAYS }}-day trial · Priced in ₹ per seat · Annual = 2 months free ·
        <a :href="DEMO_URL" class="font-semibold text-ink underline decoration-sales/40 underline-offset-4 transition hover:decoration-sales">Prefer a walkthrough?</a>
      </p>
    </div>

    <!-- the real product -->
    <div
      id="product"
      class="relative mx-auto mt-12 max-w-6xl scroll-mt-24 sm:mt-14"
      style="
        transform: perspective(1800px) rotateX(calc(var(--my) * -1.5deg)) rotateY(calc(var(--mx) * 2deg));
        transition: transform 0.35s ease-out;
        animation: rise 1.2s 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
      "
    >
      <div class="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 rounded-[3rem] bg-gradient-to-br from-sales/25 via-marketing/15 to-audit/20 blur-3xl" aria-hidden="true" />
      <ProductTour />
      <p class="mt-4 text-center text-xs text-mute">Screens redrawn from the live app, shown with sample data.</p>
    </div>
  </section>
</template>
