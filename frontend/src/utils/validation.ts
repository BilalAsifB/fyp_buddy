import { z } from 'zod';
import { GenderEnum, DEPARTMENTS, YEARS } from '../services/types';

// Validation schemas matching backend requirements
export const metadataSchema = z.object({
  department: z.enum(DEPARTMENTS as [string, ...string[]], {
    required_error: "Department is required",
    invalid_type_error: "Please select a valid department"
  }),
  year: z.number({
    required_error: "Year is required",
    invalid_type_error: "Year must be a number"
  }).min(19, "Year must be between 19 and 25").max(25, "Year must be between 19 and 25"),
  gpa: z.number({
    required_error: "GPA is required",
    invalid_type_error: "GPA must be a number"
  }).min(2.0, "GPA must be between 2.0 and 4.0").max(4.0, "GPA must be between 2.0 and 4.0"),
  gender: z.nativeEnum(GenderEnum, {
    required_error: "Gender is required",
    invalid_type_error: "Please select a valid gender"
  }),
  skills: z.array(z.string().min(1, "Skill cannot be empty")).min(1, "At least one skill is required").max(20, "Maximum 20 skills allowed"),
  email: z.string().email("Please enter a valid email address")
});

export const profileSchema = z.object({
  title: z.string().max(200, "Title must be at most 200 characters").optional(),
  domain: z.string()
    .min(3, "Domain must be at least 3 characters")
    .max(100, "Domain must be at most 100 characters"),
  idea: z.string()
    .min(50, "Project idea must be at least 50 characters")
    .max(1000, "Project idea must be at most 1000 characters"),
  tech_stack: z.array(z.string().min(1, "Technology cannot be empty"))
    .min(1, "At least one technology is required")
    .max(25, "Maximum 25 technologies allowed"),
  interests: z.array(z.string().min(1, "Interest cannot be empty"))
    .max(20, "Maximum 20 interests allowed")
    .optional()
    .default([]),
}).merge(metadataSchema);

export type ProfileFormData = z.infer<typeof profileSchema>;

// Custom validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateGPA = (gpa: number): boolean => {
  return gpa >= 2.0 && gpa <= 4.0;
};

export const validateYear = (year: number): boolean => {
  return year >= 19 && year <= 25;
};

export const validateArrayLength = (array: string[], min: number, max: number): boolean => {
  return array.length >= min && array.length <= max;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

export const validateProjectIdea = (idea: string): { isValid: boolean; message?: string } => {
  const trimmed = idea.trim();
  
  if (trimmed.length < 50) {
    return { isValid: false, message: "Project idea must be at least 50 characters" };
  }
  
  if (trimmed.length > 1000) {
    return { isValid: false, message: "Project idea must be at most 1000 characters" };
  }
  
  // Check for meaningful content (not just repeated characters)
  const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, '')).size;
  if (uniqueChars < 10) {
    return { isValid: false, message: "Project idea should contain more meaningful content" };
  }
  
  return { isValid: true };
};

export const validateTechStack = (techStack: string[]): { isValid: boolean; message?: string } => {
  const filtered = techStack.filter(tech => tech.trim().length > 0);
  
  if (filtered.length === 0) {
    return { isValid: false, message: "At least one technology is required" };
  }
  
  if (filtered.length > 25) {
    return { isValid: false, message: "Maximum 25 technologies allowed" };
  }
  
  // Check for duplicates
  const unique = new Set(filtered.map(tech => tech.toLowerCase().trim()));
  if (unique.size !== filtered.length) {
    return { isValid: false, message: "Duplicate technologies are not allowed" };
  }
  
  return { isValid: true };
};

export const validateSkills = (skills: string[]): { isValid: boolean; message?: string } => {
  const filtered = skills.filter(skill => skill.trim().length > 0);
  
  if (filtered.length === 0) {
    return { isValid: false, message: "At least one skill is required" };
  }
  
  if (filtered.length > 20) {
    return { isValid: false, message: "Maximum 20 skills allowed" };
  }
  
  // Check for duplicates
  const unique = new Set(filtered.map(skill => skill.toLowerCase().trim()));
  if (unique.size !== filtered.length) {
    return { isValid: false, message: "Duplicate skills are not allowed" };
  }
  
  return { isValid: true };
};