// src/pages/NotFoundPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

import { 
  Container, 
  Section, 
  AnimatedPage 
} from '@/components/layout'
import { Button, EmptyState } from '@/components/ui'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <AnimatedPage>
      <Section spacing="xl">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* 404 Animation */}
            <div className="mb-8">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="inline-block"
              >
                <div className="text-8xl font-bold text-primary-200">404</div>
              </motion.div>
            </div>

            <EmptyState
              title="Oops! Page Not Found"
              description="The page you're looking for doesn't exist or has been moved. Let's get you back on track to find your perfect FYP teammates!"
              icon={ExclamationTriangleIcon}
              action={
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/')}
                    size="lg"
                    className="group"
                  >
                    <HomeIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Go Home
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/matching')}
                    size="lg"
                    className="group"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Find Matches
                  </Button>
                </div>
              }
            />

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Popular Pages
              </h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Home
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => navigate('/matching')}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Find Matches
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => navigate('/about')}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  About Us
                </button>
              </div>
            </div>

            {/* Fun Fact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 p-4 bg-slate-50 rounded-lg max-w-md mx-auto"
            >
              <p className="text-sm text-slate-600">
                <strong>Fun Fact:</strong> While you're here, hundreds of students are 
                successfully finding their FYP teammates using our matching system!
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </Section>
    </AnimatedPage>
  )
}

export default NotFoundPage
