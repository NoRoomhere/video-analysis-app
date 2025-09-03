import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Здесь можно получить информацию о подписке
      setLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Оплата прошла успешно! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Добро пожаловать в сообщество создателей вирусного контента! 
            Ваша подписка активирована и готова к использованию.
          </p>

          {/* Subscription Details */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Zap className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Ваша подписка активна</h2>
            </div>
            
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">План:</span>
                <span className="font-semibold text-gray-900">Pro</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Лимит видео:</span>
                <span className="font-semibold text-gray-900">5 в день</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Статус:</span>
                <span className="font-semibold text-green-600">Активна</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/video-analysis"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>Начать анализ видео</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/dashboard"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300"
            >
              Перейти в личный кабинет
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>На вашу почту отправлено подтверждение оплаты.</p>
            <p>Если у вас есть вопросы, обратитесь в поддержку.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;
