import React, { useState } from 'react';
import { AFFILIATE_TIERS, AFFILIATE_PROGRAM_DESCRIPTION } from '../../utils/constants';
import { CheckCircle, Copy, Gift, Zap, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const mockReferralLink = 'https://your-app.com/?ref=YOURCODE';

const AffiliateProgram: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockReferralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 pb-20 overflow-hidden">
      {/* Background Gradient Circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-2000"></div>

      {/* Hero Section */}
      <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-12 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-5 py-2 text-base font-medium text-yellow-700 mb-6 shadow"
        >
          <Gift className="w-5 h-5 text-yellow-500" />
          <span>{t('affiliate.heading')}</span>
          <Zap className="w-5 h-5 text-orange-500" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
        >
          {t('affiliate.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
        >
          {t('affiliate.description')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <button
            onClick={handleCopy}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? t('affiliate.copied') : t('affiliate.copy_link')}</span>
          </button>
          <span className="font-mono text-yellow-700 text-sm select-all bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            {mockReferralLink}
          </span>
        </motion.div>
      </div>

      {/* Tiers Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative max-w-4xl mx-auto px-4 z-10"
      >
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/90">
          <table className="min-w-full text-center">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-100 to-orange-100">
                <th className="px-4 py-3 text-sm font-bold text-yellow-700">{t('affiliate.tier')}</th>
                <th className="px-4 py-3 text-sm font-bold text-yellow-700">{t('affiliate.referrals')}</th>
                <th className="px-4 py-3 text-sm font-bold text-yellow-700">{t('affiliate.commission')}</th>
                <th className="px-4 py-3 text-sm font-bold text-yellow-700">{t('affiliate.recurring')}</th>
                <th className="px-4 py-3 text-sm font-bold text-yellow-700">{t('affiliate.bonuses')}</th>
                <th className="px-4 py-3 text-sm font-bold text-yellow-700">{t('affiliate.premium_support')}</th>
              </tr>
            </thead>
            <tbody>
              {AFFILIATE_TIERS.map((tier, idx) => (
                <tr key={tier.name} className={`border-t ${idx % 2 === 0 ? 'bg-yellow-50/60' : 'bg-white/80'}`}>
                  <td className="px-4 py-3 font-bold text-gray-900 text-lg flex items-center justify-center gap-2">
                    {tier.name === 'Bronze' && <Gift className="w-5 h-5 text-yellow-400" />}
                    {tier.name === 'Silver' && <Gift className="w-5 h-5 text-gray-400" />}
                    {tier.name === 'Gold' && <Gift className="w-5 h-5 text-yellow-600" />}
                    {tier.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{tier.minReferrals} - {tier.maxReferrals === Infinity ? '∞' : tier.maxReferrals}</td>
                  <td className="px-4 py-3 text-orange-600 font-semibold">{tier.commission}%</td>
                  <td className="px-4 py-3 text-orange-500 font-semibold">{tier.recurring}%</td>
                  <td className="px-4 py-3 text-gray-700">{tier.bonus || '-'}</td>
                  <td className="px-4 py-3 text-center">{tier.premiumSupport ? <CheckCircle className="w-5 h-5 text-green-500 inline" /> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative max-w-4xl mx-auto px-4 mt-16 z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 rounded-2xl p-6 shadow flex flex-col items-center text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900">{t('affiliate.instant_payouts')}</h3>
            <p className="text-gray-600">{t('affiliate.instant_payouts_description')}</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 shadow flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900">{t('affiliate.recurring_income')}</h3>
            <p className="text-gray-600">{t('affiliate.recurring_income_description')}</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 shadow flex flex-col items-center text-center">
            <Zap className="w-8 h-8 text-orange-400 mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900">{t('affiliate.exclusive_bonuses')}</h3>
            <p className="text-gray-600">{t('affiliate.exclusive_bonuses_description')}</p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="relative max-w-2xl mx-auto px-4 mt-20 text-center z-10"
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-10 text-white shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('affiliate.ready_to_earn')}</h3>
          <p className="mb-6 text-orange-100 max-w-xl mx-auto">
            {t('affiliate.ready_to_earn_description')}
          </p>
          <button
            onClick={handleCopy}
            className="bg-white text-orange-500 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-300 inline-flex items-center space-x-2"
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? t('affiliate.copied') : t('affiliate.copy_link')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AffiliateProgram; 