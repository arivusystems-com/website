<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../AppIcon.vue'
import { I } from './icons'

// Email beside the customer record, with Astra reading the mood. Sample data.
const step = ref(0)
const reply = ref('')
const REPLY =
  'Hi Priya, done. Order SO-0092 now ships to Pune (Warehouse 2) and invoice INV-0231 is attached. Anything else, just reply here.'

const older = [
  { who: 'Kalla Foods', sub: 'PO 8841 received', t: '9:12' },
  { who: 'Metro Retail', sub: 'Re: 100 user licences', t: '8:47' },
  { who: 'Sunrise Clinics', sub: 'Demo follow-up', t: 'Tue' },
]
const threads = computed(() =>
  step.value >= 1 ? [{ who: 'Priya Raman', sub: 'Re: Quote QT-0148 · delivery address', t: 'Now', fresh: true }, ...older] : older,
)

const insights = [
  ['Sentiment', 'Positive', 'text-emerald-600'],
  ['Urgency', 'Medium', 'text-amber-600'],
  ['Intent', 'Change request', 'text-[#4f35d6]'],
] as const

let timers: number[] = []
let typer = 0
const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    step.value = 4
    reply.value = REPLY
    return
  }
  at(800, () => (step.value = 1))
  at(1600, () => (step.value = 2))
  at(2800, () => (step.value = 3))
  at(4000, () => {
    step.value = 4
    typer = window.setInterval(() => {
      reply.value = REPLY.slice(0, reply.value.length + 2)
      if (reply.value.length >= REPLY.length) clearInterval(typer)
    }, 24)
  })
})
onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  clearInterval(typer)
})
</script>

<template>
  <div class="flex h-full text-[11px] text-[#1a1f36]">
    <!-- thread list -->
    <div class="w-[205px] shrink-0 border-r border-black/[0.06] bg-white/60 p-3">
      <div class="fu flex items-center justify-between" style="--d: 0s">
        <h3 class="text-[17px] font-bold">Inbox</h3>
        <span class="flex items-center gap-1 rounded-md bg-[#4f35d6] px-2.5 py-1 font-semibold text-white">
          <AppIcon :path="I.plus" :size="10" :stroke="3" /> Compose
        </span>
      </div>
      <div class="fu mt-2.5 flex gap-1.5 text-[10px]" style="--d: 0.06s">
        <span class="rounded-md bg-[#4f35d6] px-2.5 py-0.5 font-semibold text-white">All</span>
        <span class="rounded-md bg-white px-2.5 py-0.5 text-[#6b6f85] ring-1 ring-black/[0.08]">Unread</span>
        <span class="rounded-md bg-white px-2.5 py-0.5 text-[#6b6f85] ring-1 ring-black/[0.08]">Sent</span>
      </div>
      <TransitionGroup name="list" tag="ul" class="relative mt-3 space-y-1">
        <li
          v-for="t in threads"
          :key="t.who"
          class="rounded-lg px-2.5 py-2 transition-colors duration-500"
          :class="'fresh' in t ? 'bg-[#eeeaff] ring-1 ring-[#4f35d6]/30' : 'bg-white ring-1 ring-black/[0.05]'"
        >
          <p class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 font-semibold">
              <i v-if="'fresh' in t" class="size-1.5 rounded-full bg-[#4f35d6]" />{{ t.who }}
            </span>
            <span class="text-[9px] text-[#8b8fa3]">{{ t.t }}</span>
          </p>
          <p class="mt-0.5 truncate text-[10px] text-[#6b6f85]">{{ t.sub }}</p>
        </li>
      </TransitionGroup>
    </div>

    <!-- message -->
    <div class="min-w-0 flex-1 p-4">
      <Transition name="fade-slide">
        <div v-if="step >= 2">
          <h3 class="text-[17px] font-bold leading-tight">Re: Quote QT-0148 · delivery address</h3>
          <div class="mt-3 rounded-lg bg-white p-3.5 ring-1 ring-black/[0.06]">
            <p class="flex items-center justify-between text-[10px] text-[#8b8fa3]">
              <span><b class="text-[#1a1f36]">Priya Raman</b> · priya@acme-textiles.example</span>
              <span>Today, 9:41</span>
            </p>
            <p class="mt-2.5 leading-relaxed text-[#3b4256]">
              Hi team, thanks for the quote. Can we ship to our Pune warehouse instead of Mumbai? Also, could you send the
              invoice once the order is confirmed?
            </p>
          </div>

          <Transition name="fade-slide">
            <div v-if="step >= 4" class="mt-3 rounded-lg bg-white p-3.5 ring-2 ring-[#4f35d6]/40">
              <p class="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-[#4f35d6]">
                <AppIcon :path="I.sparkle" :size="11" /> Suggested reply by Astra
              </p>
              <p class="min-h-[3.4rem] leading-relaxed text-[#3b4256]">
                {{ reply }}<i v-if="reply.length < REPLY.length" class="ml-px inline-block h-3 w-px translate-y-0.5 bg-[#4f35d6]" style="animation: blink 0.8s steps(2) infinite" />
              </p>
              <div v-if="reply.length >= REPLY.length" class="fu mt-2 flex gap-2 font-semibold" style="--d: 0s">
                <span class="rounded-md bg-[#4f35d6] px-3 py-1.5 text-white">Send</span>
                <span class="rounded-md bg-white px-3 py-1.5 text-[#6b6f85] ring-1 ring-black/10">Edit</span>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <!-- contact context -->
    <div class="w-[190px] shrink-0 border-l border-black/[0.06] bg-white p-3">
      <p class="text-[9px] font-semibold uppercase tracking-wide text-[#8b8fa3]">Contact context</p>
      <Transition name="fade-slide">
        <div v-if="step >= 2">
          <div class="mt-3 text-center">
            <span class="mx-auto grid size-11 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-[15px] font-bold text-white">P</span>
            <p class="mt-1.5 font-semibold">Priya Raman</p>
            <p class="text-[10px] text-[#8b8fa3]">Procurement · Acme Textiles</p>
          </div>

          <p class="mt-3.5 text-[9px] font-semibold uppercase tracking-wide text-[#8b8fa3]">Open deal</p>
          <div class="mt-1 rounded-md bg-[#f6f6fb] p-2">
            <p class="font-semibold">Spring catalogue</p>
            <p class="text-[10px] text-[#6b6f85]"><b class="text-emerald-600">₹4,20,000</b> · Negotiation</p>
          </div>

          <p class="mt-3 text-[9px] font-semibold uppercase tracking-wide text-[#8b8fa3]">Recent activity</p>
          <ul class="mt-1 space-y-1 text-[10px] text-[#6b6f85]">
            <li>Quote QT-0148 accepted</li>
            <li>Case #1042 resolved</li>
          </ul>

          <div class="mt-3 rounded-lg p-2.5 ring-1 ring-black/[0.08]">
            <p class="mb-1.5 flex items-center gap-1 text-[10px] font-semibold">
              <AppIcon :path="I.sparkle" :size="11" class="text-[#4f35d6]" /> Astra insights
            </p>
            <div v-for="(r, i) in insights" :key="r[0]" class="flex justify-between py-0.5 text-[10px]">
              <span class="text-[#8b8fa3]">{{ r[0] }}</span>
              <Transition name="fade-slide">
                <span v-if="step >= 3" class="font-semibold" :class="r[2]" :style="{ transitionDelay: i * 250 + 'ms' }">{{ r[1] }}</span>
              </Transition>
            </div>
            <span
              class="mt-1.5 block rounded-md py-1.5 text-center font-semibold text-white transition-colors duration-500"
              :class="step >= 4 ? 'bg-[#4f35d6]/60' : 'bg-[#4f35d6]'"
            >
              Suggest a reply
            </span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
