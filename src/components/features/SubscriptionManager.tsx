import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, CreditCard, Calendar, Zap, Settings, ExternalLink } from 'lucide-react';
import { createCustomerPortalSession } from '../../services/stripeService';
import { useAuth } from '../../context/AuthContext';
import { getPlanById } from '../../utils/subscriptionPlans';

interface SubscriptionData {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  planId: string;
  customerId: string;
}

const SubscriptionManager: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Здесь можно загрузить данные о подписке пользователя из Firebase
    // Пока используем моковые данные
    if (user) {
      // Загрузка подписки из Firebase
    }
  }, [user]);

  const handleManageSubscription = async () => {
    if (!subscription?.customerId) return;

    setLoading(true);
    try {
      const { url } = await createCustomerPortalSession(
        subscription.customerId,
        `https://aurelo.dev/dashboard`
      );
      
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      alert('Произошла ошибка при открытии панели управления');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'past_due':
        return 'text-orange-600 bg-orange-100';
      case 'canceled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активна';
      case 'past_due':
        return 'Просрочена';
      case 'canceled':
        return 'Отменена';
      default:
        return 'Неизвестно';
    }
  };

  if (!subscription) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            У вас нет активной подписки
          </h3>
          <p className="text-gray-600 mb-6">
            Выберите план подписки для доступа к полному функционалу
          </p>
          <a
            href="/pricing"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
          >
            <span>Выбрать план</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const plan = getPlanById(subscription.planId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Crown className="w-8 h-8 text-purple-500" />
          <h3 className="text-2xl font-bold text-gray-900">
            Управление подпиской
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(subscription.status)}`}>
          {getStatusText(subscription.status)}
        </span>
      </div>

      {/* Plan Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-blue-500" />
            <h4 className="text-lg font-semibold text-gray-900">Текущий план</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">План:</span>
              <span className="font-semibold text-gray-900">{plan?.name || 'Неизвестно'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Лимит видео:</span>
              <span className="font-semibold text-gray-900">{plan?.limits.videosPerDay || 0} в день</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Статус:</span>
              <span className={`font-semibold ${getStatusColor(subscription.status)}`}>
                {getStatusText(subscription.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-green-500" />
            <h4 className="text-lg font-semibold text-gray-900">Период оплаты</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Следующий платеж:</span>
              <span className="font-semibold text-gray-900">
                {formatDate(subscription.current_period_end)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Отмена:</span>
              <span className="font-semibold text-gray-900">
                {subscription.cancel_at_period_end ? 'В конце периода' : 'Не запланирована'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleManageSubscription}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2 disabled:opacity-50"
        >
          <Settings className="w-4 h-4" />
          <span>{loading ? 'Загрузка...' : 'Управлять подпиской'}</span>
        </button>

        <button className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all duration-300 inline-flex items-center space-x-2">
          <CreditCard className="w-4 h-4" />
          <span>История платежей</span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">
          <strong>Совет:</strong> Вы можете изменить план, отменить подписку или обновить способ оплаты в панели управления Stripe.
        </p>
      </div>
    </motion.div>
  );
};

export default SubscriptionManager;
