import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ProfileRequest, MatchingResponse } from './services/types';
import { apiService } from './services/api';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProfileForm from './components/forms/ProfileForm';
import MatchResults from './components/results/MatchResults';
import NoMatches from './components/results/NoMatches';
import NoData from './components/results/NoData';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Alert from './components/ui/Alert';

type AppState = 'form' | 'loading' | 'results' | 'no-matches' | 'no-data' | 'error';

interface AppError {
  message: string;
  canRetry: boolean;
}

function App() {
  const [appState, setAppState] = useState<AppState>('form');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchingResponse | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<ProfileRequest | null>(null);

  const handleFormSubmit = async (data: ProfileRequest) => {
    setLoading(true);
    setAppState('loading');
    setError(null);
    setLastSubmittedData(data);

    try {
      const response = await apiService.findMatches(data);
      setResults(response);

      if (!response.success) {
        // Check if it's a no-data situation
        if (response.message.toLowerCase().includes('no student profiles found')) {
          setAppState('no-data');
        } else {
          setAppState('no-matches');
        }
      } else if (response.total_matches === 0) {
        setAppState('no-matches');
      } else {
        setAppState('results');
      }
    } catch (err: any) {
      console.error('Error finding matches:', err);
      setError({
        message: err.message || 'An unexpected error occurred',
        canRetry: err.status !== 422 // Don't allow retry for validation errors
      });
      setAppState('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastSubmittedData) {
      handleFormSubmit(lastSubmittedData);
    }
  };

  const handleNewSearch = () => {
    setAppState('form');
    setResults(null);
    setError(null);
    setLastSubmittedData(null);
  };

  const renderContent = () => {
    switch (appState) {
      case 'form':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Find Your Perfect Study Buddy
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Let our AI-powered system match you with compatible students for your 
                  Final Year Project based on interests, skills, and project requirements.
                </p>
              </div>

              {/* Form */}
              <ProfileForm onSubmit={handleFormSubmit} loading={loading} />
            </div>
          </div>
        );

      case 'loading':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="xl" text="Finding your perfect study buddies..." />
              <p className="mt-4 text-sm text-gray-600 max-w-md mx-auto">
                Our AI is analyzing thousands of student profiles to find the best matches for your project. 
                This may take up to 60 seconds.
              </p>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              {results && (
                <MatchResults 
                  results={results} 
                  onNewSearch={handleNewSearch}
                />
              )}
            </div>
          </div>
        );

      case 'no-matches':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <NoMatches 
                onTryAgain={handleNewSearch}
                totalProfilesSearched={results?.total_matches}
              />
            </div>
          </div>
        );

      case 'no-data':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <NoData onTryAgain={handleRetry} />
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                  Something Went Wrong
                </h1>
                
                <Alert variant="danger" title="Error">
                  {error?.message}
                </Alert>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  {error?.canRetry && (
                    <button
                      onClick={handleRetry}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Try Again
                    </button>
                  )}
                  <button
                    onClick={handleNewSearch}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;