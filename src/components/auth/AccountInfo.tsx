import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ExternalLink,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface AccountInfoProps {
  accounts: {
    tiktok: { username: string; followers: string; verified: boolean };
    instagram: { username: string; followers: string; verified: boolean };
  };
}

const AccountInfo: React.FC<AccountInfoProps> = ({ accounts }) => {
  const platformData = [
    {
      name: 'TikTok',
      username: accounts.tiktok.username,
      followers: accounts.tiktok.followers,
      verified: accounts.tiktok.verified,
      color: '#FF0050',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      icon: '🎵',
      change: '+2.3K',
      trend: 'up'
    },
    {
      name: 'Instagram',
      username: accounts.instagram.username,
      followers: accounts.instagram.followers,
      verified: accounts.instagram.verified,
      color: '#E4405F',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: '📷',
      change: '-450',
      trend: 'down'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Connected Accounts</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {platformData.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            className={`${platform.bgColor} ${platform.borderColor} border rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200 min-w-0`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3 min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-xl sm:text-2xl">{platform.icon}</span>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{platform.name}</h4>
                  <div className="flex items-center space-x-1 min-w-0">
                    <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[70px] sm:max-w-none">{platform.username}</span>
                    {platform.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer flex-shrink-0" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Followers</span>
                <span className="font-semibold text-gray-900 text-xs sm:text-base">{platform.followers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">This week</span>
                <div className={`flex items-center space-x-1 text-xs sm:text-sm ${
                  platform.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {platform.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{platform.change}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AccountInfo; 