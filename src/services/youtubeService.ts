import axios from 'axios';
import { 
  YouTubeTokens, 
  YouTubeAccount, 
  VideoUploadData, 
  VideoUploadProgress, 
  UploadedVideo, 
  YouTubeAPIError,
  OAuthState,
  VIDEO_VALIDATION 
} from '../types/youtube';

// YouTube API Service Class
export class YouTubeService {
  private static instance: YouTubeService;
  private tokens: YouTubeTokens | null = null;
  private netlifyFunctionUrl = '/.netlify/functions/youtube-oauth';
  private uploadFunctionUrl = '/.netlify/functions/youtube-upload';

  private constructor() {
    // Don't load tokens immediately - wait for first use
    console.log('YouTubeService instance created');
  }

  private loadTokensFromStorage(): void {
    try {
      console.log('Loading tokens from storage...');
      const storedTokens = localStorage.getItem('youtube_tokens');
      console.log('Stored tokens raw:', storedTokens);
      
      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);
        console.log('Parsed tokens:', tokens);
        
        if (tokens.access_token && Date.now() < tokens.expires_at - 300000) {
          this.tokens = tokens;
          console.log('✅ Tokens loaded successfully');
        } else {
          console.log('❌ Tokens expired or invalid, clearing storage');
          localStorage.removeItem('youtube_tokens');
        }
      } else {
        console.log('No tokens found in storage');
      }
    } catch (error) {
      console.error('Error loading tokens from storage:', error);
      localStorage.removeItem('youtube_tokens');
    }
  }

  static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  // Load tokens when first needed
  private ensureTokensLoaded(): void {
    if (!this.tokens) {
      this.loadTokensFromStorage();
    }
  }

  // OAuth Flow Methods
  async initiateOAuth(): Promise<string> {
    try {
      console.log('Attempting to initiate OAuth via Netlify Function...');
      
      try {
        const response = await axios.post(this.netlifyFunctionUrl, {
          action: 'initiate'
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to initiate OAuth');
        }

        const { authUrl, state, codeVerifier } = response.data;

        // Store OAuth state in localStorage
        const oauthState: OAuthState = {
          state,
          codeVerifier,
          redirectUri: window.location.origin + '/auth/youtube/callback'
        };
        localStorage.setItem('youtube_oauth_state', JSON.stringify(oauthState));

        console.log('✅ OAuth initiated via Netlify Function');
        return authUrl;
      } catch (netlifyError) {
        console.log('Netlify Function failed, using direct OAuth...', netlifyError);
        
        // Fallback: direct OAuth URL generation
        const state = this.generateRandomString(32);
        const codeVerifier = this.generateRandomString(128);
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);
        
        // Store OAuth state in localStorage
        const oauthState: OAuthState = {
          state,
          codeVerifier,
          redirectUri: window.location.origin + '/auth/youtube/callback'
        };
        localStorage.setItem('youtube_oauth_state', JSON.stringify(oauthState));

        const params = new URLSearchParams({
          client_id: '246610717965-1jb1lp72pi767l4v3s0am9kfo8rmgiac.apps.googleusercontent.com',
          redirect_uri: oauthState.redirectUri,
          response_type: 'code',
          scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube',
          state,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
          access_type: 'offline',
          prompt: 'consent'
        });

        const authUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
        console.log('✅ OAuth initiated via direct URL');
        return authUrl;
      }
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      throw new Error('Failed to initiate YouTube OAuth');
    }
  }

  async handleOAuthCallback(code: string, state: string): Promise<YouTubeTokens> {
    try {
      const storedState = localStorage.getItem('youtube_oauth_state');
      if (!storedState) {
        throw new Error('OAuth state not found');
      }

      const oauthState: OAuthState = JSON.parse(storedState);
      if (oauthState.state !== state) {
        throw new Error('OAuth state mismatch');
      }

      console.log('Attempting to handle OAuth callback with Netlify Function...');

      try {
        // Try Netlify Function first
        const response = await axios.post(this.netlifyFunctionUrl, {
          action: 'callback',
          code,
          state,
          codeVerifier: oauthState.codeVerifier
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to complete OAuth');
        }

        const { tokens } = response.data;

        const youtubeTokens: YouTubeTokens = {
          user_id: 'current_user',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: Date.now() + (tokens.expires_in * 1000),
          created_at: Date.now()
        };

        // Store tokens securely
        this.tokens = youtubeTokens;
        console.log('Saving tokens to localStorage:', youtubeTokens);
        localStorage.setItem('youtube_tokens', JSON.stringify(youtubeTokens));
        localStorage.removeItem('youtube_oauth_state');
        console.log('✅ Tokens saved successfully');

        return youtubeTokens;
      } catch (netlifyError) {
        console.log('Netlify Function failed, trying direct OAuth...', netlifyError);
        
        // Fallback: direct OAuth token exchange
        const params = new URLSearchParams({
          client_id: '246610717965-1jb1lp72pi767l4v3s0am9kfo8rmgiac.apps.googleusercontent.com',
          client_secret: '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',
          code,
          grant_type: 'authorization_code',
          redirect_uri: window.location.origin + '/auth/youtube/callback'
        });

        const response = await axios.post('https://oauth2.googleapis.com/token', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const youtubeTokens: YouTubeTokens = {
          user_id: 'current_user',
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_at: Date.now() + (response.data.expires_in * 1000),
          created_at: Date.now()
        };

        // Store tokens securely
        this.tokens = youtubeTokens;
        console.log('Saving tokens to localStorage:', youtubeTokens);
        localStorage.setItem('youtube_tokens', JSON.stringify(youtubeTokens));
        localStorage.removeItem('youtube_oauth_state');
        console.log('✅ Tokens saved successfully');

        return youtubeTokens;
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw new Error('Failed to complete YouTube OAuth');
    }
  }

  // Token Management
  async refreshAccessToken(): Promise<string> {
    if (!this.tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(this.netlifyFunctionUrl, {
        action: 'refresh',
        refresh_token: this.tokens.refresh_token
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to refresh token');
      }

      const { tokens } = response.data;
      this.tokens.access_token = tokens.access_token;
      this.tokens.expires_at = Date.now() + (tokens.expires_in * 1000);
      
      localStorage.setItem('youtube_tokens', JSON.stringify(this.tokens));
      return this.tokens.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  private async refreshTokenIfNeeded(): Promise<string> {
    if (!this.tokens) {
      throw new Error('No tokens available');
    }

    if (Date.now() > this.tokens.expires_at - 300000) {
      await this.refreshAccessToken();
    }

    if (!this.tokens) {
      throw new Error('Failed to refresh tokens');
    }

    return this.tokens.access_token;
  }

  // YouTube API Methods
  async getChannelInfo(): Promise<YouTubeAccount> {
    const accessToken = await this.refreshTokenIfNeeded();

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      const channel = response.data.items[0];
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnails: channel.snippet.thumbnails,
        statistics: channel.statistics
      };
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw new Error('Failed to fetch channel information');
    }
  }

  async uploadVideo(
    file: File, 
    uploadData: VideoUploadData,
    onProgress?: (progress: VideoUploadProgress) => void
  ): Promise<UploadedVideo> {
    const accessToken = await this.refreshTokenIfNeeded();

    // Validate file
    if (file.size > VIDEO_VALIDATION.MAX_SIZE) {
      throw new Error('File size exceeds maximum allowed size');
    }

    if (!VIDEO_VALIDATION.ALLOWED_TYPES.includes(file.type as any)) {
      throw new Error('File type not supported');
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Add metadata
      const metadata = {
        snippet: {
          title: uploadData.title,
          description: uploadData.description,
          tags: uploadData.tags,
          categoryId: uploadData.categoryId || '22', // People & Blogs
          defaultLanguage: uploadData.language || 'en'
        },
        status: {
          privacyStatus: uploadData.privacyStatus,
          selfDeclaredMadeForKids: false
        }
      };

      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

      // Upload video
      const response = await axios.post('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/related'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100),
              status: 'uploading'
            });
          }
        }
      });

      const video = response.data;
      
      if (onProgress) {
        onProgress({
          loaded: 100,
          total: 100,
          percentage: 100,
          status: 'completed',
          videoId: video.id
        });
      }

      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnails: video.snippet.thumbnails,
        privacyStatus: video.status.privacyStatus,
        publishedAt: video.snippet.publishedAt,
        viewCount: '0',
        likeCount: '0',
        commentCount: '0',
        duration: 'PT0S',
        tags: video.snippet.tags || []
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      if (onProgress) {
        onProgress({
          loaded: 0,
          total: 100,
          percentage: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      throw new Error('Failed to upload video');
    }
  }

  async getUploadedVideos(maxResults: number = 50): Promise<UploadedVideo[]> {
    const accessToken = await this.refreshTokenIfNeeded();

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&myRating=like&maxResults=${maxResults}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      return response.data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnails: video.snippet.thumbnails,
        privacyStatus: video.status?.privacyStatus || 'private',
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics?.viewCount || '0',
        likeCount: video.statistics?.likeCount || '0',
        commentCount: video.statistics?.commentCount || '0',
        duration: video.contentDetails?.duration || 'PT0S',
        tags: video.snippet.tags || []
      }));
    } catch (error) {
      console.error('Error fetching uploaded videos:', error);
      throw new Error('Failed to fetch uploaded videos');
    }
  }

  async disconnectAccount(): Promise<void> {
    try {
      // Revoke tokens
      if (this.tokens?.access_token) {
        await axios.post('https://oauth2.googleapis.com/revoke', {
          token: this.tokens.access_token
        });
      }

      // Clear local storage
      localStorage.removeItem('youtube_tokens');
      localStorage.removeItem('youtube_oauth_state');
      
      this.tokens = null;
    } catch (error) {
      console.error('Error disconnecting account:', error);
      // Still clear local data even if revoke fails
      localStorage.removeItem('youtube_tokens');
      localStorage.removeItem('youtube_oauth_state');
      this.tokens = null;
    }
  }

  isConnected(): boolean {
    this.ensureTokensLoaded();
    
    try {
      const storedTokens = localStorage.getItem('youtube_tokens');
      if (!storedTokens) {
        return false;
      }

      const tokens = JSON.parse(storedTokens);
      if (!tokens.access_token) {
        return false;
      }

      // Check if token is expired
      if (Date.now() > tokens.expires_at - 300000) {
        return false;
      }

      this.tokens = tokens;
      return true;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return false;
    }
  }

  getConnectionStatus(): { connected: boolean; expiresAt?: number } {
    this.ensureTokensLoaded();
    
    try {
      const storedTokens = localStorage.getItem('youtube_tokens');
      if (!storedTokens) {
        return { connected: false };
      }

      const tokens = JSON.parse(storedTokens);
      if (!tokens.access_token) {
        return { connected: false };
      }

      // Check if token is expired
      if (Date.now() > tokens.expires_at - 300000) {
        return { connected: false };
      }

      this.tokens = tokens;
      return {
        connected: true,
        expiresAt: tokens.expires_at
      };
    } catch (error) {
      console.error('Error getting connection status:', error);
      return { connected: false };
    }
  }

  // Utility methods for OAuth
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  // Get channel info via Netlify Function (more secure)
  async getChannelInfoViaFunction(): Promise<YouTubeAccount> {
    try {
      const accessToken = await this.refreshTokenIfNeeded();
      
      const response = await axios.post(this.uploadFunctionUrl, {
        action: 'getChannelInfo',
        accessToken
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get channel info');
      }

      const channelData = response.data.channelInfo;
      
      return {
        id: channelData.id,
        title: channelData.snippet.title,
        description: channelData.snippet.description,
        thumbnails: channelData.snippet.thumbnails,
        statistics: channelData.statistics
      };
    } catch (error) {
      console.error('Error getting channel info via function:', error);
      throw new Error('Failed to get channel information');
    }
  }
}

// Export singleton instance
export const youtubeService = YouTubeService.getInstance(); 