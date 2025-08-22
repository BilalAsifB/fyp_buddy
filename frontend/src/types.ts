// src/types.ts

// One student's FYP data
export interface FypData {
  id: string;
  name: string;
  skills: string[];
  project: string;
}

// Match response coming from backend
export interface MatchResponse {
  all_data: FypData[];                 // list of top matches
  results: Record<string, number>;     // { studentId: score }
}
