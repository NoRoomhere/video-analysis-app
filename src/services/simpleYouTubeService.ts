import axios from 'axios';
import { YOUTUBE_API_KEY } from '../utils/constants';

// Simple YouTube API Service using API Key
export class SimpleYouTubeService {
  private static instance: SimpleYouTubeService;
  private apiKey: string = YOUTUBE_API_KEY;

  private constructor() {
    console.log('SimpleYouTubeService initialized with API Key:', this.apiKey ? 'Present' : 'Missing');
  }

  static getInstance(): SimpleYouTubeService {
    if (!SimpleYouTubeService.instance) {
      SimpleYouTubeService.instance = new SimpleYouTubeService();
    }
    return SimpleYouTubeService.instance;
  }

  // Get channel info by channel ID or username
  async getChannelInfo(channelId?: string, username?: string): Promise<any> {
    try {
      let url = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics';
      
      if (channelId) {
        url += `&id=${channelId}`;
      } else if (username) {
        url += `&forUsername=${username}`;
      } else {
        throw new Error('Either channelId or username must be provided');
      }
      
      url += `&key=${this.apiKey}`;

      const response = await axios.get(url);
      
      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        return {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnails: channel.snippet.thumbnails,
          statistics: channel.statistics,
          customUrl: channel.snippet.customUrl,
          publishedAt: channel.snippet.publishedAt
        };
      } else {
        throw new Error('Channel not found');
      }
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw new Error('Failed to fetch channel information');
    }
  }

  // Search for videos
  async searchVideos(query: string, maxResults: number = 10): Promise<any[]> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.apiKey}`;
      
      console.log('Searching videos with URL:', url);
      
      const response = await axios.get(url);
      
      console.log('Search response:', response.data);
      
      return response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: item.snippet.thumbnails,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt
      }));
    } catch (error: any) {
      console.error('Error searching videos:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 403) {
        throw new Error('API quota exceeded or API not enabled. Check Google Cloud Console.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid API request. Check API key and parameters.');
      } else {
        throw new Error(`Failed to search videos: ${error.message}`);
      }
    }
  }

  // Get video details
  async getVideoInfo(videoId: string): Promise<any> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${this.apiKey}`;
      
      const response = await axios.get(url);
      
      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnails: video.snippet.thumbnails,
          channelTitle: video.snippet.channelTitle,
          channelId: video.snippet.channelId,
          publishedAt: video.snippet.publishedAt,
          statistics: video.statistics,
          duration: video.contentDetails.duration,
          tags: video.snippet.tags || []
        };
      } else {
        throw new Error('Video not found');
      }
    } catch (error) {
      console.error('Error fetching video info:', error);
      throw new Error('Failed to fetch video information');
    }
  }

  // Get trending videos
  async getTrendingVideos(regionCode: string = 'US', maxResults: number = 20): Promise<any[]> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${this.apiKey}`;
      
      const response = await axios.get(url);
      
      return response.data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnails: video.snippet.thumbnails,
        channelTitle: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
        publishedAt: video.snippet.publishedAt,
        statistics: video.statistics
      }));
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      throw new Error('Failed to fetch trending videos');
    }
  }

  // Get channel videos
  async getChannelVideos(channelId: string, maxResults: number = 20): Promise<any[]> {
    try {
      // First get uploads playlist
      const playlistUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${this.apiKey}`;
      const playlistResponse = await axios.get(playlistUrl);
      
      if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
        throw new Error('Channel not found');
      }
      
      const uploadsPlaylistId = playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Get videos from uploads playlist
      const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${this.apiKey}`;
      const videosResponse = await axios.get(videosUrl);
      
      return videosResponse.data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: item.snippet.thumbnails,
        publishedAt: item.snippet.publishedAt
      }));
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw new Error('Failed to fetch channel videos');
    }
  }

  // Get video statistics
  async getVideoStatistics(videoId: string): Promise<any> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${this.apiKey}`;
      
      const response = await axios.get(url);
      
      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].statistics;
      } else {
        throw new Error('Video not found');
      }
    } catch (error) {
      console.error('Error fetching video statistics:', error);
      throw new Error('Failed to fetch video statistics');
    }
  }

  // Check if service is available
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  // Get API key status
  getApiKeyStatus(): { hasKey: boolean; keyPreview: string } {
    return {
      hasKey: !!this.apiKey,
      keyPreview: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'No API Key'
    };
  }
}

// Export singleton instance
export const simpleYouTubeService = SimpleYouTubeService.getInstance(); 