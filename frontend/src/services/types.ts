// API Types matching backend models

export enum GenderEnum {
  MALE = "Male",
  FEMALE = "Female"
}

export interface MetadataRequest {
  department: string;
  year: number;
  gpa: number;
  gender: GenderEnum;
  skills: string[];
  email: string;
}

export interface ProfileRequest {
  title?: string;
  domain: string;
  idea: string;
  tech_stack: string[];
  interests: string[];
  metadata: MetadataRequest;
}

export interface MetadataResponse {
  department: string;
  year: number;
  gpa: number;
  gender: string;
  skills: string[];
  email: string;
}

export interface MatchResponse {
  id: string;
  title: string;
  domain: string;
  idea: string;
  tech_stack: string[];
  interests: string[];
  score: number;
  metadata: MetadataResponse;
}

export interface MatchingResponse {
  success: boolean;
  message: string;
  matches: MatchResponse[];
  total_matches: number;
  query_id: string;
  timestamp: string;
  processing_time_ms: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  services: Record<string, string>;
  uptime: number;
}

export interface RateLimitResponse {
  calls_remaining: number;
  calls_made: number;
  daily_limit: number;
  reset_time: string;
}

export interface ErrorResponse {
  success: boolean;
  error_type: string;
  message: string;
  details?: ValidationErrorDetail[];
  timestamp: string;
  request_id?: string;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value: any;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Form types for frontend
export interface FormData extends Omit<ProfileRequest, 'metadata'> {
  // Student metadata
  department: string;
  year: number;
  gpa: number;
  gender: GenderEnum;
  skills: string[];
  email: string;
}

// UI State types
export interface MatchingState {
  loading: boolean;
  error: string | null;
  matches: MatchResponse[];
  totalMatches: number;
  queryId: string | null;
  processingTime: number | null;
}

export interface RateLimitState {
  callsRemaining: number;
  callsMade: number;
  dailyLimit: number;
  resetTime: string | null;
  loading: boolean;
}

// Constants
export const DEPARTMENTS = [
  "Artificial Intelligence",
  "Cyber Security", 
  "Computer Science",
  "Software Engineering",
  "Data Science"
] as const;

export const YEARS = [19, 20, 21, 22, 23, 24, 25] as const;

export const COMMON_TECH_STACK = [
  "React", "Angular", "Vue.js", "Node.js", "Express.js", "Django", "Flask",
  "FastAPI", "Spring Boot", "ASP.NET", "Python", "JavaScript", "TypeScript",
  "Java", "C#", "C++", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "Firebase",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "TensorFlow",
  "PyTorch", "Scikit-learn", "OpenCV", "Unity", "Unreal Engine", "React Native",
  "Flutter", "Ionic", "Electron", "Blockchain", "Solidity", "Web3",
  "GraphQL", "REST API", "Microservices", "Machine Learning", "Deep Learning",
  "Natural Language Processing", "Computer Vision", "IoT", "Cybersecurity",
  "DevOps", "CI/CD", "Git", "Linux", "Windows", "macOS"
] as const;

export const COMMON_INTERESTS = [
  "Web Development", "Mobile App Development", "Machine Learning", "Artificial Intelligence",
  "Data Science", "Cybersecurity", "Cloud Computing", "Internet of Things (IoT)",
  "Blockchain Technology", "Game Development", "Augmented Reality", "Virtual Reality",
  "Computer Vision", "Natural Language Processing", "Robotics", "Embedded Systems",
  "DevOps", "Full Stack Development", "Backend Development", "Frontend Development",
  "Database Management", "Network Security", "Ethical Hacking", "Digital Forensics",
  "Bioinformatics", "Fintech", "E-commerce", "Healthcare Technology", "Education Technology",
  "Social Media Platforms", "Streaming Services", "Real-time Systems", "Distributed Systems"
] as const;