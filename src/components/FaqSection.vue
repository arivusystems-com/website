<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_URL } from '../data/apps'
import { FAQS as faqs } from '../data/faqs'

const open = ref<number | null>(0)
</script>

<template>
  <section id="faq" class="relative px-5 py-20 sm:py-28">
    <div class="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
      <div v-reveal class="lg:sticky lg:top-28 lg:self-start">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-mute">Questions</p>
        <h2 class="font-display text-[clamp(2rem,4vw,3.3rem)] font-extrabold leading-[0.95]">
          Frequently <span class="gradient-text">asked.</span>
        </h2>
        <p class="mt-6 max-w-sm text-base text-ink/65 sm:text-lg">Still curious? Talk to someone who knows the product inside out.</p>
        <a :href="DEMO_URL" class="btn btn-primary mt-8">Talk to us</a>
      </div>

      <div v-reveal="100" class="space-y-3">
        <div
          v-for="(f, i) in faqs"
          :key="f.q"
          class="overflow-hidden rounded-3xl border bg-white transition-colors duration-300"
          :class="open === i ? 'border-sales/40 shadow-[0_20px_40px_-25px_rgb(79_70_229/0.5)]' : 'border-ink/10'"
        >
          <h3>
            <button
              class="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-lg font-bold sm:text-xl"
              :aria-expanded="open === i"
              @click="open = open === i ? null : i"
            >
              {{ f.q }}
              <span class="relative grid size-8 shrink-0 place-items-center rounded-lg transition-colors duration-300" :class="open === i ? 'bg-sales text-white' : 'bg-ink/5'">
                <span class="absolute h-0.5 w-3.5 rounded bg-current" />
                <span class="absolute h-3.5 w-0.5 rounded bg-current transition-transform duration-300" :class="open === i ? 'scale-y-0' : ''" />
              </span>
            </button>
          </h3>
          <div class="grid transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" :style="{ gridTemplateRows: open === i ? '1fr' : '0fr' }">
            <div class="overflow-hidden">
              <p class="px-6 pb-6 pr-14 leading-relaxed text-ink/65">{{ f.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
