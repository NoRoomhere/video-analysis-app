// App Constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Marketing Tool Dashboard';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// YouTube API Constants
// API Key для YouTube Data API v3
// ПРОБЛЕМА: Текущий API Key имеет ограничения по домену
// РЕШЕНИЕ: Создайте новый API Key в Google Cloud Console:
// 1. Credentials → Create Credentials → API Key
// 2. НЕ нажимайте "Restrict Key" (оставьте без ограничений)
// 3. Замените ключ ниже на новый
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyD7EiCdafG4XQ7hBkNY13PsAQcbeEzkAmk';

export const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// YouTube OAuth Configuration
// Данные из Google Cloud Console
export const YOUTUBE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_YOUTUBE_CLIENT_ID || '246610717965-1jb1lp72pi767l4v3s0am9kfo8rmgiac.apps.googleusercontent.com',
  CLIENT_SECRET: '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', // ВНИМАНИЕ: В продакшене должен быть на бэкенде!
  AUTH_URL: 'https://accounts.google.com/o/oauth2/auth',
  TOKEN_URL: 'https://oauth2.googleapis.com/token',
  CHANNELS_URL: 'https://www.googleapis.com/youtube/v3/channels',
  UPLOAD_URL: 'https://www.googleapis.com/upload/youtube/v3/videos',
  REDIRECT_URI: import.meta.env.VITE_YOUTUBE_REDIRECT_URI || (import.meta.env.DEV 
    ? 'http://localhost:3003/auth/youtube/callback'
    : 'https://your-app-name.netlify.app/auth/youtube/callback') // Замените на ваш домен
};

// Navigation Constants
export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'Home' },
  { name: 'Video Analysis', path: '/video-analysis', icon: 'Video' },
  { name: 'Social Automation', path: '/social-automation', icon: 'Share' },
  { name: 'Competitor Analysis', path: '/competitor-analysis', icon: 'Target' },
  { name: 'Trends & News', path: '/trends', icon: 'TrendingUp' },
  { name: 'AI Chat', path: '/ai-chat', icon: 'MessageSquare' },
  { name: 'YouTube', path: '/youtube', icon: 'Youtube' },
];

// Feature Flags
export const FEATURES = {
  YOUTUBE_INTEGRATION: true,
  AI_CHAT: true,
  SOCIAL_AUTOMATION: true,
  COMPETITOR_ANALYSIS: true,
  TRENDS_NEWS: true,
  VIDEO_ANALYSIS: true,
};

// API Endpoints
export const API_ENDPOINTS = {
  YOUTUBE: {
    CHANNELS: '/channels',
    VIDEOS: '/videos',
    SEARCH: '/search',
    STATISTICS: '/videos',
    UPLOAD: '/videos',
  },
  FIREBASE: {
    AUTH: '/auth',
    USERS: '/users',
  },
};

// UI Constants
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Error Messages
export const ERROR_MESSAGES = {
  YOUTUBE_AUTH_FAILED: 'Failed to authenticate with YouTube',
  YOUTUBE_API_ERROR: 'YouTube API error occurred',
  NETWORK_ERROR: 'Network error occurred',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error occurred',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  YOUTUBE_CONNECTED: 'Successfully connected to YouTube',
  VIDEO_UPLOADED: 'Video uploaded successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};

// Affiliate Program Constants
export const AFFILIATE_TIERS = [
  {
    name: 'Bronze',
    minReferrals: 1,
    maxReferrals: 10,
    commission: 30,
    recurring: 10,
    bonus: null,
    premiumSupport: false
  },
  {
    name: 'Silver',
    minReferrals: 11,
    maxReferrals: 50,
    commission: 35,
    recurring: 10,
    bonus: 'Special bonuses',
    premiumSupport: false
  },
  {
    name: 'Gold',
    minReferrals: 51,
    maxReferrals: Infinity,
    commission: 40,
    recurring: 10,
    bonus: 'Premium support',
    premiumSupport: true
  }
];

export const AFFILIATE_PROGRAM_DESCRIPTION = `\
Join our Affiliate Program and earn up to 40% commission!\n\n
- 30% commission on the first payment\n- 10% recurring commission on monthly subscriptions\n\nTier system:\n- Bronze (1-10 referrals): 30%\n- Silver (11-50 referrals): 35% + bonuses\n- Gold (51+ referrals): 40% + premium support\n`; 