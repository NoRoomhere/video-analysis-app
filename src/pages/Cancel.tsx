import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Cancel Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-12 h-12 text-white" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Оплата отменена
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Оплата была отменена. Не волнуйтесь, с вашей карты ничего не списали. 
            Вы можете попробовать снова в любое время.
          </p>

          {/* Possible Reasons */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Возможные причины отмены:
            </h2>
            
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-600">Недостаточно средств на карте</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-600">Банк заблокировал транзакцию</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-600">Техническая ошибка</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-600">Вы отменили оплату вручную</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Попробовать снова</span>
            </Link>
            
            <Link
              to="/"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Вернуться на главную</span>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Нужна помощь? Обратитесь в нашу поддержку:</p>
            <p className="text-blue-600 font-semibold">support@example.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cancel;
