import { getUncachableStripeClient } from './stripeClient';

const plans = [
  {
    planKey: 'essential',
    name: 'Essential',
    description: 'Hosting and upkeep. Monthly analytics report. No contract.',
    setupAmount: 0,
    monthlyAmount: 15000,
  },
  {
    planKey: 'growth',
    name: 'Growth',
    description: 'Adds local SEO and blog posts. Monthly analytics report. No contract. Founding rate is $250/mo through January 31, 2027.',
    setupAmount: 0,
    monthlyAmount: 50000,
  },
  {
    planKey: 'full-service',
    name: 'Full Service',
    description: 'Monthly analytics report. No contract. Founding rate is $500/mo through January 31, 2027.',
    setupAmount: 0,
    monthlyAmount: 100000,
  },
] as const;

async function seedProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Seeding website plans into Stripe...\n');

  for (const plan of plans) {
    const existing = await stripe.products.search({
      query: `metadata['plan_key']:'${plan.planKey}'`,
    });

    if (existing.data.length > 0) {
      console.log(`[SKIP] ${plan.name} already exists (${existing.data[0].id})`);
      const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
      for (const p of prices.data) {
        console.log(`       price: ${p.id}  ${p.recurring ? `$${(p.unit_amount ?? 0) / 100}/mo` : `$${(p.unit_amount ?? 0) / 100} one-time`}`);
      }
      continue;
    }

    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: { plan_key: plan.planKey },
    });
    console.log(`[CREATE] ${product.name} (${product.id})`);

    if (plan.setupAmount > 0) {
      const setupPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.setupAmount,
        currency: 'usd',
        nickname: `${plan.name} - Setup Fee`,
      });
      console.log(`         Setup: $${plan.setupAmount / 100} one-time -> ${setupPrice.id}`);
    }

    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.monthlyAmount,
      currency: 'usd',
      recurring: { interval: 'month' },
      nickname: `${plan.name} - Monthly`,
    });
    console.log(`         Monthly: $${plan.monthlyAmount / 100}/mo -> ${monthlyPrice.id}`);
    console.log('');
  }

  console.log('Done. Webhooks will sync this data to the database automatically.');
}

seedProducts().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error('Error seeding products:', msg);
  process.exit(1);
});
