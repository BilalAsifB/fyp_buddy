import { useState } from "react";
import { API_BASE_URL } from "../config";

export default function UserForm() {
  const currentYear = new Date().getFullYear();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    personalInfo: {
      id: "",
      department: "",
      batch: "",
      gender: "",
      cgpa: "",
      email: "",
    },
    skillsInterests: {
      skills: [],
      interests: [],
    },
    projectInfo: {
      title: "",
      domain: "",
      idea: "",
      techStack: [],
    },
  });

  const [tempInput, setTempInput] = useState({ skill: "", interest: "", tech: "" });

  // ✅ Personal Info validation
  const isPersonalInfoValid = () => {
    const { id, department, batch, gender, cgpa, email } = formData.personalInfo;
    const idRegex = /^\d{2}[A-Z]-\d{4}$/; // e.g., 22K-1234
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nu\.edu\.pk$/;
    const validDepartments = [
      "Artificial Intelligence",
      "Cyber Security",
      "Data Science",
      "Computer Science",
      "Software Engineering",
    ];

    return (
      idRegex.test(id) &&
      validDepartments.includes(department) &&
      Number(batch) <= currentYear - 3 &&
      Number(batch) >= currentYear - 6 &&
      gender &&
      parseFloat(cgpa) >= 2.0 &&
      parseFloat(cgpa) <= 4.0 &&
      emailRegex.test(email)
    );
  };

  // ✅ Skills & Interests validation
  const isSkillsInterestsValid = () => {
    return (
      formData.skillsInterests.skills.length > 0 &&
      formData.skillsInterests.interests.length > 0
    );
  };

  // Add skill / interest / tech
  const handleAddItem = (field, type) => {
    if (tempInput[type].trim() === "") return;
    
    setFormData((prev) => {
      let key = type + "s";
      if (type === "tech") key = "techStack"; // Special case for techStack
    
      return {
        ...prev,
        [field]: {
          ...prev[field],
          [key]: [...prev[field][key], tempInput[type].trim()],
          // [type + "s"]: [...prev[field][key], tempInput[type].trim()],
        },
      };
    });

    setTempInput({ ...tempInput, [type]: "" });
  };

  // Remove skill / interest / tech stack
  const handleRemoveItem = (field, type, index) => {
    setFormData((prev) => {
      let key = type + "s";
      if (type === "tech") key = "techStack"; // Special case for tech

      return {
        ...prev,
        [field]: {
          ...prev[field],
          [key]: prev[field][key].filter((_, i) => i !== index),
          // [type + "s"]: prev[field][key].filter((_, i) => i !== index),
        },
      };
    });
  };

  // Final Submit - First ingest user, then find matches
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Step 1: Ingest user data
    const ingestPayload = {
      id: formData.personalInfo.id,
      title: formData.projectInfo.title || "",
      domain: formData.projectInfo.domain || "",
      idea: formData.projectInfo.idea || "",
      tech_stack: formData.projectInfo.techStack || [],
      interests: formData.skillsInterests.interests,
      score: 0.0,
      metadata: {
        id: formData.personalInfo.id,
        department: formData.personalInfo.department,
        year: parseInt(formData.personalInfo.batch),
        gpa: parseFloat(formData.personalInfo.cgpa),
        gender: formData.personalInfo.gender.toLowerCase(),
        skills: formData.skillsInterests.skills,
        email: formData.personalInfo.email,
      },
    };

    try {
      console.log("🚀 Ingesting user data:", ingestPayload);
      console.log("👉 API BASE URL:", API_BASE_URL);

      // Ingest user data
      const ingestResponse = await fetch(`${API_BASE_URL}/ingest_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingestPayload),
      });

      if (!ingestResponse.ok) {
        throw new Error(`Failed to ingest user data: ${ingestResponse.status}`);
      }

      const ingestResult = await ingestResponse.json();
      console.log("✅ User ingested:", ingestResult);

      // Step 2: Find matches
      const matchPayload = {
        id: formData.personalInfo.id,
        title: formData.projectInfo.title || "",
        domain: formData.projectInfo.domain || "",
        idea: formData.projectInfo.idea || "",
        tech_stack: formData.projectInfo.techStack || [],
        interests: formData.skillsInterests.interests,
        score: 0.0,
        metadata: {
          id: formData.personalInfo.id,
          department: formData.personalInfo.department,
          year: parseInt(formData.personalInfo.batch),
          gpa: parseFloat(formData.personalInfo.cgpa),
          gender: formData.personalInfo.gender.toLowerCase(),
          skills: formData.skillsInterests.skills,
          email: formData.personalInfo.email,
        },
      };


      console.log("🔍 Finding matches:", matchPayload);

      const matchResponse = await fetch(`${API_BASE_URL}/find_matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchPayload),
      });

      if (!matchResponse.ok) {
        throw new Error(`Failed to find matches: ${matchResponse.status}`);
      }

      const matchResult = await matchResponse.json();
      console.log("✅ Match results:", matchResult);

      // Extract the results from the LangGraph response
      if (matchResult.success && matchResult.result) {
        setResults(matchResult.result);
      } else {
        setResults([]);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // If submitted successfully, show results
  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Your profile has been saved and we've found potential matches for you!
          </h2>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {results && results.length > 0 ? (
          <div>
            <h3 className="text-center text-xl font-semibold text-gray-800 mb-4">
              🎯 Top {results.length} Matches Found
            </h3>
            <div className="space-y-4">
              {results.map((match, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {match.title || "Untitled Project"}
                      </h4>
                    </div>
                    <span className="text-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {match.domain || "General"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Project Idea:</p>
                      <p className="text-sm text-gray-600">
                        {match.idea || "No description available"}
                      </p>
                    </div>

                    {match.tech_stack && match.tech_stack.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Project Tech Stack:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.tech_stack.map((tech, techIdx) => (
                            <span
                              key={techIdx}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {match.metadata && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Student ID:</span>{" "}
                            {match.metadata.id}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>{" "}
                            {match.metadata.email}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Department:</span>{" "}
                            {match.metadata.department}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Batch:</span>{" "}
                            {match.metadata.year}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">CGPA:</span>{" "}
                            {match.metadata.gpa}
                          </div>
                        </div>
                        
                        {match.metadata.skills && match.metadata.skills.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-700 text-sm">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.metadata.skills.map((skill, skillIdx) => (
                                <span
                                  key={skillIdx}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {match.interests && match.interests.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Interests:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.interests.map((interest, intIdx) => (
                                <span
                                  key={intIdx}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              🔍 No matches found yet. More students may join soon!
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => {
              setSubmitted(false);
              setResults(null);
              setError(null);
              setStep(1);
              setFormData({
                personalInfo: {
                  id: "",
                  department: "",
                  batch: "",
                  gender: "",
                  cgpa: "",
                  email: "",
                },
                skillsInterests: {
                  skills: [],
                  interests: [],
                },
                projectInfo: {
                  title: "",
                  domain: "",
                  idea: "",
                  techStack: [],
                },
              });
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Find more matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="flex justify-between mb-6">
        {["Personal Info", "Skills & Interests", "Project Info", "Review"].map(
          (label, index) => (
            <div
              key={index}
              className={`flex-1 text-center py-2 rounded-lg text-sm font-medium ${
                step === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {label}
            </div>
          )
        )}
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="University ID (e.g., 22K-1234)"
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.id}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, id: e.target.value },
              })
            }
          />
          <select
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.department}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  department: e.target.value,
                },
              })
            }
          >
            <option value="">Select Department</option>
            <option>Artificial Intelligence</option>
            <option>Cyber Security</option>
            <option>Data Science</option>
            <option>Computer Science</option>
            <option>Software Engineering</option>
          </select>
          <input
            type="number"
            placeholder="Batch (e.g., 2022)"
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.batch}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  batch: e.target.value,
                },
              })
            }
          />
          <select
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  gender: e.target.value,
                },
              })
            }
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="CGPA (2.0 - 4.0)"
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.cgpa}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  cgpa: e.target.value,
                },
              })
            }
          />
          <input
            type="email"
            placeholder="Email (must end with @nu.edu.pk)"
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  email: e.target.value,
                },
              })
            }
          />
        </div>
      )}

      {/* Step 2: Skills & Interests */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Skills */}
          <div>
            <label className="block font-medium mb-2">Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a skill"
                className="flex-1 p-2 border rounded-lg"
                value={tempInput.skill}
                onChange={(e) =>
                  setTempInput({ ...tempInput, skill: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem("skillsInterests", "skill");
                  }
                }}
              />
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => handleAddItem("skillsInterests", "skill")}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skillsInterests.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem("skillsInterests", "skill", i)
                    }
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block font-medium mb-2">Interests</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter an interest"
                className="flex-1 p-2 border rounded-lg"
                value={tempInput.interest}
                onChange={(e) =>
                  setTempInput({ ...tempInput, interest: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem("skillsInterests", "interest");
                  }
                }}
              />
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => handleAddItem("skillsInterests", "interest")}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skillsInterests.interests.map((s, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem("skillsInterests", "interest", i)
                    }
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Project Info */}
      {step === 3 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Title (Optional)"
            className="w-full p-2 border rounded-lg"
            value={formData.projectInfo.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectInfo: {
                  ...formData.projectInfo,
                  title: e.target.value,
                },
              })
            }
          />
          <input
            type="text"
            placeholder="Project Domain (Optional)"
            className="w-full p-2 border rounded-lg"
            value={formData.projectInfo.domain}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectInfo: {
                  ...formData.projectInfo,
                  domain: e.target.value,
                },
              })
            }
          />
          <textarea
            placeholder="Project Idea (Optional)"
            className="w-full p-2 border rounded-lg h-24"
            value={formData.projectInfo.idea}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectInfo: {
                  ...formData.projectInfo,
                  idea: e.target.value,
                },
              })
            }
          />
          <div>
            <label className="block font-medium mb-2">Tech Stack (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a technology"
                className="flex-1 p-2 border rounded-lg"
                value={tempInput.tech}
                onChange={(e) => setTempInput({ ...tempInput, tech: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem("projectInfo", "tech");
                  }
                }}
              />
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => handleAddItem("projectInfo", "tech")}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.projectInfo.techStack.map((t, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("projectInfo", "tech", i)}
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Your Information</h3>
          <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
            <p><strong>ID:</strong> {formData.personalInfo.id}</p>
            <p><strong>Department:</strong> {formData.personalInfo.department}</p>
            <p><strong>Batch:</strong> {formData.personalInfo.batch}</p>
            <p><strong>Gender:</strong> {formData.personalInfo.gender}</p>
            <p><strong>CGPA:</strong> {formData.personalInfo.cgpa}</p>
            <p><strong>Email:</strong> {formData.personalInfo.email}</p>
            <p><strong>Skills:</strong> {formData.skillsInterests.skills.join(", ")}</p>
            <p><strong>Interests:</strong> {formData.skillsInterests.interests.join(", ")}</p>
            <p><strong>Project Title:</strong> {formData.projectInfo.title || "N/A"}</p>
            <p><strong>Domain:</strong> {formData.projectInfo.domain || "N/A"}</p>
            <p><strong>Idea:</strong> {formData.projectInfo.idea || "N/A"}</p>
            <p><strong>Tech Stack:</strong> {formData.projectInfo.techStack.join(", ") || "N/A"}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg"
            disabled={loading}
          >
            Previous
          </button>
        )}
        {step < 4 && (
          <div className="flex gap-2 ml-auto">
            {step === 3 && (
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    projectInfo: { title: "", domain: "", idea: "", techStack: [] },
                  }) || setStep(4)
                }
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg"
                disabled={loading}
              >
                Skip
              </button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                loading ||
                (step === 1 && !isPersonalInfoValid()) ||
                (step === 2 && !isSkillsInterestsValid())
              }
              className={`px-6 py-2 rounded-lg text-white ${
                (step === 1 && !isPersonalInfoValid()) ||
                (step === 2 && !isSkillsInterestsValid()) ||
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
        {step === 4 && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded-lg ml-auto text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Submit & Find Matches"}
          </button>
        )}
      </div>
    </div>
  );
}