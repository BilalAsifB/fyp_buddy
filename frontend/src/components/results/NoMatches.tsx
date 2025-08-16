import React from 'react';
import { SearchX, Lightbulb, RefreshCw, Users } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface NoMatchesProps {
  onTryAgain: () => void;
  totalProfilesSearched?: number;
}

const NoMatches: React.FC<NoMatchesProps> = ({ onTryAgain, totalProfilesSearched = 0 }) => {
  const suggestions = [
    {
      icon: <Lightbulb className="w-5 h-5 text-warning-600" />,
      title: "Broaden Your Interests",
      description: "Add more diverse interests or consider interdisciplinary approaches"
    },
    {
      icon: <Users className="w-5 h-5 text-primary-600" />,
      title: "Expand Tech Stack",
      description: "Include more technologies or consider alternative frameworks"
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-success-600" />,
      title: "Try Again Later",
      description: "New student profiles are added regularly to our system"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main No Matches Card */}
      <Card variant="elevated" className="text-center">
        <CardContent className="py-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Matches Found
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any students with compatible profiles for your project at this time. 
            {totalProfilesSearched > 0 && ` We searched through ${totalProfilesSearched} student profiles.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onTryAgain} variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try New Search
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Modify Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <div className="grid gap-4 md:grid-cols-3">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">
                {suggestion.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {suggestion.title}
              </h3>
              <p className="text-sm text-gray-600">
                {suggestion.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Alert */}
      <Alert variant="info" title="Need Help?">
        If you continue to have trouble finding matches, consider:
        <ul className="mt-2 list-disc list-inside text-sm space-y-1">
          <li>Using more general or common technologies in your tech stack</li>
          <li>Writing a more detailed project description</li>
          <li>Including broader interests that appeal to more students</li>
          <li>Checking back later as new student profiles are added daily</li>
        </ul>
      </Alert>

      {/* Statistics */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Profiles Searched</span>
            <span className="font-medium">{totalProfilesSearched}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoMatches;