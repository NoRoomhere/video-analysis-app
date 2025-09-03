import React, { useState, useEffect } from 'react';
import { youtubeService } from '../services';

const DebugYouTube: React.FC = () => {
  const [tokens, setTokens] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkTokens = () => {
    try {
      const storedTokens = localStorage.getItem('youtube_tokens');
      console.log('Stored tokens:', storedTokens);
      
      if (storedTokens) {
        const parsedTokens = JSON.parse(storedTokens);
        setTokens(parsedTokens);
        
        // Check if tokens are valid
        const now = Date.now();
        const expiresAt = parsedTokens.expires_at;
        const isValid = now < expiresAt - 300000;
        
        setStatus({
          hasTokens: true,
          isValid,
          expiresAt: new Date(expiresAt).toLocaleString(),
          timeLeft: Math.floor((expiresAt - now) / 1000 / 60) + ' minutes'
        });
      } else {
        setTokens(null);
        setStatus({ hasTokens: false });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testConnection = async () => {
    try {
      const isConnected = youtubeService.isConnected();
      console.log('Is connected:', isConnected);
      
      if (isConnected) {
        const channelInfo = await youtubeService.getChannelInfo();
        console.log('Channel info:', channelInfo);
        setStatus((prev: any) => ({ ...prev, channelInfo }));
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('youtube_tokens');
    localStorage.removeItem('youtube_oauth_state');
    setTokens(null);
    setStatus(null);
    setError(null);
  };

  useEffect(() => {
    checkTokens();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">YouTube Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Actions</h2>
          <div className="space-x-3">
            <button
              onClick={checkTokens}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Check Tokens
            </button>
            <button
              onClick={testConnection}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Test Connection
            </button>
            <button
              onClick={clearTokens}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Clear Tokens
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {status && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Status</h2>
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        )}

        {tokens && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">Tokens (Partial)</h2>
            <pre className="text-sm text-yellow-700 overflow-auto">
              {JSON.stringify({
                access_token: tokens.access_token ? '***' + tokens.access_token.slice(-10) : 'null',
                refresh_token: tokens.refresh_token ? '***' + tokens.refresh_token.slice(-10) : 'null',
                expires_at: tokens.expires_at,
                created_at: tokens.created_at
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugYouTube; 