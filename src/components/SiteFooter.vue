<script setup lang="ts">
import ArivuLogo from './ArivuLogo.vue'
import { DEMO_URL, LOGIN_URL, SITE } from '../data/apps'

const cols = [
  { title: 'Platform', links: [['Overview', '#platform'], ['One customer record', '#record'], ['Quote to cash', '#flow'], ['Pricing', '#pricing'], ['Astra AI', '#astra']] },
  { title: 'Resources', links: [['Industries', '#industries'], ['FAQ', '#faq'], ['Blog', SITE.blog], ['Help center', SITE.help]] },
  { title: 'Company', links: [['Partnerships', SITE.partnerships], ['Contact', DEMO_URL], ['Log in', LOGIN_URL], ['Privacy Policy', SITE.privacy], ['Terms of Service', SITE.terms]] },
]
</script>

<template>
  <footer class="border-t border-ink/10 bg-white px-5 pb-10 pt-16">
    <div class="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:justify-between">
      <div class="max-w-xs">
        <ArivuLogo />
        <p class="mt-3 font-display text-2xl font-extrabold"><span class="gradient-text">Everything to grow.</span></p>
        <p class="mt-3 text-ink/60">One platform that knows your customer, so every team can act on the same truth.</p>
      </div>
      <div class="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3">
        <div v-for="c in cols" :key="c.title">
          <div class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-mute">{{ c.title }}</div>
          <ul class="space-y-2.5">
            <li v-for="l in c.links" :key="l[0]">
              <a :href="l[1]" class="text-ink/75 transition hover:text-sales">{{ l[0] }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6 text-sm text-ink/45">
      <span>© {{ new Date().getFullYear() }} Arivu Systems. All rights reserved.</span>
      <span>Priced in ₹ · GST extra</span>
    </div>
  </footer>
</template>
