import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Lightbulb, Code, User } from 'lucide-react';
import toast from 'react-hot-toast';

import { profileSchema, ProfileFormData } from '../../utils/validation';
import { ProfileRequest, GenderEnum, DEPARTMENTS, YEARS, COMMON_TECH_STACK, COMMON_INTERESTS } from '../../services/types';
import { apiService } from '../../services/api';

import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import TechStackInput from './TechStackInput';

interface ProfileFormProps {
  onSubmit: (data: ProfileRequest) => void;
  loading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, loading = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      domain: '',
      idea: '',
      tech_stack: [],
      interests: [],
      department: '',
      year: 22,
      gpa: 3.0,
      gender: GenderEnum.MALE,
      skills: [],
      email: ''
    }
  });

  const watchedValues = watch();
  const ideaLength = watchedValues.idea?.length || 0;

  const steps = [
    { id: 1, title: 'Project Info', icon: Lightbulb },
    { id: 2, title: 'Tech Stack', icon: Code },
    { id: 3, title: 'Interests', icon: Users },
    { id: 4, title: 'Personal Info', icon: User }
  ];

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof ProfileFormData)[] => {
    switch (step) {
      case 1: return ['domain', 'idea', 'title'];
      case 2: return ['tech_stack'];
      case 3: return ['interests'];
      case 4: return ['department', 'year', 'gpa', 'gender', 'skills', 'email'];
      default: return [];
    }
  };

  const onFormSubmit = (data: ProfileFormData) => {
    const profileRequest: ProfileRequest = {
      title: data.title || '',
      domain: data.domain,
      idea: data.idea,
      tech_stack: data.tech_stack,
      interests: data.interests || [],
      metadata: {
        department: data.department,
        year: data.year,
        gpa: data.gpa,
        gender: data.gender,
        skills: data.skills,
        email: data.email
      }
    };

    onSubmit(profileRequest);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Project Title (Optional)"
              placeholder="e.g., Smart Campus Management System"
              {...register('title')}
              error={errors.title?.message}
              helpText="A catchy name for your project idea"
            />

            <Input
              label="Project Domain *"
              placeholder="e.g., Artificial Intelligence, Web Development"
              {...register('domain')}
              error={errors.domain?.message}
              helpText="The main technology area or field of your project"
            />

            <Textarea
              label="Project Idea *"
              placeholder="Describe your project idea in detail. What problem does it solve? What features will it have? How will it work? Be specific and detailed..."
              rows={6}
              characterLimit={1000}
              value={watchedValues.idea}
              {...register('idea')}
              error={errors.idea?.message}
              helpText={`Minimum 50 characters required. Current: ${ideaLength}/1000`}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <TechStackInput
              label="Technical Stack *"
              value={watchedValues.tech_stack}
              onChange={(value) => setValue('tech_stack', value, { shouldValidate: true })}
              suggestions={COMMON_TECH_STACK}
              error={errors.tech_stack?.message}
              helpText="Add the technologies, frameworks, and tools you plan to use"
              maxItems={25}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <TechStackInput
              label="Interests (Optional)"
              value={watchedValues.interests || []}
              onChange={(value) => setValue('interests', value, { shouldValidate: true })}
              suggestions={COMMON_INTERESTS}
              error={errors.interests?.message}
              helpText="Add your interests and types of projects you'd like to work on"
              maxItems={20}
              placeholder="e.g., Machine Learning, Web Development"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Department *"
                options={DEPARTMENTS.map(dept => ({ value: dept, label: dept }))}
                placeholder="Select your department"
                {...register('department')}
                error={errors.department?.message}
              />

              <Select
                label="Year of Study *"
                options={YEARS.map(year => ({ value: year, label: `20${year}` }))}
                placeholder="Select your year"
                {...register('year', { valueAsNumber: true })}
                error={errors.year?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="GPA *"
                type="number"
                step="0.1"
                min="2.0"
                max="4.0"
                placeholder="3.5"
                {...register('gpa', { valueAsNumber: true })}
                error={errors.gpa?.message}
                helpText="Enter your current GPA (2.0 - 4.0)"
              />

              <Select
                label="Gender *"
                options={[
                  { value: GenderEnum.MALE, label: 'Male' },
                  { value: GenderEnum.FEMALE, label: 'Female' }
                ]}
                placeholder="Select gender"
                {...register('gender')}
                error={errors.gender?.message}
              />
            </div>

            <TechStackInput
              label="Technical Skills *"
              value={watchedValues.skills}
              onChange={(value) => setValue('skills', value, { shouldValidate: true })}
              suggestions={COMMON_TECH_STACK}
              error={errors.skills?.message}
              helpText="Add your technical skills and programming languages"
              maxItems={20}
              placeholder="e.g., Python, React, Machine Learning"
            />

            <Input
              label="Email Address *"
              type="email"
              placeholder="student@nu.edu.pk"
              {...register('email')}
              error={errors.email?.message}
              helpText="We'll use this to connect you with your matches"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200
                  ${isActive ? 'border-primary-600 bg-primary-600 text-white' : 
                    isCompleted ? 'border-success-600 bg-success-600 text-white' :
                    'border-gray-300 bg-white text-gray-400'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-primary-600' : isCompleted ? 'text-success-600' : 'text-gray-500'}`}>
                    Step {step.id}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-primary-500' : isCompleted ? 'text-success-500' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-6 ${isCompleted ? 'bg-success-600' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>
            {steps[currentStep - 1]?.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            {renderStepContent()}
            
            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <div className="flex space-x-3">
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={!isValid}
                  >
                    Find My Study Buddies
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;