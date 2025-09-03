import { useState, useEffect, useCallback } from 'react';
import { youtubeService } from '../services';
import { 
  UploadedVideo, 
  YouTubeAccount, 
  VideoUploadData, 
  VideoUploadProgress 
} from '../types/youtube';

export const useYouTube = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channelInfo, setChannelInfo] = useState<YouTubeAccount | null>(null);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = useCallback(async () => {
    try {
      const status = youtubeService.getConnectionStatus();
      setIsConnected(status.connected);
      
      if (status.connected) {
        await loadChannelInfo();
        await loadUploadedVideos();
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      setIsConnected(false);
      setError('Failed to check connection status');
    }
  }, []);

  const loadChannelInfo = useCallback(async () => {
    try {
      const info = await youtubeService.getChannelInfo();
      setChannelInfo(info);
    } catch (error) {
      console.error('Error loading channel info:', error);
      setError('Failed to load channel information');
    }
  }, []);

  const loadUploadedVideos = useCallback(async (maxResults: number = 50) => {
    try {
      const videos = await youtubeService.getUploadedVideos(maxResults);
      setUploadedVideos(videos);
    } catch (error) {
      console.error('Error loading uploaded videos:', error);
      setError('Failed to load uploaded videos');
    }
  }, []);

  const initiateOAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authUrl = await youtubeService.initiateOAuth();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      setError('Failed to start YouTube authorization');
      setIsLoading(false);
    }
  }, []);

  const handleOAuthCallback = useCallback(async (code: string, state: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await youtubeService.handleOAuthCallback(code, state);
      await checkConnectionStatus();
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      setError('Failed to complete YouTube authorization');
    } finally {
      setIsLoading(false);
    }
  }, [checkConnectionStatus]);

  const disconnectAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await youtubeService.disconnectAccount();
      setIsConnected(false);
      setChannelInfo(null);
      setUploadedVideos([]);
    } catch (error) {
      console.error('Error disconnecting account:', error);
      setError('Failed to disconnect YouTube account');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadVideo = useCallback(async (
    file: File,
    uploadData: VideoUploadData,
    onProgress?: (progress: VideoUploadProgress) => void
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const uploadedVideo = await youtubeService.uploadVideo(file, uploadData, onProgress);
      
      // Add to uploaded videos list
      setUploadedVideos(prev => [uploadedVideo, ...prev]);
      
      return uploadedVideo;
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshConnection = useCallback(async () => {
    await checkConnectionStatus();
  }, [checkConnectionStatus]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isConnected,
    isLoading,
    channelInfo,
    uploadedVideos,
    error,
    
    // Actions
    initiateOAuth,
    handleOAuthCallback,
    disconnectAccount,
    uploadVideo,
    refreshConnection,
    clearError,
    
    // Utilities
    checkConnectionStatus,
    loadChannelInfo,
    loadUploadedVideos
  };
}; 