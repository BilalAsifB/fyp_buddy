// src/types.ts

export interface Metadata {
  id: string;
  department: string;
  year: number;
  gpa: number;
  gender: string;
  skills: string[];
  email: string;
}

export interface Match {
  id: string;
  title: string;
  domain: string;
  idea: string;
  tech_stack: string[];
  interests: string[];
  score: number;
  metadata: Metadata;
}

export interface UserData {
  project_domain: string;
  student_interests: string[];
}

export interface MatchRequest {
  project_domain: string;
  student_interests: string[];
}

export interface MatchResponse {
  success: boolean;
  result: {
    all_data: Match[];
    query: Match;
    done: boolean;
    offset: number;
    limit: number;
    results: Record<string, number>;
  };
}

export interface ProjectRequest {
  domain: string;
}

export interface InterestRequest {
  student_id: string;
  interests: string[];
}