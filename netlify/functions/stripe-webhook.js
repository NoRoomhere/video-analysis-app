import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event, context) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Webhook error: STRIPE_SECRET_KEY is not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration' }) };
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Webhook error: STRIPE_WEBHOOK_SECRET is not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration' }) };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    if (!sig) {
      console.error('Webhook error: Missing stripe-signature header');
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing stripe-signature header' }) };
    }

    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' })
    };
  }

  // Обработка различных событий
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object;
      console.log('Checkout session completed:', session.id);
      
      // Здесь можно добавить логику для обновления пользователя в Firebase
      // Например, активировать подписку пользователя
      break;

    case 'customer.subscription.created':
      const subscription = stripeEvent.data.object;
      console.log('Subscription created:', subscription.id);
      
      // Обновить статус подписки в Firebase
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = stripeEvent.data.object;
      console.log('Subscription updated:', updatedSubscription.id);
      
      // Обновить данные подписки в Firebase
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = stripeEvent.data.object;
      console.log('Subscription deleted:', deletedSubscription.id);
      
      // Отключить подписку в Firebase
      break;

    case 'invoice.payment_succeeded':
      const invoice = stripeEvent.data.object;
      console.log('Payment succeeded:', invoice.id);
      
      // Обновить статус платежа
      break;

    case 'invoice.payment_failed':
      const failedInvoice = stripeEvent.data.object;
      console.log('Payment failed:', failedInvoice.id);
      
      // Обработать неудачный платеж
      break;

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};
