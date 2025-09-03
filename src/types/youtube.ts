// YouTube API Types and Interfaces

export interface YouTubeTokens {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  created_at: number;
}

export interface YouTubeAccount {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

export interface VideoUploadData {
  title: string;
  description: string;
  tags: string[];
  privacyStatus: 'public' | 'unlisted' | 'private';
  categoryId?: string;
  language?: string;
  location?: {
    latitude: number;
    longitude: number;
    description: string;
  };
}

export interface VideoUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  videoId?: string;
  error?: string;
}

export interface UploadedVideo {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  privacyStatus: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
  tags: string[];
}

export interface YouTubeAPIError {
  code: number;
  message: string;
  errors?: Array<{
    domain: string;
    reason: string;
    message: string;
  }>;
}

export interface OAuthState {
  state: string;
  codeVerifier: string;
  redirectUri: string;
}

// Video file validation
export const VIDEO_VALIDATION = {
  MAX_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
  ALLOWED_TYPES: [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv'
  ],
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_TAGS_COUNT: 500,
  MAX_TAG_LENGTH: 30
} as const; 