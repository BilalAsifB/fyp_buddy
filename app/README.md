# FYP BUDDY - Backend

A FastAPI-powered backend system that uses LangGraph agents and AI to match university students for Final Year Projects (FYP) based on their skills, interests, and project ideas.

## 🚀 Features

- **AI-Powered Matching**: Uses LLM-based agents to find compatible project partners
- **Async Job Processing**: Background job queue with Redis for long-running match operations
- **Project Generation**: AI-generated project ideas tailored to different CS domains
- **Interest Profiling**: Generate student interest profiles for better matching
- **MongoDB Integration**: Scalable document storage for student profiles and projects
- **LangSmith Tracing**: Comprehensive monitoring and debugging of AI agent workflows
- **Docker Support**: Full containerization with multi-stage builds
- **Health Monitoring**: Built-in health checks and Redis connectivity testing

## 🛠️ Tech Stack

- **API Framework**: FastAPI 0.116.1+ with async support
- **AI/ML**: LangChain 0.3.27+, LangGraph 0.3.34+, Groq LLM
- **Database**: MongoDB with PyMongo 4.13.2+
- **Queue**: Redis 6.4.0+ with RQ 2.6.0+ for background jobs
- **Monitoring**: LangSmith integration for AI workflow tracing
- **Containerization**: Docker with multi-stage builds
- **Python**: 3.12+ with Pydantic for data validation

## 📋 Prerequisites

- **Python**: 3.12 or higher
- **MongoDB**: Local instance or Atlas connection
- **Redis**: Local instance or cloud Redis
- **API Keys**: Groq and LangSmith accounts

## 🔧 Installation & Setup

### 1. Clone and Setup Environment

```bash
git clone <repository-url>
cd app/
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```bash
# Required API Keys
GROQ_API_KEY=your_groq_api_key_here
LANGSMITH_API_KEY=your_langsmith_api_key_here

# MongoDB Configuration  
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fyp_buddy
MONGODB_DATABASE_NAME=fyp_buddy

# Redis Configuration (for Docker)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# CORS (comma-separated)
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

### 3. Dependencies Installation

Using pip:
```bash
pip install -r pyproject.toml
```

Or using uv (faster):
```bash
pip install uv
uv pip install -r pyproject.toml
```

### 4. Database Setup

Ensure MongoDB is running and accessible. The application will create collections automatically.

## 🚀 Running the Application

### Local Development

```bash
# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Or using the provided script
python main.py
```

API will be available at: `http://localhost:8000`

### Docker Development

```bash
# Start all services (API + Redis)
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Production Docker

```bash
# Build optimized production image
docker build -t fyp-backend .

# Run with environment variables
docker run -p 8000:8000 --env-file .env fyp-backend
```

## 📚 API Documentation

### Core Endpoints

| Endpoint | Method | Purpose | Duration |
|----------|--------|---------|-----------|
| `/` | GET | Health check | Instant |
| `/generate_project` | POST | Generate AI project ideas | 30s-2m |
| `/generate_interests` | POST | Generate student interest profiles | 30s-2m |
| `/find_matches` | POST | Queue match-finding job | Instant |
| `/find_matches/{job_id}` | GET | Get match results | Instant |
| `/ingest_user` | POST | Add user to database | < 1s |
| `/stats` | GET | Get database statistics | < 1s |
| `/redis_ping` | GET | Test Redis connectivity | < 1s |

### Interactive Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔄 Workflow Overview

### 1. User Registration Flow
```
Frontend → /ingest_user → MongoDB → Success Response
```

### 2. Match Finding Flow
```
Frontend → /find_matches → Redis Queue → Background Processing → /find_matches/{job_id} → Results
```

### 3. AI Generation Flow
```
API Request → LangGraph Agent → LLM (Groq) → Generated Data → Database Storage
```

## 🏗️ Architecture

### Core Components

```
├── main.py                      # FastAPI application entry point
├── src/agent/
│   ├── config.py               # Environment configuration
│   ├── domain/                 # Pydantic models & schemas
│   │   ├── fyp_data.py        # Main student/project data model
│   │   ├── metadata.py        # Student metadata model
│   │   └── match_state.py     # Graph state for matching
│   ├── application/agents/
│   │   ├── chains/            # LLM chain definitions
│   │   ├── graphs/            # LangGraph workflow definitions
│   │   └── prompts/           # LangSmith prompt management
│   └── infrastructure/
│       └── mongo/             # MongoDB service layer
└── test_scripts/              # Comprehensive test suite
```

### LangGraph Agents

1. **Project Generation Agent** (`projects_agent`)
   - Generates creative FYP project ideas
   - Creates realistic student profiles
   - Ensures domain coherence and feasibility

2. **Interest Generation Agent** (`interests_agent`) 
   - Generates student interest profiles
   - Focuses on project domains and technologies
   - Creates diverse, realistic preferences

3. **Match Finding Agent** (`match_agent`)
   - Analyzes compatibility between students
   - Scores matches on 5 criteria (0-5 scale)
   - Returns ranked list of potential partners

## 📊 Data Models

### Student Profile (`Fyp_data`)
```python
{
  "id": "22K-1234",
  "title": "AI Healthcare Diagnosis System",
  "domain": "Healthcare AI", 
  "idea": "Detailed project description...",
  "tech_stack": ["Python", "TensorFlow", "Flask"],
  "interests": ["AI", "Healthcare", "Machine Learning"],
  "score": 3.5,
  "metadata": {
    "department": "Artificial Intelligence",
    "year": 2022,
    "gpa": 3.5,
    "gender": "female",
    "skills": ["Python", "ML", "Deep Learning"],
    "email": "student@nu.edu.pk"
  }
}
```

### Match Request Format
```python
{
  "id": "22K-4114",
  "title": "Project Title",
  "domain": "Project Domain",
  "idea": "Project description",
  "tech_stack": ["Python", "React"],
  "interests": ["Web Dev", "AI"],
  "score": 0.0,
  "metadata": {
    "id": "22K-4114",
    "department": "Computer Science",
    "year": 2022,
    "gpa": 3.5,
    "gender": "male", 
    "skills": ["JavaScript", "Python"],
    "email": "student@nu.edu.pk"
  }
}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|-----------|
| `GROQ_API_KEY` | Groq LLM API key | - | Yes |
| `LANGSMITH_API_KEY` | LangSmith tracing key | - | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/fyp_buddy` | Yes |
| `MONGODB_DATABASE_NAME` | Database name | `fyp_buddy` | No |
| `REDIS_HOST` | Redis hostname | `localhost` | No |
| `REDIS_PORT` | Redis port | `6379` | No |
| `REDIS_PASSWORD` | Redis password | - | No |
| `CORS_ORIGINS` | Allowed origins for CORS | `*` | No |

### LangSmith Configuration

```bash
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_PROJECT=fyp-agent-api
```

## 🧪 Testing

### Run Complete Test Suite

```bash
cd test_scripts/
python run_all_tests.py
```

### Individual Tests

```bash
# Test configuration
python test_config.py

# Test database connectivity  
python test_mongodb.py

# Test AI agents (takes longer)
python test_project_agent.py
python test_interest_agent.py
python test_match_agent.py

# Test error handling
python test_error_handling.py

# Test deployed backend
python test_backend.py
```

### Expected Results
- **100% pass rate** = System fully operational
- **80%+ pass rate** = Minor issues, mostly functional
- **<80% pass rate** = Major issues requiring attention

## 🚀 Deployment

### Local Development
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Docker Compose (Recommended)
```bash
docker-compose up --build
```

### Production Deployment
```bash
# Build production image
docker build -t fyp-backend .

# Deploy to cloud platform
# (Azure Container Apps, AWS ECS, etc.)
```

### Azure Container Apps
The application is configured for Azure Container Apps deployment with:
- Health checks on `/redis_ping`
- Multi-stage Docker builds for optimization
- Redis integration for job queuing

## 📈 Performance & Monitoring

### Response Times
- **Health checks**: < 100ms
- **User ingestion**: < 1s
- **Match job queuing**: < 500ms
- **Match processing**: 2-10 minutes (background)
- **AI generation**: 5-15 minutes (background)

### Monitoring
- **LangSmith**: AI agent execution tracing
- **Health endpoints**: System status monitoring
- **Redis metrics**: Job queue monitoring
- **MongoDB metrics**: Database performance

### Scalability
- **Async processing**: Non-blocking API operations
- **Job queues**: Horizontal scaling of AI workloads
- **Connection pooling**: Efficient database usage
- **Stateless design**: Easy horizontal scaling

## 🐛 Troubleshooting

### Common Issues

**API Key Errors**
```bash
Missing required settings: ['GROQ_API_KEY']
```
- Check `.env` file exists and contains all required keys

**Database Connection**
```bash
pymongo.errors.ServerSelectionTimeoutError
```
- Verify MongoDB is running and URI is correct
- Check network connectivity and firewall settings

**Redis Connection**
```bash
redis.exceptions.ConnectionError
```
- Ensure Redis is running on specified host/port
- Check Redis password if authentication is enabled

**Import Errors**
```bash
ModuleNotFoundError: No module named 'src'
```
- Run from `app/` directory
- Ensure `PYTHONPATH` includes the app directory

**Rate Limiting**
```bash
groq.RateLimitError: Rate limit exceeded
```
- AI operations include automatic delays
- Consider upgrading Groq API plan for higher limits

### Debug Mode

Enable detailed logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Health Checks

```bash
# Basic health
curl http://localhost:8000/

# Database stats
curl http://localhost:8000/stats

# Redis connectivity
curl http://localhost:8000/redis_ping
```

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Developer

**Developed by:** Bilal Asif Burney  
**Email:** bilalburney14@gmail.com

This system helps university students find compatible partners for their Final Year Projects through intelligent AI-powered matching.

---

**Need Help?** 
- Check the comprehensive test suite for system validation
- Review individual log files for detailed error information
