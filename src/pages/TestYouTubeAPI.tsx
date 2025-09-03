import React, { useState } from 'react';
import { simpleYouTubeService } from '../services/simpleYouTubeService';
import { YOUTUBE_API_KEY } from '../utils/constants';

const TestYouTubeAPI: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState<any>(null);

  const testApiKey = () => {
    setApiStatus(simpleYouTubeService.getApiKeyStatus());
  };

  const searchVideos = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      const videos = await simpleYouTubeService.searchVideos(searchQuery, 5);
      setResults(videos);
      console.log('Search results:', videos);
    } catch (err: any) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testTrendingVideos = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      const videos = await simpleYouTubeService.getTrendingVideos('US', 5);
      setResults(videos);
      console.log('Trending results:', videos);
    } catch (err: any) {
      setError(err.message);
      console.error('Trending error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">YouTube API Test</h1>
      
      {/* API Key Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">API Key Status</h2>
        <button 
          onClick={testApiKey}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check API Key
        </button>
        {apiStatus && (
          <div className="mt-2">
            <p>Has Key: {apiStatus.hasKey ? '✅ Yes' : '❌ No'}</p>
            <p>Key Preview: {apiStatus.keyPreview}</p>
            <p>Full Key: {YOUTUBE_API_KEY}</p>
          </div>
        )}
      </div>

      {/* Search Videos */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Search Videos</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={searchVideos}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Test Trending */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Test Trending Videos</h2>
        <button
          onClick={testTrendingVideos}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Trending Videos'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Results ({results.length})</h2>
          <div className="space-y-4">
            {results.map((video, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-gray-600 text-sm">{video.channelTitle}</p>
                <p className="text-gray-500 text-xs">{video.publishedAt}</p>
                {video.statistics && (
                  <div className="text-xs text-gray-400 mt-1">
                    Views: {video.statistics.viewCount} | 
                    Likes: {video.statistics.likeCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestYouTubeAPI; 