export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string;
  trialDays?: number;
  features: string[];
  limits: {
    videosPerDay: number;
    maxFileSizeMB: number;
    maxRecommendationsPerAnalysis: number;
    analysesPerMonth: number;
  };
  color: string;
  gradient: string;
  badge?: string;
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    price: 3.00,
    currency: 'USD',
    interval: 'month',
    stripePriceId: 'price_beginner_monthly',
    features: [
      '2 видео в день',
      'Расширенные рекомендации',
      'Приоритетная поддержка',
      'Экспорт в PDF',
      'Базовый аналитический отчет'
    ],
    limits: {
      videosPerDay: 2,
      maxFileSizeMB: 100,
      maxRecommendationsPerAnalysis: 8,
      analysesPerMonth: 60
    },
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-600 to-cyan-600',
    badge: '🎯 НАЧАЛЬНЫЙ'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 15.00,
    currency: 'USD',
    interval: 'month',
    stripePriceId: 'price_pro_monthly',
    trialDays: 3,
    features: [
      '5 видео в день',
      '3 дня бесплатно',
      'Расширенные рекомендации',
      'Приоритетная поддержка',
      'Экспорт в PDF',
      'A/B тестирование',
      'Детальная аналитика',
      'API доступ'
    ],
    limits: {
      videosPerDay: 5,
      maxFileSizeMB: 200,
      maxRecommendationsPerAnalysis: 12,
      analysesPerMonth: 150
    },
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-600 to-pink-600',
    badge: '⭐ РЕКОМЕНДУЕМЫЙ',
    popular: true
  },
  {
    id: 'max',
    name: 'Max',
    price: 40.00,
    currency: 'USD',
    interval: 'month',
    stripePriceId: 'price_max_monthly',
    features: [
      '20 видео в день',
      'Все функции Pro',
      'Команда до 5 пользователей',
      'Кастомные интеграции',
      'Персональный менеджер',
      'Белый лейбл'
    ],
    limits: {
      videosPerDay: 20,
      maxFileSizeMB: 500,
      maxRecommendationsPerAnalysis: 20,
      analysesPerMonth: 600
    },
    color: 'from-orange-500 to-red-500',
    gradient: 'from-orange-600 to-red-600',
    badge: '🚀 МАКСИМАЛЬНЫЙ'
  }
];

export const YEARLY_PLANS: SubscriptionPlan[] = [
  {
    id: 'pro_yearly',
    name: 'Pro (Ежегодно)',
    price: 140.00,
    currency: 'USD',
    interval: 'year',
    stripePriceId: 'price_pro_yearly',
    trialDays: 3,
    features: [
      '5 видео в день',
      '3 дня бесплатно',
      'Экономия $40 в год',
      'Все функции Pro',
      'Приоритетная поддержка'
    ],
    limits: {
      videosPerDay: 5,
      maxFileSizeMB: 200,
      maxRecommendationsPerAnalysis: 12,
      analysesPerMonth: 150
    },
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-600 to-pink-600',
    badge: '⭐ РЕКОМЕНДУЕМЫЙ',
    popular: true
  },
  {
    id: 'max_yearly',
    name: 'Max (Ежегодно)',
    price: 340.00,
    currency: 'USD',
    interval: 'year',
    stripePriceId: 'price_max_yearly',
    features: [
      '20 видео в день',
      'Экономия $140 в год',
      'Все функции Max',
      'Персональный менеджер',
      'Белый лейбл'
    ],
    limits: {
      videosPerDay: 20,
      maxFileSizeMB: 500,
      maxRecommendationsPerAnalysis: 20,
      analysesPerMonth: 600
    },
    color: 'from-orange-500 to-red-500',
    gradient: 'from-orange-600 to-red-600',
    badge: '🚀 МАКСИМАЛЬНЫЙ'
  }
];

export const getPlanById = (id: string): SubscriptionPlan | undefined => {
  return [...SUBSCRIPTION_PLANS, ...YEARLY_PLANS].find(plan => plan.id === id);
};

export const getMonthlyPlans = (): SubscriptionPlan[] => {
  return SUBSCRIPTION_PLANS;
};

export const getYearlyPlans = (): SubscriptionPlan[] => {
  return YEARLY_PLANS;
};

export const calculateSavings = (plan: SubscriptionPlan): number => {
  if (plan.interval === 'year') {
    if (plan.id === 'pro_yearly') {
      return 40; // Фиксированная экономия $40 для Pro ежегодно
    } else if (plan.id === 'max_yearly') {
      return 140; // Фиксированная экономия $140 для Max ежегодно
    }
  }
  return 0;
};
