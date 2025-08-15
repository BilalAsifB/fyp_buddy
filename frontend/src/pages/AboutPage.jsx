import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CpuChipIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

import { 
  Container, 
  Section, 
  PageHeader, 
  AnimatedPage,
  Grid
} from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'
import { APP_CONFIG } from '@/constants'

const AboutPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: CpuChipIcon,
      title: 'AI-Powered Matching',
      description: 'Our advanced algorithm analyzes project requirements, technical skills, and interests to find the most compatible teammates.',
      highlights: ['Machine Learning', 'Natural Language Processing', 'Smart Scoring']
    },
    {
      icon: UserGroupIcon,
      title: 'Comprehensive Profiles',
      description: 'Detailed student profiles including academic background, technical skills, project interests, and collaboration preferences.',
      highlights: ['Academic Records', 'Skill Assessment', 'Interest Mapping']
    },
    {
      icon: AcademicCapIcon,
      title: 'Academic Integration',
      description: 'Seamlessly integrated with university systems to ensure authenticity and provide relevant academic context.',
      highlights: ['Department Diversity', 'GPA Consideration', 'Batch Compatibility']
    },
    {
      icon: ChartBarIcon,
      title: 'Smart Analytics',
      description: 'Detailed compatibility scores and insights to help you make informed decisions about team formation.',
      highlights: ['Compatibility Metrics', 'Skill Gaps Analysis', 'Success Prediction']
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Fill Your Profile',
      description: 'Complete your project details, technical requirements, and personal information.',
      icon: '📝'
    },
    {
      step: 2,
      title: 'AI Analysis',
      description: 'Our algorithm analyzes your profile against thousands of student profiles.',
      icon: '🤖'
    },
    {
      step: 3,
      title: 'Get Matches',
      description: 'Receive ranked matches with detailed compatibility scores and insights.',
      icon: '🎯'
    },
    {
      step: 4,
      title: 'Connect & Collaborate',
      description: 'Reach out to your matches and start building your dream team.',
      icon: '🚀'
    }
  ]

  const benefits = [
    'Find teammates with complementary skills',
    'Save time on manual team formation',
    'Increase project success rate',
    'Connect across different departments',
    'Get detailed compatibility insights',
    'Access to a large student database'
  ]

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <Section spacing="lg">
        <Container>
          <PageHeader
            title="About FYP Student Matcher"
            description="Revolutionizing how students find their perfect Final Year Project teammates through AI-powered matching"
          />

          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium"
            >
              <SparklesIcon className="h-4 w-4" />
              Powered by Advanced AI Technology
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Our Platform Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with deep understanding of academic collaboration
              to create the most effective team matching system.
            </p>
          </div>

          <Grid columns={{ default: 1, lg: 2 }} gap="lg">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary-100 rounded-lg flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 mb-4">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {feature.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="primary" size="sm">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </Grid>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section className="bg-slate-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Simple steps to find your perfect FYP teammates
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-200 transform -translate-y-1/2" />
            
            <Grid columns={{ default: 1, sm: 2, lg: 4 }} gap="lg">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="text-center relative z-10">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {step.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* Benefits Section */}
      <Section className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Benefits of Using Our Platform
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Our AI-powered matching system provides numerous advantages over traditional
                team formation methods, ensuring better collaboration and project success.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-success-600 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-8 bg-gradient-to-br from-primary-50 to-blue-50">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary-600 mb-2">95%</div>
                  <p className="text-lg font-medium text-slate-900 mb-2">Success Rate</p>
                  <p className="text-slate-600 text-sm">
                    Students who use our platform report higher satisfaction with their team formation
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600">4.8/5</div>
                    <p className="text-xs text-slate-600">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <p className="text-xs text-slate-600">Departments</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1000+</div>
                    <p className="text-xs text-slate-600">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">200+</div>
                    <p className="text-xs text-slate-600">Projects</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Technology Section */}
      <Section className="bg-slate-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built with modern technologies to ensure reliability, scalability, and performance
            </p>
          </div>

          <Grid columns={{ default: 2, md: 4 }} gap="lg">
            {[
              { name: 'React', description: 'Frontend Framework' },
              { name: 'FastAPI', description: 'Backend API' },
              { name: 'Python', description: 'AI & ML Processing' },
              { name: 'PostgreSQL', description: 'Database' }
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 mb-1">{tech.name}</h3>
                  <p className="text-sm text-slate-600">{tech.description}</p>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Dream Team?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who have successfully formed their FYP teams using our platform.
              Start your journey to project success today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/matching')}
                className="bg-white text-primary-600 hover:bg-slate-50 border-white group"
              >
                Start Matching Now
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white border-white/30 hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </AnimatedPage>
  )
}

export default AboutPage
