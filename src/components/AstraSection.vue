<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useInView } from '../composables/useInView'

// Layers mirror the Astra v2 architecture: Context → Orchestrator → Agents → Tools → Models,
// with Governance and Memory cutting across all of them.
const layers = [
  { name: 'Context', desc: 'Who is asking, what record they are on' },
  { name: 'Orchestrator', desc: 'Plans the steps' },
  { name: 'Agents', desc: 'Specialists per app' },
  { name: 'Tools', desc: 'Act on real platform data' },
  { name: 'Models', desc: 'The right model for the job' },
]

const prompt = 'Which deals look stuck this week, and who should chase them?'
// Illustrative answer — swap for a real recorded Astra response before launch.
const answer =
  '3 deals have gone quiet for 9+ days. Acme Textiles (₹4.2L) is the biggest. I drafted follow-up tasks for their owners.'

const typed = ref('')
const reply = ref('')
const activeLayer = ref(-1)
const phase = ref<'idle' | 'typing' | 'thinking' | 'answering' | 'done'>('idle')

const section = ref<HTMLElement | null>(null)
const visible = useInView(section, 0.3)
let run = 0
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function loop(token: number) {
  while (token === run) {
    typed.value = ''
    reply.value = ''
    activeLayer.value = -1
    phase.value = 'typing'
    for (const ch of prompt) {
      if (token !== run) return
      typed.value += ch
      await wait(28)
    }
    await wait(350)
    phase.value = 'thinking'
    for (let i = 0; i < layers.length; i++) {
      if (token !== run) return
      activeLayer.value = i
      await wait(650)
    }
    phase.value = 'answering'
    for (const ch of answer) {
      if (token !== run) return
      reply.value += ch
      await wait(14)
    }
    phase.value = 'done'
    await wait(4500)
  }
}

watch(visible, (v) => {
  run++
  if (v) loop(run)
})
onBeforeUnmount(() => run++)
</script>

<template>
  <section id="astra" ref="section" class="relative isolate overflow-hidden px-5 py-20 sm:py-28">
    <div class="absolute inset-x-4 inset-y-6 -z-10 overflow-hidden rounded-[2.5rem] bg-[#0f1226] noise sm:inset-x-8">
      <div class="absolute -left-20 top-0 size-[32rem] rounded-full bg-sales/50 blur-[130px]" style="animation: blob 20s ease-in-out infinite" />
      <div class="absolute -right-20 bottom-0 size-[28rem] rounded-full bg-marketing/40 blur-[130px]" style="animation: blob 24s ease-in-out infinite reverse" />
    </div>

    <div class="mx-auto max-w-6xl py-6 text-white">
      <div v-reveal class="max-w-3xl">
        <p class="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
          <span class="relative grid place-items-center"><span class="size-2 rounded-full bg-audit" /><span class="absolute size-2 rounded-full bg-audit" style="animation: ping-soft 1.8s ease-out infinite" /></span>
          Astra · the AI platform
        </p>
        <h2 class="font-display text-[clamp(2rem,4.4vw,3.7rem)] font-extrabold leading-[0.95]">
          AI that's <span class="gradient-text">inside</span> the platform, not stapled on.
        </h2>
        <p class="mt-6 max-w-xl text-base text-white/65 sm:text-lg">
          Astra sits on the same records, permissions and audit trail as everything else. Ask in
          plain language; agents use platform tools to do the work.
        </p>
      </div>

      <div v-reveal="120" class="mt-14 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <!-- chat -->
        <div class="flex min-h-[26rem] flex-col rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl sm:p-8">
          <div class="flex items-center gap-2.5 text-sm text-white/55">
            <span class="grid size-8 place-items-center rounded-full bg-gradient-to-br from-sales to-marketing font-display font-bold text-white">A</span>
            Ask Astra
            <span class="ml-auto rounded-full border border-white/15 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-widest text-white/40">Illustrative</span>
          </div>

          <div class="mt-6 flex-1 space-y-4">
            <div v-if="typed" class="ml-auto w-fit max-w-[90%] rounded-3xl rounded-br-lg bg-white px-5 py-3.5 text-ink">
              {{ typed }}<span v-if="phase === 'typing'" class="ml-0.5 inline-block h-5 w-0.5 translate-y-1 bg-ink" style="animation: blink 0.8s steps(1) infinite" />
            </div>

            <div v-if="phase === 'thinking'" class="flex items-center gap-2 text-sm text-white/60" style="animation: pop 0.4s both">
              <span class="flex gap-1">
                <i v-for="n in 3" :key="n" class="size-1.5 rounded-full bg-white/70" :style="{ animation: `wave 1s ${n * 0.15}s ease-in-out infinite` }" />
              </span>
              {{ layers[Math.max(0, activeLayer)].name }}…
            </div>

            <div v-if="reply" class="w-fit max-w-[92%] rounded-3xl rounded-bl-lg bg-white/10 px-5 py-3.5 leading-relaxed">
              {{ reply }}
            </div>
          </div>

          <div class="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-5 py-3 text-sm text-white/35">
            Ask anything about your business…
          </div>
        </div>

        <!-- stack -->
        <div class="grid grid-cols-[auto_1fr_auto] gap-3">
          <div class="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-2 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white/50 [writing-mode:vertical-rl] rotate-180">
            Governance
          </div>
          <ol class="space-y-2.5">
            <li
              v-for="(l, i) in layers"
              :key="l.name"
              class="relative overflow-hidden rounded-2xl border px-5 py-4 transition-all duration-500"
              :class="
                i === activeLayer
                  ? 'scale-[1.03] border-transparent bg-white text-ink shadow-[0_20px_50px_-15px_rgb(79_70_229/0.9)]'
                  : i < activeLayer || phase === 'answering' || phase === 'done'
                    ? 'border-white/10 bg-white/10 text-white'
                    : 'border-white/10 bg-white/[0.04] text-white/60'
              "
            >
              <div class="flex items-center justify-between">
                <span class="font-display text-xl font-bold">{{ l.name }}</span>
                <span class="font-mono text-xs opacity-50">0{{ i + 1 }}</span>
              </div>
              <div class="text-sm opacity-70">{{ l.desc }}</div>
            </li>
          </ol>
          <div class="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-2 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white/50 [writing-mode:vertical-rl]">
            Memory
          </div>
        </div>
      </div>

      <div v-reveal="200" class="mt-10 flex flex-wrap gap-3 text-sm text-white/70">
        <span v-for="t in ['PII redaction', 'Audit log of every AI action', 'Usage metered with AI credits', 'Astra Studio · Living Canvas']" :key="t" class="rounded-lg border border-white/15 bg-white/5 px-4 py-2">{{ t }}</span>
      </div>
    </div>
  </section>
</template>
