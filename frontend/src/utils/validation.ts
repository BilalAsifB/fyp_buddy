import { z } from 'zod';
import { GenderEnum, DEPARTMENTS, YEARS } from '../services/types';

// Convert DEPARTMENTS readonly tuple into mutable string array for z.enum
const DEPARTMENT_VALUES = [...DEPARTMENTS] as [string, ...string[]];

// Validation schemas matching backend requirements
export const metadataSchema = z.object({
  department: z.enum(DEPARTMENT_VALUES, {
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
