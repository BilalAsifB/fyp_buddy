import { useState } from "react";
import Results from "./components/Results";
import LoadingSpinner from "./components/LoadingSpinner";
import { MatchResponse } from "./types";


export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResponse | null>(null);

  // Example fake fetch
  const fetchMatches = async () => {
    setLoading(true);
    setTimeout(() => {
      const fakeResults: MatchResponse = {
        all_data: [
          {
            id: "1",
            name: "Alice",
            skills: ["Python", "ML"],
            project: "AI Research Assistant",
          },
          {
            id: "2",
            name: "Bob",
            skills: ["React", "Node.js"],
            project: "Web Platform",
          },
        ],
        results: {
          "1": 92,
          "2": 85,
        },
      };
      setResults(fakeResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">FYP Buddy</h1>

      <button
        onClick={fetchMatches}
        className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Find Matches
      </button>

      <div className="mt-6 w-full max-w-2xl">
        {loading && <LoadingSpinner />}
        {results && <Results results={results} />}
      </div>
    </div>
  );
}
