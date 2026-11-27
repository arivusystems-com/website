# Arivu Marketing Website

Vue 3 + Vite + Tailwind CSS 4 + TypeScript (same stack as the Arivu product). No animation library: everything is CSS and small composables.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Page flow

Hero → Marquee → Chaos-to-clarity → Platform (Lego stack) → One record → Quote to cash → Pricing builder → Industries → Astra → Trust → FAQ → Founder's Launch → Footer

## Where to edit

| What | File |
|------|------|
| Demo / trial / login / blog / legal URLs | `src/data/apps.ts` |
| App names, colours, icons | `src/data/apps.ts` |
| Prices, seats, GST, founder spots | `src/data/pricing.ts` |
| Industry copy | `src/components/IndustriesSection.vue` |
| FAQ copy | `src/components/FaqSection.vue` |
| Page order | `src/App.vue` |
| Brand colours, fonts, keyframes | `src/style.css` |
| Logos | `public/logo/` (official SVGs from arivusystems.com) |

## Before launch

- `src/data/pricing.ts`: per-app prices are **placeholders** inside the ₹149–₹499 range from the architecture doc. Replace with the real catalog.
- `TRIAL_URL` currently points to the demo form (`app.arivusystems.com/demo`). Split it if a self-serve signup exists.
- Industries other than Retail are **draft copy** written from what the apps do. Have each reviewed.
- The Astra chat answer and the Priya / Acme examples are illustrative.
