import { MatchResponse } from "../types";

interface ResultsProps {
  results: MatchResponse;
}

export default function Results({ results }: ResultsProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Match Results</h2>

      {results.all_data.length === 0 ? (
        <p className="text-gray-500">No matches found.</p>
      ) : (
        <ul className="space-y-3">
          {results.all_data.map((match, idx) => (
            <li
              key={match.id || idx}
              className="p-3 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-700">{match.name}</p>
                <p className="text-sm text-gray-500">
                  {match.skills.join(", ")}
                </p>
                <p className="text-sm text-gray-400 italic">{match.project}</p>
              </div>
              <span className="text-blue-600 font-semibold">
                {results.results[match.id]}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
