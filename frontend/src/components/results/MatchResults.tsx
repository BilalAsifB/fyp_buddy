import React from 'react';
import { Clock, Users, Zap } from 'lucide-react';
import { MatchingResponse } from '../../services/types';
import MatchCard from './MatchCard';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

interface MatchResultsProps {
  results: MatchingResponse;
  onNewSearch: () => void;
}

const MatchResults: React.FC<MatchResultsProps> = ({ results, onNewSearch }) => {
  const getScoreVariant = (score: number) => {
    if (score >= 4.0) return 'success';
    if (score >= 3.0) return 'primary';
    if (score >= 2.0) return 'warning';
    return 'secondary';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.0) return 'Excellent Match';
    if (score >= 3.0) return 'Good Match';
    if (score >= 2.0) return 'Fair Match';
    return 'Basic Match';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Results Header */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-success-700">
                🎉 Found {results.total_matches} Study Buddies!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Here are students with similar interests and complementary skills for your project.
              </p>
            </div>
            <button
              onClick={onNewSearch}
              className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              New Search
            </button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Processed in {results.processing_time_ms}ms</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Query ID: {results.query_id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{results.matches.length} profiles matched</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Compatibility Scores:</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" size="sm">Excellent (4.0+)</Badge>
              <Badge variant="primary" size="sm">Good (3.0+)</Badge>
              <Badge variant="warning" size="sm">Fair (2.0+)</Badge>
              <Badge variant="secondary" size="sm">Basic (1.0+)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {results.matches.map((match, index) => (
          <div key={match.id} className="relative">
            {/* Rank Badge */}
            <div className="absolute -top-2 -left-2 z-10">
              <Badge 
                variant={index === 0 ? 'success' : index === 1 ? 'primary' : 'secondary'}
                className="text-xs font-bold"
              >
                #{index + 1}
              </Badge>
            </div>
            
            {/* Score Badge */}
            <div className="absolute -top-2 -right-2 z-10">
              <Badge 
                variant={getScoreVariant(match.score)}
                className="text-xs font-bold"
              >
                {match.score.toFixed(1)}/5.0
              </Badge>
            </div>
            
            <MatchCard match={match} />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <Card variant="outlined">
        <CardContent className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to Connect?
          </h3>
          <p className="text-gray-600 mb-4">
            Reach out to your potential study buddies and start collaborating on amazing projects!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNewSearch}
              className="px-6 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Find More Matches
            </button>
            <a
              href="mailto:"
              className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchResults;