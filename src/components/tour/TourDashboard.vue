<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCountUp } from '../../composables/useCountUp'

const kpis = [
  { label: 'Total Revenue', l: 'R', c: '#16a34a', to: 184, f: (n: number) => `₹${(n / 10).toFixed(1)}L`, d: '+12.4%', up: true },
  { label: 'Pipeline Value', l: 'P', c: '#7c3aed', to: 426, f: (n: number) => `₹${(n / 10).toFixed(1)}L`, d: '+8.6%', up: true },
  { label: 'Forecast', l: 'F', c: '#2563eb', to: 248, f: (n: number) => `₹${(n / 10).toFixed(1)}L`, d: '+6.4%', up: true },
  { label: 'Win Rate', l: 'W', c: '#d97706', to: 32, f: (n: number) => `${n}%`, d: '+3.1%', up: true },
  { label: 'Avg Sales Cycle', l: 'S', c: '#e11d48', to: 28, f: (n: number) => `${n}d`, d: '-6.4%', up: false },
  { label: 'Pipeline Coverage', l: 'C', c: '#0d9488', to: 26, f: (n: number) => `${(n / 10).toFixed(1)}x`, d: '+5.4%', up: true },
]
const targets = kpis.map(() => ref(0))
const shown = targets.map((t) => useCountUp(t, 1300))
const bars = [4, 6, 5, 8, 7, 9, 8, 11]
const attain = ref(0)
const attainShown = useCountUp(attain, 1500)
onMounted(() => {
  targets.forEach((t, i) => (t.value = kpis[i]!.to))
  attain.value = 62
})

const funnel = [
  { s: 'New', n: 9, v: '₹10.4L', c: '#f59e0b' },
  { s: 'Qualification', n: 6, v: '₹9.8L', c: '#6366f1' },
  { s: 'Proposal', n: 4, v: '₹6.4L', c: '#3b82f6' },
  { s: 'Negotiation', n: 3, v: '₹15.9L', c: '#10b981' },
]
const months = [
  { m: 'Jan', h: 54 },
  { m: 'Feb', h: 70 },
  { m: 'Mar', h: 88 },
]
</script>

<template>
  <div class="px-5 py-4 text-[11px] text-[#1a1f36]">
    <div class="fu flex items-end justify-between" style="--d: 0s">
      <div>
        <h3 class="text-[21px] font-bold leading-none">Sales</h3>
        <p class="mt-1 text-[#8b8fa3]">Overview and insights for this workspace</p>
      </div>
      <div class="flex gap-1.5 text-[10px] font-medium">
        <span class="rounded-md bg-white px-2.5 py-1.5 ring-1 ring-black/10">Last 12 weeks</span>
        <span class="rounded-md bg-[#eceaff] px-2.5 py-1.5 text-[#4f35d6]">Refresh</span>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-6 gap-2">
      <div
        v-for="(k, i) in kpis"
        :key="k.label"
        class="fu rounded-lg bg-white p-2.5 ring-1 ring-black/[0.06]"
        :style="{ '--d': 0.08 + i * 0.07 + 's' }"
      >
        <p class="flex items-center gap-1.5 text-[10px] font-medium text-[#6b6f85]">
          <span class="grid size-4 place-items-center rounded text-[8px] font-bold text-white" :style="{ background: k.c }">{{ k.l }}</span>
          <span class="truncate">{{ k.label }}</span>
        </p>
        <p class="mt-1.5 text-[18px] font-bold leading-none tabular-nums">{{ k.f(shown[i]!.value) }}</p>
        <p class="mt-1 text-[9px] font-semibold" :class="k.up ? 'text-emerald-600' : 'text-rose-600'">{{ k.d }} <span class="font-normal text-[#8b8fa3]">vs prev</span></p>
        <div class="mt-1.5 flex h-5 items-end gap-0.5">
          <span
            v-for="(b, bi) in bars"
            :key="bi"
            class="gy w-full rounded-sm"
            :style="{ height: b * 8 + '%', background: k.c + '55', '--d': 0.3 + i * 0.07 + bi * 0.04 + 's' }"
          />
        </div>
      </div>
    </div>

    <div class="mt-2.5 grid grid-cols-[1.25fr_1fr] gap-2.5">
      <div class="fu rounded-lg bg-white p-3 ring-1 ring-black/[0.06]" style="--d: 0.5s">
        <div class="flex items-center justify-between">
          <p class="text-[13px] font-bold">Pipeline Health</p>
          <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">Watchlist active</span>
        </div>
        <div class="mt-2.5 space-y-1.5">
          <div v-for="(f, i) in funnel" :key="f.s" class="flex items-center gap-2">
            <div class="h-5 w-[58%] overflow-hidden rounded bg-black/[0.04]">
              <div
                class="gx flex h-full items-center rounded px-2 font-semibold text-white"
                :style="{ width: (f.n / 9) * 100 + '%', background: f.c, '--d': 0.7 + i * 0.12 + 's' }"
              >
                {{ f.s }}
              </div>
            </div>
            <span class="w-4 text-right font-semibold tabular-nums">{{ f.n }}</span>
            <span class="w-12 text-right tabular-nums text-[#6b6f85]">{{ f.v }}</span>
          </div>
        </div>
        <p class="fu mt-2.5 rounded-md bg-rose-50 px-2.5 py-1.5 text-[10px] text-rose-700 ring-1 ring-rose-100" style="--d: 1.3s">
          Biggest drop-off: Proposal → Negotiation. Run proposal aging review.
        </p>
      </div>

      <div class="fu rounded-lg bg-white p-3 ring-1 ring-black/[0.06]" style="--d: 0.58s">
        <p class="text-[13px] font-bold">Forecast Overview</p>
        <div class="mt-2 flex h-[74px] items-end gap-2.5">
          <div v-for="(m, i) in months" :key="m.m" class="flex flex-1 flex-col items-center gap-1">
            <div class="flex h-14 w-full items-end overflow-hidden rounded bg-black/[0.04]">
              <div class="gy w-full rounded bg-gradient-to-t from-[#4f35d6] to-[#7c6cf0]" :style="{ height: m.h + '%', '--d': 0.9 + i * 0.12 + 's' }" />
            </div>
            <span class="text-[9px] text-[#8b8fa3]">{{ m.m }}</span>
          </div>
        </div>
        <div class="mt-1.5 rounded-md bg-[#f6f6fb] p-2">
          <p class="flex justify-between text-[10px] text-[#6b6f85]">
            Forecast vs target <span class="font-semibold text-[#1a1f36]">{{ attainShown }}% of target</span>
          </p>
          <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#dfe1ee]">
            <div class="gx h-full rounded-full bg-[#4f35d6]" style="width: 62%; --d: 1s" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
