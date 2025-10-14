import express from 'express';
import { handleStripeWebhook } from '../services/stripe.service';

export const webhooksRouter = express.Router();

webhooksRouter.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    await handleStripeWebhook(req.body.toString('utf8'), signature);
    res.json({ received: true });
  } catch (e: any) {
    res.status(400).send(`Webhook Error: ${e?.message}`);
  }
});
