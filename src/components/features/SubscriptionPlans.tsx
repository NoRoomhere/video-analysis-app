import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Crown, Star, Gift, ArrowRight, Loader } from 'lucide-react';
import { 
  SUBSCRIPTION_PLANS, 
  YEARLY_PLANS, 
  SubscriptionPlan,
  calculateSavings 
} from '../../utils/subscriptionPlans';
import { useLanguage } from '../../context/LanguageContext';
import { createCheckoutSession, getStripe } from '../../services/stripeService';
import { useAuth } from '../../context/AuthContext';

const SubscriptionPlans: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const plans = billingCycle === 'monthly' ? SUBSCRIPTION_PLANS : YEARLY_PLANS;

  const handlePlanSelect = async (planId: string) => {
    if (!user) {
      // Перенаправить на страницу входа
      window.location.href = '/auth';
      return;
    }

    setLoading(planId);
    setSelectedPlan(planId);

    try {
      const origin = window.location.origin;
      const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/pricing`;

      const { sessionId } = await createCheckoutSession(
        planId,
        user.email || '',
        successUrl,
        cancelUrl
      );

      // Перенаправить на Stripe Checkout
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Error:', error);
        alert('Произошла ошибка при создании сессии оплаты');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Произошла ошибка при создании сессии оплаты');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-4">
            <Crown className="w-4 h-4" />
            <span>Выберите план</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Тарифы <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">для роста</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Начните создавать вирусные видео с экспертной помощью. Выберите план, который подходит именно вам.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ежегодно
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                -40%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${
                plan.popular ? 'lg:scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Популярный</span>
                  </div>
                </div>
              )}

              {/* Plan Card */}
              <div className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${
                plan.popular 
                  ? 'border-purple-200 bg-gradient-to-br from-white to-purple-50' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}>
                {/* Badge */}
                {plan.badge && (
                  <div className="text-center mb-6">
                    <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                    <span className="text-lg text-gray-500 font-normal">
                      /{plan.interval === 'month' ? 'мес' : 'год'}
                    </span>
                  </div>
                  {plan.interval === 'year' && (
                    <div className="text-sm text-green-600 font-semibold">
                      Экономия ${calculateSavings(plan)} в год
                    </div>
                  )}
                </div>

                {/* Trial Period */}
                {plan.trialDays && (
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      <Gift className="w-4 h-4" />
                      <span>{plan.trialDays} дня бесплатно</span>
                    </div>
                  </div>
                )}

                {/* Video Limit */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${plan.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                    <Zap className="w-4 h-4" />
                    <span>{plan.limits.videosPerDay} видео в день</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    {loading === plan.id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Загрузка...</span>
                      </>
                    ) : (
                      <>
                        <span>Выбрать план</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </button>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Готовы начать создавать вирусные видео?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Выберите план и получите доступ к мощным инструментам анализа видео с ИИ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => handlePlanSelect('pro')}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 inline-flex items-center space-x-2"
              >
                <span>Начать с Pro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-blue-200 text-sm">
                Безопасные платежи • Отмена в любое время
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;
