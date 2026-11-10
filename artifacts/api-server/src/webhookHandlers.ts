import { getStripeSync } from './stripeClient';
import { handleCampaignStripeEvent } from "./campaign/payments";
import type Stripe from "stripe";

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);
    // Never trust payload contents until the existing signature verifier succeeds.
    await handleCampaignStripeEvent(JSON.parse(payload.toString("utf8")) as Stripe.Event);
  }
}
