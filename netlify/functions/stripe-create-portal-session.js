const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  if (!event.body) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing JSON body' }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server misconfiguration' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    console.error('Bad JSON body:', event.body);
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { customerId, returnUrl } = payload;
  if (!customerId || !returnUrl) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  try {
    const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
    return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };
  } catch (error) {
    console.error('Portal error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create portal session' }) };
  }
};
