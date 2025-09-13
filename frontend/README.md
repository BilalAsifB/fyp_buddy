# FYP BUDDY - Frontend

A React-based web application that helps university students find project partners for their Final Year Projects (FYP) by matching them based on skills, interests, and project preferences.

## 🚀 Features

- **Multi-step Form**: Intuitive 4-step registration process
- **Personal Information**: Capture student ID, department, batch, CGPA, and contact details
- **Skills & Interests**: Dynamic skill and interest tagging system
- **Project Information**: Optional project details including title, domain, idea, and tech stack
- **Smart Matching**: AI-powered partner matching based on compatibility
- **Real-time Validation**: Form validation with visual feedback
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **Linting**: ESLint with React hooks support
- **Development**: Hot Module Replacement (HMR)

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Backend API running (see environment configuration)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The application uses environment variables for API configuration:
   
   - **Development**: Uses `.env.development` (API at `http://localhost:8000`)
   - **Production**: Uses `.env.production` (API at Azure Container Apps)
   
   Create your own `.env.local` if you need custom configuration:
   ```bash
   VITE_API_BASE_URL=your_api_endpoint_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── favicon.ico               # App favicon
│   ├── apple-touch-icon.png     # iOS icon
│   └── site.webmanifest         # PWA manifest
├── src/
│   ├── components/
│   │   └── UserForm.jsx         # Main form component
│   ├── assets/
│   │   └── react.svg           # React logo
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Global styles
│   ├── main.jsx               # Application entry point
│   ├── index.css              # Tailwind imports
│   └── config.js              # API configuration
├── .env.development           # Development environment variables
├── .env.production           # Production environment variables
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── eslint.config.js         # ESLint configuration
```

## 🎯 How It Works

### 1. Personal Information Step
- **Student ID**: Validates format (e.g., 22K-1234)
- **Department**: Dropdown with CS-related departments
- **Batch Year**: Validates against current year constraints
- **CGPA**: Range validation (2.0 - 4.0)
- **Email**: Must end with @nu.edu.pk

### 2. Skills & Interests Step
- **Dynamic Tags**: Add/remove skills and interests
- **Real-time Updates**: Instant visual feedback
- **Minimum Requirement**: At least one skill and interest required

### 3. Project Information Step (Optional)
- **Project Title**: Optional project name
- **Domain**: Project category/field
- **Project Idea**: Detailed description
- **Tech Stack**: Technologies to be used

### 4. Review & Submit
- **Data Validation**: Final review of all information
- **API Integration**: Submits data and finds matches
- **Results Display**: Shows compatible partners with contact details

## 🔌 API Integration

The frontend communicates with a backend API through two main endpoints:

### POST `/ingest_user`
Registers the user in the system with their profile information.

### POST `/find_matches`
Finds compatible project partners based on the user's profile.

**Request Payload Structure**:
```javascript
{
  id: "22K-1234",
  title: "Project Title",
  domain: "AI/ML",
  idea: "Project description...",
  tech_stack: ["Python", "React", "MongoDB"],
  interests: ["Machine Learning", "Web Development"],
  score: 0.0,
  metadata: {
    id: "22K-1234",
    department: "Computer Science",
    year: 2022,
    gpa: 3.5,
    gender: "male",
    skills: ["JavaScript", "Python"],
    email: "student@nu.edu.pk"
  }
}
```

## 🎨 UI/UX Features

- **Progress Indicator**: Visual step tracker
- **Validation Feedback**: Real-time form validation
- **Loading States**: User feedback during API calls
- **Error Handling**: Graceful error display
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Semantic HTML and keyboard navigation

## 🚀 Deployment

### Development Deployment
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
- **Development**: Automatically uses `localhost:8000`
- **Production**: Points to Azure Container Apps endpoint
- **Custom**: Create `.env.local` for custom configuration

## 🔍 Validation Rules

| Field | Rule |
|-------|------|
| Student ID | Must match pattern `##[A-Z]-####` |
| Department | Must be from predefined list |
| Batch Year | Must be within valid range (current year - 3 to 6) |
| CGPA | Must be between 2.0 and 4.0 |
| Email | Must end with `@nu.edu.pk` |
| Skills | At least one skill required |
| Interests | At least one interest required |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m "Add feature description"`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

**API Connection Issues**
- Verify the backend API is running
- Check the `VITE_API_BASE_URL` environment variable
- Ensure CORS is configured on the backend

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for ESLint errors: `npm run lint`
- Verify all dependencies are installed

**Development Server Issues**
- Port 5173 might be in use, Vite will auto-assign a new port
- Clear browser cache and hard refresh
- Check console for JavaScript errors

## 📱 Browser Support

- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

## 📄 License
This project is licensed under the [MIT License](./LICENSE) © 2025 Bilal Asif Burney.

## 👨‍💻 Developer

**Developed by:** Bilal Asif Burney  
**Email:** bilalburney14@gmail.com  
**GitHub:** [Your GitHub Profile]

This project helps university students find compatible partners for their Final Year Projects through intelligent matching algorithms.

---

**Need Help?** Check the console for detailed error messages or create an issue in the repository.
