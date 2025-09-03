import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye,
  ThumbsUp,
  MessageCircle,
  Clock,
  Brain,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Features = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: Brain,
      title: 'Глубокий ИИ‑анализ ролика',
      description: 'Выделяем ключевые элементы: тема, месседж, целевая аудитория, визуал и звук. Даём рекомендации по усилению.',
      color: 'from-purple-500 to-pink-500',
      delay: 0.1
    },
    {
      icon: Eye,
      title: 'Детекция удержания внимания',
      description: 'Находим слабые места сюжета и таймкоды падений внимания. Предлагаем правки хука и темпа.',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.2
    },
    {
      icon: Clock,
      title: 'Оптимальная структура и тайминг',
      description: 'Рекомендуем длительность, ритм сцен, переходы и расстановку акцентов для максимального досмотра.',
      color: 'from-green-500 to-emerald-500',
      delay: 0.3
    },
    {
      icon: MessageCircle,
      title: 'Сценарные подсказки и формулировки',
      description: 'Формируем чёткие тезисы, призывы к действию и варианты формулировок для диктора и титров.',
      color: 'from-orange-500 to-red-500',
      delay: 0.4
    },
    {
      icon: ThumbsUp,
      title: 'Вирусные элементы и визуальные триггеры',
      description: 'Подсказываем рабочие приёмы: смена плана, субтитры, эффекты, мем‑референсы, звук и ритм.',
      color: 'from-indigo-500 to-purple-500',
      delay: 0.5
    },
    {
      icon: TrendingUp,
      title: 'Прогноз отклика и рекомендации публикации',
      description: 'Оцениваем потенциал охватов и даём советы по обложке, описанию, хештегам и времени публикации.',
      color: 'from-pink-500 to-rose-500',
      delay: 0.6
    }
  ];

  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm">
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
            <Zap className="w-4 h-4" />
            <span>Возможности анализа</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Инструменты <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">для роста видео</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Шесть ключевых функций, которые помогают делать ролики интереснее и вируснее.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Готовы улучшить ваши ролики?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Загрузите видео и получите понятные шаги по усилению контента.
            </p>
            <a href="/video-analysis" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 inline-flex items-center space-x-2">
              <span>Перейти к анализу</span>
              <Zap className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;