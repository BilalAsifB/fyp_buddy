import { z } from 'zod'
import { VALIDATION_RULES, DEPARTMENTS, GENDERS } from '@/constants'

// Base schemas
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .refine(email => email.endsWith('@nu.edu.pk'), {
    message: 'Email must be from @nu.edu.pk domain'
  })

const arrayStringSchema = (minItems = 0, maxItems = 50, itemName = 'item') =>
  z
    .array(z.string().min(1, `Each ${itemName} must not be empty`))
    .min(minItems, `At least ${minItems} ${itemName}${minItems !== 1 ? 's' : ''} required`)
    .max(maxItems, `Maximum ${maxItems} ${itemName}s allowed`)
    .refine(
      items => new Set(items.map(item => item.toLowerCase())).size === items.length,
      { message: `Duplicate ${itemName}s are not allowed` }
    )

// Metadata schema
export const metadataSchema = z.object({
  department: z
    .string()
    .min(1, 'Department is required')
    .refine(dept => DEPARTMENTS.includes(dept), {
      message: 'Please select a valid department'
    }),
  year: z
    .number()
    .int('Year must be a whole number')
    .min(19, 'Year must be at least 19')
    .max(25, 'Year must be at most 25'),
  gpa: z
    .number()
    .min(VALIDATION_RULES.GPA_MIN, `GPA must be at least ${VALIDATION_RULES.GPA_MIN}`)
    .max(VALIDATION_RULES.GPA_MAX, `GPA must be at most ${VALIDATION_RULES.GPA_MAX}`)
    .refine(val => Number.isFinite(val), 'GPA must be a valid number'),
  gender: z
    .string()
    .min(1, 'Gender is required')
    .refine(gender => GENDERS.some(g => g.value === gender), {
      message: 'Please select a valid gender'
    }),
  skills: arrayStringSchema(
    VALIDATION_RULES.SKILLS_MIN,
    VALIDATION_RULES.SKILLS_MAX,
    'skill'
  ),
  email: emailSchema,
})

// Main profile schema
export const profileSchema = z.object({
  title: z
    .string()
    .max(VALIDATION_RULES.TITLE_MAX_LENGTH, `Title must be at most ${VALIDATION_RULES.TITLE_MAX_LENGTH} characters`)
    .optional()
    .transform(val => val?.trim() || ''),
  domain: z
    .string()
    .min(VALIDATION_RULES.DOMAIN_MIN_LENGTH, `Domain must be at least ${VALIDATION_RULES.DOMAIN_MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.DOMAIN_MAX_LENGTH, `Domain must be at most ${VALIDATION_RULES.DOMAIN_MAX_LENGTH} characters`)
    .transform(val => val?.trim()),
  idea: z
    .string()
    .min(VALIDATION_RULES.IDEA_MIN_LENGTH, `Project idea must be at least ${VALIDATION_RULES.IDEA_MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.IDEA_MAX_LENGTH, `Project idea must be at most ${VALIDATION_RULES.IDEA_MAX_LENGTH} characters`)
    .transform(val => val?.trim()),
  tech_stack: arrayStringSchema(
    VALIDATION_RULES.TECH_STACK_MIN,
    VALIDATION_RULES.TECH_STACK_MAX,
    'technology'
  ),
  interests: arrayStringSchema(
    0,
    VALIDATION_RULES.INTERESTS_MAX,
    'interest'
  ).optional().default([]),
  metadata: metadataSchema,
})

// Form validation helper
export const validateField = (schema, data) => {
  try {
    schema.parse(data)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error.errors[0]?.message || 'Validation error'
    }
  }
}

// Validate entire form
export const validateForm = (data) => {
  try {
    const validated = profileSchema.parse(data)
    return { success: true, data: validated, errors: {} }
  } catch (error) {
    const errors = {}
    error.errors.forEach(err => {
      const path = err.path.join('.')
      errors[path] = err.message
    })
    return { success: false, data: null, errors }
  }
}

// Individual field validators
export const validators = {
  email: (email) => {
    try {
      emailSchema.parse(email)
      return null
    } catch (error) {
      return error.errors[0]?.message || 'Invalid email'
    }
  },
  
  gpa: (gpa) => {
    try {
      z.number()
        .min(VALIDATION_RULES.GPA_MIN)
        .max(VALIDATION_RULES.GPA_MAX)
        .parse(Number(gpa))
      return null
    } catch {
      return `GPA must be between ${VALIDATION_RULES.GPA_MIN} and ${VALIDATION_RULES.GPA_MAX}`
    }
  },
  
  idea: (idea) => {
    if (!idea || idea.trim().length < VALIDATION_RULES.IDEA_MIN_LENGTH) {
      return `Project idea must be at least ${VALIDATION_RULES.IDEA_MIN_LENGTH} characters`
    }
    if (idea.length > VALIDATION_RULES.IDEA_MAX_LENGTH) {
      return `Project idea must be at most ${VALIDATION_RULES.IDEA_MAX_LENGTH} characters`
    }
    return null
  },
  
  techStack: (techStack) => {
    if (!Array.isArray(techStack) || techStack.length < VALIDATION_RULES.TECH_STACK_MIN) {
      return `At least ${VALIDATION_RULES.TECH_STACK_MIN} technology required`
    }
    if (techStack.length > VALIDATION_RULES.TECH_STACK_MAX) {
      return `Maximum ${VALIDATION_RULES.TECH_STACK_MAX} technologies allowed`
    }
    return null
  },
  
  skills: (skills) => {
    if (!Array.isArray(skills) || skills.length < VALIDATION_RULES.SKILLS_MIN) {
      return `At least ${VALIDATION_RULES.SKILLS_MIN} skill required`
    }
    if (skills.length > VALIDATION_RULES.SKILLS_MAX) {
      return `Maximum ${VALIDATION_RULES.SKILLS_MAX} skills allowed`
    }
    return null
  }
}

// Helper functions
export const getFieldError = (errors, fieldName) => {
  return errors[fieldName] || null
}

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0
}

export const clearError = (errors, fieldName) => {
  const newErrors = { ...errors }
  delete newErrors[fieldName]
  return newErrors
}
