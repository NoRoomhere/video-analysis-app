const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // CORS
  const origin = event.headers.origin || event.headers.Origin || '*';
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // only POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  // body required
  if (!event.body) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing JSON body' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    console.error('Bad JSON body:', event.body);
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { priceId, customerEmail, successUrl, cancelUrl, planId, trialDays } = payload;

  if (!priceId || !customerEmail || !successUrl || !cancelUrl) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server misconfiguration' }) };
  }

  try {
    // find or create customer
    let customer;
    const existingCustomers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    customer = existingCustomers.data[0] || (await stripe.customers.create({ email: customerEmail, metadata: { planId: planId || '' } }));

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { planId: planId || '', customerEmail },
      subscription_data: trialDays ? { trial_period_days: trialDays } : undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: { address: 'auto', name: 'auto' },
    });

    return { statusCode: 200, headers, body: JSON.stringify({ sessionId: session.id }) };
  } catch (error) {
    console.error('Checkout error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create checkout session' }) };
  }
};
