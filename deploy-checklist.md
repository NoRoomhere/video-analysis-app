# 🚀 Deployment Checklist for Video Analysis App

## ✅ Before Deployment

### 1. File Verification
- [ ] All Stripe functions created in `netlify/functions/`
- [ ] Stripe configuration updated in `src/config/stripe.ts`
- [ ] URLs updated for your domain
- [ ] `netlify.toml` configured correctly

### 2. Dependency Check
- [ ] `@stripe/stripe-js` installed
- [ ] `stripe` installed
- [ ] All other dependencies installed

### 3. Stripe Dashboard Setup
- [ ] Webhook URL: `https://your-app.netlify.app/.netlify/functions/stripe-webhook`
- [ ] All Price IDs created and active
- [ ] Production keys configured

## 🔧 Deployment Process

### 1. Upload to GitHub
```bash
git add .
git commit -m "🚀 Prepare for deployment with Stripe integration"
git push origin main
```

### 2. Netlify Setup
- Connect repository to Netlify
- Set up your custom domain
- Configure SSL certificate

### 3. Environment Variables
Set these in Netlify Dashboard (Site Settings → Environment Variables):
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
VITE_STRIPE_PRICE_BEGINNER=price_your_beginner_plan_id
VITE_STRIPE_PRICE_PRO=price_your_pro_plan_id
VITE_STRIPE_PRICE_MAX=price_your_max_plan_id
VITE_STRIPE_PRICE_PRO_YEARLY=price_your_pro_yearly_plan_id
VITE_STRIPE_PRICE_MAX_YEARLY=price_your_max_yearly_plan_id
```

**⚠️ Important:** Never commit actual Stripe keys to your repository. Always use environment variables.

## 🧪 After Deployment

### 1. Function Testing
- [ ] `/api/stripe/create-checkout-session` works
- [ ] `/api/stripe/create-portal-session` works
- [ ] `/api/stripe/webhook` receives events

### 2. Page Testing
- [ ] `/pricing` displays correctly
- [ ] `/success` works after payment
- [ ] `/cancel` works on cancellation

### 3. Payment Testing
- [ ] Checkout Session creation
- [ ] Redirect to Stripe
- [ ] Successful payment handling
- [ ] Cancellation handling

### 4. Webhook Verification
- [ ] Events reach functions
- [ ] Logs appear in Netlify
- [ ] Subscriptions created in Stripe

## 🐛 Potential Issues

### CORS Errors
- Check headers in `netlify.toml`
- Verify domain correctness

### Functions Not Working
- Check logs in Netlify Functions
- Verify redirects are correct

### Webhook Not Working
- Check URL in Stripe Dashboard
- Verify signature correctness

## 🔒 Security Checklist

- [ ] All Stripe keys are in environment variables
- [ ] No sensitive data in repository
- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced
- [ ] CORS properly configured

## 🎉 Ready!

After passing all checks, the system is ready to accept real payments! 💳✨
