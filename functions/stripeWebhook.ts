import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    // Verify webhook signature
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')
    );

    console.log('Webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata;
        
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          await base44.asServiceRole.entities.Subscription.create({
            user_email: metadata.user_email,
            plan_id: metadata.plan_id,
            plan_name: metadata.plan_name,
            status: 'active',
            billing_cycle: metadata.billing_cycle,
            amount: subscription.items.data[0].price.unit_amount / 100,
            currency: subscription.currency.toUpperCase(),
            start_date: new Date(subscription.current_period_start * 1000).toISOString().split('T')[0],
            end_date: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
            next_billing_date: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
            stripe_subscription_id: subscription.id,
            stripe_customer_id: session.customer,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString().split('T')[0] : null
          });

          console.log('Subscription created for:', metadata.user_email);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        const existingSubs = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: subscription.id
        });

        if (existingSubs.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existingSubs[0].id, {
            status: subscription.status,
            next_billing_date: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
            cancel_at_period_end: subscription.cancel_at_period_end
          });
          console.log('Subscription updated:', subscription.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        const existingSubs = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: subscription.id
        });

        if (existingSubs.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existingSubs[0].id, {
            status: 'canceled',
            end_date: new Date().toISOString().split('T')[0]
          });
          console.log('Subscription canceled:', subscription.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        const existingSubs = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: invoice.subscription
        });

        if (existingSubs.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existingSubs[0].id, {
            status: 'past_due'
          });
          console.log('Payment failed for subscription:', invoice.subscription);
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});