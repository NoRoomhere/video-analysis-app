import axios from 'axios';

// YouTube OAuth Configuration from environment variables
const YOUTUBE_CONFIG = {
  CLIENT_ID: process.env.YOUTUBE_CLIENT_ID || '246610717965-1jb1lp72pi767l4v3s0am9kfo8rmgiac.apps.googleusercontent.com',
  CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET || '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',
  AUTH_URL: 'https://accounts.google.com/o/oauth2/auth',
  TOKEN_URL: 'https://oauth2.googleapis.com/token',
  SCOPES: [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube'
  ]
};

// Utility functions
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateCodeVerifier() {
  return generateRandomString(128);
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

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
    const { action } = JSON.parse(event.body || '{}');

    if (action === 'initiate') {
      // Initiate OAuth flow
      const state = generateRandomString(32);
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store OAuth state (in production, use a database)
      const oauthState = {
        state,
        codeVerifier,
        redirectUri: event.headers.origin + '/auth/youtube/callback'
      };

      const params = new URLSearchParams({
        client_id: YOUTUBE_CONFIG.CLIENT_ID,
        redirect_uri: oauthState.redirectUri,
        response_type: 'code',
        scope: YOUTUBE_CONFIG.SCOPES.join(' '),
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        access_type: 'offline',
        prompt: 'consent'
      });

      const authUrl = `${YOUTUBE_CONFIG.AUTH_URL}?${params.toString()}`;

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          authUrl,
          state,
          codeVerifier
        })
      };
    }

    if (action === 'callback') {
      // Handle OAuth callback
      const { code, state, codeVerifier } = JSON.parse(event.body);

      const params = new URLSearchParams({
        client_id: YOUTUBE_CONFIG.CLIENT_ID,
        client_secret: YOUTUBE_CONFIG.CLIENT_SECRET,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: event.headers.origin + '/auth/youtube/callback'
      });

      const response = await axios.post(YOUTUBE_CONFIG.TOKEN_URL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const tokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type
      };

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          tokens
        })
      };
    }

    if (action === 'refresh') {
      // Handle token refresh
      const { refresh_token } = JSON.parse(event.body);

      const params = new URLSearchParams({
        client_id: YOUTUBE_CONFIG.CLIENT_ID,
        client_secret: YOUTUBE_CONFIG.CLIENT_SECRET,
        refresh_token: refresh_token,
        grant_type: 'refresh_token'
      });

      const response = await axios.post(YOUTUBE_CONFIG.TOKEN_URL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const tokens = {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type
      };

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          tokens
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
    console.error('YouTube OAuth Error:', error);
    
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