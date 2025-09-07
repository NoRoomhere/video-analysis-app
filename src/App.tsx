import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Pages
import { Home, Pricing, Success, Cancel } from './pages';
import VideoAnalysis from './pages/VideoAnalysis';

// Components
import Dashboard from './components/features/Dashboard';
import { Auth, ProtectedRoute } from './components/auth';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/video-analysis" element={<ProtectedRoute><VideoAnalysis /></ProtectedRoute>} />
          
          {/* Catch all route */}
          <Route path="*" element={<Home />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;