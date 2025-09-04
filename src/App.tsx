import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Video Analysis App
          </h1>
          <p className="text-lg text-gray-600">
            Analyze videos with AI and advanced analytics
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-700 mb-4">
              This is your video analysis application. Features include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>🎥 Video analysis and processing</li>
              <li>💳 Stripe payment processing</li>
              <li>🔐 Google OAuth authentication</li>
              <li>📊 Analytics dashboard</li>
              <li>🤖 AI-powered insights</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;