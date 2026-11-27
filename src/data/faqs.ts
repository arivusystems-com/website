export interface Faq {
  q: string
  a: string
}

/** Single source of truth: rendered by FaqSection and rendered by FaqSection. */
export const FAQS: Faq[] = [
  {
    q: 'What is Arivu, and how does it work?',
    a: 'Arivu is a multi-app business platform. Sales, Helpdesk, Audit, Inventory, Marketing and more all sit on one customer record, one login and one permission model. You switch on the apps you need and your teams work from the same data.',
  },
  {
    q: 'Who is Arivu designed for?',
    a: 'Growing businesses, scaling teams, founders and operations leaders who are replacing a patchwork of disconnected tools. It works for a single location or many teams.',
  },
  {
    q: 'How much does it cost?',
    a: 'Pricing is per seat, in ₹, plus the apps you switch on: Admin ₹999 and Standard ₹699 per month, Portal users from ₹199, and apps from ₹149 to ₹499 per month. Annual billing is 10× monthly, so two months are free. Prices exclude GST. Use the price builder above to see your exact total.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes, 14 days. Pick your apps, invite your team and see it on your own data before you pay anything.',
  },
  {
    q: 'What makes Arivu different from other business software?',
    a: 'One customer record shared by every app, instead of a copy in every tool. A deal flows into a quote, an order, an invoice and a payment without re-typing. Pricing is transparent, and Astra AI works on the same records and permissions as everyone else.',
  },
  {
    q: 'Is my data kept separate from other customers?',
    a: 'Yes. Every customer can have its own database or its own Kubernetes instance. On top of that, access is controlled with roles, profiles, field-level permissions and sharing rules, and changes are kept in an audit trail.',
  },
  {
    q: 'Is Arivu cloud-based? Does it work on mobile?',
    a: 'It is fully cloud-based, so there are no servers to run. There is also a mobile app, and field audits can run offline and sync later. The product is available in 13 languages, including Hindi, Arabic, Japanese and Korean.',
  },
  {
    q: 'How long does it take to go live?',
    a: 'Most teams start from pre-built foundations and workflows and are running in days rather than months. Configure processes, forms, approvals and automations to match how you already work, with no coding.',
  },
]
