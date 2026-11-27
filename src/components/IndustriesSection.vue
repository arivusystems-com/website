<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { appByKey, DEMO_URL, type AppKey } from '../data/apps'

// Draft copy: Retail is from the current site; the rest is built from what the apps actually do.
// Have each industry owner review before launch.
interface Industry {
  key: string
  name: string
  headline: string
  body: string
  points: string[]
  apps: AppKey[]
  color: string
}

const industries: Industry[] = [
  {
    key: 'retail',
    name: 'Retail',
    headline: 'Run every store and channel from one connected system.',
    body: 'From inventory to sales to customer support, one platform to manage operations, track performance and keep every location consistent.',
    points: ['Multi-location inventory and stock tracking', 'Sales pipeline and order management', 'Customer support tied to purchase history'],
    apps: ['sales', 'inventory', 'helpdesk', 'marketing'],
    color: '#4f46e5',
  },
  {
    key: 'realestate',
    name: 'Real estate',
    headline: 'Every enquiry, site visit and booking in one place.',
    body: 'Capture leads from your website, schedule visits, and carry each buyer from first enquiry to signed deal without losing the thread.',
    points: ['Web-form leads straight into the pipeline', 'Site-visit scheduling and follow-ups', 'Quotes, bookings and payment links'],
    apps: ['sales', 'marketing', 'portal'],
    color: '#ff9f1c',
  },
  {
    key: 'education',
    name: 'Education',
    headline: 'From admissions to learning on a single record.',
    body: 'Run enquiries, support and training together, so a student or parent is one person across every touchpoint.',
    points: ['Enquiry-to-admission pipeline', 'Learning Academy for external learners', 'Parent and student support cases'],
    apps: ['learning', 'sales', 'helpdesk', 'portal'],
    color: '#ff6b35',
  },
  {
    key: 'healthcare',
    name: 'Healthcare',
    headline: 'Appointments, follow-ups and supplies, coordinated.',
    body: 'Keep front-desk bookings, patient queries and clinical stock in sync, with clear ownership on every request.',
    points: ['Appointment booking and reminders', 'Case-based queries with response targets', 'Supplies and stock tracking'],
    apps: ['helpdesk', 'inventory', 'portal'],
    color: '#00b894',
  },
  {
    key: 'it',
    name: 'IT & services',
    headline: 'Win it, deliver it, support it, bill it.',
    body: 'One flow from the first proposal to the support ticket and the invoice, with clients able to check status themselves.',
    points: ['Pipeline to quote to invoice', 'Helpdesk with SLAs for client support', 'Client portal for status and invoices'],
    apps: ['sales', 'helpdesk', 'portal'],
    color: '#2f7bff',
  },
  {
    key: 'prof',
    name: 'Professional services',
    headline: 'Proposals, clients and billing without the busywork.',
    body: 'Send proposals with approvals, share documents securely, and get paid faster with built-in payment links.',
    points: ['Quote and proposal workflows with approvals', 'Client portal and shared documents', 'Invoices and payment links'],
    apps: ['sales', 'portal', 'marketing'],
    color: '#ff4d8d',
  },
]

const active = ref(0)
const cur = computed(() => industries[active.value])
</script>

<template>
  <section id="industries" class="relative px-5 py-20 sm:py-28">
    <div class="mx-auto max-w-6xl">
      <div v-reveal class="max-w-3xl">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-mute">Industries</p>
        <h2 class="font-display text-[clamp(2rem,4.4vw,3.7rem)] font-extrabold leading-[0.95]">
          Built for how <span class="gradient-text">your industry</span> works.
        </h2>
      </div>

      <div v-reveal="100" class="-mx-5 mt-12 overflow-x-auto px-5 [scrollbar-width:none]">
        <div class="flex w-max gap-2 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-ink/10">
          <button
            v-for="(ind, i) in industries"
            :key="ind.key"
            class="rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300"
            :class="i === active ? 'text-white shadow-md' : 'text-ink/60 hover:bg-ink/5'"
            :style="i === active ? { background: ind.color } : {}"
            @click="active = i"
          >
            {{ ind.name }}
          </button>
        </div>
      </div>

      <div v-reveal="150" class="relative mt-8 min-h-[26rem] overflow-hidden rounded-[2.2rem] border border-ink/10 bg-white md:min-h-[22rem]">
        <Transition name="fade-slide" mode="out-in">
          <div :key="cur.key" class="grid h-full gap-10 p-7 sm:p-12 md:grid-cols-[1.2fr_1fr]">
            <div>
              <span class="inline-block rounded-md px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-white" :style="{ background: cur.color }">{{ cur.name }}</span>
              <h3 class="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-3xl">{{ cur.headline }}</h3>
              <p class="mt-4 max-w-lg text-ink/65">{{ cur.body }}</p>
              <ul class="mt-6 space-y-2.5">
                <li v-for="(p, i) in cur.points" :key="p" class="flex items-start gap-3" :style="{ animation: `rise .6s ${i * 90}ms cubic-bezier(.2,.8,.2,1) both` }">
                  <span class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white" :style="{ background: cur.color }">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                  </span>
                  <span class="font-medium">{{ p }}</span>
                </li>
              </ul>
              <a :href="DEMO_URL" class="btn btn-primary mt-8">See it for {{ cur.name.toLowerCase() }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </div>

            <div class="relative flex flex-col justify-center rounded-3xl p-6" :style="{ background: cur.color + '12' }">
              <div class="mb-4 text-xs font-bold uppercase tracking-widest" :style="{ color: cur.color }">Apps this team uses</div>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="(k, i) in cur.apps"
                  :key="k"
                  class="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-ink/5"
                  :style="{ animation: `pop .5s ${i * 100}ms both` }"
                >
                  <span class="grid size-10 place-items-center rounded-xl text-white" :style="{ background: appByKey(k).color }">
                    <AppIcon :path="appByKey(k).icon" :size="19" />
                  </span>
                  <span class="text-sm font-bold">{{ appByKey(k).name }}</span>
                </div>
              </div>
              <div class="mt-4 flex items-center gap-2 text-xs font-medium text-ink/55">
                <span class="size-2 rounded-full bg-helpdesk" /> All sharing the same customer record
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>
