import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Video,
  BarChart3,
  Zap
} from 'lucide-react';
import logo from '../../assets/aurelo-logo.png';
import { useLanguage } from '../../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  const features = [
    { icon: Video, text: t('hero.features.videoAnalysis') },
    { icon: TrendingUp, text: t('hero.features.trendPrediction') },
    { icon: Users, text: t('hero.features.competitorInsights') },
    { icon: BarChart3, text: t('hero.features.smartAnalytics') },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('hero.badge')}</span>
            <Zap className="w-4 h-4" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
          >
            {t('hero.heading')} 
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('hero.headingAccent')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200"
                >
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span>{feature.text}</span>
                </div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/video-analysis"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
            >
              <span>{t('hero.cta.startTrial')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/pricing"
              className="group bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center space-x-2 border border-gray-200"
            >
              <span>Посмотреть планы</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
              <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Play className="w-5 h-5 ml-1" />
              </div>
              <span className="font-medium">{t('hero.cta.watchDemo')}</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '10K+', label: 'hero.stats.activeUsers' },
              { number: '500M+', label: 'hero.stats.videosAnalyzed' },
              { number: '95%', label: 'hero.stats.accuracyRate' },
              { number: '24/7', label: 'hero.stats.aiSupport' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{t(stat.label)}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;