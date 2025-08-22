// src/components/MatchResults.tsx
import type { Match } from "../types";

interface MatchResultsProps {
  matches: Match[];
  error: string | null;
  loading: boolean;
}

export default function MatchResults({ matches, error, loading }: MatchResultsProps) {
  if (loading) {
    return (
      <div className="text-blue-500 text-center p-6 bg-blue-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Finding matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-semibold mb-2">Error</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-gray-500 text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p>No matches found. Try adjusting your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Found {matches.length} matches
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => (
          <div
            key={match.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                  {match.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {match.domain}
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    {Math.round(match.score * 20)}%
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {match.idea}
              </p>

              {/* Tech Stack */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Tech Stack:</p>
                <div className="flex flex-wrap gap-2">
                  {match.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {match.tech_stack.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                      +{match.tech_stack.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Interests:</p>
                <div className="flex flex-wrap gap-2">
                  {match.interests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-md font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                  {match.interests.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                      +{match.interests.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{match.metadata.department}</span>
                  <span>Year {match.metadata.year}</span>
                  <span>GPA: {match.metadata.gpa.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}