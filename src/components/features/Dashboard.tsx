import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Video, 
  Share2, 
  MessageCircle,
  Calendar,
  Filter,
  User,
  Zap,
  Eye,
  Heart,
  Upload,
  LogOut,
  ArrowUp,
  ArrowDown,
  ThumbsUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AccountInfo from '../auth/AccountInfo';


const Dashboard = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('7d');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Sample data with more realistic numbers
  const analyticsData = [
    { name: 'Mon', views: 45000, engagement: 3200, posts: 12 },
    { name: 'Tue', views: 38000, engagement: 2800, posts: 8 },
    { name: 'Wed', views: 52000, engagement: 4100, posts: 15 },
    { name: 'Thu', views: 61000, engagement: 4800, posts: 10 },
    { name: 'Fri', views: 78000, engagement: 6200, posts: 18 },
    { name: 'Sat', views: 89000, engagement: 7100, posts: 22 },
    { name: 'Sun', views: 95000, engagement: 7800, posts: 25 },
  ];

  // Updated platform data with more recognizable colors
  const platformData = [
    { name: 'TikTok', value: 60, color: '#FF0050' },
    { name: 'Instagram', value: 40, color: '#E4405F' },
  ];

  // Enhanced stats with more detailed information
  const stats = [
    {
      title: 'Total Views',
      value: '2.4M',
      change: '+12.5%',
      changeValue: '+267K',
      trend: 'up',
      icon: Zap,
      color: 'blue'
    },
    {
      title: 'Engagement Rate',
      value: '8.2%',
      change: '+2.1%',
      changeValue: '+0.3%',
      trend: 'up',
      icon: Zap,
      color: 'pink'
    },
    {
      title: 'Followers Growth',
      value: '+15.2K',
      change: '+5.8%',
      changeValue: '+2.3K',
      trend: 'up',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Content Score',
      value: '94/100',
      change: '-1.2%',
      changeValue: '-2 points',
      trend: 'down',
      icon: BarChart3,
      color: 'purple'
    }
  ];

  // Enhanced video analytics with more realistic data
  const recentVideos = [
    {
      title: 'How to Go Viral on TikTok in 2024',
      platform: 'TikTok',
      views: '1.2M',
      engagement: '12.5%',
      score: 95,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      analysis: {
        strengths: ['Strong hook in first 3 seconds', 'Trending audio used', 'Perfect timing'],
        improvements: ['Add more text overlays', 'Include call-to-action', 'Optimize hashtags'],
        recommendations: 'This video has excellent viral potential. Focus on adding more interactive elements and cross-promoting on other platforms.'
      }
    },
    {
      title: 'Instagram Growth Hacks That Actually Work',
      platform: 'Instagram',
      views: '850K',
      engagement: '8.9%',
      score: 88,
      thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      analysis: {
        strengths: ['High-quality visuals', 'Educational content', 'Good caption length'],
        improvements: ['Post at optimal times', 'Use more stories', 'Engage with comments faster'],
        recommendations: 'Solid performance. Try posting during peak hours (7-9 PM) and increase story frequency to boost engagement.'
      }
    }
  ];

  const handleUploadVideo = () => {
    // Navigate to video analysis page
    navigate('/video-analysis');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null; // This should not happen as Dashboard is protected
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">{t('dashboard.heading')}</h1>
              {/* Описание убрано, если нет dashboard.subheading в translations */}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 md:mt-0">
              {/* User Info */}
              <div className="flex items-center space-x-2 sm:space-x-3 bg-white rounded-lg px-2 sm:px-4 py-1 sm:py-2 shadow-sm min-w-0">
                <img src={user.avatar} alt={user.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
                <span className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-none">{user.name}</span>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">{t('dashboard.timeRange.7d')}</option>
                <option value="30d">{t('dashboard.timeRange.30d')}</option>
                <option value="90d">{t('dashboard.timeRange.90d')}</option>
              </select>
              <button 
                onClick={handleUploadVideo}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-1 sm:space-x-2 min-w-0"
              >
                <Upload className="w-4 h-4" />
                <span className="truncate">{t('dashboard.uploadVideo')}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center space-x-1 sm:space-x-2 min-w-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="truncate">{t('dashboard.logout')}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Account Information */}
        <AccountInfo accounts={user.accounts} />

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                  <div className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeValue} {t('dashboard.fromLastWeek')}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8 min-w-[320px]">
            {/* Views & Engagement Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-xl p-3 sm:p-6 shadow-lg border border-gray-100 min-w-0"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.viewsEngagement')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Platform Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border border-gray-100 min-w-0"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.platformDistribution')}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {platformData.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                      <span className="text-sm text-gray-600">{platform.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Video Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border border-gray-100 min-w-0"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.videoAnalytics')}</h3>
          <div className="space-y-6">
            {recentVideos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{video.title}</h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        video.score >= 90 ? 'bg-green-100 text-green-800' : 
                        video.score >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {t('dashboard.score')}: {video.score}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{video.platform}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{video.views} {t('dashboard.views')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{video.engagement} {t('dashboard.engagement')}</span>
                      </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">{t('dashboard.strengths')}</h5>
                        <ul className="space-y-1">
                          {video.analysis.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-green-600 flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">{t('dashboard.improvements')}</h5>
                        <ul className="space-y-1">
                          {video.analysis.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-sm text-orange-600 flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">{t('dashboard.recommendation')}</h5>
                        <p className="text-sm text-gray-600">{video.analysis.recommendations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;