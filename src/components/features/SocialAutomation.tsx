import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  Users,
  Eye,
  ThumbsUp,
  MessageCircle,
  Clock,
  CheckCircle,
  ImageIcon,
  Video,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SocialAutomation = () => {
  const { t } = useLanguage();
  const [selectedPlatforms, setSelectedPlatforms] = useState(['tiktok', 'instagram']);
  const [postContent, setPostContent] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const platforms = [
    { id: 'tiktok', name: 'TikTok', color: 'from-pink-500 to-red-500', icon: '🎵' },
    { id: 'instagram', name: 'Instagram', color: 'from-purple-500 to-pink-500', icon: '📸' },
  ];

  const scheduledPosts = [
    {
      id: 1,
      content: 'How to grow your business with AI 🚀',
      platforms: ['TikTok', 'Instagram'],
      scheduledTime: '2024-01-15 18:00',
      status: 'scheduled',
      hashtags: ['#AI', '#business', '#growth', '#entrepreneur'],
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      content: 'Top 5 marketing trends for 2024 📈',
      platforms: ['Instagram'],
      scheduledTime: '2024-01-16 12:00',
      status: 'posted',
      hashtags: ['#marketing', '#trends', '#2024', '#digital'],
      engagement: { likes: 1250, comments: 89, shares: 156 }
    },
    {
      id: 3,
      content: 'Behind the scenes of our latest project ✨',
      platforms: ['TikTok'],
      scheduledTime: '2024-01-17 20:00',
      status: 'draft',
      hashtags: ['#BTS', '#project', '#creative', '#team'],
      engagement: { likes: 0, comments: 0, shares: 0 }
    }
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedulePost = () => {
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setPostContent('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>{t('socialAutomation.badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('socialAutomation.heading')}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('socialAutomation.headingAccent')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('socialAutomation.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Creator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Create Post */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('socialAutomation.createNewPost')}</h3>
              
              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('socialAutomation.selectPlatforms')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                      {selectedPlatforms.includes(platform.id) && (
                        <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('socialAutomation.postContent')}</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={t('socialAutomation.postContentPlaceholder')}
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Media Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('socialAutomation.addMedia')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{t('socialAutomation.addImage')}</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Video className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{t('socialAutomation.addVideo')}</span>
                  </button>
                </div>
              </div>

              {/* AI Hashtag Generator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">{t('socialAutomation.aiGeneratedHashtags')}</label>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{t('socialAutomation.generate')}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['#marketing', '#AI', '#growth', '#business', '#viral', '#trending'].map((hashtag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('socialAutomation.scheduleDate')}</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('socialAutomation.scheduleTime')}</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleSchedulePost}
                  disabled={isScheduling || !postContent.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isScheduling ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('socialAutomation.scheduling')}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5" />
                      <span>{t('socialAutomation.schedulePost')}</span>
                    </>
                  )}
                </button>
                <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  {t('socialAutomation.saveDraft')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('socialAutomation.thisWeek')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('socialAutomation.postsScheduled')}</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('socialAutomation.postsPublished')}</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('socialAutomation.totalEngagement')}</span>
                  <span className="font-semibold text-green-600">+24.5%</span>
                </div>
              </div>
            </div>

            {/* Best Times */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('socialAutomation.bestTimesToPost')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🎵</span>
                    <span className="text-sm text-gray-600">{t('socialAutomation.tiktok')}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">6-9 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">📸</span>
                    <span className="text-sm text-gray-600">{t('socialAutomation.instagram')}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">11 AM-1 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">📷</span>
                    <span className="text-sm text-gray-600">{t('socialAutomation.instagram')}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">2-4 PM</span>
                </div>
              </div>
            </div>

            {/* Trending Hashtags */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('socialAutomation.trendingNow')}</h3>
              <div className="space-y-2">
                {['#AIMarketing', '#DigitalGrowth', '#ContentCreator', '#BusinessTips', '#Viral2024'].map((hashtag, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">{hashtag}</span>
                    <span className="text-xs text-gray-500">🔥</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scheduled Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{t('socialAutomation.scheduledPosts')}</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                {t('socialAutomation.viewAll')}
              </button>
            </div>
            
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.scheduledTime}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{post.platforms.join(', ')}</span>
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      post.status === 'posted' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {post.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.slice(0, 3).map((hashtag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {hashtag}
                        </span>
                      ))}
                      {post.hashtags.length > 3 && (
                        <span className="text-xs text-gray-500">+{post.hashtags.length - 3} more</span>
                      )}
                    </div>
                    
                    {post.status === 'posted' && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{post.engagement.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{post.engagement.comments}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>🔄</span>
                          <span>{post.engagement.shares}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialAutomation;