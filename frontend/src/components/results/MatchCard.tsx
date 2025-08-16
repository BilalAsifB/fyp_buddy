import React, { useState } from 'react';
import { Mail, User, GraduationCap, Star, Code, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { MatchResponse } from '../../services/types';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface MatchCardProps {
  match: MatchResponse;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-success-600';
    if (score >= 3.0) return 'text-primary-600';
    if (score >= 2.0) return 'text-warning-600';
    return 'text-gray-600';
  };

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-success-600';
    if (gpa >= 3.0) return 'text-primary-600';
    if (gpa >= 2.5) return 'text-warning-600';
    return 'text-gray-600';
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`FYP Collaboration: ${match.title || 'Project Collaboration'}`);
    const body = encodeURIComponent(
      `Hi!\n\nI found your profile through the FYP Student Matching System and I'm interested in collaborating on a project.\n\nMy project idea: ${match.idea.substring(0, 200)}...\n\nWould you be interested in discussing potential collaboration?\n\nBest regards`
    );
    window.open(`mailto:${match.metadata.email}?subject=${subject}&body=${body}`);
  };

  return (
    <Card variant="elevated" className="h-full hover:shadow-large transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {match.title || 'Untitled Project'}
            </CardTitle>
            <p className="text-sm text-primary-600 font-medium mb-2">
              {match.domain}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{match.metadata.department}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GraduationCap className="w-3 h-3" />
                <span>20{match.metadata.year}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className={`w-3 h-3 ${getGpaColor(match.metadata.gpa)}`} />
                <span className={getGpaColor(match.metadata.gpa)}>
                  {match.metadata.gpa.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getScoreColor(match.score)}`}>
              {match.score.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">compatibility</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Project Idea */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Project Idea</h4>
          <p className="text-sm text-gray-600 line-clamp-3">
            {expanded ? match.idea : `${match.idea.substring(0, 150)}${match.idea.length > 150 ? '...' : ''}`}
          </p>
          {match.idea.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary-600 hover:text-primary-700 mt-1 flex items-center space-x-1"
            >
              <span>{expanded ? 'Show less' : 'Show more'}</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-1">
            <Code className="w-4 h-4" />
            <span>Tech Stack</span>
          </h4>
          <div className="flex flex-wrap gap-1">
            {match.tech_stack.slice(0, 6).map((tech, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {tech}
              </Badge>
            ))}
            {match.tech_stack.length > 6 && (
              <Badge variant="secondary" size="sm">
                +{match.tech_stack.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        {/* Interests */}
        {match.interests && match.interests.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>Interests</span>
            </h4>
            <div className="flex flex-wrap gap-1">
              {match.interests.slice(0, 4).map((interest, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {interest}
                </Badge>
              ))}
              {match.interests.length > 4 && (
                <Badge variant="primary" size="sm">
                  +{match.interests.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {match.metadata.skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="outline" size="sm">
                {skill}
              </Badge>
            ))}
            {match.metadata.skills.length > 5 && (
              <Badge variant="outline" size="sm">
                +{match.metadata.skills.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleEmailClick}
          className="w-full"
          variant="primary"
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact for Collaboration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;