<script setup lang="ts">
type Item = { t: string; d: string }

const row1: Item[] = [
  { t: 'Live chat', d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' },
  {
    t: 'Internal chat',
    d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    t: 'Telephony',
    d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
  },
  { t: 'Email credits', d: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7' },
  {
    t: 'Articles & blog',
    d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  },
  { t: 'Announcements', d: 'M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12' },
  { t: 'CPQ', d: 'M4 2v20l3-2 2 2 3-2 3 2 2-2 3 2V2l-3 2-2-2-3 2-3-2-2 2zM8 8h8M8 12h8' },
  { t: 'Tally', d: 'M18 7V4H6l6 8-6 8h12v-3' },
  { t: 'Stockroom', d: 'M21 8l-9-5-9 5v8l9 5 9-5zM3.3 7.5L12 12.5l8.7-5M12 22V12.5' },
  {
    t: 'Astra AI',
    d: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z',
  },
]

const row2: Item[] = [
  { t: 'Analytics & embeds', d: 'M3 3v18h18M7 15v3M12 9v9M17 5v13' },
  { t: 'Content Studio', d: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z' },
  {
    t: 'Documents + OCR',
    d: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 8h8M7 12h10M7 16h6',
  },
  { t: 'Automation', d: 'M13 2L3 14h9l-1 8 10-12h-9z' },
  { t: 'Visual process designer', d: 'M3 3h6v6H3zM15 15h6v6h-6zM6 9v6a3 3 0 0 0 3 3h6' },
  { t: 'Approvals', d: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4L12 14l-3-3' },
  { t: 'Duplicate prevention', d: 'M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1' },
  { t: 'Trash & restore', d: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5' },
  { t: 'Release notes', d: 'M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4zM7 7h.01' },
  { t: 'Mobile app', d: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM12 18h.01' },
]
const tint = ['#4f46e5', '#00a383', '#f08a00', '#2f7bff', '#e63977', '#5fa012', '#ee5a24']
</script>

<template>
  <section class="relative py-14 sm:py-16" aria-label="Add-ons and platform capabilities">
    <div class="mx-auto mb-8 flex max-w-xl items-center gap-4 px-6">
      <span class="h-px flex-1 bg-gradient-to-r from-transparent to-ink/15" />
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-mute">…and it keeps going</p>
      <span class="h-px flex-1 bg-gradient-to-l from-transparent to-ink/15" />
    </div>

    <div class="space-y-3 [mask-image:linear-gradient(90deg,transparent,black_14%,black_86%,transparent)]">
      <div v-for="(row, r) in [row1, row2]" :key="r" class="group flex overflow-hidden py-1">
        <ul
          class="flex shrink-0 gap-3 pr-3 group-hover:[animation-play-state:paused]"
          :style="{ animation: `marquee ${r ? 52 : 44}s linear infinite ${r ? 'reverse' : ''}` }"
        >
          <li
            v-for="(it, i) in [...row, ...row]"
            :key="i"
            class="flex shrink-0 items-center gap-2.5 rounded-lg bg-white/70 py-1.5 pl-1.5 pr-4 text-[15px] font-medium text-ink shadow-[0_1px_2px_rgba(26,31,54,0.05)] ring-1 ring-ink/[0.07] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_20px_-8px_rgba(26,31,54,0.25)]"
          >
            <span
              class="grid size-7 place-items-center rounded-md"
              :style="{ background: tint[((i % row.length) + r * 3) % tint.length] + '1c', color: tint[((i % row.length) + r * 3) % tint.length] }"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path :d="it.d" />
              </svg>
            </span>
            {{ it.t }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
