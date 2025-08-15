/ src/pages/AboutPage.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { 
  CpuChipIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  HeartIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'

import { 
  Container, 
  Section, 
  PageHeader, 
  Grid, 
  AnimatedPage 
} from '@/components/layout'
import { Card, Badge } from '@/components/ui'

const AboutPage = () => {
  const features = [
    {
      icon: CpuChipIcon,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms analyze compatibility across multiple dimensions including project ideas, technical skills, and interests.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: UserGroupIcon,
      title: 'Skill Complementarity',
      description: 'Find teammates whose skills complement yours, ensuring your team has all the expertise needed for project success.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy Protected',
      description: 'Your personal information is secure. We only share what\'s necessary for successful team formation.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: ClockIcon,
      title: 'Fast Processing',
      description: 'Get your matches in under 2 minutes. Our optimized system processes hundreds of profiles quickly.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const techStack = [
    'React', 'FastAPI', 'Python', 'MongoDB', 'TailwindCSS', 
    'Framer Motion', 'LangChain', 'Groq AI', 'Docker'
  ]

  return (
    <AnimatedPage>
      <Section>
        <Container>
          <PageHeader
            title="About FYP Student Matcher"
            description="Connecting students for successful Final Year Projects through intelligent matching"
          />

          {/* Mission Statement */}
          <Card className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-4">
                <HeartIcon className="h-8 w-8 text-primary-500 mr-3" />
                <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
                                    </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                )
              })}
            </Grid>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
              How It Works
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {[
                  {
                    step: '01',
                    title: 'Submit Your Profile',
                    description: 'Tell us about your project idea, required technologies, interests, and academic background.'
                  },
                  {
                    step: '02',
                    title: 'AI Analysis',
                    description: 'Our intelligent system analyzes your profile against hundreds of other students using advanced matching algorithms.'
                  },
                  {
                    step: '03',
                    title: 'Get Your Matches',
                    description: 'Receive up to 5 highly compatible potential teammates with detailed compatibility scores and contact information.'
                  },
                  {
                    step: '04',
                    title: 'Connect & Collaborate',
                    description: 'Reach out to your matches and start building your dream FYP team for project success.'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="flex items-start gap-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-600">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
              Built With Modern Technology
            </h2>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CodeBracketIcon className="h-8 w-8 text-primary-500 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">Technology Stack</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Our platform is built using cutting-edge technologies to ensure reliability, speed, and scalability.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {techStack.map((tech, index) => (
                  <Badge key={index} variant="primary" size="lg">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Contact */}
          <Card className="text-center bg-gradient-to-r from-primary-50 to-blue-50">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Questions or Feedback?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              We're continuously improving our matching system. If you have suggestions, 
              encounter issues, or just want to share your success story, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@nu.edu.pk"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                View Source Code
              </a>
            </div>
          </Card>
        </Container>
      </Section>
    </AnimatedPage>
  )
}

export default AboutPage
