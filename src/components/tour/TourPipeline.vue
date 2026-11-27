<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../AppIcon.vue'
import { I } from './icons'

interface Deal {
  id: string
  title: string
  amt: number
  date: string
  prob: number
  who: string
  col: number
}

const cols = [
  { name: 'Qualification', c: '#3b82f6' },
  { name: 'Proposal', c: '#6366f1' },
  { name: 'Negotiation', c: '#10b981' },
  { name: 'Contract sent', c: '#f59e0b' },
  { name: 'Closed won', c: '#16a34a' },
]
const base: Deal[] = [
  { id: 'a', title: 'Lakshmi Textiles · Rollout', amt: 380000, date: 'Dec 04', prob: 25, who: 'AS', col: 0 },
  { id: 'b', title: 'Orbit Logistics · 40 seats', amt: 210000, date: 'Dec 11', prob: 25, who: 'MK', col: 0 },
  { id: 'c', title: 'Metro Retail · 100 users', amt: 240000, date: 'Nov 29', prob: 50, who: 'MK', col: 1 },
  { id: 'd', title: 'Sunrise Clinics · Suite', amt: 860000, date: 'Nov 27', prob: 70, who: 'AS', col: 2 },
  { id: 'e', title: 'Kalla Foods · Annual', amt: 190000, date: 'Nov 18', prob: 100, who: 'MK', col: 4 },
]
const acme = { id: 'acme', title: 'Acme Textiles · Spring catalogue', amt: 420000, date: 'Nov 28', prob: 60, who: 'MK' }

const stage = ref(1)
const probs = [60, 60, 80, 90, 100]
const events = [
  null,
  null,
  'Quote QT-0148 accepted by Priya',
  'Sales order SO-0092 created, no re-typing',
  'Invoice INV-0231 raised · ₹4,95,600 incl. GST',
]
const toast = computed(() => events[stage.value])

const board = computed(() =>
  cols.map((c, i) => {
    const deals: Deal[] = base.filter((d) => d.col === i)
    if (stage.value === i) deals.push({ ...acme, col: i, prob: probs[i]! })
    return { ...c, deals, total: deals.reduce((s, d) => s + d.amt, 0) }
  }),
)
const lakh = (n: number) => '₹' + (n / 100000).toFixed(1) + 'L'
const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

let timers: number[] = []
onMounted(() => {
  ;[1500, 3100, 4700].forEach((ms, i) => timers.push(window.setTimeout(() => (stage.value = i + 2), ms)))
})
onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <div class="relative h-full px-5 py-4 text-[11px] text-[#1a1f36]">
    <div class="fu flex items-center justify-between" style="--d: 0s">
      <h3 class="text-[20px] font-bold">All Deals <span class="text-[#8b8fa3]">⌄</span></h3>
      <div class="flex items-center gap-2 text-[11px] font-medium">
        <span class="rounded-md bg-white px-3 py-1.5 ring-1 ring-black/10">Stats</span>
        <span class="flex rounded-md bg-[#eceef6] p-0.5">
          <span class="rounded bg-white px-3 py-1 text-[#4f35d6] shadow-sm">Pipeline</span>
          <span class="px-3 py-1 text-[#6b6f85]">List</span>
        </span>
        <span class="flex items-center gap-1 rounded-md bg-[#4f35d6] px-3 py-1.5 font-semibold text-white">
          <AppIcon :path="I.plus" :size="11" :stroke="2.8" /> New Deal
        </span>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-5 gap-2">
      <div
        v-for="(col, ci) in board"
        :key="col.name"
        class="fu overflow-hidden rounded-lg"
        :style="{ '--d': 0.08 + ci * 0.07 + 's', background: col.c + '14' }"
      >
        <div class="flex items-center justify-between px-2 py-1.5 font-semibold text-white" :style="{ background: col.c }">
          <span class="truncate">{{ col.name }}</span>
          <span class="rounded bg-white/25 px-1.5 text-[10px]">{{ col.deals.length }}</span>
        </div>
        <p class="px-2 pt-1 text-[10px] font-semibold tabular-nums" :style="{ color: col.c }">{{ lakh(col.total) }}</p>

        <TransitionGroup name="list" tag="div" class="relative min-h-[150px] space-y-1.5 p-1.5">
          <div
            v-for="d in col.deals"
            :key="d.id"
            class="rounded-md bg-white p-2 shadow-sm ring-1 transition-shadow duration-500"
            :class="d.id === 'acme' ? 'shadow-lg ring-2 ring-[#4f35d6]' : 'ring-black/[0.06]'"
          >
            <p class="font-semibold leading-tight">{{ d.title }}</p>
            <p class="mt-1.5 font-semibold tabular-nums text-emerald-600">{{ inr(d.amt) }}</p>
            <p class="mt-0.5 text-[10px] text-[#8b8fa3]">{{ d.date }} · <span class="font-semibold text-blue-600">{{ d.prob }}%</span></p>
            <span class="mt-1.5 grid size-4 place-items-center rounded-full bg-[#3b4256] text-[7px] font-bold text-white">{{ d.who }}</span>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <Transition name="fade-slide" mode="out-in">
      <div
        v-if="toast"
        :key="stage"
        class="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#1a1f36] py-2 pl-2.5 pr-4 text-[11px] font-medium text-white shadow-xl"
      >
        <span class="grid size-4.5 place-items-center rounded-full bg-emerald-500">
          <AppIcon :path="I.check" :size="10" :stroke="3.4" />
        </span>
        {{ toast }}
      </div>
    </Transition>
  </div>
</template>
