import React, { useState } from 'react';

const TestOAuth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectOAuth = () => {
    setLoading(true);
    setError(null);
    
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=246610717965-1jb1lp72pi767l4v3s0am9kfo8rmgiac.apps.googleusercontent.com&redirect_uri=${encodeURIComponent('http://localhost:3003/auth/youtube/callback')}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube')}&access_type=offline&prompt=consent`;
    
    console.log('Direct OAuth URL:', authUrl);
    window.location.href = authUrl;
  };

  const testNetlifyFunction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/.netlify/functions/youtube-oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'initiate' })
      });
      
      const data = await response.json();
      console.log('Netlify function response:', data);
      
      if (data.success) {
        window.location.href = data.authUrl;
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Netlify function error:', error);
      setError('Failed to connect to Netlify function');
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    const tokens = localStorage.getItem('youtube_tokens');
    const oauthState = localStorage.getItem('youtube_oauth_state');
    
    console.log('LocalStorage tokens:', tokens);
    console.log('LocalStorage oauth_state:', oauthState);
    
    alert(`Tokens: ${tokens ? 'Found' : 'Not found'}\nOAuth State: ${oauthState ? 'Found' : 'Not found'}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">YouTube OAuth Test</h1>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Test Options</h2>
          <p className="text-blue-700 mb-4">
            Choose a method to test YouTube OAuth connection:
          </p>
          
          <div className="space-y-3">
            <button
              onClick={testNetlifyFunction}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Netlify Function'}
            </button>
            
            <button
              onClick={testDirectOAuth}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Redirecting...' : 'Test Direct OAuth'}
            </button>
            
            <button
              onClick={checkLocalStorage}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              Check LocalStorage
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Click "Test Netlify Function" to test the server-side OAuth</li>
            <li>If that fails, click "Test Direct OAuth" for a direct connection</li>
            <li>After authorization, you'll be redirected to the callback page</li>
            <li>Check the console for any error messages</li>
            <li>Use "Check LocalStorage" to see if tokens were saved</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestOAuth; 