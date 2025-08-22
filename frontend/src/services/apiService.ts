// src/services/apiService.ts
import type { Match, UserData, MatchRequest, MatchResponse, ProjectRequest, InterestRequest } from "../types";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://your-azure-container-app-url.azurecontainerapps.io");

export async function findMatches(userData: UserData): Promise<Match[]> {
  try {
    const matchRequest: MatchRequest = {
      project_domain: userData.project_domain,
      student_interests: userData.student_interests
    };

    const response = await fetch(`${BACKEND_URL}/find_matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `HTTP ${response.status}: Failed to find matches`);
    }

    const data: MatchResponse = await response.json();
    return data.result.all_data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function generateProject(domain: string) {
  try {
    const projectRequest: ProjectRequest = { domain };

    const response = await fetch(`${BACKEND_URL}/generate_project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `HTTP ${response.status}: Failed to generate project`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function generateInterests(studentId: string, interests: string[]) {
  try {
    const interestRequest: InterestRequest = {
      student_id: studentId,
      interests: interests
    };

    const response = await fetch(`${BACKEND_URL}/generate_interests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interestRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `HTTP ${response.status}: Failed to generate interests`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function getStats() {
  try {
    const response = await fetch(`${BACKEND_URL}/stats`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to get stats`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}