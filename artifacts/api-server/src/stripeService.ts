import Stripe from 'stripe';
import { getUncachableStripeClient } from './stripeClient';

export class StripeService {
  async createCheckoutSession(
    setupPriceId: string | null,
    monthlyPriceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const stripe = await getUncachableStripeClient();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (setupPriceId) {
      lineItems.push({ price: setupPriceId, quantity: 1 });
    }
    lineItems.push({ price: monthlyPriceId, quantity: 1 });

    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });
  }
}

export const stripeService = new StripeService();
