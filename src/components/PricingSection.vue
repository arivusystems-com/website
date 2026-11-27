<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { appByKey, DEMO_URL, TRIAL_URL } from '../data/apps'
import {
  ANNUAL_MULTIPLIER,
  APP_PRICES,
  GST_RATE,
  LEARNING_TIERS,
  SEAT_PRICES,
  TRIAL_DAYS,
  type PricedAppKey,
} from '../data/pricing'
import { inr, useCountUp } from '../composables/useCountUp'
import { annual, learningOn, monthly, picked, planFlash, seats, tier } from '../composables/usePlan'

const flashing = ref(false)
let flashTimer = 0
watch(planFlash, () => {
  flashing.value = true
  clearTimeout(flashTimer)
  flashTimer = window.setTimeout(() => (flashing.value = false), 2200)
})

const pricedApps = Object.keys(APP_PRICES) as PricedAppKey[]

const seatRows = [
  { key: 'admin', label: 'Admin', hint: 'Configures everything', price: SEAT_PRICES.admin, min: 1 },
  { key: 'standard', label: 'Standard', hint: 'Does the daily work', price: SEAT_PRICES.standard, min: 0 },
  { key: 'portal', label: 'Portal', hint: 'Your customers, from', price: SEAT_PRICES.portal, min: 0 },
] as const

const bump = (k: keyof typeof seats, d: number, min: number) => {
  seats[k] = Math.min(999, Math.max(min, seats[k] + d))
}

interface Line {
  id: string
  label: string
  detail: string
  amount: number
  color: string
}

const lines = computed<Line[]>(() => {
  const out: Line[] = []
  for (const r of seatRows) {
    if (seats[r.key] > 0)
      out.push({
        id: r.key,
        label: `${seats[r.key]} × ${r.label}`,
        detail: `${inr(r.price)} each`,
        amount: seats[r.key] * r.price,
        color: '#1a1f36',
      })
  }
  for (const k of pricedApps) {
    if (picked[k])
      out.push({ id: k, label: appByKey(k).name, detail: 'App', amount: APP_PRICES[k], color: appByKey(k).color })
  }
  if (learningOn.value) {
    const t = LEARNING_TIERS[tier.value]
    out.push({ id: 'learning', label: 'Learning', detail: `${t.learners} learners`, amount: t.price, color: appByKey('learning').color })
  }
  return out
})

const total = computed(() => (annual.value ? monthly.value * ANNUAL_MULTIPLIER : monthly.value))
const saved = computed(() => (annual.value ? monthly.value * (12 - ANNUAL_MULTIPLIER) : 0))
const gst = computed(() => Math.round(total.value * GST_RATE))

const shownTotal = useCountUp(total, 800)
const shownGst = useCountUp(gst, 800)
const shownSaved = useCountUp(saved, 800)
</script>

<template>
  <section id="pricing" class="relative isolate overflow-hidden px-5 py-20 sm:py-28">
    <div class="pointer-events-none absolute -right-40 top-20 -z-10 size-[36rem] rounded-full bg-helpdesk/20 blur-[120px]" />
    <div class="mx-auto max-w-6xl">
      <div v-reveal class="mx-auto max-w-3xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-mute">Pricing, as a toy</p>
        <h2 class="font-display text-[clamp(2rem,4.4vw,3.7rem)] font-extrabold leading-[0.95]">
          Build your <span class="gradient-text">own price.</span>
        </h2>
        <p class="mt-6 text-base text-ink/65 sm:text-lg">
          Pay for seats and the apps you actually switch on. No tiers to decode, no sales call to
          see a number.
        </p>
      </div>

      <div class="mt-16 grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
        <!-- controls -->
        <div class="space-y-8">
          <!-- billing toggle -->
          <div v-reveal class="inline-flex items-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-ink/10">
            <button
              class="rounded-lg px-6 py-2.5 text-sm font-semibold transition"
              :class="!annual ? 'bg-ink text-white shadow' : 'text-ink/60'"
              @click="annual = false"
            >
              Monthly
            </button>
            <button
              class="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition"
              :class="annual ? 'bg-ink text-white shadow' : 'text-ink/60'"
              @click="annual = true"
            >
              Annual
              <span class="rounded-full bg-helpdesk px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white">2 months free</span>
            </button>
          </div>

          <!-- seats -->
          <div v-reveal class="rounded-[2rem] border border-ink/10 bg-white p-6 sm:p-8">
            <h3 class="font-display text-2xl font-bold">1 · Your people</h3>
            <div class="mt-5 divide-y divide-ink/10">
              <div v-for="r in seatRows" :key="r.key" class="flex items-center justify-between gap-4 py-4">
                <div>
                  <div class="font-semibold">{{ r.label }}</div>
                  <div class="text-sm text-ink/55">{{ r.hint }} {{ inr(r.price) }}/mo</div>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    class="grid size-10 place-items-center rounded-lg bg-paper text-xl font-bold ring-1 ring-ink/10 transition hover:scale-110 hover:bg-ink hover:text-white active:scale-90 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-paper disabled:hover:text-ink"
                    :disabled="seats[r.key] <= r.min"
                    :aria-label="`Fewer ${r.label} seats`"
                    @click="bump(r.key, -1, r.min)"
                  >
                    −
                  </button>
                  <span class="w-10 text-center font-display text-3xl font-extrabold tabular-nums">{{ seats[r.key] }}</span>
                  <button
                    class="grid size-10 place-items-center rounded-lg bg-paper text-xl font-bold ring-1 ring-ink/10 transition hover:scale-110 hover:bg-ink hover:text-white active:scale-90"
                    :aria-label="`More ${r.label} seats`"
                    @click="bump(r.key, 1, r.min)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- apps -->
          <div v-reveal>
            <h3 class="mb-4 font-display text-2xl font-bold">2 · Your apps</h3>
            <div class="grid gap-3 sm:grid-cols-2">
              <button
                v-for="k in pricedApps"
                :key="k"
                class="group relative flex items-center gap-4 overflow-hidden rounded-3xl border-2 bg-white p-4 text-left transition duration-300 hover:-translate-y-1"
                :style="{ borderColor: picked[k] ? appByKey(k).color : 'rgb(26 31 54 / .1)' }"
                :aria-pressed="picked[k]"
                @click="picked[k] = !picked[k]"
              >
                <span
                  class="absolute inset-0 -z-0 origin-left transition-transform duration-500"
                  :style="{ background: appByKey(k).color + '14', transform: picked[k] ? 'scaleX(1)' : 'scaleX(0)' }"
                />
                <span
                  class="relative grid size-12 shrink-0 place-items-center rounded-2xl text-white transition-transform duration-300 group-hover:rotate-6"
                  :style="{ background: appByKey(k).color }"
                >
                  <AppIcon :path="appByKey(k).icon" />
                </span>
                <span class="relative min-w-0 flex-1">
                  <span class="block font-semibold">{{ appByKey(k).name }}</span>
                  <span class="block truncate text-sm text-ink/55">{{ appByKey(k).blurb }}</span>
                </span>
                <span class="relative text-right">
                  <span class="block font-display text-lg font-bold">{{ inr(APP_PRICES[k]) }}</span>
                  <span
                    class="mt-1 grid size-6 place-items-center rounded-full border-2 transition"
                    :style="picked[k] ? { background: appByKey(k).color, borderColor: appByKey(k).color } : { borderColor: 'rgb(26 31 54 / .2)' }"
                  >
                    <svg v-if="picked[k]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="animation: pop 0.35s both"><path d="M5 12l5 5 9-10" /></svg>
                  </span>
                </span>
              </button>

              <!-- learning -->
              <div
                class="relative overflow-hidden rounded-3xl border-2 bg-white p-4 sm:col-span-2"
                :style="{ borderColor: learningOn ? appByKey('learning').color : 'rgb(26 31 54 / .1)' }"
              >
                <button class="flex w-full items-center gap-4 text-left" :aria-pressed="learningOn" @click="learningOn = !learningOn">
                  <span class="grid size-12 shrink-0 place-items-center rounded-2xl text-white" :style="{ background: appByKey('learning').color }">
                    <AppIcon :path="appByKey('learning').icon" />
                  </span>
                  <span class="flex-1">
                    <span class="block font-semibold">Learning</span>
                    <span class="block text-sm text-ink/55">{{ appByKey('learning').blurb }} Priced by learner capacity.</span>
                  </span>
                  <span
                    class="grid size-6 place-items-center rounded-full border-2 transition"
                    :style="learningOn ? { background: appByKey('learning').color, borderColor: appByKey('learning').color } : { borderColor: 'rgb(26 31 54 / .2)' }"
                  >
                    <svg v-if="learningOn" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="animation: pop 0.35s both"><path d="M5 12l5 5 9-10" /></svg>
                  </span>
                </button>
                <div
                  class="grid transition-all duration-500"
                  :style="{ gridTemplateRows: learningOn ? '1fr' : '0fr' }"
                >
                  <div class="overflow-hidden">
                    <div class="mt-4 grid grid-cols-3 gap-2">
                      <button
                        v-for="(t, i) in LEARNING_TIERS"
                        :key="t.learners"
                        class="rounded-2xl border-2 px-3 py-3 text-center transition hover:-translate-y-0.5"
                        :style="
                          tier === i
                            ? { borderColor: appByKey('learning').color, background: appByKey('learning').color + '14' }
                            : { borderColor: 'rgb(26 31 54 / .1)' }
                        "
                        @click="tier = i"
                      >
                        <span class="block font-display text-xl font-extrabold">{{ t.learners }}</span>
                        <span class="block text-xs text-ink/55">learners</span>
                        <span class="mt-1 block text-sm font-semibold">{{ inr(t.price) }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- receipt -->
        <aside v-reveal="150" class="lg:sticky lg:top-24">
          <div
            class="relative overflow-hidden rounded-[2rem] bg-ink p-7 text-white shadow-[0_40px_80px_-30px_rgb(79_70_229/0.6)] transition-all duration-500"
            :class="flashing ? 'scale-[1.025] ring-4 ring-marketing/60' : 'ring-0 ring-transparent'"
          >
            <div class="absolute -right-10 -top-10 size-40 rounded-full bg-sales/50 blur-3xl" />
            <div class="relative">
              <div class="flex items-center justify-between text-sm text-white/55">
                <span>Your Arivu</span>
                <span>{{ annual ? 'per year' : 'per month' }}</span>
              </div>

              <div class="relative mt-5 min-h-[3rem]">
                <TransitionGroup name="list" tag="ul" class="relative space-y-2.5">
                  <li v-for="l in lines" :key="l.id" class="flex items-center justify-between gap-3 text-sm">
                    <span class="flex items-center gap-2.5">
                      <span class="size-2.5 rounded-full ring-2 ring-white/30" :style="{ background: l.color === '#1a1f36' ? '#fff' : l.color }" />
                      <span class="font-medium">{{ l.label }}</span>
                      <span class="text-white/40">{{ l.detail }}</span>
                    </span>
                    <span class="tabular-nums text-white/80">{{ inr(annual ? l.amount * ANNUAL_MULTIPLIER : l.amount) }}</span>
                  </li>
                </TransitionGroup>
              </div>

              <div class="mt-6 border-t border-dashed border-white/20 pt-6">
                <div class="font-display text-[3rem] font-extrabold leading-none tabular-nums sm:text-5xl">
                  {{ inr(shownTotal) }}
                </div>
                <div class="mt-2 text-sm text-white/50">+ {{ inr(shownGst) }} GST (18%)</div>
                <div class="mt-3 h-7">
                  <Transition name="fade-slide" mode="out-in">
                    <span v-if="annual" class="inline-block rounded-md bg-helpdesk px-3 py-1 text-sm font-bold">
                      You save {{ inr(shownSaved) }} a year
                    </span>
                    <span v-else class="text-sm text-white/45">Switch to annual to get 2 months free</span>
                  </Transition>
                </div>
              </div>

              <a :href="TRIAL_URL" class="btn btn-light mt-6 w-full justify-center text-lg">
                Start {{ TRIAL_DAYS }}-day trial
              </a>
              <a :href="DEMO_URL" class="mt-3 block rounded-lg py-2.5 text-center text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                Prefer a walkthrough? Talk to us →
              </a>
              <p class="mt-2 text-center text-xs text-white/40">
                Founder customers lock this price for 24 months.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
