const DetailModal = ({ match, onClose }) => {
    if (!match) return null

    const matchScore = match.total_score || match.score || 0
    const scoreInfo = getScoreInfo(matchScore)
    const initials = getInitials(match.metadata?.email || 'Unknown')
    const avatarColor = getAvatarColor(match.metadata?.email || 'unknown')

    // Handle different score structures
    const scores = match.scores || {
      domain_similarity: match.domain_similarity || 0,
      tech_compatibility: match.tech_compatibility || 0,
      interest_overlap: match.interest_overlap || 0,
      academic_compatibility: match.academic_compatibility || 0
    }

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg',
                    avatarColor
                  )}>
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {match.title || 'Untitled Project'}
                    </h2>
                    <p className="text-slate-600">{match.metadata?.email || 'No email'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={scoreInfo.color} size="lg">
                        <StarIcon className="h-3 w-3 mr-1" />
                        {formatScore(matchScore)} • {scoreInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" onClick={onClose}>
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Academic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Academic Info</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-500">Department:</span>
                      <span className="ml-2 font-medium">{match.metadata?.department || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Year:</span>
                      <span className="ml-2 font-medium">20{match.metadata?.year || 'XX'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">GPA:</span>
                      <span className="ml-2 font-medium">{match.metadata?.gpa || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Gender:</span>
                      <span className="ml-2 font-medium">{match.metadata?.gender || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Project Domain</h3>
                  <Badge variant="primary">{match.domain || 'No Domain'}</Badge>
                </div>
              </div>

              {/* Project Idea */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Project Idea</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {match.idea || 'No description available'}
                </p>
              </div>

              {/* Tech Stack */}
              {(match.tech_stack || []).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Technology Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {match.tech_stack.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {(match.metadata?.skills || []).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {match.metadata.skills.map((skill, idx) => (
                      <Badge key={idx} variant="success" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {(match.interests || []).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {match.interests.map((interest, idx) => (
                      <Badge key={idx} variant="warning" size="sm">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Compatibility Scores */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">Compatibility Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">Domain Similarity</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatScore(scores.domain_similarity)}/5.0
                      </span>
                    </div>
                    <ProgressBar 
                      value={getScorePercentage(scores.domain_similarity)} 
                      max={100} 
                      color="primary"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">Tech Compatibility</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatScore(scores.tech_compatibility)}/5.0
                      </span>
                    </div>
                    <ProgressBar 
                      value={getScorePercentage(scores.tech_compatibility)} 
                      max={100} 
                      color="success"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">Interest Overlap</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatScore(scores.interest_overlap)}/5.0
                      </span>
                    </div>
                    <ProgressBar 
                      value={getScorePercentage(scores.interest_overlap)} 
                      max={100} 
                      color="warning"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">Academic Compatibility</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatScore(scores.academic_compatibility)}/5.0
                      </span>
                    </div>
                    <ProgressBar 
                      value={getScorePercentage(scores.academic_compatibility)} 
                      max={100} 
                      color="error"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => window.location.href = `mailto:${match.metadata?.email || ''}`}
                  disabled={!match.metadata?.email}
                >
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Contact Student
                </Button>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyEmail(match.metadata?.email || '')
                  }}
                  disabled={!match.metadata?.email}
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                  Copy Email
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    )
  }import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  CheckBadgeIcon,
  ClipboardDocumentIcon,
  ShareIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

import { 
  Container, 
  Section, 
  PageHeader, 
  AnimatedPage,
  Grid,
  SidebarLayout
} from '@/components/layout'
import { 
  Button, 
  Card, 
  Badge, 
  Alert, 
  Input,
  Select,
  ProgressBar,
  EmptyState
} from '@/components/ui'
import { getScoreInfo, SCORE_RANGES } from '@/constants'
import { 
  formatScore, 
  getScorePercentage, 
  getInitials, 
  getAvatarColor, 
  formatProcessingTime,
  formatEmail,
  truncate,
  capitalizeWords,
  cn
} from '@/utils'

const ResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [scoreFilter, setScoreFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [sortBy, setSortBy] = useState('score')
  const [selectedMatch, setSelectedMatch] = useState(null)

  // Get data from navigation state
  const results = location.state?.results
  const formData = location.state?.formData

  useEffect(() => {
    // Redirect if no results data
    if (!results) {
      navigate('/matching')
    }
  }, [results, navigate])

  if (!results) {
    return (
      <AnimatedPage>
        <Section spacing="xl">
          <Container>
            <EmptyState
              title="No Results Found"
              description="It looks like you haven't searched for matches yet."
              action={
                <Button onClick={() => navigate('/matching')}>
                  Start Matching
                </Button>
              }
            />
          </Container>
        </Section>
      </AnimatedPage>
    )
  }

  // Handle both API response structures
  const matches = results.matches || []
  const processing_time = results.processing_time || results.processing_time_ms || 0
  const request_id = results.request_id || results.query_id
  const total_matches = results.total_matches || matches.length

  // Filter and sort matches
  const filteredMatches = matches
    .filter(match => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = `${match.metadata?.email || ''} ${match.domain || ''} ${match.title || ''} ${match.idea || ''} ${(match.tech_stack || []).join(' ')} ${(match.interests || []).join(' ')}`.toLowerCase()
        if (!searchableText.includes(query)) return false
      }

      // Score filter - handle both score formats
      const matchScore = match.total_score || match.score || 0
      if (scoreFilter !== 'all') {
        const range = SCORE_RANGES[scoreFilter.toUpperCase()]
        if (matchScore < range.min || matchScore > range.max) return false
      }

      // Department filter
      if (departmentFilter !== 'all' && match.metadata?.department !== departmentFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      const aScore = a.total_score || a.score || 0
      const bScore = b.total_score || b.score || 0
      
      switch (sortBy) {
        case 'score':
          return bScore - aScore
        case 'gpa':
          return (b.metadata?.gpa || 0) - (a.metadata?.gpa || 0)
        case 'department':
          return (a.metadata?.department || '').localeCompare(b.metadata?.department || '')
        default:
          return 0
      }
    })

  const departments = [...new Set(matches.map(m => m.metadata?.department).filter(Boolean))].sort()

  const handleNewSearch = () => {
    navigate('/matching')
  }

  const handleCopyEmail = (email) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email)
      toast.success('Email copied to clipboard!')
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = email
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Email copied to clipboard!')
    }
  }

  const handleShareResults = () => {
    const shareText = `Found ${total_matches} potential FYP teammates! Check out the FYP Student Matcher.`
    
    if (navigator.share) {
      navigator.share({
        title: 'FYP Team Matches',
        text: shareText,
        url: window.location.href
      }).catch(() => {
        // Fallback if share fails
        handleCopyToClipboard(`${shareText} ${window.location.href}`)
      })
    } else {
      handleCopyToClipboard(`${shareText} ${window.location.href}`)
    }
  }

  const handleCopyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      toast.success('Share link copied to clipboard!')
    } else {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Share link copied to clipboard!')
    }
  }

  const getScoreColor = (score) => {
    const info = getScoreInfo(score)
    const colorMap = {
      success: 'text-success-600',
      primary: 'text-primary-600',
      warning: 'text-warning-600',
      error: 'text-error-600',
    }
    return colorMap[info.color] || 'text-slate-600'
  }

  const getScoreBgColor = (score) => {
    const info = getScoreInfo(score)
    const colorMap = {
      success: 'bg-success-100 border-success-200',
      primary: 'bg-primary-100 border-primary-200',
      warning: 'bg-warning-100 border-warning-200',
      error: 'bg-error-100 border-error-200',
    }
    return colorMap[info.color] || 'bg-slate-100 border-slate-200'
  }

  const MatchCard = ({ match, index }) => {
    const matchScore = match.total_score || match.score || 0
    const scoreInfo = getScoreInfo(matchScore)
    const initials = getInitials(match.metadata?.email || 'Unknown')
    const avatarColor = getAvatarColor(match.metadata?.email || 'unknown')

    // Handle different score structures
    const scores = match.scores || {
      domain_similarity: match.domain_similarity || 0,
      tech_compatibility: match.tech_compatibility || 0,
      interest_overlap: match.interest_overlap || 0,
      academic_compatibility: match.academic_compatibility || 0
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onClick={() => setSelectedMatch(match)}
      >
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0',
              avatarColor
            )}>
              {initials}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {match.title || 'Untitled Project'}
                  </h3>
                  <p className="text-sm text-slate-600 truncate">
                    {match.metadata?.email?.split('@')[0] || 'Unknown User'}
                  </p>
                </div>
                
                {/* Score */}
                <div className={cn(
                  'px-3 py-1 rounded-full border text-sm font-semibold flex items-center gap-1',
                  getScoreBgColor(matchScore)
                )}>
                  <StarIcon className="h-3 w-3" />
                  {formatScore(matchScore)}
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">{match.domain || 'No Domain'}</Badge>
                  <Badge variant="secondary" size="sm">{match.metadata?.department || 'Unknown Dept'}</Badge>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2">
                  {truncate(match.idea || 'No description available', 150)}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1 mb-3">
                {(match.tech_stack || []).slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
                {(match.tech_stack || []).length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded">
                    +{match.tech_stack.length - 3} more
                  </span>
                )}
              </div>

              {/* Scores Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-slate-900">
                    {formatScore(scores.domain_similarity || 0)}
                  </div>
                  <div className="text-slate-500">Domain</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-900">
                    {formatScore(scores.tech_compatibility || 0)}
                  </div>
                  <div className="text-slate-500">Tech</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-900">
                    {formatScore(scores.interest_overlap || 0)}
                  </div>
                  <div className="text-slate-500">Interest</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-900">
                    {formatScore(scores.academic_compatibility || 0)}
                  </div>
                  <div className="text-slate-500">Academic</div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span className="truncate">
                    {formatEmail(match.metadata?.email || 'No email')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyEmail(match.metadata?.email || '')
                    }}
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.location.href = `mailto:${match.metadata?.email || ''}`
                    }}
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  const DetailModal = ({ match, onClose }) => {
    if (!match) return null

    const scoreInfo = getScoreInfo(match.total_score)
    const initials = getInitials(match.metadata.email)
    const avatarColor = getAvatarColor(match.metadata.email)

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg',
                    avatarColor
                  )}>
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {match.title || 'Untitled Project'}
                    </h2>
                    <p className="text-slate-600">{match.metadata.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={scoreInfo.color} size="lg">
                        <StarIcon className="h-3 w-3 mr-1" />
                        {formatScore(match.total_score)} • {scoreInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" onClick={onClose}>
                  ✕
                </Button>
              </div>

              {/* Academic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Academic Info</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-500">Department:</span>
                      <span className="ml-2 font-medium">{match.metadata.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Year:</span>
                      <span className="ml-2 font-medium">20{match.metadata.year}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">GPA:</span>
                      <span className="ml-2 font-medium">{match.metadata.gpa}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Gender:</span>
                      <span className="ml-2 font-medium">{match.metadata.gender}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Project Domain</h3>
                  <Badge variant="primary">{match.domain}</Badge>
                </div>
              </div>

              {/* Project Idea */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Project Idea</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {match.idea}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {match.tech_stack.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {match.metadata.skills.map((skill, idx) => (
                    <Badge key={idx} variant="success" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              {match.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {match.interests.map((interest, idx) => (
                      <Badge key={idx} variant="warning" size="sm">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Compatibility Scores */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">Compatibility Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">Domain Similarity</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatScore(match.scores.domain_similarity)}/5.0
                      </span>
                    </div>
                    <ProgressBar 
                      value={getScorePercentage(match.scores.domain_similarity)} 
                      max={100} 
                      color="primary"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">Tech Compatibility</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatScore(match.scores.tech_compatibility)}/5.0
                      </span>
                    </div>
                    <ProgressBar 
                      value={getScorePercentage(match.scores.tech_compatibility)} 
                      max={100} 
                      color="success"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">Interest Overlap</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatScore(match.scores.interest_overlap)}/5.0
                      </span>
                    </div>
                    <ProgressBar 
                      value={getScorePercentage(match.scores.interest_overlap)} 
                      max={100} 
                      color="warning"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">Academic Compatibility</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatScore(match.scores.academic_compatibility)}/5.0
                      </span>
                    </div>
                    <ProgressBar 
                      value={getScorePercentage(match.scores.academic_compatibility)} 
                      max={100} 
                      color="error"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => window.location.href = `mailto:${match.metadata.email}`}
                >
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Contact Student
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    )
  }

  const sidebar = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search Matches
        </label>
        <Input
          type="text"
          placeholder="Search by email, domain, or technology..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Filters */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Filter by Score
        </label>
        <Select
          value={scoreFilter}
          onChange={setScoreFilter}
          options={[
            { value: 'all', label: 'All Scores' },
            { value: 'excellent', label: 'Excellent (4.0-5.0)' },
            { value: 'good', label: 'Good (3.0-3.9)' },
            { value: 'fair', label: 'Fair (2.0-2.9)' },
            { value: 'poor', label: 'Poor (0-1.9)' }
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Filter by Department
        </label>
        <Select
          value={departmentFilter}
          onChange={setDepartmentFilter}
          options={[
            { value: 'all', label: 'All Departments' },
            ...departments.map(dept => ({ value: dept, label: dept }))
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Sort by
        </label>
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'score', label: 'Compatibility Score' },
            { value: 'gpa', label: 'GPA' },
            { value: 'department', label: 'Department' }
          ]}
        />
      </div>

      {/* Summary */}
      <Card>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {filteredMatches.length}
          </div>
          <div className="text-sm text-slate-600 mb-3">
            {filteredMatches.length === 1 ? 'Match Found' : 'Matches Found'}
          </div>
          <div className="text-xs text-slate-500">
            Processed in {formatProcessingTime(processing_time)}
          </div>
        </div>
      </Card>

      <Button
        variant="outline"
        onClick={handleNewSearch}
        className="w-full"
      >
        <ArrowPathIcon className="h-4 w-4 mr-2" />
        New Search
      </Button>
    </div>
  )

  return (
    <AnimatedPage>
      <Section spacing="lg">
        <Container>
          <PageHeader
            title="Your FYP Matches"
            description={`Found ${matches.length} potential teammates based on your requirements`}
            action={
              <Button variant="outline" onClick={handleNewSearch}>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                New Search
              </Button>
            }
          />

          {/* Results Summary */}
          <div className="mb-8">
            <Alert variant="success" className="mb-4">
              <CheckBadgeIcon className="h-5 w-5" />
              <div>
                <strong>Search Complete!</strong> We found {matches.length} potential teammates 
                for your project "{formData?.title || 'your project'}". 
                Processing took {formatProcessingTime(processing_time)}.
              </div>
            </Alert>

            {/* Quick Stats */}
            <Grid columns={{ default: 2, sm: 4 }} gap="sm">
              {[
                { 
                  label: 'Excellent Matches', 
                  count: matches.filter(m => m.total_score >= 4.0).length,
                  color: 'text-success-600'
                },
                { 
                  label: 'Good Matches', 
                  count: matches.filter(m => m.total_score >= 3.0 && m.total_score < 4.0).length,
                  color: 'text-primary-600'
                },
                { 
                  label: 'Different Depts', 
                  count: new Set(matches.map(m => m.metadata.department)).size,
                  color: 'text-purple-600'
                },
                { 
                  label: 'Avg Score', 
                  count: formatScore(matches.reduce((sum, m) => sum + m.total_score, 0) / matches.length),
                  color: 'text-orange-600'
                }
              ].map((stat, index) => (
                <Card key={index} className="text-center p-4">
                  <div className={cn('text-lg font-bold', stat.color)}>
                    {stat.count}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </Card>
              ))}
            </Grid>
          </div>

          <SidebarLayout
            sidebar={sidebar}
            sidebarPosition="left"
            sidebarWidth="sm"
          >
            {filteredMatches.length > 0 ? (
              <div className="space-y-4">
                {filteredMatches.map((match, index) => (
                  <MatchCard key={match.request_id || index} match={match} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matches found"
                description="Try adjusting your filters to see more results."
                action={
                  <Button onClick={() => {
                    setSearchQuery('')
                    setScoreFilter('all')
                    setDepartmentFilter('all')
                  }}>
                    Clear Filters
                  </Button>
                }
              />
            )}
          </SidebarLayout>
        </Container>
      </Section>

  const sidebar = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search Matches
        </label>
        <Input
          type="text"
          placeholder="Search by email, domain, or technology..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Filters */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Filter by Score
        </label>
        <Select
          value={scoreFilter}
          onChange={setScoreFilter}
          options={[
            { value: 'all', label: 'All Scores' },
            { value: 'excellent', label: 'Excellent (4.0-5.0)' },
            { value: 'good', label: 'Good (3.0-3.9)' },
            { value: 'fair', label: 'Fair (2.0-2.9)' },
            { value: 'poor', label: 'Poor (0-1.9)' }
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Filter by Department
        </label>
        <Select
          value={departmentFilter}
          onChange={setDepartmentFilter}
          options={[
            { value: 'all', label: 'All Departments' },
            ...departments.map(dept => ({ value: dept, label: dept }))
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Sort by
        </label>
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'score', label: 'Compatibility Score' },
            { value: 'gpa', label: 'GPA' },
            { value: 'department', label: 'Department' }
          ]}
        />
      </div>

      {/* Summary */}
      <Card>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {filteredMatches.length}
          </div>
          <div className="text-sm text-slate-600 mb-3">
            {filteredMatches.length === 1 ? 'Match Found' : 'Matches Found'}
          </div>
          <div className="text-xs text-slate-500">
            Processed in {formatProcessingTime(processing_time)}
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleNewSearch}
          className="flex-1"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          New Search
        </Button>
        <Button
          variant="ghost"
          onClick={handleShareResults}
          className="flex-1"
        >
          <ShareIcon className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )

  return (
    <AnimatedPage>
      <Section spacing="lg">
        <Container>
          <PageHeader
            title="Your FYP Matches"
            description={`Found ${total_matches} potential teammates based on your requirements`}
            action={
              <Button variant="outline" onClick={handleNewSearch}>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                New Search
              </Button>
            }
          />

          {/* Results Summary */}
          <div className="mb-8">
            <Alert variant="success" className="mb-4">
              <CheckBadgeIcon className="h-5 w-5" />
              <div>
                <strong>Search Complete!</strong> We found {total_matches} potential teammates 
                for your project "{formData?.title || 'your project'}". 
                Processing took {formatProcessingTime(processing_time)}.
              </div>
            </Alert>

            {/* Quick Stats */}
            <Grid columns={{ default: 2, sm: 4 }} gap="sm">
              {[
                { 
                  label: 'Excellent Matches', 
                  count: matches.filter(m => (m.total_score || m.score || 0) >= 4.0).length,
                  color: 'text-success-600'
                },
                { 
                  label: 'Good Matches', 
                  count: matches.filter(m => {
                    const score = m.total_score || m.score || 0
                    return score >= 3.0 && score < 4.0
                  }).length,
                  color: 'text-primary-600'
                },
                { 
                  label: 'Different Depts', 
                  count: new Set(matches.map(m => m.metadata?.department).filter(Boolean)).size,
                  color: 'text-purple-600'
                },
                { 
                  label: 'Avg Score', 
                  count: formatScore(matches.reduce((sum, m) => sum + (m.total_score || m.score || 0), 0) / matches.length),
                  color: 'text-orange-600'
                }
              ].map((stat, index) => (
                <Card key={index} className="text-center p-4">
                  <div className={cn('text-lg font-bold', stat.color)}>
                    {stat.count}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </Card>
              ))}
            </Grid>
          </div>

          <SidebarLayout
            sidebar={sidebar}
            sidebarPosition="left"
            sidebarWidth="sm"
          >
            {filteredMatches.length > 0 ? (
              <div className="space-y-4">
                {filteredMatches.map((match, index) => (
                  <MatchCard key={match.id || index} match={match} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matches found"
                description="Try adjusting your filters to see more results."
                action={
                  <Button onClick={() => {
                    setSearchQuery('')
                    setScoreFilter('all')
                    setDepartmentFilter('all')
                  }}>
                    Clear Filters
                  </Button>
                }
              />
            )}
          </SidebarLayout>
        </Container>
      </Section>

      {/* Detail Modal */}
      {selectedMatch && (
        <DetailModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </AnimatedPage>
  )
}

export default ResultsPage
