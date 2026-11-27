<script setup lang="ts">
import AppIcon from '../AppIcon.vue'
import { APPS } from '../../data/apps'
import { I } from './icons'

const apps = ['sales', 'audit', 'helpdesk', 'marketing', 'inventory']
  .map((k) => APPS.find((a) => a.key === k)!)

const next = [
  { t: 'Send revised quote to Acme Textiles', due: 'Today', hot: true },
  { t: 'Follow up: Monsoon launch campaign', due: 'Tomorrow' },
  { t: 'Review audit AU-204 · Warehouse 2', due: 'Fri' },
]
const recent = [
  { t: 'Case #1042 · Fabric batch delayed', m: 'Helpdesk · 2 hours ago', icon: I.mail },
  { t: 'Quote QT-0148 · Acme Textiles', m: 'Sales · 3 hours ago', icon: I.quotes },
  { t: 'Stock reserved · 320 units', m: 'Inventory · yesterday', icon: I.box },
  { t: 'Invoice INV-0231 · viewed by customer', m: 'Portal · yesterday', icon: I.invoices },
]
</script>

<template>
  <div class="px-5 py-4 text-[12px] text-[#1a1f36]">
    <h3 class="fu text-[21px] font-bold" style="--d: 0s">Good morning, Meera</h3>

    <div class="fu mt-3 rounded-lg bg-white p-3 ring-1 ring-black/[0.06]" style="--d: 0.08s">
      <p class="mb-2 text-[11px] font-semibold">What do you need to do right now?</p>
      <div class="flex gap-2">
        <div class="flex flex-1 items-center gap-2 rounded-md bg-[#f5f5fa] px-3 py-2 text-[#8b8fa3]">
          <AppIcon :path="I.search" :size="13" />
          Search records, run commands…
          <span class="ml-auto rounded bg-white px-1.5 py-px text-[9px] ring-1 ring-black/5">⌘K</span>
        </div>
        <span class="flex items-center gap-1 rounded-md bg-[#4f35d6] px-4 py-2 font-semibold text-white">
          <AppIcon :path="I.plus" :size="12" :stroke="2.6" /> Create
        </span>
      </div>
    </div>

    <div class="fu mt-2.5 rounded-lg bg-white p-3 ring-1 ring-black/[0.06]" style="--d: 0.16s">
      <p class="text-[11px] font-semibold">Today</p>
      <p class="mt-1 text-[#4a4f66]">Priority: 1 SLA at risk</p>
      <div class="mt-2 flex flex-wrap gap-1.5 text-[10px] font-medium">
        <span class="fu rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-100" style="--d: 0.35s">● 1 deal closing soon</span>
        <span class="fu rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-100" style="--d: 0.45s">● 8 open cases team-wide</span>
        <span class="fu rounded-full bg-red-50 px-2.5 py-1 text-red-700 ring-1 ring-red-100" style="--d: 0.55s">● 1 SLA at risk</span>
      </div>
    </div>

    <div class="fu mt-2.5 rounded-lg bg-white p-3 ring-1 ring-black/[0.06]" style="--d: 0.24s">
      <p class="mb-2 text-[11px] font-semibold">Your apps <span class="ml-1 font-medium text-[#4f35d6]">Explore apps →</span></p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(a, i) in apps"
          :key="a.key"
          class="fu flex items-center gap-1.5 rounded-full py-1 pl-1.5 pr-3 font-semibold"
          :style="{ '--d': 0.4 + i * 0.08 + 's', background: a.color + '1a', color: a.color }"
        >
          <span class="grid size-5 place-items-center rounded-full" :style="{ background: a.color + '26' }">
            <AppIcon :path="a.icon" :size="11" />
          </span>
          <span class="text-[#1a1f36]">{{ a.name }}</span>
          <span v-if="a.key === 'helpdesk'" class="size-1.5 rounded-full bg-red-500" />
        </span>
      </div>
    </div>

    <p class="fu mb-1.5 mt-3 text-[11px] font-semibold" style="--d: 0.3s">Workspace</p>
    <div class="grid grid-cols-2 gap-2.5">
      <div class="fu rounded-lg bg-white p-3 ring-1 ring-black/[0.06]" style="--d: 0.34s">
        <p class="mb-2 text-[11px] font-semibold">Up next</p>
        <div
          v-for="(n, i) in next"
          :key="n.t"
          class="fu flex items-center gap-2 border-t border-black/5 py-1.5"
          :style="{ '--d': 0.6 + i * 0.12 + 's' }"
        >
          <span class="size-3.5 rounded border border-[#c9cde0]" />
          <span class="flex-1 truncate">{{ n.t }}</span>
          <span class="rounded-full px-2 py-0.5 text-[9px] font-semibold" :class="n.hot ? 'bg-red-50 text-red-600' : 'bg-[#f1f2f8] text-[#6b6f85]'">{{ n.due }}</span>
        </div>
      </div>
      <div class="fu rounded-lg bg-white p-3 ring-1 ring-black/[0.06]" style="--d: 0.42s">
        <p class="mb-2 text-[11px] font-semibold">Recent</p>
        <div
          v-for="(r, i) in recent"
          :key="r.t"
          class="fu flex items-center gap-2 border-t border-black/5 py-1.5"
          :style="{ '--d': 0.7 + i * 0.12 + 's' }"
        >
          <span class="grid size-6 shrink-0 place-items-center rounded-md bg-[#f1f2f8] text-[#6b6f85]">
            <AppIcon :path="r.icon" :size="12" />
          </span>
          <span class="min-w-0">
            <span class="block truncate font-medium">{{ r.t }}</span>
            <span class="block text-[9px] text-[#8b8fa3]">{{ r.m }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
