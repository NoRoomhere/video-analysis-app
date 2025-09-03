import axios from 'axios';
import { google } from 'googleapis';

// YouTube OAuth Configuration from environment variables
const YOUTUBE_CONFIG = {
  CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
  CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
  REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI
};

// Netlify Function Handler
export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { action, accessToken, videoData } = JSON.parse(event.body || '{}');

    if (action === 'upload') {
      // Create YouTube client with access token
      const oauth2Client = new google.auth.OAuth2(
        YOUTUBE_CONFIG.CLIENT_ID,
        YOUTUBE_CONFIG.CLIENT_SECRET,
        YOUTUBE_CONFIG.REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: accessToken
      });

      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

      // Upload video
      const response = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: videoData.title,
            description: videoData.description,
            tags: videoData.tags || [],
            categoryId: '22' // People & Blogs
          },
          status: {
            privacyStatus: videoData.privacyStatus || 'private'
          }
        },
        media: {
          body: videoData.fileStream
        }
      });

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          videoId: response.data.id,
          video: response.data
        })
      };
    }

    if (action === 'getChannelInfo') {
      const oauth2Client = new google.auth.OAuth2(
        YOUTUBE_CONFIG.CLIENT_ID,
        YOUTUBE_CONFIG.CLIENT_SECRET,
        YOUTUBE_CONFIG.REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: accessToken
      });

      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

      const response = await youtube.channels.list({
        part: ['snippet', 'statistics'],
        mine: true
      });

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          channelInfo: response.data.items[0]
        })
      };
    }

    return {
      statusCode: 400,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Invalid action'
      })
    };

  } catch (error) {
    console.error('YouTube Upload Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}; 