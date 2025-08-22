import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
const schema = z.object({
  title: z.string().min(5).max(100).optional(),
  domain: z.string().optional(),
  idea: z.string().min(20).max(250).optional(),
  tech_stack: z.string().optional(),
  interests: z.string().optional(),
  id: z.string().regex(/^\d{2}K-\d{4}$/, "ID must follow format xxK-xxxx"),
  department: z.enum([
    "Computer Science",
    "Software Engineering",
    "Cyber Security",
    "Artificial Intelligence",
    "Data Science",
  ]),
  year: z.coerce.number().int().min(2019).max(2022),
  gpa: z.coerce.number().min(2.0).max(4.0),
  gender: z.enum(["Male", "Female"]),
  skills: z.string().min(1, "Skills are required"),
  email: z
    .string()
    .email("Invalid email format")
    .refine((val) => val.endsWith("@nu.edu.pk"), {
      message: "Email must be an @nu.edu.pk address",
    }),
});

type FormFields = z.infer<typeof schema>;

const commonTech = ["React", "Node.js", "Python", "TensorFlow"];
const commonInterests = ["AI", "Web Development", "Cyber Security", "Data Science"];
const commonSkills = ["C++", "Java", "SQL", "Machine Learning", "Docker"];

const App = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form data:", data);
    } catch (error) {
      setError("email", { type: "manual", message: "An error occurred" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <form
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl space-y-6 border border-gray-200"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-blue-700 tracking-wide">
          FYP BUDDY
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Submit your project and student details
        </p>

        {/* Project Title */}
        <div>
          <label className="form-label">Project Title (optional)</label>
          <input {...register("title")} placeholder="Enter project title" className="form-input" />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        {/* Domain */}
        <div>
          <label className="form-label">Domain (optional)</label>
          <input {...register("domain")} placeholder="E.g. Artificial Intelligence" className="form-input" />
        </div>

        {/* Idea */}
        <div>
          <label className="form-label">Project Idea (optional)</label>
          <textarea
            {...register("idea")}
            placeholder="Describe your project idea (20-250 words)"
            rows={4}
            className="form-input resize-none"
          />
          {errors.idea && <p className="error-text">{errors.idea.message}</p>}
        </div>

        {/* Tech Stack */}
        <div>
          <label className="form-label">Tech Stack (optional)</label>
          <input {...register("tech_stack")} placeholder="React, Node.js, MongoDB" className="form-input" />
          <p className="helper-text">Common: {commonTech.join(", ")}</p>
        </div>

        {/* Interests */}
        <div>
          <label className="form-label">Interests (optional)</label>
          <input {...register("interests")} placeholder="AI, Web Development" className="form-input" />
          <p className="helper-text">Common: {commonInterests.join(", ")}</p>
        </div>

        {/* Student ID */}
        <div>
          <label className="form-label">Student ID</label>
          <input {...register("id")} placeholder="20K-1234" className="form-input" />
          {errors.id && <p className="error-text">{errors.id.message}</p>}
        </div>

        {/* Department */}
        <div>
          <label className="form-label">Department</label>
          <select {...register("department")} className="form-input">
            <option value="">Select Department</option>
            <option>Computer Science</option>
            <option>Software Engineering</option>
            <option>Cyber Security</option>
            <option>Artificial Intelligence</option>
            <option>Data Science</option>
          </select>
          {errors.department && <p className="error-text">{errors.department.message}</p>}
        </div>

        {/* Year */}
        <div>
          <label className="form-label">Year</label>
          <input type="number" {...register("year")} placeholder="2020" className="form-input" />
          {errors.year && <p className="error-text">{errors.year.message}</p>}
        </div>

        {/* GPA */}
        <div>
          <label className="form-label">GPA</label>
          <input type="number" step="0.01" {...register("gpa")} placeholder="3.5" className="form-input" />
          {errors.gpa && <p className="error-text">{errors.gpa.message}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="form-label">Gender</label>
          <select {...register("gender")} className="form-input">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender.message}</p>}
        </div>

        {/* Skills */}
        <div>
          <label className="form-label">Skills</label>
          <input {...register("skills")} placeholder="Java, C++, SQL" className="form-input" />
          <p className="helper-text">Common: {commonSkills.join(", ")}</p>
          {errors.skills && <p className="error-text">{errors.skills.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="form-label">Email</label>
          <input {...register("email")} placeholder="student@nu.edu.pk" className="form-input" />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 shadow-md"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default App;
