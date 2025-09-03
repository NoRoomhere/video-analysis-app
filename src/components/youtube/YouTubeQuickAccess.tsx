import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Youtube, 
  Upload, 
  History, 
  TrendingUp, 
  Settings,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useYouTube } from '../../hooks';

const YouTubeQuickAccess: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, channelInfo, uploadedVideos } = useYouTube();

  const quickActions = [
    {
      title: 'Upload Video',
      description: 'Upload a new video to YouTube',
      icon: Upload,
      action: () => navigate('/youtube'),
      color: 'red',
      disabled: !isConnected
    },
    {
      title: 'View History',
      description: 'See your uploaded videos',
      icon: History,
      action: () => navigate('/youtube'),
      color: 'blue',
      disabled: !isConnected
    },
    {
      title: 'Analytics',
      description: 'View channel performance',
      icon: TrendingUp,
      action: () => navigate('/youtube'),
      color: 'green',
      disabled: !isConnected
    },
    {
      title: 'Settings',
      description: 'Manage YouTube connection',
      icon: Settings,
      action: () => navigate('/youtube'),
      color: 'purple',
      disabled: false
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500 text-red-100';
      case 'blue': return 'bg-blue-500 text-blue-100';
      case 'green': return 'bg-green-500 text-green-100';
      case 'purple': return 'bg-purple-500 text-purple-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  const formatNumber = (num: string): string => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">YouTube Integration</h3>
            <p className="text-sm text-gray-500">Manage your YouTube content</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-500">
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Not Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Connection Status */}
      {isConnected && channelInfo ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <img
              src={channelInfo.thumbnails.default.url}
              alt={channelInfo.title}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{channelInfo.title}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>{formatNumber(channelInfo.statistics.subscriberCount)} subscribers</span>
                <span>{formatNumber(channelInfo.statistics.videoCount)} videos</span>
                <span>{formatNumber(channelInfo.statistics.viewCount)} views</span>
              </div>
            </div>
            <a
              href={`https://www.youtube.com/channel/${channelInfo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Youtube className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-900">Connect YouTube Account</h4>
              <p className="text-sm text-yellow-700">
                Connect your YouTube channel to upload videos and track analytics
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={action.action}
            disabled={action.disabled}
            className={`p-4 rounded-lg border border-gray-200 text-left transition-all ${
              action.disabled
                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                : 'hover:shadow-md hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${getColorClasses(action.color)}`}>
              <action.icon className="w-4 h-4" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
            <p className="text-xs text-gray-500">{action.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Recent Activity */}
      {isConnected && uploadedVideos.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recent Uploads</h4>
          <div className="space-y-2">
            {uploadedVideos.slice(0, 3).map((video) => (
              <div key={video.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <img
                  src={video.thumbnails.default.url}
                  alt={video.title}
                  className="w-8 h-6 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {video.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(video.publishedAt).toLocaleDateString()} • {formatNumber(video.viewCount)} views
                  </p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => navigate('/youtube')}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Youtube className="w-4 h-4" />
          <span>
            {isConnected ? 'Manage YouTube Integration' : 'Connect YouTube Account'}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default YouTubeQuickAccess; 