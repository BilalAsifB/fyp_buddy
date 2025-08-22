// src/App.tsx
import { useState } from "react";
import UserForm from "./components/UserForm";
import MatchResults from "./components/MatchResults";
import ConnectionStatus from "./components/ConnectionStatus";
import { findMatches } from "./services/apiService";
import type { Match, UserData } from "./types";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFindMatches = async (userData: UserData) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const matchResults = await findMatches(userData);
      setMatches(matchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to find matches";
      setError(errorMessage);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setMatches([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ConnectionStatus />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            FYP BUDDY
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect Final Year Project partners based on your interests and skills
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Search Form */}
          {!hasSearched && (
            <UserForm onSubmit={handleFindMatches} loading={loading} />
          )}

          {/* Results Section */}
          {hasSearched && (
            <div className="space-y-6">
              {/* Reset Button */}
              <div className="flex justify-center">
                <button
                  onClick={resetSearch}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  New Search
                </button>
              </div>

              {/* Results */}
              <MatchResults 
                matches={matches} 
                error={error} 
                loading={loading} 
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 FYP Buddy - Connecting students for amazing projects</p>
        </footer>
      </div>
    </div>
  );
}