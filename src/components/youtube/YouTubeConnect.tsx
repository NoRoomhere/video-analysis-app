import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { youtubeService } from '../../services';
import { YouTubeAccount } from '../../types/youtube';

interface YouTubeConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

const YouTubeConnect: React.FC<YouTubeConnectProps> = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channelInfo, setChannelInfo] = useState<YouTubeAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const status = youtubeService.getConnectionStatus();
      setIsConnected(status.connected);
      
      if (status.connected) {
        await loadChannelInfo();
      }
      
      onConnectionChange?.(status.connected);
    } catch (error) {
      console.error('Error checking connection status:', error);
      setIsConnected(false);
      onConnectionChange?.(false);
    }
  };

  const loadChannelInfo = async () => {
    try {
      const info = await youtubeService.getChannelInfo();
      setChannelInfo(info);
    } catch (error) {
      console.error('Error loading channel info:', error);
      setError('Failed to load channel information');
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to connect to YouTube...');
      const authUrl = await youtubeService.initiateOAuth();
      console.log('Auth URL received:', authUrl);
      
      // Show success message before redirect
      setError('Redirecting to Google OAuth...');
      
      // Small delay to show the message
      setTimeout(() => {
        window.location.href = authUrl;
      }, 1000);
    } catch (error: any) {
      console.error('Error initiating OAuth:', error);
      setError(`Failed to start YouTube authorization: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await youtubeService.disconnectAccount();
      setIsConnected(false);
      setChannelInfo(null);
      onConnectionChange?.(false);
    } catch (error) {
      console.error('Error disconnecting account:', error);
      setError('Failed to disconnect YouTube account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await checkConnectionStatus();
    } catch (error) {
      console.error('Error refreshing connection:', error);
      setError('Failed to refresh connection status');
    } finally {
      setIsLoading(false);
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
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">YouTube Account</h3>
            <p className="text-sm text-gray-500">Connect your YouTube channel</p>
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
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      {isConnected && channelInfo ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={channelInfo.thumbnails.default.url}
              alt={channelInfo.title}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{channelInfo.title}</h4>
              <p className="text-sm text-gray-500">{channelInfo.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">
                {formatNumber(channelInfo.statistics.subscriberCount)}
              </div>
              <div className="text-xs text-blue-500">Subscribers</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">
                {formatNumber(channelInfo.statistics.videoCount)}
              </div>
              <div className="text-xs text-green-500">Videos</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">
                {formatNumber(channelInfo.statistics.viewCount)}
              </div>
              <div className="text-xs text-purple-500">Views</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Disconnecting...' : 'Disconnect Account'}
            </button>
            <a
              href={`https://www.youtube.com/channel/${channelInfo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Channel
            </a>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Youtube className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Connect Your YouTube Channel
          </h4>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Connect your YouTube account to upload videos, manage your content, and track analytics directly from our platform.
          </p>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Youtube className="w-4 h-4 mr-2" />
                Connect YouTube Account
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default YouTubeConnect; 