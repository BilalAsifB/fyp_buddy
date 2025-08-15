import React from "react";

const DetailModal = ({ match, onClose, onCopyEmail }) => {
  if (!match) return null;

  const { metadata = {}, scores = {} } = match;
  const { name, email, domain, technologies, project, description } = metadata;

  const totalScore =
    match.total_score ??
    match.score ??
    (scores.total ? scores.total.toFixed?.(2) : "N/A");

  const handleEmailClick = () => {
    if (email) {
      if (onCopyEmail) {
        onCopyEmail(email);
      } else {
        navigator.clipboard.writeText(email);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold">Match Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-3">
          <p>
            <strong>Name:</strong> {name || "Unknown"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {email ? (
              <span
                onClick={handleEmailClick}
                className="cursor-pointer text-blue-600 hover:underline"
                title="Click to copy"
              >
                {email}
              </span>
            ) : (
              "N/A"
            )}
          </p>

          <p>
            <strong>Domain:</strong> {domain || "N/A"}
          </p>

          <p>
            <strong>Technologies:</strong>{" "}
            {technologies?.length ? technologies.join(", ") : "N/A"}
          </p>

          <p>
            <strong>Project:</strong> {project || "N/A"}
          </p>

          <p>
            <strong>Description:</strong> {description || "N/A"}
          </p>

          <p>
            <strong>Total Score:</strong> {totalScore}
          </p>

          {/* Optional: Show all other scores */}
          {scores && Object.keys(scores).length > 0 && (
            <div className="mt-3">
              <strong>Detailed Scores:</strong>
              <ul className="list-disc list-inside">
                {Object.entries(scores).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value?.toFixed ? value.toFixed(2) : value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
