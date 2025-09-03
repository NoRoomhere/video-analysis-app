import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw, Youtube } from 'lucide-react';
import { youtubeService } from '../../services';

const YouTubeCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      console.log('OAuth Callback - Code:', code);
      console.log('OAuth Callback - State:', state);
      console.log('OAuth Callback - Error:', errorParam);

      if (errorParam) {
        throw new Error(`OAuth error: ${errorParam}`);
      }

      if (!code || !state) {
        throw new Error('Missing authorization code or state parameter');
      }

      console.log('Processing OAuth callback...');
      
      // Handle the OAuth callback
      const tokens = await youtubeService.handleOAuthCallback(code, state);
      console.log('OAuth callback successful, tokens received:', tokens);
      
      // Verify tokens are saved
      const storedTokens = localStorage.getItem('youtube_tokens');
      console.log('Tokens saved to localStorage:', storedTokens);
      
      setStatus('success');
      
      // Redirect back to the main page after a short delay
      setTimeout(() => {
        navigate('/youtube', { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      setError(error instanceof Error ? error.message : 'Authorization failed');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    setStatus('loading');
    setError(null);
    handleCallback();
  };

  const handleGoBack = () => {
    navigate('/youtube', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-6"
          >
            {status === 'loading' && (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {status === 'loading' && 'Connecting to YouTube...'}
            {status === 'success' && 'Successfully Connected!'}
            {status === 'error' && 'Connection Failed'}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            {status === 'loading' && 'Please wait while we complete the authorization process.'}
            {status === 'success' && 'Your YouTube account has been successfully connected. You can now upload videos and manage your content.'}
            {status === 'error' && error}
          </motion.p>

          {/* Progress Bar for Loading */}
          {status === 'loading' && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="w-full bg-gray-200 rounded-full h-2 mb-6"
            >
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" />
            </motion.div>
          )}

          {/* Success Message */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Youtube className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <h4 className="font-medium text-green-900">YouTube Connected</h4>
                  <p className="text-sm text-green-700">
                    Redirecting you to YouTube integration...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <h4 className="font-medium text-red-900">Connection Failed</h4>
                  <p className="text-sm text-red-700">
                    {error || 'An unexpected error occurred during the authorization process.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-3"
          >
            {status === 'loading' && (
              <div className="text-sm text-gray-500">
                This may take a few moments...
              </div>
            )}

            {status === 'success' && (
              <button
                onClick={handleGoBack}
                className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Continue to YouTube Integration
              </button>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleGoBack}
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Back to YouTube Integration
                </button>
              </div>
            )}
          </motion.div>

          {/* Additional Info */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <h4 className="font-medium text-gray-900 mb-2">Troubleshooting Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Make sure you're using the same browser</li>
                <li>• Check your internet connection</li>
                <li>• Try refreshing the page</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default YouTubeCallback; 