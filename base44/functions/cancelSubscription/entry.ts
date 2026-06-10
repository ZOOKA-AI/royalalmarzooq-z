import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return Response.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    // Cancel subscription at period end (user keeps access until end of billing period)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    return Response.json({ 
      success: true,
      subscription: {
        id: subscription.id,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: subscription.current_period_end
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});