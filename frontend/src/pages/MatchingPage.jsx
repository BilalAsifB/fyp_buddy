import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { 
  Container, 
  Section, 
  PageHeader, 
  AnimatedPage 
} from '@/components/layout'
import { 
  Button, 
  Input, 
  Textarea, 
  Select, 
  Card, 
  Alert,
  ProgressBar,
  Spinner 
} from '@/components/ui'
import { 
  TagInput, 
  FormSection, 
  FieldGroup, 
  CharacterCounter 
} from '@/components/forms'

import { 
  DEPARTMENTS, 
  YEARS, 
  GENDERS, 
  COMMON_DOMAINS, 
  COMMON_TECHNOLOGIES, 
  COMMON_SKILLS, 
  COMMON_INTERESTS,
  VALIDATION_RULES,
  LOADING_MESSAGES
} from '@/constants'
import { profileSchema, validators } from '@/utils/validation'
import { useMatching, useRateLimit, useLocalStorage } from '@/hooks'
import { truncate } from '@/utils'

const MatchingPage = () => {
  const navigate = useNavigate()
  const { findMatches, loading, progress, error, data } = useMatching()
  const { data: rateLimit, refetch: refetchRateLimit } = useRateLimit()
  const [savedData, setSavedData] = useLocalStorage('matching-form-draft', {})
  const [currentStep, setCurrentStep] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    reset,
    trigger
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: savedData.title || '',
      domain: savedData.domain || '',
      idea: savedData.idea || '',
      tech_stack: savedData.tech_stack || [],
      interests: savedData.interests || [],
      metadata: {
        department: savedData.metadata?.department || '',
        year: savedData.metadata?.year || '',
        gpa: savedData.metadata?.gpa || '',
        gender: savedData.metadata?.gender || '',
        skills: savedData.metadata?.skills || [],
        email: savedData.metadata?.email || '',
      }
    },
    mode: 'onChange'
  })

  const watchedValues = watch()
  const ideaLength = watch('idea')?.length || 0

  // Save form data to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      setSavedData(data)
    })
    return () => subscription.unsubscribe()
  }, [watch, setSavedData])

  // Handle loading messages rotation
  useEffect(() => {
    if (!loading) return

    let messageIndex = 0
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[messageIndex])
    }, 3000)

    return () => clearInterval(interval)
  }, [loading])

  // Navigate to results when matching completes
  useEffect(() => {
    if (data && !loading) {
      navigate('/results', { state: { results: data, formData: watchedValues } })
    }
  }, [data, loading, navigate, watchedValues])

  const steps = [
    {
      title: 'Project Information',
      description: 'Tell us about your project idea and domain'
    },
    {
      title: 'Technical Requirements',
      description: 'What technologies and skills do you need?'
    },
    {
      title: 'Personal Information',
      description: 'Your academic details and contact information'
    }
  ]

  const onSubmit = async (formData) => {
    try {
      // Check rate limit
      if (rateLimit && rateLimit.calls_remaining <= 0) {
        toast.error('You have reached your daily search limit. Please try again tomorrow.')
        return
      }

      const result = await findMatches(formData)
      
      if (result.success) {
        // Clear saved data after successful submission
        setSavedData({})
        toast.success('Matches found successfully!')
        // Refresh rate limit
        refetchRateLimit()
      } else {
        toast.error(result.error?.message || 'An error occurred while finding matches')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ['title', 'domain', 'idea']
      case 1:
        return ['tech_stack', 'interests']
      case 2:
        return ['metadata.department', 'metadata.year', 'metadata.gpa', 'metadata.gender', 'metadata.skills', 'metadata.email']
      default:
        return []
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <FormSection
            title="Project Details"
            description="Describe your project idea and the domain it belongs to"
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Project Title"
                  placeholder="e.g., AI-Powered Study Assistant"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="domain"
              control={control}
              render={({ field }) => (
                <TagInput
                  {...field}
                  label="Project Domain"
                  placeholder="Type to search or add custom domain..."
                  suggestions={COMMON_DOMAINS}
                  maxTags={1}
                  required
                  error={errors.domain?.message}
                  helperText="Choose the main domain that best describes your project"
                />
              )}
            />

            <Controller
              name="idea"
              control={control}
              render={({ field }) => (
                <div>
                  <Textarea
                    {...field}
                    label="Project Idea"
                    placeholder="Describe your project idea in detail. What problem does it solve? What are the main features? How will it work?"
                    rows={6}
                    required
                    error={!!errors.idea}
                    helperText={errors.idea?.message}
                  />
                  <CharacterCounter
                    current={ideaLength}
                    max={VALIDATION_RULES.IDEA_MAX_LENGTH}
                    className="mt-1"
                  />
                </div>
              )}
            />
          </FormSection>
        )

      case 1:
        return (
          <FormSection
            title="Technical Requirements"
            description="What technologies and skills are needed for your project?"
          >
            <Controller
              name="tech_stack"
              control={control}
              render={({ field }) => (
                <TagInput
                  {...field}
                  label="Technology Stack"
                  placeholder="Add technologies, frameworks, languages..."
                  suggestions={COMMON_TECHNOLOGIES}
                  maxTags={VALIDATION_RULES.TECH_STACK_MAX}
                  required
                  error={errors.tech_stack?.message}
                  helperText="List the main technologies, programming languages, and frameworks you'll use"
                />
              )}
            />

            <Controller
              name="interests"
              control={control}
              render={({ field }) => (
                <TagInput
                  {...field}
                  label="Project Interests"
                  placeholder="Add your interests and areas you'd like to explore..."
                  suggestions={COMMON_INTERESTS}
                  maxTags={VALIDATION_RULES.INTERESTS_MAX}
                  error={errors.interests?.message}
                  