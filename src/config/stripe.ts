// Stripe configuration for client-side usage
// Note: Price IDs are safe to expose publicly as they're designed for client-side use
export const STRIPE_CONFIG = {
  // API Keys (publishable only; secret keys must NOT be in client code)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

  // Price IDs - these are safe to expose publicly
  prices: {
    beginner: import.meta.env.VITE_STRIPE_PRICE_BEGINNER || '',
    pro: import.meta.env.VITE_STRIPE_PRICE_PRO || '',
    max: import.meta.env.VITE_STRIPE_PRICE_MAX || '',
    proYearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY || '',
    maxYearly: import.meta.env.VITE_STRIPE_PRICE_MAX_YEARLY || ''
  },

  // Settings
  currency: 'usd',
  mode: import.meta.env.VITE_STRIPE_MODE || 'test'
};

// Validate configuration
export const validateStripeConfig = () => {
  const errors: string[] = [];
  
  if (!STRIPE_CONFIG.publishableKey) {
    errors.push('VITE_STRIPE_PUBLISHABLE_KEY is required');
  }
  
  const priceIds = Object.values(STRIPE_CONFIG.prices);
  if (priceIds.some(id => !id)) {
    errors.push('All Stripe price IDs must be configured');
  }
  
  return errors;
};

export const getPriceId = (planId: string): string => {
  const priceMap: Record<string, string> = {
    'beginner': STRIPE_CONFIG.prices.beginner,
    'pro': STRIPE_CONFIG.prices.pro,
    'max': STRIPE_CONFIG.prices.max,
    'pro-yearly': STRIPE_CONFIG.prices.proYearly,
    'max-yearly': STRIPE_CONFIG.prices.maxYearly
  };
  
  return priceMap[planId] || '';
};