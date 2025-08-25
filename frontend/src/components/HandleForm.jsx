import { useState } from "react";
import { API_BASE_URL } from "../config";
import Results from "./Results";

export default function HandleForm({ formData }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: formData.personalInfo.id,
      title: formData.projectInfo.title || "N/A",
      domain: formData.projectInfo.domain || "N/A",
      idea: formData.projectInfo.idea || "N/A",
      tech_stack: formData.projectInfo.techStack || [],
      interests: formData.personalInfo.interests || [],
      score: 0.0,
      metadata: {
        id: formData.personalInfo.id,
        department: formData.personalInfo.department,
        year: formData.personalInfo.batch,
        gpa: parseFloat(formData.personalInfo.cgpa),
        gender: formData.personalInfo.gender,
        skills: formData.personalInfo.skills || [],
        email: formData.personalInfo.email,
      },
    };

    console.log("🚀 Submitting payload:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📡 API Response Status:", response.status);

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);

      const data = await response.json();
      console.log("✅ API Response Data:", data);

      setResults(data); // expecting array
    } catch (err) {
      console.error("❌ API Error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      console.log("⏹️ Request finished. Loading:", false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      <div className="mt-6">
        <Results results={results} error={error} />
      </div>
    </div>
  );
}
