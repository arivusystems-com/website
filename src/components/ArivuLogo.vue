<script setup lang="ts">
// `dark` = the logo sits on a dark background (uses the light variant of the official SVG).
defineProps<{ dark?: boolean }>()
const top = () => {
  history.replaceState(null, '', location.pathname + location.search)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <a
    href="/"
    class="group inline-flex items-center"
    aria-label="Arivu home"
    @click.prevent="top"
  >
    <img
      :src="dark ? '/logo/Logo_word_light.svg' : '/logo/Logo_word_dark.svg'"
      alt="Arivu"
      width="1050"
      height="550"
      class="h-11 w-auto transition-transform duration-500 group-hover:scale-105"
    />
  </a>
</template>
