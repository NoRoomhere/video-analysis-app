import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG, getPriceId } from '../config/stripe';
import { getPlanById } from '../utils/subscriptionPlans';

// Инициализация Stripe
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

// Типы для Stripe
export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  planId: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  client_secret: string;
}

// Создание Checkout Session
export const createCheckoutSession = async (
  planId: string,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string }> => {
  const plan = getPlanById(planId);
  if (!plan) {
    throw new Error('Plan not found');
  }

  const priceId = getPriceId(planId);
  if (!priceId) {
    throw new Error('Price ID not found');
  }

  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      customerEmail,
      successUrl,
      cancelUrl,
      planId,
      trialDays: plan.trialDays
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const { sessionId } = await response.json();
  return { sessionId };
};

// Создание Customer Portal Session
export const createCustomerPortalSession = async (
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> => {
  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      returnUrl,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create portal session');
  }

  const { url } = await response.json();
  return { url };
};

// Получение информации о подписке
export const getSubscription = async (subscriptionId: string): Promise<StripeSubscription> => {
  const response = await fetch(`/api/stripe/subscription/${subscriptionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get subscription');
  }

  return response.json();
};

// Отмена подписки
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  const response = await fetch(`/api/stripe/subscription/${subscriptionId}/cancel`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }
};

// Обновление подписки
export const updateSubscription = async (
  subscriptionId: string,
  newPriceId: string
): Promise<StripeSubscription> => {
  const response = await fetch(`/api/stripe/subscription/${subscriptionId}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newPriceId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update subscription');
  }

  return response.json();
};
