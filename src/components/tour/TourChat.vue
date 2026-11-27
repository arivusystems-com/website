<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../AppIcon.vue'
import { I } from './icons'

// Team chat, including a chat attached to a record. Sample data.
const msgs = [
  { me: false, who: 'AS', name: 'Arjun Sharma', t: '9:41', text: 'Priya accepted QT-0148. Can we reserve 320 units?', card: true },
  { me: true, who: 'MK', name: 'You', t: '9:42', text: 'Checking Warehouse 2 now.' },
  { me: false, who: 'AS', name: 'Arjun Sharma', t: '9:42', text: 'In stock. Reserved against the deal.' },
  { me: true, who: 'MK', name: 'You', t: '9:43', text: 'Great. Creating the sales order.' },
]
const shown = ref(0)
const typing = ref(false)
const visible = computed(() => msgs.slice(0, shown.value))

let timers: number[] = []
const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = msgs.length
    return
  }
  at(700, () => (shown.value = 1))
  at(2100, () => (shown.value = 2))
  at(3000, () => (typing.value = true))
  at(4300, () => {
    typing.value = false
    shown.value = 3
  })
  at(5700, () => (shown.value = 4))
})
onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <div class="flex h-full text-[11px] text-[#1a1f36]">
    <!-- conversations -->
    <div class="w-[225px] shrink-0 border-r border-black/[0.06] bg-white/70 p-3">
      <div class="fu flex items-center justify-between" style="--d: 0s">
        <p class="flex items-center gap-1.5 text-[13px] font-bold">
          Chat <i class="size-1.5 rounded-full bg-emerald-500" />
        </p>
        <span class="flex gap-2 text-[#8b8fa3]">
          <AppIcon :path="I.gear" :size="12" /><AppIcon :path="I.plus" :size="12" />
        </span>
      </div>
      <div class="fu mt-2.5 flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 text-[10px] text-[#9a9eb2] ring-1 ring-black/[0.07]" style="--d: 0.06s">
        <AppIcon :path="I.search" :size="11" /> Filter conversations…
      </div>

      <div class="fu" style="--d: 0.12s">
        <p class="mb-1 mt-3.5 flex justify-between px-1 text-[8.5px] font-semibold uppercase tracking-wider text-[#8b8fa3]">Direct messages <span>+</span></p>
        <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
          <span class="grid size-5 place-items-center rounded-full bg-[#e6f4c8] text-[8px] font-bold text-[#4d6b12]">AS</span> Arjun Sharma
        </div>
        <p class="mb-1 mt-3 flex justify-between px-1 text-[8.5px] font-semibold uppercase tracking-wider text-[#8b8fa3]">Channels <span>+</span></p>
        <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-[#4b5068]"><span class="text-[#8b8fa3]">#</span> sales-team</div>
        <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-[#4b5068]"><span class="text-[#8b8fa3]">#</span> warehouse</div>
        <p class="mb-1 mt-3 px-1 text-[8.5px] font-semibold uppercase tracking-wider text-[#8b8fa3]">Records</p>
        <div class="flex items-center gap-2 rounded-md bg-[#eeeaff] px-2 py-1.5 font-semibold text-[#4f35d6]">
          <span class="grid size-5 place-items-center rounded-md bg-[#d5f5e3] text-[10px] font-bold text-emerald-700">#</span> Acme Textiles
        </div>
      </div>
    </div>

    <!-- thread -->
    <div class="relative flex min-w-0 flex-1 flex-col">
      <div class="flex items-center gap-2.5 border-b border-black/[0.06] bg-white/60 px-5 py-2.5">
        <span class="grid size-6 place-items-center rounded-md bg-[#d5f5e3] text-[11px] font-bold text-emerald-700">#</span>
        <span class="text-[12px] font-bold">Acme Textiles</span>
        <span class="rounded-full bg-[#eeeaff] px-2 py-0.5 text-[9px] font-semibold text-[#4f35d6]">Record chat</span>
        <span class="ml-auto rounded-md bg-white px-2.5 py-1 text-[10px] text-[#9a9eb2] ring-1 ring-black/[0.07]">Search messages…</span>
      </div>

      <div class="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-6 pb-3">
        <TransitionGroup name="fade-slide" tag="div" class="flex flex-col gap-3">
          <div v-for="m in visible" :key="m.t + m.text" class="flex gap-2" :class="m.me ? 'justify-end' : 'justify-start'">
            <span v-if="!m.me" class="mt-4 grid size-6 shrink-0 place-items-center rounded-full bg-[#e6f4c8] text-[8px] font-bold text-[#4d6b12]">{{ m.who }}</span>
            <div :class="m.me ? 'items-end' : 'items-start'" class="flex flex-col">
              <p class="mb-0.5 text-[9px] text-[#8b8fa3]">
                <b v-if="!m.me" class="text-[#4b5068]">{{ m.name }}</b> {{ m.t }}
              </p>
              <span
                class="rounded-2xl px-3 py-1.5 text-[11px]"
                :class="m.me ? 'bg-[#4f35d6] text-white' : 'bg-white text-[#1a1f36] ring-1 ring-black/[0.06]'"
              >
                {{ m.text }}
              </span>
              <span
                v-if="m.card"
                class="fu mt-1.5 flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 ring-1 ring-black/[0.08]"
                style="--d: 0.3s"
              >
                <span class="grid size-6 place-items-center rounded-md bg-[#eeeaff] text-[#4f35d6]"><AppIcon :path="I.deals" :size="12" /></span>
                <span>
                  <b class="block text-[10.5px]">Spring catalogue</b>
                  <span class="text-[9.5px] text-[#6b6f85]"><b class="text-emerald-600">₹4,20,000</b> · Negotiation</span>
                </span>
              </span>
            </div>
            <span v-if="m.me" class="mt-4 grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#4f35d6] to-[#a78bfa] text-[8px] font-bold text-white">MK</span>
          </div>
        </TransitionGroup>

        <Transition name="fade-slide">
          <div v-if="typing" class="flex items-center gap-2">
            <span class="grid size-6 place-items-center rounded-full bg-[#e6f4c8] text-[8px] font-bold text-[#4d6b12]">AS</span>
            <span class="flex gap-1 rounded-2xl bg-white px-3 py-2.5 ring-1 ring-black/[0.06]">
              <i v-for="d in 3" :key="d" class="size-1.5 rounded-full bg-[#9a9eb2]" :style="{ animation: `blink 1s ${d * 0.2}s infinite` }" />
            </span>
          </div>
        </Transition>
      </div>

      <div class="mx-5 mb-4 rounded-xl bg-white p-3 ring-1 ring-black/[0.08]">
        <p class="text-[10.5px] text-[#9a9eb2]">Message Acme Textiles</p>
        <div class="mt-3 flex items-center justify-between text-[#9a9eb2]">
          <AppIcon :path="I.forms" :size="13" />
          <span class="grid size-6 place-items-center rounded-full bg-[#4f35d6]/40 text-white"><AppIcon :path="I.chevron" :size="11" class="-rotate-90" /></span>
        </div>
      </div>
    </div>
  </div>
</template>
