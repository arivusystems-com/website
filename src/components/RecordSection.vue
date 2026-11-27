<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { appByKey, type AppKey } from '../data/apps'
import { useInView } from '../composables/useInView'

interface Panel {
  app: AppKey
  /** How this app refers to Priya. */
  role: string
  title: string
  items: { label: string; value: string; tag?: string }[]
}

// Illustrative data for one person, seen through four apps.
const panels: Panel[] = [
  {
    app: 'sales',
    role: 'Primary contact on the deal',
    title: 'Open deal',
    items: [
      { label: 'Spring catalogue rollout', value: '₹4,20,000', tag: 'Negotiation' },
      { label: 'Task · Send revised quote', value: 'Due today' },
      { label: 'Last touch', value: 'Call · 2 days ago' },
    ],
  },
  {
    app: 'helpdesk',
    role: 'Requester on the case',
    title: 'Open case',
    items: [
      { label: '#1042 · Fabric batch delayed', value: 'High', tag: 'SLA 2h left' },
      { label: 'Assigned to', value: 'Support · Meera' },
      { label: 'Email-to-case', value: 'Linked' },
    ],
  },
  {
    app: 'marketing',
    role: 'Audience member',
    title: 'Campaigns',
    items: [
      { label: 'Monsoon launch', value: 'Opened · Clicked', tag: 'Sent' },
      { label: 'Audience', value: 'Textile buyers' },
      { label: 'Subscription', value: 'Opted in' },
    ],
  },
  {
    app: 'portal',
    role: 'Signed-in customer',
    title: 'Customer portal',
    items: [
      { label: 'Signed in', value: 'Today, 9:41' },
      { label: 'Invoice INV-0231', value: '₹4,95,600', tag: 'Paid' },
      { label: 'Case #1042', value: 'Tracking live' },
    ],
  },
]

/* ---------- the shared record: one phone number, read by every app ---------- */
const ICON = {
  pencil: 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
  check: 'M5 12l5 5 9-10',
  close: 'M6 6l12 12M18 6L6 18',
  link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
}
const SUGGESTIONS = ['+91 70123 45608', '+91 90909 12345', '+91 81234 56789']

const phone = ref('+91 98765 43221')
const draft = ref('')
const editing = ref(false)
const input = ref<HTMLInputElement | null>(null)
const touched = ref(false) // has the visitor tried it yet? Drives the hint pulse.
const changed = ref(false) // has the number ever changed?
const fresh = ref(false) // true for a few seconds after a change
const tick = ref(0) // bumps on every change so animations replay
let freshTimer = 0

const startEdit = async () => {
  touched.value = true
  draft.value = SUGGESTIONS.find((s) => s !== phone.value) ?? ''
  editing.value = true
  await nextTick()
  input.value?.focus()
  input.value?.select()
}
const cancel = () => (editing.value = false)
const save = () => {
  const v = draft.value.trim().slice(0, 20)
  editing.value = false
  if (!v || v === phone.value) return
  phone.value = v
  tick.value++
  changed.value = true
  fresh.value = true
  clearTimeout(freshTimer)
  freshTimer = window.setTimeout(() => (fresh.value = false), 4800)
  sweep()
}

/* ---------- which app is on screen ---------- */
const active = ref(0)
const cycle = ref(0) // restarts the progress bar
const section = ref<HTMLElement | null>(null)
const tablist = ref<HTMLElement | null>(null)
const visible = useInView(section, 0.35)

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hovering = ref(false)
const sweeping = ref(false)
const paused = computed(() => !visible.value || hovering.value || editing.value || sweeping.value)

watch(active, () => cycle.value++)

const next = () => (active.value = (active.value + 1) % panels.length)

// After a change, walk through every app so the visitor sees the new number land in each one.
let sweepTimers: number[] = []
const clearSweep = () => {
  sweepTimers.forEach(clearTimeout)
  sweepTimers = []
  sweeping.value = false
}
const sweep = () => {
  clearSweep()
  sweeping.value = true
  const base = active.value
  for (let s = 1; s < panels.length; s++) {
    sweepTimers.push(window.setTimeout(() => (active.value = (base + s) % panels.length), s * 1100))
  }
  sweepTimers.push(window.setTimeout(() => (sweeping.value = false), panels.length * 1100))
}

const pick = (i: number) => {
  clearSweep()
  active.value = i
  cycle.value++
}
const onKey = (e: KeyboardEvent) => {
  const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
  if (!dir) return
  e.preventDefault()
  const i = (active.value + dir + panels.length) % panels.length
  pick(i)
  nextTick(() => tablist.value?.querySelectorAll<HTMLElement>('[role=tab]')[i]?.focus())
}

onBeforeUnmount(() => {
  clearTimeout(freshTimer)
  clearSweep()
})

const current = computed(() => panels[active.value])
const color = computed(() => appByKey(current.value.app).color)

/* ---------- colour helpers (white-on-lime fails contrast, so text uses a darker mix) ---------- */
const deep = (c: string) => `color-mix(in srgb, ${c} 50%, #1a1f36)`
const tile = (c: string) => `linear-gradient(135deg, ${c}, color-mix(in srgb, ${c} 74%, #1a1f36))`
const tint = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, white)`
</script>

<template>
  <section id="record" ref="section" class="relative overflow-hidden px-5 py-20 sm:py-28">
    <div class="mx-auto max-w-6xl">
      <div class="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div v-reveal class="max-w-3xl">
          <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-mute">One customer record</p>
          <h2 class="font-display text-[clamp(2rem,4.4vw,3.7rem)] font-extrabold leading-[0.95]">
            Meet Priya.<br />
            She's in four apps. <span class="gradient-text">She exists once.</span>
          </h2>
          <p class="mt-6 max-w-xl text-base text-ink/65 sm:text-lg">
            Most stacks give every tool its own copy of your customer. In Arivu there's a single
            People record that every app reads and writes. Change her number once, it's changed
            everywhere. <strong class="font-semibold text-ink">Go on, try it.</strong>
          </p>
        </div>

        <dl v-reveal="200" class="flex shrink-0 gap-8 border-t border-ink/10 pt-6 lg:gap-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div v-for="s in [['1', 'People record'], ['4', 'Apps reading it'], ['0', 'Duplicate copies']]" :key="s[1]">
            <dd class="font-display text-4xl font-extrabold leading-none sm:text-5xl" :class="s[0] === '0' ? 'gradient-text' : ''">{{ s[0] }}</dd>
            <dt class="mt-2 text-xs font-semibold uppercase tracking-wider text-mute">{{ s[1] }}</dt>
          </div>
        </dl>
      </div>

      <div
        v-reveal="120"
        class="mt-14 grid items-center gap-8 lg:grid-cols-[22rem_1fr]"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <!-- the person: one record, editable -->
        <div class="relative">
          <div class="rounded-[2rem] bg-ink p-6 text-white shadow-2xl">
            <div class="flex items-center gap-4">
              <div class="grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-audit to-marketing font-display text-2xl font-extrabold">
                P
              </div>
              <div class="min-w-0">
                <div class="font-display text-2xl font-bold">Priya Raman</div>
                <div class="text-sm text-white/55">Procurement · Acme Textiles</div>
              </div>
            </div>

            <div class="mt-5 grid gap-1 text-sm text-white/70">
              <div class="truncate">priya@acmetextiles.in</div>
              <div class="flex h-10 items-center justify-between gap-2">
                <template v-if="!editing">
                  <span
                    :key="tick"
                    class="rounded-md px-1.5 py-0.5 -mx-1.5 font-medium tabular-nums text-white"
                    :class="fresh ? 'phone-flash' : ''"
                  >{{ phone }}</span>
                  <button
                    type="button"
                    class="relative inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    @click="startEdit"
                  >
                    <span
                      v-if="!touched && !reduced"
                      class="pointer-events-none absolute inset-0 rounded-full bg-white/30"
                      style="animation: hintpulse 2.2s ease-out infinite"
                    />
                    <AppIcon :path="ICON.pencil" :size="13" :stroke="2.2" />
                    Change number
                  </button>
                </template>
                <form v-else class="flex w-full items-center gap-1.5" @submit.prevent="save">
                  <input
                    ref="input"
                    v-model="draft"
                    type="tel"
                    inputmode="tel"
                    maxlength="20"
                    aria-label="New phone number for Priya"
                    class="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-1.5 font-medium tabular-nums text-white outline-none ring-1 ring-white/25 focus:ring-2 focus:ring-white/70"
                    @keydown.esc="cancel"
                  />
                  <button type="submit" aria-label="Save number" class="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-ink transition hover:scale-105">
                    <AppIcon :path="ICON.check" :size="16" :stroke="2.6" />
                  </button>
                  <button type="button" aria-label="Cancel" class="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 transition hover:bg-white/20" @click="cancel">
                    <AppIcon :path="ICON.close" :size="14" :stroke="2.4" />
                  </button>
                </form>
              </div>
            </div>

            <div
              ref="tablist"
              role="tablist"
              aria-orientation="vertical"
              aria-label="Apps that read Priya's record"
              class="mt-4 space-y-2"
              @keydown="onKey"
            >
              <div v-for="(p, i) in panels" :key="p.app" class="relative">
                <button
                  :id="'rec-tab-' + p.app"
                  type="button"
                  role="tab"
                  aria-controls="rec-panel"
                  :aria-selected="i === active"
                  :tabindex="i === active ? 0 : -1"
                  class="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  :class="i === active ? 'bg-white text-ink' : 'bg-white/5 text-white/70 hover:bg-white/10'"
                  @click="pick(i)"
                >
                  <span class="grid size-8 shrink-0 place-items-center rounded-lg text-white" :style="{ background: tile(appByKey(p.app).color) }">
                    <AppIcon :path="appByKey(p.app).icon" :size="16" />
                  </span>
                  <span class="font-semibold">{{ appByKey(p.app).name }}</span>

                  <!-- ripples through every app after a change -->
                  <span
                    v-if="tick"
                    :key="tick"
                    class="sync-badge ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    :class="i === active ? 'bg-emerald-500/15 text-emerald-700' : 'bg-emerald-400/15 text-emerald-300'"
                    :style="{ animationDelay: i * 160 + 'ms' }"
                  >
                    <AppIcon :path="ICON.check" :size="10" :stroke="3.2" /> Synced
                  </span>

                  <!-- auto-advance timer: pauses on hover, while editing, and off-screen -->
                  <span
                    v-if="i === active && !reduced"
                    :key="'bar' + cycle"
                    class="absolute inset-x-0 bottom-0 h-[3px] origin-left"
                    :style="{
                      background: appByKey(p.app).color,
                      animation: 'barfill 7s linear both',
                      animationPlayState: paused ? 'paused' : 'running',
                    }"
                    @animationend="next"
                  />
                </button>

                <!-- the line that carries the record into the open app -->
                <svg
                  v-if="i === active"
                  :key="'wire' + p.app"
                  class="wire pointer-events-none absolute left-full top-1/2 hidden h-4 w-14 origin-left -translate-y-1/2 lg:block"
                  viewBox="0 0 56 16"
                  aria-hidden="true"
                >
                  <line x1="0" y1="8" x2="48" y2="8" :stroke="appByKey(p.app).color" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 6" style="animation: dash 1.2s linear infinite" />
                  <circle cx="50" cy="8" r="5" :fill="appByKey(p.app).color" opacity="0.25" />
                  <circle cx="50" cy="8" r="3" :fill="appByKey(p.app).color" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- the app window: same record, seen through the selected app -->
        <div class="relative">
          <div
            class="absolute -inset-4 -z-10 rounded-[2.5rem] opacity-30 blur-3xl transition-colors duration-700"
            :style="{ background: color }"
          />
          <div
            id="rec-panel"
            role="tabpanel"
            :aria-labelledby="'rec-tab-' + current.app"
            class="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_40px_80px_-30px_rgb(26_31_54/0.35)]"
          >
            <div class="flex items-center gap-2 border-b border-ink/10 bg-paper px-5 py-3.5">
              <span class="size-3 rounded-full bg-ink/12" /><span class="size-3 rounded-full bg-ink/12" /><span class="size-3 rounded-full bg-ink/12" />
              <span class="ml-3 flex min-w-0 items-center gap-2 truncate text-sm font-semibold text-ink/60">
                <span class="size-2 shrink-0 rounded-full transition-colors duration-500" :style="{ background: color }" />
                arivu / {{ appByKey(current.app).name.toLowerCase() }} / priya-raman
              </span>
              <span
                class="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors duration-500 sm:inline-flex"
                :style="{ color: deep(color), borderColor: tint(color, 35), background: tint(color, 12) }"
              >
                <AppIcon :path="ICON.link" :size="12" :stroke="2.4" /> People record
              </span>
            </div>

            <div class="relative min-h-[27rem] p-7 sm:p-9">
              <Transition name="fade-slide" mode="out-in">
                <div :key="current.app">
                  <div class="flex items-center gap-3">
                    <span class="grid size-11 place-items-center rounded-xl text-white" :style="{ background: tile(color) }">
                      <AppIcon :path="appByKey(current.app).icon" />
                    </span>
                    <div>
                      <div class="text-xs font-bold uppercase tracking-widest" :style="{ color: deep(color) }">{{ appByKey(current.app).name }}</div>
                      <div class="font-display text-2xl font-bold">{{ current.title }}</div>
                    </div>
                  </div>

                  <!-- Priya, as read from the one shared record -->
                  <div
                    class="mt-6 flex items-center gap-3 rounded-2xl px-4 py-3"
                    :style="{ background: tint(color, 10), animation: 'rise .6s cubic-bezier(.2,.8,.2,1) both' }"
                  >
                    <span class="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-audit to-marketing text-sm font-extrabold text-white">P</span>
                    <div class="min-w-0 flex-1">
                      <div class="font-semibold leading-tight">Priya Raman</div>
                      <div class="truncate text-xs text-ink/60">{{ current.role }}</div>
                    </div>
                    <span
                      :key="tick"
                      class="rounded-lg px-2 py-1 text-sm font-semibold tabular-nums"
                      :class="fresh ? 'phone-flash' : ''"
                      :style="{ '--c': color, color: deep(color) }"
                    >{{ phone }}</span>
                  </div>

                  <ul class="mt-4 space-y-3">
                    <li
                      v-for="(it, i) in current.items"
                      :key="it.label"
                      class="flex items-center justify-between gap-4 rounded-2xl border border-ink/8 bg-paper px-5 py-4"
                      :style="{ animation: `rise .6s ${(i + 1) * 90}ms cubic-bezier(.2,.8,.2,1) both` }"
                    >
                      <span class="font-medium">{{ it.label }}</span>
                      <span class="flex items-center gap-2.5 text-right text-sm">
                        <span class="text-ink/65">{{ it.value }}</span>
                        <span
                          v-if="it.tag"
                          class="rounded-full px-2.5 py-1 text-xs font-bold"
                          :style="{ background: tint(color, 16), color: deep(color), boxShadow: `inset 0 0 0 1px ${tint(color, 38)}` }"
                        >{{ it.tag }}</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </Transition>
            </div>

            <div class="flex items-center gap-2.5 border-t border-ink/10 bg-paper/70 px-7 py-3 text-xs text-ink/60 sm:px-9" aria-live="polite">
              <span class="relative grid size-2.5 place-items-center">
                <span v-if="fresh" class="absolute inset-0 rounded-full bg-emerald-500" style="animation: ping-soft 1.2s ease-out infinite" />
                <span class="size-2 rounded-full" :class="changed ? 'bg-emerald-500' : 'bg-ink/25'" />
              </span>
              <span v-if="fresh" class="font-semibold text-emerald-700">Updated just now · synced to all 4 apps</span>
              <span v-else-if="changed">Last change synced to all 4 apps · nothing to reconcile</span>
              <span v-else>Every app reads this one People record. Nothing is copied.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@keyframes barfill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* soft attention ring on the "Change number" button, stays close to its edge */
@keyframes hintpulse {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  70%,
  100% {
    transform: scale(1.22, 1.55);
    opacity: 0;
  }
}

/* a changed value glows in its app's colour, then settles */
@keyframes phoneflash {
  0% {
    background: color-mix(in srgb, var(--c, #fff) 45%, transparent);
    scale: 1.08;
  }
  100% {
    background: transparent;
    scale: 1;
  }
}
.phone-flash {
  animation: phoneflash 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes syncbadge {
  0% {
    opacity: 0;
    scale: 0.6;
  }
  12%,
  78% {
    opacity: 1;
    scale: 1;
  }
  100% {
    opacity: 0;
    scale: 1;
  }
}
.sync-badge {
  animation: syncbadge 2.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes wirein {
  from {
    opacity: 0;
    scale: 0.3 1;
  }
}
.wire {
  animation: wirein 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
</style>
