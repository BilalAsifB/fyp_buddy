// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// App Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'FYP Student Matcher',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Find your perfect FYP team members',
}

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  MATCHING: {
    FIND: '/api/v1/matching/find',
    VALIDATE: '/api/v1/matching/validate',
    RATE_LIMIT: '/api/v1/matching/rate-limit',
    STATS: '/api/v1/matching/stats',
  },
}

// Form Constants
export const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Artificial Intelligence',
  'Data Science',
  'Cyber Security',
  'Information Technology',
  'Computer Engineering',
  'Electrical Engineering',
]

export const YEARS = [
  { value: 19, label: '2019' },
  { value: 20, label: '2020' },
  { value: 21, label: '2021' },
  { value: 22, label: '2022' },
  { value: 23, label: '2023' },
  { value: 24, label: '2024' },
  { value: 25, label: '2025' },
]

export const GENDERS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
]

export const COMMON_DOMAINS = [
  'Web Development',
  'Mobile App Development',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Analytics',
  'Cybersecurity',
  'Internet of Things (IoT)',
  'Blockchain Technology',
  'Cloud Computing',
  'Game Development',
  'Computer Vision',
  'Natural Language Processing',
  'Robotics',
  'DevOps & Infrastructure',
  'UI/UX Design',
  'Database Systems',
  'Network Security',
  'Software Testing & QA',
  'Embedded Systems',
  'Virtual Reality & Augmented Reality',
  'Distributed Systems',
]

export const COMMON_TECHNOLOGIES = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript',
  'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'Dart', 'C', 'Assembly',
  
  // Web Technologies
  'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'Next.js', 'Nuxt.js', 'Svelte', 'FastAPI', 'Laravel', 'Ruby on Rails',
  
  // Mobile Development
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin', 'Ionic', 'Cordova',
  
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'Firebase',
  'Oracle', 'SQL Server', 'DynamoDB', 'Neo4j',
  
  // Cloud & DevOps
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
  'Terraform', 'Ansible', 'Chef', 'Puppet',
  
  // AI/ML
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'Keras',
  'Hugging Face', 'LangChain', 'NLTK', 'spaCy',
  
  // Other Tools
  'Git', 'Linux', 'Nginx', 'Apache', 'Elasticsearch', 'RabbitMQ', 'Kafka',
  'GraphQL', 'REST APIs', 'Microservices', 'Socket.io', 'WebRTC',
]

export const COMMON_SKILLS = [
  // Programming Skills
  'Frontend Development', 'Backend Development', 'Full-Stack Development', 'Mobile Development',
  'Database Design', 'API Development', 'System Architecture', 'Code Review',
  
  // Specialized Skills
  'Machine Learning', 'Data Analysis', 'Data Visualization', 'Deep Learning',
  'Computer Vision', 'Natural Language Processing', 'Cybersecurity', 'Penetration Testing',
  'Network Administration', 'Cloud Architecture', 'DevOps', 'CI/CD',
  
  // Soft Skills
  'Project Management', 'Team Leadership', 'Agile Methodology', 'Scrum',
  'Problem Solving', 'Technical Writing', 'Code Documentation', 'Testing & QA',
  'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research',
]

export const COMMON_INTERESTS = [
  // Technical Interests
  'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision',
  'Natural Language Processing', 'Robotics', 'IoT Projects', 'Blockchain Development',
  'Cybersecurity', 'Ethical Hacking', 'Web Development', 'Mobile Apps',
  'Game Development', 'AR/VR Development', 'Cloud Computing', 'DevOps',
  
  // Domain Interests
  'Healthcare Technology', 'Fintech', 'E-commerce', 'Education Technology',
  'Social Media', 'Environmental Tech', 'Smart Cities', 'Agriculture Tech',
  'Sports Analytics', 'Music Technology', 'Travel & Tourism', 'Real Estate Tech',
  
  // Research Areas
  'Human-Computer Interaction', 'Software Engineering', 'Distributed Systems',
  'Database Systems', 'Information Security', 'Network Protocols',
  'Algorithm Design', 'Data Structures', 'System Performance', 'Scalability',
]

// Validation Constants
export const VALIDATION_RULES = {
  IDEA_MIN_LENGTH: 50,
  IDEA_MAX_LENGTH: 1000,
  TITLE_MAX_LENGTH: 200,
  DOMAIN_MIN_LENGTH: 3,
  DOMAIN_MAX_LENGTH: 100,
  TECH_STACK_MIN: 1,
  TECH_STACK_MAX: 25,
  INTERESTS_MAX: 20,
  SKILLS_MIN: 1,
  SKILLS_MAX: 20,
  GPA_MIN: 2.0,
  GPA_MAX: 4.0,
}

// UI Constants
export const TOAST_CONFIG = {
  position: 'top-right',
  duration: 5000,
  style: {
    background: '#fff',
    color: '#1e293b',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
  },
}

export const LOADING_MESSAGES = [
  'Searching for your perfect matches...',
  'Analyzing student profiles...',
  'Finding compatible team members...',
  'Processing your requirements...',
  'Almost there...',
]

// Rate Limiting
export const RATE_LIMIT = {
  DAILY_LIMIT: 5,
  WARNING_THRESHOLD: 3,
}

// Match Score Ranges
export const SCORE_RANGES = {
  EXCELLENT: { min: 4.0, max: 5.0, color: 'success', label: 'Excellent Match' },
  GOOD: { min: 3.0, max: 3.9, color: 'primary', label: 'Good Match' },
  FAIR: { min: 2.0, max: 2.9, color: 'warning', label: 'Fair Match' },
  POOR: { min: 0, max: 1.9, color: 'error', label: 'Poor Match' },
}

export const getScoreInfo = (score) => {
  for (const [key, range] of Object.entries(SCORE_RANGES)) {
    if (score >= range.min && score <= range.max) {
      return range
    }
  }
  return SCORE_RANGES.POOR
}
