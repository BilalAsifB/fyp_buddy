# main.py
import os
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import List

# Import your LangGraph graphs
from src.agent.application.agents.graphs.build_proj_gen_graph import projects_agent
from src.agent.application.agents.graphs.build_interest_gen_graph import interests_agent
from src.agent.application.agents.graphs.build_find_match_graph import match_agent

# Import domain models and services
from src.agent.domain.fyp_data import Fyp_data
from src.agent.domain.metadata import Metadata
from src.agent.infrastructure.mongo.service import MongoDBService

# ---------------------------------------------------
# Logging
# ---------------------------------------------------
logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    level=logging.INFO
)
logger = logging.getLogger("langgraph_api")

# ---------------------------------------------------
# FastAPI App
# ---------------------------------------------------
app = FastAPI(
    title="LangGraph API",
    description="API wrapper for LangGraph agents",
    version="1.0.0"
)

# CORS (allow frontend or external clients)
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# Schemas
# ---------------------------------------------------
class ProjectRequest(BaseModel):
    domain: str

class InterestRequest(BaseModel):
    student_id: str
    interests: List[str]

class MatchRequest(BaseModel):
    project_domain: str
    student_interests: List[str]

class MetadataRequest(BaseModel):
    id: str
    department: str
    year: int
    gpa: float
    gender: str
    skills: List[str]
    email: str

class UserIngestionRequest(BaseModel):
    id: str
    title: str
    domain: str
    idea: str
    tech_stack: List[str]
    interests: List[str]
    score: float
    metadata: MetadataRequest

# ---------------------------------------------------
# Routes
# ---------------------------------------------------
@app.get("/")
def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "ok", "service": "LangGraph API"}

@app.post("/generate_project")
async def generate_project(req: ProjectRequest):
    try:
        result = projects_agent.invoke({"domain": req.domain})
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Error in /generate_project: {e}")
        raise HTTPException(status_code=500, detail="Project generation failed")

@app.post("/generate_interests")
async def generate_interests(req: InterestRequest):
    try:
        result = interests_agent.invoke({
            "student_id": req.student_id,
            "interests": req.interests
        })
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Error in /generate_interests: {e}")
        raise HTTPException(status_code=500, detail="Interest generation failed")

@app.post("/find_matches")
async def find_matches(req: MatchRequest):
    try:
        # Create a query object for the match agent
        query_metadata = Metadata(
            id="query_user",
            department="",
            year=0,
            gpa=0.0,
            gender="",
            skills=[],
            email=""
        )
        
        query_data = Fyp_data(
            id="query_user",
            title="",
            domain=req.project_domain,
            idea="",
            tech_stack=[],
            interests=req.student_interests,
            score=0.0,
            metadata=query_metadata
        )
        
        result = match_agent.invoke({
            "query": query_data,
            "all_data": [],
            "done": False,
            "offset": 0,
            "limit": 20,
            "results": {}
        })
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Error in /find_matches: {e}")
        raise HTTPException(status_code=500, detail="Match finding failed")

@app.post("/ingest_user")
async def ingest_user(req: UserIngestionRequest):
    """Ingest user data into MongoDB collection."""
    try:
        # Convert request to Fyp_data model
        metadata = Metadata(
            id=req.metadata.id,
            department=req.metadata.department,
            year=req.metadata.year,
            gpa=req.metadata.gpa,
            gender=req.metadata.gender,
            skills=req.metadata.skills,
            email=req.metadata.email
        )
        
        user_data = Fyp_data(
            id=req.id,
            title=req.title,
            domain=req.domain,
            idea=req.idea,
            tech_stack=req.tech_stack,
            interests=req.interests,
            score=req.score,
            metadata=metadata
        )
        
        # Ingest into MongoDB
        with MongoDBService(
            model=Fyp_data,
            collection_name="std_profiles"
        ) as service:
            service.ingest_documents([user_data])
        
        logger.info(f"Successfully ingested user data for ID: {req.id}")
        return {"success": True, "message": "User data ingested successfully"}
    except Exception as e:
        logger.error(f"Error in /ingest_user: {e}")
        raise HTTPException(status_code=500, detail="User ingestion failed")

@app.get("/stats")
async def get_stats():
    """Get database statistics."""
    try:
        with MongoDBService(
            model=Fyp_data,
            collection_name="std_profiles"
        ) as service:
            count = service.get_collection_count()
        
        return {"success": True, "total_profiles": count}
    except Exception as e:
        logger.error(f"Error in /stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get stats")

# ---------------------------------------------------
# Global error handler (bad JSON, validation, etc.)
# ---------------------------------------------------
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return HTTPException(status_code=422, detail=exc.errors())