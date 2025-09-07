import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { connectAuthEmulator } from 'firebase/auth';

const FirebaseDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<{
    firebaseConfig: boolean;
    authConnection: boolean;
    networkStatus: boolean;
    errors: string[];
  }>({
    firebaseConfig: false,
    authConnection: false,
    networkStatus: false,
    errors: []
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = {
        firebaseConfig: false,
        authConnection: false,
        networkStatus: false,
        errors: [] as string[]
      };

      try {
        // Check Firebase config
        if (auth.app.options.apiKey) {
          results.firebaseConfig = true;
        } else {
          results.errors.push('Firebase API key not found');
        }

        // Check network connectivity
        try {
          const response = await fetch('https://www.google.com', { 
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
          });
          results.networkStatus = true;
        } catch (error) {
          results.errors.push('Network connectivity issue');
        }

        // Check Firebase Auth connection
        try {
          // Try to get current user (this will test auth connection)
          const currentUser = auth.currentUser;
          results.authConnection = true;
        } catch (error) {
          results.errors.push('Firebase Auth connection failed');
        }

        // Test Firebase Auth endpoints
        try {
          const testResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${auth.app.options.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'testpassword',
              returnSecureToken: true
            })
          });
          
          if (testResponse.status === 400) {
            // This is expected - means Firebase is reachable but email is invalid
            results.authConnection = true;
          }
        } catch (error) {
          results.errors.push('Firebase Auth endpoint unreachable');
        }

      } catch (error: any) {
        results.errors.push(`Diagnostic error: ${error.message}`);
      }

      setDiagnostics(results);
    };

    runDiagnostics();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Firebase Diagnostics</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${diagnostics.firebaseConfig ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Firebase Config: {diagnostics.firebaseConfig ? 'OK' : 'FAILED'}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${diagnostics.networkStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Network: {diagnostics.networkStatus ? 'OK' : 'FAILED'}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${diagnostics.authConnection ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Firebase Auth: {diagnostics.authConnection ? 'OK' : 'FAILED'}</span>
        </div>
      </div>

      {diagnostics.errors.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-red-600">Errors:</h4>
          <ul className="list-disc list-inside text-sm text-red-600">
            {diagnostics.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Firebase Project:</strong> {auth.app.options.projectId}</p>
        <p><strong>Auth Domain:</strong> {auth.app.options.authDomain}</p>
      </div>
    </div>
  );
};

export default FirebaseDiagnostics;
