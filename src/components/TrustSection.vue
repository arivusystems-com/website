<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 13 languages shipped in the product
const hellos = [
  ['Hello', 'English'],
  ['नमस्ते', 'हिन्दी'],
  ['مرحبا', 'العربية'],
  ['こんにちは', '日本語'],
  ['안녕하세요', '한국어'],
  ['Bonjour', 'Français'],
  ['Hola', 'Español'],
  ['Hallo', 'Deutsch'],
  ['Ciao', 'Italiano'],
  ['Olá', 'Português'],
  ['Привет', 'Русский'],
  ['你好', '中文'],
  ['Hoi', 'Nederlands'],
]
const h = ref(0)
const sync = ref(false)
const perm = ref(0)
const perms = [
  { role: 'Admin', field: 'Deal amount', mode: 'Edit', c: '#00b894' },
  { role: 'Standard', field: 'Deal amount', mode: 'View', c: '#ff9f1c' },
  { role: 'Portal', field: 'Deal amount', mode: 'Hidden', c: '#ff4d8d' },
]
const trail = [
  ['Priya changed stage', 'Negotiation → Won'],
  ['Meera deleted a task', 'Moved to trash'],
  ['Admin restored it', 'Back in 1 click'],
]
let t1 = 0
let t2 = 0
let t3 = 0
onMounted(() => {
  t1 = window.setInterval(() => (h.value = (h.value + 1) % hellos.length), 1400)
  t2 = window.setInterval(() => (sync.value = !sync.value), 2800)
  t3 = window.setInterval(() => (perm.value = (perm.value + 1) % perms.length), 2000)
})
onBeforeUnmount(() => [t1, t2, t3].forEach(clearInterval))
</script>

<template>
  <section id="trust" class="relative px-5 py-20 sm:py-28">
    <div class="mx-auto max-w-6xl">
      <div v-reveal class="max-w-3xl">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-mute">Built to be trusted</p>
        <h2 class="font-display text-[clamp(2rem,4.4vw,3.7rem)] font-extrabold leading-[0.95]">
          Boring where it matters. <span class="gradient-text">Fast everywhere else.</span>
        </h2>
      </div>

      <div class="mt-16 grid auto-rows-[minmax(14rem,auto)] gap-4 md:grid-cols-6">
        <!-- isolation -->
        <div v-reveal class="group relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white md:col-span-4">
          <h3 class="font-display text-3xl font-bold">Your own database.</h3>
          <p class="mt-2 max-w-sm text-white/60">Every tenant can get a dedicated database or Kubernetes instance. Your data never shares a table with a stranger's.</p>
          <div class="mt-8 grid grid-cols-3 gap-3">
            <div v-for="(n, i) in ['Acme', 'Globex', 'Initech']" :key="n" class="relative rounded-2xl border border-white/15 bg-white/5 p-4 text-center">
              <svg class="mx-auto text-white/80" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>
              <div class="mt-2 text-sm font-semibold">{{ n }}</div>
              <span class="absolute right-3 top-3 size-2 rounded-full bg-helpdesk" :style="{ animation: `wave 2s ${i * 0.4}s ease-in-out infinite` }" />
            </div>
          </div>
        </div>

        <!-- languages -->
        <div v-reveal="80" class="relative overflow-hidden rounded-[2rem] bg-sales p-8 text-white md:col-span-2">
          <div class="text-sm font-semibold uppercase tracking-widest text-white/70">13 languages</div>
          <div class="relative mt-6 h-24">
            <Transition name="fade-slide" mode="out-in">
              <div :key="h" class="absolute inset-0">
                <div class="font-display text-5xl font-extrabold leading-tight">{{ hellos[h][0] }}</div>
                <div class="mt-1 text-white/70">{{ hellos[h][1] }}</div>
              </div>
            </Transition>
          </div>
          <p class="mt-4 text-sm text-white/70">Right-to-left included.</p>
        </div>

        <!-- mobile -->
        <div v-reveal class="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-8 md:col-span-2 md:row-span-2">
          <h3 class="font-display text-3xl font-bold">Works offline.</h3>
          <p class="mt-2 text-ink/60">Field audits keep running with no signal, then sync.</p>
          <div class="mx-auto mt-6 w-44 rounded-[2rem] border-[6px] border-ink bg-paper p-3 shadow-xl" style="animation: float 6s ease-in-out infinite">
            <div class="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/20" />
            <div class="flex items-center justify-between text-[0.65rem] font-semibold">
              <span>Audits</span>
              <span class="rounded-full px-2 py-0.5 text-white transition-colors duration-500" :class="sync ? 'bg-helpdesk' : 'bg-audit'">{{ sync ? 'Synced' : 'Offline' }}</span>
            </div>
            <div v-for="(s, i) in ['Store 14 · Pune', 'Store 22 · Mumbai', 'Store 31 · Surat']" :key="s" class="mt-2 flex items-center gap-2 rounded-xl bg-white p-2.5 text-[0.7rem] font-medium shadow-sm">
              <span class="grid size-5 shrink-0 place-items-center rounded-full text-white transition-colors duration-500" :class="sync ? 'bg-helpdesk' : 'bg-audit'" :style="{ transitionDelay: i * 120 + 'ms' }">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
              </span>
              {{ s }}
            </div>
            <div class="mt-3 grid grid-cols-4 gap-1.5 text-center text-[0.55rem] font-semibold text-ink/50">
              <span>Home</span><span>Inbox</span><span>Tasks</span><span>More</span>
            </div>
          </div>
        </div>

        <!-- permissions -->
        <div v-reveal="80" class="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-8 md:col-span-2">
          <h3 class="font-display text-2xl font-bold">Down to the field.</h3>
          <p class="mt-1 text-sm text-ink/60">Roles, profiles and sharing rules.</p>
          <div class="mt-5 space-y-2">
            <div v-for="(p, i) in perms" :key="p.role" class="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-all duration-500" :class="i === perm ? 'scale-[1.03] bg-ink text-white shadow-lg' : 'bg-paper'">
              <span class="font-semibold">{{ p.role }}</span>
              <span class="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" :style="{ background: p.c }">{{ p.mode }}</span>
            </div>
          </div>
        </div>

        <!-- audit trail -->
        <div v-reveal="160" class="relative overflow-hidden rounded-[2rem] bg-audit p-8 text-ink md:col-span-2">
          <h3 class="font-display text-2xl font-bold">Nothing just vanishes.</h3>
          <p class="mt-1 text-sm text-ink/70">Trails, soft-delete and one-click restore.</p>
          <ul class="mt-5 space-y-2">
            <li v-for="(t, i) in trail" :key="t[0]" class="rounded-xl bg-white/70 px-4 py-2.5 text-sm" :style="{ animation: `float ${4 + i}s ${i * 0.3}s ease-in-out infinite` }">
              <b>{{ t[0] }}</b> <span class="text-ink/60">· {{ t[1] }}</span>
            </li>
          </ul>
        </div>

        <!-- realtime + security -->
        <div v-reveal class="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-8 md:col-span-4">
          <div class="flex flex-wrap items-center justify-between gap-6">
            <div class="max-w-sm">
              <h3 class="font-display text-3xl font-bold">Live, without the refresh.</h3>
              <p class="mt-2 text-ink/60">Notifications, inbox and team chat stream in as they happen. CSRF protection and rate limiting guard the doors.</p>
            </div>
            <div class="flex items-end gap-1.5" aria-hidden="true">
              <i v-for="n in 14" :key="n" class="w-2.5 rounded-full bg-sales" :style="{ height: '3.5rem', transformOrigin: 'bottom', animation: `wave 1.4s ${n * 0.09}s ease-in-out infinite` }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
