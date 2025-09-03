import React from 'react';
import { motion } from 'framer-motion';
import { SubscriptionPlans } from '../components/features';
import { Shield, Zap, Clock, Users, CheckCircle } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-6">
              <Shield className="w-4 h-4" />
              <span>Безопасные платежи</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Выберите план для{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                роста вашего контента
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Мощные инструменты анализа видео с ИИ для создания вирусного контента. 
              Начните с бесплатного пробного периода и масштабируйтесь по мере роста.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Безопасные платежи</h3>
              <p className="text-gray-600 text-sm">Все платежи обрабатываются через Stripe с SSL-шифрованием</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Отмена в любое время</h3>
              <p className="text-gray-600 text-sm">Отмените подписку в любой момент без дополнительных платежей</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Поддержка 24/7</h3>
              <p className="text-gray-600 text-sm">Наша команда готова помочь вам в любое время</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subscription Plans */}
      <SubscriptionPlans />

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Часто задаваемые вопросы
            </h2>
            <p className="text-xl text-gray-600">
              Ответы на самые популярные вопросы о наших планах
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Можно ли отменить подписку в любое время?
              </h3>
              <p className="text-gray-600">
                Да, вы можете отменить подписку в любое время. Доступ к функциям сохранится до конца оплаченного периода.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Что включает пробный период?
              </h3>
              <p className="text-gray-600">
                Пробный период включает полный доступ ко всем функциям выбранного плана на 3 дня без списания средств.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Как работает система лимитов?
              </h3>
              <p className="text-gray-600">
                Лимиты на видео в день сбрасываются каждый день в 00:00. Вы можете использовать все доступные видео в течение дня.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Можно ли изменить план в процессе?
              </h3>
              <p className="text-gray-600">
                Да, вы можете изменить план в любое время. Новые лимиты и функции станут доступны сразу после обновления.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
