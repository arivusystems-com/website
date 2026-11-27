import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** True while the element is meaningfully on screen. Used to pause loops that are off-screen. */
export function useInView(el: Ref<HTMLElement | null>, threshold = 0.25) {
  const visible = ref(false)
  let io: IntersectionObserver | undefined

  onMounted(() => {
    io = new IntersectionObserver(([entry]) => (visible.value = entry.isIntersecting), {
      threshold,
    })
    if (el.value) io.observe(el.value)
  })
  onBeforeUnmount(() => io?.disconnect())

  return visible
}
