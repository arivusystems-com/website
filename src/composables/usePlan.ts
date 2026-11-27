import { computed, reactive, ref } from 'vue'
import { APP_PRICES, LEARNING_TIERS, SEAT_PRICES, type PricedAppKey } from '../data/pricing'

/**
 * The price-builder state, kept in one shared place so PricingSection just renders it.
 */
export const annual = ref(false)
export const seats = reactive({ admin: 1, standard: 4, portal: 10 })
export const picked = reactive<Record<PricedAppKey, boolean>>({
  sales: true,
  helpdesk: true,
  audit: false,
  inventory: false,
  marketing: false,
})
export const learningOn = ref(false)
export const tier = ref(0)

/** Bumped whenever something outside the pricing section changes the plan; the section flashes. */
export const planFlash = ref(0)

/** Monthly total in ₹, excluding GST. */
export const monthly = computed(() => {
  let sum = seats.admin * SEAT_PRICES.admin + seats.standard * SEAT_PRICES.standard + seats.portal * SEAT_PRICES.portal
  for (const k of Object.keys(APP_PRICES) as PricedAppKey[]) if (picked[k]) sum += APP_PRICES[k]
  if (learningOn.value) sum += LEARNING_TIERS[tier.value].price
  return sum
})

export const pickedCount = computed(
  () => (Object.keys(APP_PRICES) as PricedAppKey[]).filter((k) => picked[k]).length + (learningOn.value ? 1 : 0),
)
