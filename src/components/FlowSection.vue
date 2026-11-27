<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useInView } from '../composables/useInView'

interface Stage {
  key: string
  label: string
  doc: string
  number: string
  amount: string
  status: string
  note: string
  color: string
  rows: [string, string][]
}

// Illustrative data: one deal, carried all the way to cash. Nothing retyped.
const stages: Stage[] = [
  {
    key: 'deal',
    label: 'Deal',
    doc: 'Deal',
    number: 'Spring catalogue rollout',
    amount: '₹4,20,000',
    status: 'Negotiation · 70%',
    note: 'Lines roll up into the deal amount automatically.',
    color: '#4f46e5',
    rows: [['Fabric lot A × 200', '₹2,40,000'], ['Fabric lot B × 120', '₹1,80,000']],
  },
  {
    key: 'quote',
    label: 'Quote',
    doc: 'Quote',
    number: 'QT-0148',
    amount: '₹4,20,000',
    status: 'Accepted by customer',
    note: 'Generated from the deal. Approvals and acceptance built in.',
    color: '#ff4d8d',
    rows: [['Fabric lot A × 200', '₹2,40,000'], ['Fabric lot B × 120', '₹1,80,000']],
  },
  {
    key: 'order',
    label: 'Sales Order',
    doc: 'Sales order',
    number: 'SO-0093',
    amount: '₹4,20,000',
    status: 'Fulfilling from stock',
    note: 'Fulfilment talks to Inventory. Stock is reserved, not guessed.',
    color: '#ff9f1c',
    rows: [['Reserved · Warehouse 2', '320 units'], ['Delivery note', 'DN-0071']],
  },
  {
    key: 'invoice',
    label: 'Invoice',
    doc: 'Invoice',
    number: 'INV-0231',
    amount: '₹4,95,600',
    status: 'Sent · due in 15 days',
    note: 'Billed from the order. Tax added, nothing retyped.',
    color: '#2f7bff',
    rows: [['Subtotal', '₹4,20,000'], ['GST 18%', '₹75,600']],
  },
  {
    key: 'payment',
    label: 'Payment',
    doc: 'Payment',
    number: 'PAY-0412',
    amount: '₹4,95,600',
    status: 'Paid · allocated',
    note: 'Pay links, gateways and allocations close the loop.',
    color: '#00b894',
    rows: [['Via payment link', 'UPI'], ['Allocated to', 'INV-0231']],
  },
]

const active = ref(0)
const section = ref<HTMLElement | null>(null)
const visible = useInView(section, 0.3)
const manual = ref(false)
let timer = 0

const start = () => {
  stop()
  timer = window.setInterval(() => (active.value = (active.value + 1) % stages.length), 2600)
}
const stop = () => clearInterval(timer)

watch(visible, (v) => (v && !manual.value ? start() : stop()))
onBeforeUnmount(stop)

const pick = (i: number) => {
  manual.value = true
  active.value = i
  stop()
}
const resume = () => {
  manual.value = false
  if (visible.value) start()
}

const current = computed(() => stages[active.value])
const pct = computed(() => (active.value / (stages.length - 1)) * 100)
</script>

<template>
  <section id="flow" ref="section" class="relative isolate overflow-hidden bg-ink px-5 py-20 text-white sm:py-28">
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[140px] transition-colors duration-1000"
      :style="{ background: current.color }"
    />
    <div class="mx-auto max-w-6xl">
      <div v-reveal class="mx-auto max-w-3xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Quote to cash</p>
        <h2 class="font-display text-[clamp(2rem,4.4vw,3.7rem)] font-extrabold leading-[0.95]">
          One deal. <span class="gradient-text">One line</span> all the way to paid.
        </h2>
        <p class="mt-6 text-base text-white/60 sm:text-lg">
          Every document is born from the one before it. Nothing is re-typed, nothing is pasted
          between tools.
        </p>
      </div>

      <!-- track -->
      <div v-reveal="150" class="mt-20" @mouseleave="resume">
        <div class="relative mx-auto max-w-4xl">
          <!-- inset by half a node button so line + token align with node centres -->
          <div class="absolute inset-x-10 top-0 h-full sm:inset-x-14" aria-hidden="true">
            <div class="absolute left-0 right-0 top-6 h-1 -translate-y-1/2 rounded-full bg-white/10" />
            <div
              class="absolute left-0 top-6 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-sales via-marketing to-helpdesk transition-all duration-700 ease-out"
              :style="{ width: pct + '%' }"
            />
            <div
              class="absolute top-6 z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_30px_8px_rgb(255_255_255/0.5)] transition-all duration-700 ease-out"
              :style="{ left: pct + '%' }"
            />
          </div>
          <ol class="relative z-20 flex justify-between">
            <li v-for="(s, i) in stages" :key="s.key">
              <button
                class="group flex w-20 -translate-x-0 flex-col items-center gap-3 sm:w-28"
                @click="pick(i)"
                @mouseenter="pick(i)"
              >
                <span
                  class="grid size-12 place-items-center rounded-full border-2 font-display text-lg font-bold transition-all duration-500"
                  :class="i <= active ? 'scale-100 text-white' : 'scale-90 border-white/20 bg-ink text-white/40'"
                  :style="i <= active ? { background: s.color, borderColor: s.color } : {}"
                >
                  <svg v-if="i < active" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                  <template v-else>{{ i + 1 }}</template>
                </span>
                <span
                  class="text-center text-xs font-semibold transition sm:text-sm"
                  :class="i === active ? 'text-white' : 'text-white/45 group-hover:text-white/80'"
                  >{{ s.label }}</span
                >
              </button>
            </li>
          </ol>
        </div>

        <!-- document card -->
        <div class="relative mx-auto mt-14 grid max-w-4xl items-stretch gap-6 md:grid-cols-[1.1fr_1fr]">
          <div class="relative min-h-[17rem]">
            <Transition name="fade-slide" mode="out-in">
              <div
                :key="current.key"
                class="absolute inset-0 rounded-3xl bg-white p-7 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <div class="text-xs font-bold uppercase tracking-widest" :style="{ color: current.color }">
                      {{ current.doc }}
                    </div>
                    <div class="mt-1 font-display text-xl font-bold">{{ current.number }}</div>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold text-white"
                    :style="{ background: current.color }"
                    >{{ current.status }}</span
                  >
                </div>
                <div class="mt-5 space-y-2.5 border-y border-ink/10 py-4 text-sm">
                  <div v-for="r in current.rows" :key="r[0]" class="flex justify-between text-ink/70">
                    <span>{{ r[0] }}</span>
                    <span class="font-medium text-ink">{{ r[1] }}</span>
                  </div>
                </div>
                <div class="mt-4 flex items-end justify-between">
                  <span class="text-sm text-ink/50">Total</span>
                  <span class="font-display text-4xl font-extrabold">{{ current.amount }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
            <Transition name="fade-slide" mode="out-in">
              <div :key="current.key">
                <div class="text-sm font-semibold text-white/50">Step {{ active + 1 }} of {{ stages.length }}</div>
                <p class="mt-3 font-display text-2xl font-bold leading-snug">{{ current.note }}</p>
              </div>
            </Transition>
            <div class="mt-8 flex gap-1.5">
              <span
                v-for="(s, i) in stages"
                :key="s.key"
                class="h-1 flex-1 rounded-full transition-all duration-500"
                :style="{ background: i <= active ? s.color : 'rgb(255 255 255 / .12)' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
