<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeStrip from './components/MarqueeStrip.vue'
import RaceSection from './components/RaceSection.vue'
import PlatformSection from './components/PlatformSection.vue'
import RecordSection from './components/RecordSection.vue'
import FlowSection from './components/FlowSection.vue'
import PricingSection from './components/PricingSection.vue'
import IndustriesSection from './components/IndustriesSection.vue'
import AstraSection from './components/AstraSection.vue'
import TrustSection from './components/TrustSection.vue'
import FaqSection from './components/FaqSection.vue'
import FounderSection from './components/FounderSection.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <NavBar />
  <main>
    <HeroSection />
    <MarqueeStrip />
    <RaceSection />
    <PlatformSection />
    <RecordSection />
    <FlowSection />
    <PricingSection />
    <IndustriesSection />
    <AstraSection />
    <TrustSection />
    <FaqSection />
    <FounderSection />
  </main>
  <SiteFooter />
</template>
