<script setup lang="ts">
const stats = [
  ['Total organizations', '1,248'],
  ['Assigned to me', '86'],
  ['Unassigned', '12'],
  ['Active', '1,102'],
  ['Trial', '34'],
]
const rows = [
  { n: 'Acme Textiles', i: 'AT', c: '#f97316', who: 'Meera K.', ind: 'Manufacturing', d: 'Nov 12, 2026' },
  { n: 'Kalla Foods', i: 'KF', c: '#16a34a', who: 'Arjun S.', ind: 'Retail', d: 'Nov 10, 2026' },
  { n: 'Sunrise Clinics', i: 'SC', c: '#2563eb', who: 'Meera K.', ind: 'Healthcare', d: 'Nov 08, 2026' },
  { n: 'Metro Retail', i: 'MR', c: '#d97706', who: 'Arjun S.', ind: 'Retail', d: 'Nov 03, 2026' },
  { n: 'Lakshmi Textiles', i: 'LT', c: '#db2777', who: 'Divya R.', ind: 'Manufacturing', d: 'Oct 29, 2026' },
  { n: 'Orbit Logistics', i: 'OL', c: '#7c3aed', who: 'Meera K.', ind: 'Logistics', d: 'Oct 24, 2026' },
  { n: 'Greenfield Schools', i: 'GS', c: '#0d9488', who: 'Divya R.', ind: 'Education', d: 'Oct 19, 2026' },
  { n: 'Nimbus Realty', i: 'NR', c: '#e11d48', who: 'Arjun S.', ind: 'Real estate', d: 'Oct 14, 2026' },
]
</script>

<template>
  <div class="px-5 py-4 text-[11px] text-[#1a1f36]">
    <div class="fu flex items-center justify-between" style="--d: 0s">
      <h3 class="text-[20px] font-bold">All Organizations <span class="text-[#8b8fa3]">⌄</span></h3>
      <span class="rounded-md bg-[#4f35d6] px-3 py-1.5 font-semibold text-white">+ New Organization</span>
    </div>

    <div class="fu mt-3 grid grid-cols-5 divide-x divide-black/[0.06] overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.06]" style="--d: 0.08s">
      <div v-for="s in stats" :key="s[0]" class="px-3 py-2">
        <p class="text-[8.5px] font-semibold uppercase tracking-wide text-[#8b8fa3]">{{ s[0] }}</p>
        <p class="mt-0.5 text-[16px] font-bold tabular-nums">{{ s[1] }}</p>
      </div>
    </div>

    <div class="fu mt-2.5 overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.06]" style="--d: 0.16s">
      <div class="grid grid-cols-[1.5fr_1fr_.7fr_1fr_1fr] border-b border-black/[0.06] bg-[#fafafd] px-3 py-2 text-[9px] font-semibold uppercase tracking-wide text-[#8b8fa3]">
        <span>Name</span><span>Assigned to</span><span>Is active</span><span>Industry</span><span>Created at</span>
      </div>
      <div
        v-for="(r, i) in rows"
        :key="r.n"
        class="fu grid grid-cols-[1.5fr_1fr_.7fr_1fr_1fr] items-center border-b border-black/[0.04] px-3 py-[7px] last:border-0"
        :style="{ '--d': 0.3 + i * 0.09 + 's' }"
      >
        <span class="flex items-center gap-2 font-semibold">
          <span class="grid size-5 place-items-center rounded text-[8px] font-bold" :style="{ background: r.c + '22', color: r.c }">{{ r.i }}</span>
          {{ r.n }}
        </span>
        <span class="flex items-center gap-1.5 text-[#4a4f66]">
          <span class="grid size-4 place-items-center rounded-full bg-[#eceaff] text-[7px] font-bold text-[#4f35d6]">{{ r.who.slice(0, 1) }}</span>
          {{ r.who }}
        </span>
        <span><span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">Active</span></span>
        <span class="text-[#4a4f66]">{{ r.ind }}</span>
        <span class="text-[#6b6f85]">{{ r.d }}</span>
      </div>
    </div>
  </div>
</template>
