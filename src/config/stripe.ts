export const STRIPE_CONFIG = {
  // API Keys (publishable only; secret keys must NOT be in client code)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

  // Price IDs
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

export const getPriceId = (planId: string): string => {
  const priceMap: Record<string, string> = {
    'beginner': STRIPE_CONFIG.prices.beginner,
    'pro': STRIPE_CONFIG.prices.pro,
    'max': STRIPE_CONFIG.prices.max,
    'pro_yearly': STRIPE_CONFIG.prices.proYearly,
    'max_yearly': STRIPE_CONFIG.prices.maxYearly
  };
  
  return priceMap[planId] || '';
};
