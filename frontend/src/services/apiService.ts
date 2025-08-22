import type { Match, UserData } from "../types";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://your-azure-container-app-url.azurecontainerapps.io");

export async function findMatches(userData: UserData): Promise<Match[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/match/find-matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to find matches");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
