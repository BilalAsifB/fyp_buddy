import React, { useState } from "react";

export default function UserForm() {
  const currentYear = new Date().getFullYear();

  const [step, setStep] = useState(1);
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

  // Validation checks
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
      batch <= currentYear &&
      batch >= currentYear - 3 &&
      gender &&
      parseFloat(cgpa) >= 2.0 &&
      parseFloat(cgpa) <= 4.0 &&
      emailRegex.test(email)
    );
  };

  const isSkillsInterestsValid = () => {
    return formData.skillsInterests.skills.length > 0 && formData.skillsInterests.interests.length > 0;
  };

  const handleAddItem = (field, type) => {
    if (tempInput[type].trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type + "s"]: [...prev[field][type + "s"], tempInput[type].trim()],
      },
    }));
    setTempInput({ ...tempInput, [type]: "" });
  };

  const handleRemoveItem = (field, type, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type + "s"]: prev[field][type + "s"].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Final Submitted Data:", formData);
    alert("Form submitted! Check console for output.");
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="flex justify-between mb-6">
        {["Personal Info", "Skills & Interests", "Project Info", "Review"].map((label, index) => (
          <div
            key={index}
            className={`flex-1 text-center py-2 rounded-lg text-sm font-medium ${
              step === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {label}
          </div>
        ))}
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
              setFormData({ ...formData, personalInfo: { ...formData.personalInfo, id: e.target.value } })
            }
          />
          <select
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.department}
            onChange={(e) =>
              setFormData({ ...formData, personalInfo: { ...formData.personalInfo, department: e.target.value } })
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
              setFormData({ ...formData, personalInfo: { ...formData.personalInfo, batch: e.target.value } })
            }
          />
          <select
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.gender}
            onChange={(e) =>
              setFormData({ ...formData, personalInfo: { ...formData.personalInfo, gender: e.target.value } })
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
              setFormData({ ...formData, personalInfo: { ...formData.personalInfo, cgpa: e.target.value } })
            }
          />
          <input
            type="email"
            placeholder="Email (must end with @nu.edu.pk)"
            className="w-full p-2 border rounded-lg"
            value={formData.personalInfo.email}
            onChange={(e) =>
              setFormData({ ...formData, personalInfo: { ...formData.personalInfo, email: e.target.value } })
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
                onChange={(e) => setTempInput({ ...tempInput, skill: e.target.value })}
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
                  <button type="button" onClick={() => handleRemoveItem("skillsInterests", "skill", i)}>
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
                onChange={(e) => setTempInput({ ...tempInput, interest: e.target.value })}
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
                  <button type="button" onClick={() => handleRemoveItem("skillsInterests", "interest", i)}>
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
            placeholder="Project Title"
            className="w-full p-2 border rounded-lg"
            value={formData.projectInfo.title}
            onChange={(e) =>
              setFormData({ ...formData, projectInfo: { ...formData.projectInfo, title: e.target.value } })
            }
          />
          <input
            type="text"
            placeholder="Project Domain"
            className="w-full p-2 border rounded-lg"
            value={formData.projectInfo.domain}
            onChange={(e) =>
              setFormData({ ...formData, projectInfo: { ...formData.projectInfo, domain: e.target.value } })
            }
          />
          <textarea
            placeholder="Project Idea"
            className="w-full p-2 border rounded-lg"
            value={formData.projectInfo.idea}
            onChange={(e) =>
              setFormData({ ...formData, projectInfo: { ...formData.projectInfo, idea: e.target.value } })
            }
          />
          {/* Tech stack input */}
          <div>
            <label className="block font-medium mb-2">Tech Stack</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a technology"
                className="flex-1 p-2 border rounded-lg"
                value={tempInput.tech}
                onChange={(e) => setTempInput({ ...tempInput, tech: e.target.value })}
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
                  <button type="button" onClick={() => handleRemoveItem("projectInfo", "tech", i)}>
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
            <p><strong>Project Title:</strong> {formData.projectInfo.title}</p>
            <p><strong>Domain:</strong> {formData.projectInfo.domain}</p>
            <p><strong>Idea:</strong> {formData.projectInfo.idea}</p>
            <p><strong>Tech Stack:</strong> {formData.projectInfo.techStack.join(", ")}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg"
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
              >
                Skip
              </button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              disabled={(step === 1 && !isPersonalInfoValid()) || (step === 2 && !isSkillsInterestsValid())}
              className={`px-6 py-2 rounded-lg text-white ${
                (step === 1 && !isPersonalInfoValid()) || (step === 2 && !isSkillsInterestsValid())
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg ml-auto"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
