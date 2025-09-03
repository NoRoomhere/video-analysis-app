import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Search, TrendingUp, Users, Play, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import { simpleYouTubeService } from '../../services/simpleYouTubeService';

const SimpleYouTube: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'trending' | 'channel'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelId, setChannelId] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (num: string): string => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  };

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await simpleYouTubeService.searchVideos(searchQuery, 20);
      setVideos(results);
    } catch (error) {
      setError('Failed to search videos');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrending = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await simpleYouTubeService.getTrendingVideos('US', 20);
      setVideos(results);
    } catch (error) {
      setError('Failed to fetch trending videos');
      console.error('Trending error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetChannelVideos = async () => {
    if (!channelId.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await simpleYouTubeService.getChannelVideos(channelId, 20);
      setVideos(results);
    } catch (error) {
      setError('Failed to fetch channel videos');
      console.error('Channel videos error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  useEffect(() => {
    if (activeTab === 'trending') {
      handleGetTrending();
    }
  }, [activeTab]);

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
            <h1 className="text-3xl font-bold text-gray-900">YouTube Analytics</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search videos, view trending content, and analyze YouTube data without OAuth.
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'search'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'trending'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => setActiveTab('channel')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'channel'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Channel</span>
          </button>
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
          {activeTab === 'search' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Videos</h3>
              <div className="flex space-x-3 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter search query..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Videos</h3>
              <p className="text-gray-600 mb-4">Showing trending videos in the US</p>
            </div>
          )}

          {activeTab === 'channel' && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Videos</h3>
              <div className="flex space-x-3 mb-6">
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="Enter channel ID (e.g., UC_x5XG1OV2P6uZZ5FSM9Ttw)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleGetChannelVideos()}
                />
                <button
                  onClick={handleGetChannelVideos}
                  disabled={loading}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Get Videos'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
        >
          <strong>Error:</strong> {error}
        </motion.div>
      )}

      {/* Videos Grid */}
      {videos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleVideoClick(video.id)}
            >
              <div className="relative">
                <img
                  src={video.thumbnails.medium.url}
                  alt={video.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <Play className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  {video.channelTitle}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
                {video.statistics && (
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(video.statistics.viewCount)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{formatNumber(video.statistics.likeCount)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{formatNumber(video.statistics.commentCount)}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default SimpleYouTube; 