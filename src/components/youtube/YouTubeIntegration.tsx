import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Upload, History, Settings, X, User, Shield } from 'lucide-react';
import YouTubeConnect from './YouTubeConnect';
import YouTubeUpload from './YouTubeUpload';
import YouTubeHistory from './YouTubeHistory';
import { youtubeService } from '../../services';
import { UploadedVideo } from '../../types/youtube';
import SimpleYouTube from './SimpleYouTube';

type TabType = 'connect' | 'upload' | 'history' | 'simple';

const YouTubeIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('connect');
  const [isConnected, setIsConnected] = useState(false);
  const [recentUploads, setRecentUploads] = useState<UploadedVideo[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = () => {
    try {
      const status = youtubeService.getConnectionStatus();
      console.log('Connection status:', status);
      setIsConnected(status.connected);
      
      if (status.connected) {
        loadRecentUploads();
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      setIsConnected(false);
    }
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
    if (connected) {
      loadRecentUploads();
    }
  };

  const loadRecentUploads = async () => {
    try {
      const uploads = await youtubeService.getUploadedVideos(10);
      setRecentUploads(uploads);
    } catch (error) {
      console.log('Failed to load recent uploads:', error);
    }
  };

  const handleUploadComplete = () => {
    setShowSuccessMessage(true);
    loadRecentUploads();
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const handleVideoSelect = (video: UploadedVideo) => {
    console.log('Selected video:', video);
  };

  const handleConnect = async () => {
    try {
      console.log('Initiating YouTube OAuth...');
      
      const authUrl = await youtubeService.initiateOAuth();
      console.log('Auth URL received:', authUrl);
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('OAuth error:', error);
    }
  };

  const handleGetChannelInfo = () => {
    // Implementation of handleGetChannelInfo
  };

  const handleGetChannelInfoViaFunction = async () => {
    try {
      console.log('Getting channel info via Netlify Function...');
      const channelInfo = await youtubeService.getChannelInfoViaFunction();
      console.log('Channel info received:', channelInfo);
      alert(`Channel: ${channelInfo.title}\nSubscribers: ${channelInfo.statistics.subscriberCount}`);
    } catch (error: any) {
      console.error('Error getting channel info via function:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const tabs = [
    {
      id: 'simple' as TabType,
      label: 'Analytics',
      icon: Youtube,
      description: 'Search and analyze videos'
    },
    {
      id: 'connect' as TabType,
      label: 'Connect',
      icon: Youtube,
      description: 'Link your YouTube account'
    },
    {
      id: 'upload' as TabType,
      label: 'Upload',
      icon: Upload,
      description: 'Upload new videos',
      disabled: !isConnected
    },
    {
      id: 'history' as TabType,
      label: 'History',
      icon: History,
      description: 'View uploaded videos',
      disabled: !isConnected
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">YouTube Integration</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search videos, analyze trends, and manage your YouTube content.
          </p>
        </motion.div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">Upload Successful!</h4>
                  <p className="text-sm text-green-700">Your video has been uploaded to YouTube.</p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-400 hover:text-green-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Status */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Youtube className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">YouTube Connected</h4>
                <p className="text-sm text-blue-700">
                  Your YouTube account is connected and ready for uploads.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('connect')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Manage Connection
            </button>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 shadow-sm'
                  : tab.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'simple' && (
            <SimpleYouTube />
          )}
          
          {activeTab === 'connect' && (
            <div className="space-y-4">
              <button
                onClick={handleConnect}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Youtube className="w-5 h-5" />
                <span>Connect YouTube Account</span>
              </button>
              
              {isConnected && (
                <button
                  onClick={handleGetChannelInfo}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Get Channel Info (Direct)</span>
                </button>
              )}
              
              {isConnected && (
                <button
                  onClick={handleGetChannelInfoViaFunction}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Shield className="w-5 h-5" />
                  <span>Get Channel Info (Secure)</span>
                </button>
              )}
            </div>
          )}
          
          {activeTab === 'upload' && isConnected && (
            <YouTubeUpload onUploadComplete={handleUploadComplete} />
          )}
          
          {activeTab === 'history' && isConnected && (
            <YouTubeHistory onVideoSelect={handleVideoSelect} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Recent Uploads Preview */}
      {isConnected && recentUploads.length > 0 && activeTab !== 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Uploads</h3>
            <button
              onClick={() => setActiveTab('history')}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentUploads.slice(0, 3).map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={video.thumbnails.medium.url}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.privacyStatus}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-red-500" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Easy Upload</h4>
          <p className="text-gray-600 text-sm">
            Upload videos up to 2GB with progress tracking and automatic processing.
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6 text-blue-500" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Video Management</h4>
          <p className="text-gray-600 text-sm">
            View all your uploaded videos, track performance, and manage settings.
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Settings className="w-6 h-6 text-green-500" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Smart Features</h4>
          <p className="text-gray-600 text-sm">
            Auto-tagging, privacy controls, and bulk upload capabilities.
          </p>
        </div>
      </motion.div>

      {/* Test OAuth Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Test YouTube OAuth</h3>
          <p className="text-blue-700 mb-4">
            Click the button below to test the YouTube OAuth flow
          </p>
          <button
            onClick={handleConnect}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Test YouTube Connection
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default YouTubeIntegration; 