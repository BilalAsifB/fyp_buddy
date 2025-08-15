import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  StarIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  ClipboardDocumentIcon,
  ShareIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

import { 
  Container, 
  Section, 
  PageHeader, 
  Grid, 
  AnimatedPage 
} from '@/components/layout'
import { 
  Button, 
  Card, 
  Badge, 
  Alert, 
  ProgressBar,
  EmptyState,
  Input
} from '@/components/ui'

import { 
  formatScore, 
  getScorePercentage, 
  getInitials, 
  getAvatarColor, 
  formatEmail, 
  truncate,
  capitalizeWords,
  cn
} from '@/utils'
import { getScoreInfo } from '@/constants'
import toast from 'react-hot-toast'

const ResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { results, formData } = location.state || {}
  
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [minScore, setMinScore] = useState(0)
  const [sortBy, setSortBy] = useState('score')

  // Redirect if no results
  useEffect(() => {
    if (!results) {
      navigate('/', { replace: true })
      return
    }
    
    if (results.success) {
      setFilteredMatches(results.matches || [])
    }
  }, [results, navigate])

  // Filter and sort matches
  useEffect(() => {
    if (!results?.matches) return

    let filtered = [...results.matches]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(match => 
        match.title.toLowerCase().includes(term) ||
        match.domain.toLowerCase().includes(term) ||
        match.idea.toLowerCase().includes(term) ||
        match.metadata.email.toLowerCase().includes(term) ||
        match.tech_stack.some(tech => tech.toLowerCase().includes(term)) ||
        match.interests.some(interest => interest.toLowerCase().includes(term))
      )
    }

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(match => match.metadata.department === selectedDepartment)
    }

    // Apply score filter
    filtered = filtered.filter(match => match.score >= minScore)

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score
        case 'gpa':
          return b.metadata.gpa - a.metadata.gpa
        case 'department':
          return a.metadata.department.localeCompare(b.metadata.department)
        default:
          return 0
      }
    })

    setFilteredMatches(filtered)
  }, [results?.matches, searchTerm, selectedDepartment, minScore, sortBy])

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email)
    toast.success('Email copied to clipboard!')
  }

  const handleShareResults = () => {
    const shareText = `Found ${results.total_matches} potential FYP teammates! Check out the FYP Student Matcher.`
    
    if (navigator.share) {
      navigator.share({
        title: 'FYP Team Matches',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
      toast.success('Share link copied to clipboard!')
    }
  }

  const handleNewSearch = () => {
    navigate('/matching')
  }

  if (!results) {
    return null // Will redirect
  }

  // Get unique departments for filter
  const departments = ['all', ...new Set(results.matches?.map(match => match.metadata.department) || [])]

  const MatchCard = ({ match, index }) => {
    const scoreInfo = getScoreInfo(match.score)
    const avatarColor = getAvatarColor(match.metadata.email)
    const initials = getInitials(match.metadata.email)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="hover:shadow-lg transition-all duration-200">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm',
              avatarColor
            )}>
              {initials}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {match.title || 'Untitled Project'}
                  </h3>
                  <p className="text-sm text-slate-600">{match.domain}</p>
                </div>
                
                {/* Score Badge */}
                <Badge 
                  variant={scoreInfo.color}
                  className="ml-2 flex-shrink-0"
                >
                  <StarIcon className="h-3 w-3 mr-1" />
                  {formatScore(match.score)}
                </Badge>
              </div>

              {/* Progress Bar for Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700">
                    Compatibility: {scoreInfo.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    {getScorePercentage(match.score)}%
                  </span>
                </div>
                <ProgressBar
                  value={match.score}
                  max={5}
                  color={scoreInfo.color}
                />
              </div>

              {/* Project Description */}
              <p className="text-sm text-slate-600 mb-4">
                {truncate(match.idea, 150)}
              </p>

              {/* Tech Stack */}
              {match.tech_stack && match.tech_stack.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-slate-700 mb-2">Technologies:</h4>
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
              )}

              {/* Interests */}
              {match.interests && match.interests.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-slate-700 mb-2">Interests:</h4>
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

              {/* Student Info */}
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <AcademicCapIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      {match.metadata.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChartBarIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      GPA: {match.metadata.gpa}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                {match.metadata.skills && match.metadata.skills.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-xs font-medium text-slate-700 mb-1">Skills:</h5>
                    <div className="flex flex-wrap gap-1">
                      {match.metadata.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {skill}
                        </Badge>
                      ))}
                      {match.metadata.skills.length > 4 && (
                        <Badge variant="secondary" size="sm">
                          +{match.metadata.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span className="truncate">
                      {formatEmail(match.metadata.email)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyEmail(match.metadata.email)}
                    className="ml-2"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <AnimatedPage>
      <Section>
        <Container>
          <PageHeader
            title={
              results.success 
                ? `Found ${results.total_matches} Potential Teammates` 
                : 'No Matches Found'
            }
            description={
              results.success 
                ? `Processed in ${results.processing_time_ms}ms • Query ID: ${results.query_id}`
                : results.message
            }
            action={
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleShareResults}>
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleNewSearch}>
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  New Search
                </Button>
              </div>
            }
          />

          {results.success ? (
            <>
              {/* Filters */}
              <Card className="mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-64">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Search matches
                    </label>
                    <div className="relative">
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title, domain, tech, or email..."
                        className="pl-10"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="min-w-48">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>
                          {dept === 'all' ? 'All Departments' : dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-32">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Min Score
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={minScore}
                      onChange={(e) => setMinScore(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-slate-500 text-center">
                      {formatScore(minScore)}+
                    </div>
                  </div>

                  <div className="min-w-32">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="score">Score</option>
                      <option value="gpa">GPA</option>
                      <option value="department">Department</option>
                    </select>
                  </div>
                </div>

                {(searchTerm || selectedDepartment !== 'all' || minScore > 0) && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        Showing {filteredMatches.length} of {results.total_matches} matches
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedDepartment('all')
                          setMinScore(0)
                          setSortBy('score')
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Results */}
              {filteredMatches.length > 0 ? (
                <div className="space-y-6">
                  {filteredMatches.map((match, index) => (
                    <MatchCard key={match.id} match={match} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No matches found"
                  description={
                    searchTerm || selectedDepartment !== 'all' || minScore > 0
                      ? "Try adjusting your filters to see more results."
                      : "No students match your criteria at this time."
                  }
                  icon={FunnelIcon}
                  action={
                    <Button onClick={handleNewSearch}>
                      Try New Search
                    </Button>
                  }
                />
              )}
            </>
          ) : (
            <Alert variant="warning">
              <strong>{results.message}</strong>
              <br />
              {results.suggestion || 'Please try again with different criteria or check back later.'}
              <div className="mt-4">
                <Button onClick={handleNewSearch}>
                  Try Again
                </Button>
              </div>
            </Alert>
          )}
        </Container>
      </Section>
    </AnimatedPage>
  )
}

export default ResultsPage
