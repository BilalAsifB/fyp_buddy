import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  CpuChipIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

import { Container, Section, Grid, AnimatedPage } from '@/components/layout'
import { Button, Card, Badge, Alert, Spinner } from '@/components/ui'
import { useMatchingStats, useRateLimit } from '@/hooks'
import { APP_CONFIG } from '@/constants'
import { cn } from '@/utils'

const HomePage = () => {
  const navigate = useNavigate()
  const { data: stats, loading: statsLoading, error: statsError } = useMatchingStats()
  const { data: rateLimit, loading: rateLimitLoading } = useRateLimit()
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: CpuChipIcon,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm analyzes your project idea, tech stack, and interests to find the perfect teammates.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: UserGroupIcon,
      title: 'Skill Compatibility',
      description: 'Find students with complementary skills and similar project interests for successful collaboration.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: AcademicCapIcon,
      title: 'Department Diversity',
      description: 'Connect with students from different departments to bring diverse perspectives to your project.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: ChartBarIcon,
      title: 'Smart Scoring',
      description: 'Get detailed compatibility scores to make informed decisions about your team formation.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  // Rotate features every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [features.length])

  const handleStartMatching = () => {
    navigate('/matching')
  }

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <Section spacing="xl" className="text-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <SparklesIcon className="h-12 w-12 text-primary-500 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
                Find Your Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 block">
                  FYP Team
                </span>
              </h1>
            </div>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Connect with like-minded students who share your project interests and complement your skills. 
              Our AI-powered matching system helps you build the ideal team for your Final Year Project success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleStartMatching}
                className="group"
                disabled={rateLimitLoading}
              >
                Start Finding Matches
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>

            {/* Rate Limit Info */}
            {rateLimit && !rateLimitLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6"
              >
                <Badge variant="secondary" size="lg">
                  {rateLimit.calls_remaining} searches remaining today
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Our Matching System?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We use advanced algorithms and comprehensive profile analysis to ensure you find the most compatible teammates.
            </p>
          </div>

          <Grid columns={{ default: 1, md: 2, lg: 4 }} gap="lg">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isActive = index === currentFeature
              
              return (
                <motion.div
                  key={index}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    y: isActive ? -8 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={cn(
                    'text-center h-full transition-all duration-300',
                    isActive && 'shadow-lg ring-2 ring-primary-200'
                  )}>
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4',
                      feature.bgColor
                    )}>
                      <Icon className={cn('h-6 w-6', feature.color)} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </Grid>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section className="bg-slate-50">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              System Statistics
            </h2>
            <p className="text-lg text-slate-600">
              See how many students are already using our platform
            </p>
          </div>

          {statsLoading ? (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : statsError ? (
            <Alert variant="error" className="max-w-md mx-auto">
              <strong>Unable to load statistics.</strong>
              <br />
              {statsError.message || 'Please try again later.'}
            </Alert>
          ) : stats ? (
            <Grid columns={{ default: 1, sm: 2, lg: 4 }}>
              <Card className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.total_profiles || 0}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  Total Students
                </div>
              </Card>

              <Card className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.unique_domains || 0}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  Project Domains
                </div>
              </Card>

              <Card className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.unique_departments || 0}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  Departments
                </div>
              </Card>

              <Card className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.round(stats.avg_tech_stack_size || 0)}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  Avg. Technologies
                </div>
              </Card>
            </Grid>
          ) : (
            <Alert variant="warning" className="max-w-md mx-auto">
              <strong>No data available.</strong>
              <br />
              The system is currently being set up. Please check back later.
            </Alert>
          )}
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <Container>
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Team?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join hundreds of students who have already found their perfect FYP teammates. 
                Start your journey to project success today.
              </p>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleStartMatching}
                className="bg-white text-primary-600 hover:bg-slate-50 border-white group"
                disabled={rateLimitLoading}
              >
                Get Started Now
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </Container>
      </Section>
    </AnimatedPage>
  )
}

export default HomePage
