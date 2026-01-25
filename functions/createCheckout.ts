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

    const { priceId, planId, planName, billingCycle } = await req.json();

    if (!priceId || !planId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create or retrieve Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customer;
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name,
        metadata: {
          user_id: user.id,
          base44_app_id: Deno.env.get('BASE44_APP_ID')
        }
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${req.headers.get('origin') || 'https://example.com'}/subscriptions?success=true`,
      cancel_url: `${req.headers.get('origin') || 'https://example.com'}/subscriptions?canceled=true`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        plan_id: planId,
        plan_name: planName,
        billing_cycle: billingCycle
      },
      subscription_data: {
        metadata: {
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
          user_email: user.email,
          plan_id: planId,
          plan_name: planName
        },
        trial_period_days: 14, // 14 days free trial
      }
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});