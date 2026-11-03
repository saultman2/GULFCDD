import { Router, type IRouter } from 'express';
import type Stripe from 'stripe';
import { getUncachableStripeClient } from '../stripeClient';
import { PLANS } from '../plans';
import { logger } from '../lib/logger';

const router: IRouter = Router();

router.post('/checkout', async (req, res) => {
  try {
    const { planKey } = req.body as { planKey?: string };

    if (!planKey) {
      res.status(400).json({ error: 'planKey is required' });
      return;
    }

    const plan = PLANS[planKey];
    if (!plan) {
      res.status(404).json({ error: `Plan "${planKey}" not found.` });
      return;
    }

    const stripe = await getUncachableStripeClient();

    const domain =
      process.env.REPLIT_DOMAINS?.split(',')[0] || req.get('host') || 'localhost';
    const baseUrl = `https://${domain}`;

    type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;

    let lineItems: LineItem[];

    if (plan.type === 'payment') {
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `GulfCDD ${plan.name} — Website Build` },
            unit_amount: plan.onceCents,
          },
          quantity: 1,
        },
      ];
    } else {
      lineItems = [];
      if (plan.setupCents > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: { name: `GulfCDD ${plan.name} — Setup & Build Fee` },
            unit_amount: plan.setupCents,
          },
          quantity: 1,
        });
      }
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `GulfCDD ${plan.name} — Monthly plan ($${plan.monthlyCents / 100}/mo, no contract)`,
          },
          unit_amount: plan.monthlyCents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?plan=${planKey}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#packages`,
      allow_promotion_codes: true,
    });

    res.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error({ err }, 'Checkout session creation failed');
    res.status(500).json({ error: message });
  }
});

export default router;
