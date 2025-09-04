# 💳 Stripe Payment Integration

Complete payment and subscription system through Stripe for React application.

## 🚀 Features

- ✅ **Stripe Checkout** for secure payments
- ✅ **Subscriptions** with trial periods
- ✅ **Customer Portal** for subscription management
- ✅ **Webhook handlers** for automation
- ✅ **Firebase integration** for users
- ✅ **Limit system** by plans

## 📋 Subscription Plans

### Monthly plans:
- **Beginner**: $3/month - 2 videos per day
- **Pro**: $15/month - 5 videos per day (3-day trial period)
- **Max**: $40/month - 20 videos per day

### Annual plans:
- **Pro**: $140/year - save $40
- **Max**: $340/year - save $140

## 🔧 Installation and Setup

### 1. Install dependencies
```bash
npm install @stripe/stripe-js stripe
```

### 2. Stripe Configuration
All keys should be configured in environment variables:

**Environment Variables to set:**
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_STRIPE_PRICE_BEGINNER=price_your_beginner_plan_id
VITE_STRIPE_PRICE_PRO=price_your_pro_plan_id
VITE_STRIPE_PRICE_MAX=price_your_max_plan_id
VITE_STRIPE_PRICE_PRO_YEARLY=price_your_pro_yearly_plan_id
VITE_STRIPE_PRICE_MAX_YEARLY=price_your_max_yearly_plan_id
```

**⚠️ Important:** Never commit actual Stripe keys or price IDs to your repository. Always use environment variables.

### 3. Price IDs Configuration
Configure your Stripe price IDs in environment variables:
- Beginner: `VITE_STRIPE_PRICE_BEGINNER`
- Pro: `VITE_STRIPE_PRICE_PRO`
- Max: `VITE_STRIPE_PRICE_MAX`
- Pro Yearly: `VITE_STRIPE_PRICE_PRO_YEARLY`
- Max Yearly: `VITE_STRIPE_PRICE_MAX_YEARLY`

## 📁 File Structure

```
src/
├── config/
│   └── stripe.ts                 # Stripe configuration
├── services/
│   └── stripeService.ts          # Stripe API service
├── components/features/
│   ├── SubscriptionPlans.tsx     # Subscription plans component
│   └── SubscriptionManager.tsx   # Subscription management
├── pages/
│   ├── Pricing.tsx              # Pricing page
│   ├── Success.tsx              # Success page
│   └── Cancel.tsx               # Cancel page
└── utils/
    └── subscriptionPlans.ts     # Plans configuration

netlify/functions/
├── stripe-create-checkout-session.js  # Create Checkout Session
├── stripe-create-portal-session.js    # Create Portal Session
└── stripe-webhook.js                  # Webhook event handler
```

## 🔄 Payment Process

### 1. Plan Selection
User selects a plan on the `/pricing` page

### 2. Create Checkout Session
```typescript
const { sessionId } = await createCheckoutSession(
  planId,
  userEmail,
  successUrl,
  cancelUrl
);
```

### 3. Redirect to Stripe
```typescript
const stripe = await getStripe();
await stripe.redirectToCheckout({ sessionId });
```

### 4. Handle Result
- **Success**: Redirect to `/success`
- **Cancel**: Redirect to `/cancel`

## 🎛️ Subscription Management

### Customer Portal
```typescript
const { url } = await createCustomerPortalSession(
  customerId,
  returnUrl
);
window.location.href = url;
```

### SubscriptionManager Component
Displays current subscription information and allows management.

## 🔗 Webhook Events

Events handled in `stripe-webhook.js`:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 🚀 Netlify Deployment

### 1. Function Setup
Functions are already configured in `netlify/functions/`

### 2. Redirects
Added to `netlify.toml`:
```toml
[[redirects]]
  from = "/api/stripe/*"
  to = "/.netlify/functions/stripe-:splat"
  status = 200
```

### 3. Webhook URL
Configure webhook in Stripe Dashboard:
```
https://your-app.netlify.app/.netlify/functions/stripe-webhook
```

### 4. Environment Variables
Set all required environment variables in Netlify Dashboard:
- Go to Site Settings → Environment Variables
- Add all Stripe-related variables listed above

## 🔒 Security Best Practices

1. **Never commit secrets** to your repository
2. **Use environment variables** for all sensitive data
3. **Use test keys** for development
4. **Rotate keys** regularly
5. **Monitor webhook events** for security

## 🧪 Testing

### Test Cards
Use Stripe test cards for development:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Webhooks
Use Stripe CLI to test webhooks locally:
```bash
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
```
