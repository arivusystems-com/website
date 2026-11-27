/**
 * Pricing, in INR per month, excluding GST.
 *
 * CONFIRMED (from the Arivu architecture doc):
 *   seats        — Admin 999, Standard 699, Portal from 199
 *   Learning     — 1,999 / 5,999 / 11,999 for 50 / 200 / 500 learners
 *   annual       — 10x monthly (2 months free)
 *   GST          — 18% default
 *
 * PLACEHOLDER: the doc only says apps cost 149–499/mo. Exact per-app prices below
 * are assumptions inside that range — replace with the real catalog.
 */
export const SEAT_PRICES = { admin: 999, standard: 699, portal: 199 } as const

export const APP_PRICES = {
  sales: 499,
  helpdesk: 399,
  audit: 299,
  inventory: 449,
  marketing: 349,
} as const

export type PricedAppKey = keyof typeof APP_PRICES

export const LEARNING_TIERS = [
  { learners: 50, price: 1999 },
  { learners: 200, price: 5999 },
  { learners: 500, price: 11999 },
] as const

export const ANNUAL_MULTIPLIER = 10
export const GST_RATE = 0.18
export const TRIAL_DAYS = 14
export const FOUNDER_SPOTS = 100
export const FOUNDER_LOCK_MONTHS = 24
