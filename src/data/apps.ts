export type AppKey =
  | 'sales'
  | 'helpdesk'
  | 'audit'
  | 'inventory'
  | 'marketing'
  | 'portal'
  | 'learning'

export interface AppDef {
  key: AppKey
  name: string
  blurb: string
  color: string
  /** 24x24 stroke icon path(s) */
  icon: string
}

export const APPS: AppDef[] = [
  {
    key: 'sales',
    name: 'Sales',
    blurb: 'Leads, deals, tasks — quote to cash in one line.',
    color: '#4f46e5',
    icon: 'M3 17l6-6 4 4 8-8M14 7h7v7',
  },
  {
    key: 'helpdesk',
    name: 'Helpdesk',
    blurb: 'Cases, SLAs, business hours, email-to-case.',
    color: '#00b894',
    icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8zM5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M18.4 5.6l-3.2 3.2M8.8 15.2l-3.2 3.2',
  },
  {
    key: 'audit',
    name: 'Audit',
    blurb: 'Field audits and surveys that work offline.',
    color: '#ff9f1c',
    icon: 'M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1zM8 6H6a1 1 0 00-1 1v13a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1h-2M9 14l2 2 4-4',
  },
  {
    key: 'inventory',
    name: 'Inventory',
    blurb: 'Stock ledger, lots, serials, POs, deliveries.',
    color: '#2f7bff',
    icon: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  },
  {
    key: 'marketing',
    name: 'Marketing',
    blurb: 'Campaigns, audiences, webforms, blog.',
    color: '#ff4d8d',
    icon: 'M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1zM15 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12',
  },
  {
    key: 'portal',
    name: 'Portal',
    blurb: 'A self-service home for your customers.',
    color: '#7cc720',
    icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  },
  {
    key: 'learning',
    name: 'Learning',
    blurb: 'Internal training plus an Academy for learners.',
    color: '#ff6b35',
    icon: 'M2 9l10-5 10 5-10 5zM6 11.5V16c3 2.4 9 2.4 12 0v-4.5',
  },
]

export const appByKey = (k: AppKey) => APPS.find((a) => a.key === k)!

/**
 * Real destinations, taken from the live site (arivusystems.com).
 * The demo form is the current entry point for new instances, so the trial and the demo
 * both land there. Split them if a self-serve signup URL is added later.
 */
export const DEMO_URL = 'https://app.arivusystems.com/demo'
export const TRIAL_URL = DEMO_URL
export const LOGIN_URL = 'https://app.arivusystems.com/login'
export const SITE = {
  blog: 'https://www.arivusystems.com/blog',
  help: 'https://www.arivusystems.com/help',
  partnerships: 'https://www.arivusystems.com/partnerships',
  privacy: 'https://www.arivusystems.com/privacy',
  terms: 'https://www.arivusystems.com/terms',
} as const
