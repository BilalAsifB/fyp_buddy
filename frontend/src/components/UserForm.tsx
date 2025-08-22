// src/components/UserForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import type { UserData } from "../types";

const formSchema = z.object({
  project_domain: z.string().min(1, "Project domain is required"),
  student_interests: z.array(z.string()).min(1, "At least one interest is required"),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmit: (data: UserData) => void;
  loading: boolean;
}

const COMMON_DOMAINS = [
  "Artificial Intelligence",
  "Web Development",
  "Mobile Development",
  "Cyber Security",
  "Data Science",
  "Machine Learning",
  "IoT",
  "Blockchain",
  "Game Development",
  "Computer Vision",
  "Natural Language Processing",
  "Software Engineering",
];

const COMMON_INTERESTS = [
  "Machine Learning",
  "Web Development",
  "Mobile Apps",
  "Data Analysis",
  "Cybersecurity",
  "Cloud Computing",
  "IoT",
  "Blockchain",
  "Game Development",
  "AI Research",
  "Database Systems",
  "Network Security",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "Software Architecture",
];

export default function UserForm({ onSubmit, loading }: UserFormProps) {
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_domain: "",
      student_interests: [],
    },
  });

  const watchedDomain = watch("project_domain");

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      setValue("student_interests", updatedInterests);
      setNewInterest("");
    }
  };

  const addCommonInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      const updatedInterests = [...interests, interest];
      setInterests(updatedInterests);
      setValue("student_interests", updatedInterests);
    }
  };

  const removeInterest = (index: number) => {
    const updatedInterests = interests.filter((_, i) => i !== index);
    setInterests(updatedInterests);
    setValue("student_interests", updatedInterests);
  };

  const onFormSubmit = (data: FormData) => {
    onSubmit({
      project_domain: data.project_domain,
      student_interests: interests,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Find Your Perfect Project Match
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Project Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Domain *
          </label>
          <select
            {...register("project_domain")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Select a domain...</option>
            {COMMON_DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          {errors.project_domain && (
            <p className="text-red-500 text-sm mt-1">
              {errors.project_domain.message}
            </p>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Interests *
          </label>

          {/* Current Interests */}
          {interests.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add Custom Interest */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add custom interest..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInterest();
                }
              }}
            />
            <button
              type="button"
              onClick={addInterest}
              disabled={!newInterest.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Common Interests */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Or choose from common interests:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => addCommonInterest(interest)}
                  disabled={interests.includes(interest)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition"
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {errors.student_interests && (
            <p className="text-red-500 text-sm mt-2">
              {errors.student_interests.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || interests.length === 0 || !watchedDomain}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Finding Matches...
            </span>
          ) : (
            "Find Matches"
          )}
        </button>
      </form>
    </div>
  );
}