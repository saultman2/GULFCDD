export interface PlanConfig {
  key: string;
  name: string;
  type: 'subscription' | 'payment';
  setupCents: number;
  monthlyCents: number;
  onceCents: number;
}

/**
 * Public monthly plans. Founding rates and the free build are quoted
 * through January 31, 2027; checkout uses the regular monthly amount.
 * No setup fee is charged here.
 */
export const PLANS: Record<string, PlanConfig> = {
  essential: {
    key: 'essential',
    name: 'Essential',
    type: 'subscription',
    setupCents: 0,
    monthlyCents: 15000,
    onceCents: 0,
  },
  growth: {
    key: 'growth',
    name: 'Growth',
    type: 'subscription',
    setupCents: 0,
    monthlyCents: 50000,
    onceCents: 0,
  },
  'full-service': {
    key: 'full-service',
    name: 'Full Service',
    type: 'subscription',
    setupCents: 0,
    monthlyCents: 100000,
    onceCents: 0,
  },
};
