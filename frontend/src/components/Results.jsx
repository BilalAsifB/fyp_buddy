export default function Results({ results, error }) {
  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!results) {
    return null; // nothing yet
  }

  if (results.length === 0) {
    return (
      <p className="text-gray-600 text-lg">
        No matches found yet. Please come back later.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Top {results.length} Matches
      </h2>
      <ul className="space-y-4">
        {results.map((match, idx) => (
          <li
            key={idx}
            className="border p-4 rounded-xl shadow-sm bg-gray-50"
          >
            <p><strong>ID:</strong> {match.id}</p>
            <p><strong>Title:</strong> {match.title}</p>
            <p><strong>Domain:</strong> {match.domain}</p>
            <p><strong>Idea:</strong> {match.idea}</p>
            <p><strong>Tech Stack:</strong> {match.tech_stack?.join(", ")}</p>
            <p><strong>Interests:</strong> {match.interests?.join(", ")}</p>
            <p><strong>Score:</strong> {match.score}</p>

            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Department:</strong> {match.metadata?.department}</p>
              <p><strong>Year:</strong> {match.metadata?.year}</p>
              <p><strong>GPA:</strong> {match.metadata?.gpa}</p>
              <p><strong>Gender:</strong> {match.metadata?.gender}</p>
              <p><strong>Skills:</strong> {match.metadata?.skills?.join(", ")}</p>
              <p><strong>Email:</strong> {match.metadata?.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
