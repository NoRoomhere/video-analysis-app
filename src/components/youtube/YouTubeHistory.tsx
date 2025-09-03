import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  ExternalLink,
  RefreshCw,
  Calendar,
  X
} from 'lucide-react';
import { youtubeService } from '../../services';
import { UploadedVideo } from '../../types/youtube';

interface YouTubeHistoryProps {
  onVideoSelect?: (video: UploadedVideo) => void;
}

const YouTubeHistory: React.FC<YouTubeHistoryProps> = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<UploadedVideo | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const uploadedVideos = await youtubeService.getUploadedVideos();
      setVideos(uploadedVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
      setError('Failed to load uploaded videos');
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

  const formatDuration = (duration: string): string => {
    // Parse ISO 8601 duration format (PT4M13S -> 4:13)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPrivacyIcon = (status: string) => {
    switch (status) {
      case 'public': return <Eye className="w-4 h-4 text-green-500" />;
      case 'unlisted': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'private': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPrivacyLabel = (status: string): string => {
    switch (status) {
      case 'public': return 'Public';
      case 'unlisted': return 'Unlisted';
      case 'private': return 'Private';
      default: return 'Unknown';
    }
  };

  const handleVideoClick = (video: UploadedVideo) => {
    setSelectedVideo(video);
    onVideoSelect?.(video);
  };

  const handleRefresh = () => {
    loadVideos();
  };

  if (isLoading && videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
            <span className="text-gray-600">Loading videos...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upload History</h3>
              <p className="text-sm text-gray-500">
                {videos.length} video{videos.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
          </div>
          
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
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Video List */}
      <div className="max-h-96 overflow-y-auto">
        {videos.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No videos uploaded yet
            </h4>
            <p className="text-gray-500">
              Upload your first video to see it here
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedVideo?.id === video.id ? 'bg-red-50 border-red-200' : ''
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <div className="flex space-x-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={video.thumbnails.medium.url}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {getPrivacyIcon(video.privacyStatus)}
                        <span className="text-xs text-gray-500">
                          {getPrivacyLabel(video.privacyStatus)}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(video.viewCount)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{formatNumber(video.likeCount)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <MessageCircle className="w-3 h-3" />
                        <span>{formatNumber(video.commentCount)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(video.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {video.tags.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{video.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Selected Video Details */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-6 bg-gray-50 border-t border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Video Details</h4>
            <button
              onClick={() => setSelectedVideo(null)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Views:</span>
              <span className="ml-2 font-medium">{formatNumber(selectedVideo.viewCount)}</span>
            </div>
            <div>
              <span className="text-gray-500">Likes:</span>
              <span className="ml-2 font-medium">{formatNumber(selectedVideo.likeCount)}</span>
            </div>
            <div>
              <span className="text-gray-500">Comments:</span>
              <span className="ml-2 font-medium">{formatNumber(selectedVideo.commentCount)}</span>
            </div>
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-2 font-medium">{formatDuration(selectedVideo.duration)}</span>
            </div>
            <div>
              <span className="text-gray-500">Published:</span>
              <span className="ml-2 font-medium">{formatDate(selectedVideo.publishedAt)}</span>
            </div>
            <div>
              <span className="text-gray-500">Privacy:</span>
              <span className="ml-2 font-medium">{getPrivacyLabel(selectedVideo.privacyStatus)}</span>
            </div>
          </div>

          <div className="mt-4">
            <a
              href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on YouTube</span>
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default YouTubeHistory; 