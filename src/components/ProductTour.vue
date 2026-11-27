<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import TourHome from './tour/TourHome.vue'
import TourPipeline from './tour/TourPipeline.vue'
import TourDashboard from './tour/TourDashboard.vue'
import TourOrgs from './tour/TourOrgs.vue'
import TourInbox from './tour/TourInbox.vue'
import TourChat from './tour/TourChat.vue'
import { I } from './tour/icons'
import { APPS } from '../data/apps'
import { useInView } from '../composables/useInView'

// The product shell (collapsed icon rail and tab bar), redrawn at a fixed size and
// scaled to fit. Data is illustrative.
const W = 1000
const H = 560
const DUR = 7500
const PURPLE = '#3a1c96'

const appIcon = (k: string) => APPS.find((a) => a.key === k)!.icon

// left icon rail
const railTop = [
  { k: 'Search', icon: I.search },
  { k: 'Home', icon: I.home },
  { k: 'Inbox', icon: I.inbox },
  { k: 'Astra', icon: I.sparkle },
  { k: 'More', icon: I.more },
]
const railApps = [
  { k: 'Core', icon: I.dashboard },
  { k: 'Sales', icon: I.briefcase },
  { k: 'Audit', icon: I.shield },
  { k: 'Helpdesk', icon: appIcon('helpdesk') },
  { k: 'Marketing', icon: appIcon('marketing') },
  { k: 'Inventory', icon: appIcon('inventory') },
]
const railBottom = [
  { k: 'Settings', icon: I.gear },
  { k: 'Help', icon: I.help },
]

const screens = [
  { label: 'Pipeline', tab: 'Deals', tabIcon: I.deals, rail: 'Sales', comp: TourPipeline },
  { label: 'Inbox + Astra', tab: 'Inbox', tabIcon: I.inbox, rail: 'Inbox', comp: TourInbox },
  { label: 'Team chat', tab: 'Chat', tabIcon: I.responses, rail: 'More', comp: TourChat },
  { label: 'Dashboard', tab: 'Sales', tabIcon: I.dashboard, rail: 'Sales', comp: TourDashboard },
  { label: 'Home', tab: 'Home', tabIcon: I.home, rail: 'Home', comp: TourHome },
  { label: 'Customers', tab: 'Organizations', tabIcon: I.org, rail: 'Core', comp: TourOrgs },
]

const idx = ref(0)
const paused = ref(false)
const epoch = ref(0)
const current = computed(() => screens[idx.value]!)

const root = ref<HTMLElement | null>(null)
const visible = useInView(root, 0.3)
const reduce = ref(false)
let timer = 0
watch(
  [idx, visible, paused, epoch],
  () => {
    clearTimeout(timer)
    if (visible.value && !paused.value && !reduce.value) {
      timer = window.setTimeout(() => (idx.value = (idx.value + 1) % screens.length), DUR)
    }
  },
  { immediate: true },
)

// scale the fixed canvas to its container
const wrap = ref<HTMLElement | null>(null)
const scale = ref(0.8)
let ro: ResizeObserver | undefined
onMounted(() => {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ro = new ResizeObserver(([e]) => (scale.value = e!.contentRect.width / W))
  if (wrap.value) ro.observe(wrap.value)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  clearTimeout(timer)
})

const pick = (i: number) => {
  idx.value = i
  epoch.value++
}
const hold = (v: boolean) => {
  paused.value = v
  if (!v) epoch.value++
}
</script>

<template>
  <div ref="root" class="relative" @mouseenter="hold(true)" @mouseleave="hold(false)">
    <div
      ref="wrap"
      class="w-full rounded-[14px] shadow-[0_40px_90px_-30px_rgba(55,30,140,0.45)] ring-1 ring-ink/10"
      :style="{ height: H * scale + 'px' }"
    >
      <div
        class="relative flex origin-top-left overflow-hidden rounded-[14px] bg-[#eceef5] font-sans"
        :style="{ width: W + 'px', height: H + 'px', transform: `scale(${scale})` }"
      >
        <!-- icon rail -->
        <nav class="my-1.5 ml-1.5 mr-1.5 flex w-[44px] shrink-0 flex-col items-center rounded-xl py-1.5 text-white/75 shadow-[0_6px_16px_-8px_rgba(42,20,117,0.6)]" :style="{ background: PURPLE }">
          <img src="/logo/Logo_light.svg" alt="" class="mb-1 size-5" />
          <ul class="w-full space-y-0.5 px-1">
            <li
              v-for="n in railTop"
              :key="n.k"
              class="flex flex-col items-center gap-0.5 rounded-lg py-[4px] text-[7px] font-medium transition-colors duration-300"
              :class="current.rail === n.k ? 'bg-white text-[#2a1475]' : ''"
            >
              <AppIcon :path="n.icon" :size="14" /> {{ n.k }}
            </li>
          </ul>
          <span class="my-1 h-px w-6 bg-white/15" />
          <ul class="w-full space-y-0.5 px-1">
            <li
              v-for="n in railApps"
              :key="n.k"
              class="flex flex-col items-center gap-0.5 rounded-lg py-[4px] text-[7px] font-medium transition-colors duration-300"
              :class="current.rail === n.k ? 'bg-white text-[#2a1475]' : ''"
            >
              <AppIcon :path="n.icon" :size="14" /> {{ n.k }}
            </li>
          </ul>
          <ul class="mt-auto w-full space-y-0.5 px-1">
            <li v-for="n in railBottom" :key="n.k" class="flex flex-col items-center gap-0.5 py-[3px] text-[7px] font-medium">
              <AppIcon :path="n.icon" :size="14" /> {{ n.k }}
            </li>
          </ul>
        </nav>

        <!-- tab bar + screen -->
        <div class="my-1.5 mr-1.5 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.07]">
          <div class="flex h-9 shrink-0 items-end border-b border-black/[0.07] bg-[#fafafc] px-1 text-[11px]">
            <div
              class="flex h-full items-center gap-1.5 px-3.5 text-[#6b6f85]"
              :class="current.tab === 'Home' ? 'border-b-2 border-[#4f35d6] bg-white font-semibold text-[#1a1f36]' : ''"
            >
              <AppIcon :path="I.home" :size="12" /> Home
            </div>
            <div
              v-if="current.tab !== 'Home'"
              class="flex h-full items-center gap-1.5 border-b-2 border-[#4f35d6] bg-white px-3.5 font-semibold text-[#1a1f36]"
            >
              <AppIcon :path="current.tabIcon" :size="12" class="text-[#6b6f85]" />
              {{ current.tab }} <span class="ml-1 text-[#8b8fa3]">×</span>
            </div>
            <div class="flex h-full items-center gap-1.5 px-3.5 text-[#6b6f85]">
              <AppIcon :path="I.gear" :size="12" /> Settings
            </div>
            <div class="ml-auto flex h-full items-center gap-3 pr-2.5 text-[#6b6f85]">
              <AppIcon :path="I.bell" :size="14" />
              <span class="grid size-5 place-items-center rounded-full p-[1.5px]" style="background: conic-gradient(#4f46e5, #ec4899, #f59e0b, #4f46e5)">
                <span class="grid size-full place-items-center rounded-full bg-white text-[#4f35d6]"><AppIcon :path="I.sparkle" :size="9" /></span>
              </span>
              <span class="relative grid size-6 place-items-center rounded-full bg-gradient-to-br from-[#4f35d6] to-[#a78bfa] text-[8px] font-bold text-white">
                MK<i class="absolute -bottom-px -right-px size-2 rounded-full bg-emerald-500 ring-2 ring-[#fafafc]" />
              </span>
            </div>
          </div>

          <main class="relative min-h-0 flex-1 overflow-hidden bg-[#f4f4f9]">
            <Transition name="scr" mode="out-in">
              <component :is="current.comp" :key="idx" />
            </Transition>
          </main>
        </div>
      </div>
    </div>

    <!-- pager -->
    <div class="mt-7 flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="(s, i) in screens"
        :key="s.label"
        class="relative overflow-hidden rounded-lg px-4 py-1.5 text-xs font-semibold ring-1 transition"
        :class="i === idx ? 'bg-white text-sales ring-sales/40 shadow-sm' : 'bg-white/50 text-ink/55 ring-ink/10 hover:text-ink'"
        @click="pick(i)"
      >
        <span
          v-if="i === idx && !reduce"
          :key="`${idx}-${epoch}`"
          class="absolute inset-0 origin-left bg-sales/10"
          :style="{
            animation: `tourfill ${DUR}ms linear both`,
            animationPlayState: paused || !visible ? 'paused' : 'running',
          }"
        />
        <span class="relative">{{ s.label }}</span>
      </button>
    </div>
  </div>
</template>
