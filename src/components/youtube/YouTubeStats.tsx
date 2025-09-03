import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share,
  Users, 
  Clock,
  Filter,
  Download,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { UploadedVideo } from '../../types/youtube';

interface YouTubeStatsProps {
  videos: UploadedVideo[];
  channelInfo?: {
    statistics: {
      viewCount: string;
      subscriberCount: string;
      videoCount: string;
    };
  } | null;
}

const YouTubeStats: React.FC<YouTubeStatsProps> = ({ videos, channelInfo }) => {
  const formatNumber = (num: string): string => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  };

  const calculateStats = () => {
    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.viewCount || '0'), 0);
    const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.likeCount || '0'), 0);
    const totalComments = videos.reduce((sum, video) => sum + parseInt(video.commentCount || '0'), 0);
    const publicVideos = videos.filter(video => video.privacyStatus === 'public').length;
    const privateVideos = videos.filter(video => video.privacyStatus === 'private').length;
    const unlistedVideos = videos.filter(video => video.privacyStatus === 'unlisted').length;

    // Calculate average views per video
    const avgViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0;
    
    // Calculate engagement rate (likes + comments / views)
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(2) : '0';

    return {
      totalViews,
      totalLikes,
      totalComments,
      publicVideos,
      privateVideos,
      unlistedVideos,
      avgViews,
      engagementRate
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Views',
      value: formatNumber(stats.totalViews.toString()),
      icon: Eye,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Likes',
      value: formatNumber(stats.totalLikes.toString()),
      icon: ThumbsUp,
      color: 'green',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Comments',
      value: formatNumber(stats.totalComments.toString()),
      icon: MessageCircle,
      color: 'purple',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Avg Views/Video',
      value: formatNumber(stats.avgViews.toString()),
      icon: TrendingUp,
      color: 'orange',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const privacyStats = [
    {
      title: 'Public Videos',
      value: stats.publicVideos,
      icon: Eye,
      color: 'green'
    },
    {
      title: 'Private Videos',
      value: stats.privateVideos,
      icon: Eye,
      color: 'gray'
    },
    {
      title: 'Unlisted Videos',
      value: stats.unlistedVideos,
      icon: Eye,
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 text-blue-100';
      case 'green': return 'bg-green-500 text-green-100';
      case 'purple': return 'bg-purple-500 text-purple-100';
      case 'orange': return 'bg-orange-500 text-orange-100';
      case 'yellow': return 'bg-yellow-500 text-yellow-100';
      case 'gray': return 'bg-gray-500 text-gray-100';
      default: return 'bg-blue-500 text-blue-100';
    }
  };

  const getChangeColor = (type: string) => {
    return type === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className={`w-4 h-4 ${getChangeColor(stat.changeType)}`} />
                <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Channel Stats and Privacy Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Overview */}
        {channelInfo && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Subscribers</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {formatNumber(channelInfo.statistics.subscriberCount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Total Videos</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatNumber(channelInfo.statistics.videoCount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Channel Views</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {formatNumber(channelInfo.statistics.viewCount)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Privacy Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Privacy Distribution</h3>
          
          <div className="space-y-4">
            {privacyStats.map((stat) => (
              <div key={stat.title} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{stat.title}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Engagement Rate */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
              <span className="text-lg font-bold text-green-600">{stats.engagementRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(parseFloat(stats.engagementRate), 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              (Likes + Comments) / Views
            </p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      {videos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          
          <div className="space-y-3">
            {videos.slice(0, 5).map((video) => (
              <div key={video.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <img src={video.thumbnails.default.url} alt={video.title} className="w-12 h-8 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                  <p className="text-xs text-gray-500">{formatNumber(video.viewCount)} views • {new Date(video.publishedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {formatNumber(video.viewCount)}
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {formatNumber(video.likeCount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default YouTubeStats; 