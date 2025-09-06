# main.py
import os
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import List
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

# Import your config
from src.agent.config import settings

# ---------------------------------------------------
# Configure LangSmith Tracing
# ---------------------------------------------------
os.environ["LANGCHAIN_TRACING_V2"] = settings.LANGSMITH_TRACING
os.environ["LANGCHAIN_ENDPOINT"] = settings.LANGSMITH_ENDPOINT
os.environ["LANGCHAIN_API_KEY"] = settings.LANGSMITH_API_KEY
os.environ["LANGCHAIN_PROJECT"] = settings.LANGSMITH_PROJECT

# Import LangGraph chain
from src.agent.application.agents.chains.connection_finding_chain import (
    connection_finding_chain
)

# Import LangGraph graphs
from src.agent.application.agents.graphs.build_proj_gen_graph import projects_agent
from src.agent.application.agents.graphs.build_interest_gen_graph import interests_agent
from src.agent.application.agents.graphs.build_find_match_graph import match_agent

# Import domain models and services
from src.agent.domain.fyp_data import Fyp_data
from src.agent.domain.metadata import Metadata
from src.agent.domain.match_state import Match_State
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

# CORS
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

class MetadataRequest(BaseModel):
    id: str
    department: str
    year: int
    gpa: float
    gender: str
    skills: List[str]
    email: str
class MatchRequest(BaseModel):
    id: str
    title: str
    domain: str
    idea: str
    tech_stack: List[str]
    interests: List[str]
    score: float
    metadata: MetadataRequest


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
@app.get("/", tags=["Health"])
def health_check():
    """Health check endpoint for monitoring."""
    logger.info("✅ Health check called")
    return {"status": "ok", "service": "LangGraph API"}

@app.post("/generate_project", tags=["Projects"])
async def generate_project(req: ProjectRequest):
    try:
        logger.info(f"📥 /generate_project request: {req.json()}")
        result = projects_agent.invoke({"domain": req.domain})
        logger.info(f"📤 /generate_project response: {result}")
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"❌ Error in /generate_project: {e}")
        raise HTTPException(status_code=500, detail="Project generation failed")

@app.post("/generate_interests", tags=["Interests"])
async def generate_interests(req: InterestRequest):
    try:
        logger.info(f"📥 /generate_interests request: {req.json()}")
        result = interests_agent.invoke({
            "student_id": req.student_id,
            "interests": req.interests
        })
        logger.info(f"📤 /generate_interests response: {result}")
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"❌ Error in /generate_interests: {e}")
        raise HTTPException(status_code=500, detail="Interest generation failed")

@app.post("/find_matches", tags=["Matching"])
async def find_matches(req: MatchRequest):
    try:
        logger.info(f"📥 /find_matches request: {req.json()}")

        # Convert request → Fyp_data
        query_metadata = Metadata(**req.metadata.dict())
        query_data = Fyp_data(
            id=req.id,
            title=req.title,
            domain=req.domain,
            idea=req.idea,
            tech_stack=req.tech_stack,
            interests=req.interests,
            score=req.score,
            metadata=query_metadata,
        )

        # logger.debug(query_data)

        # # Call LangGraph agent
        # result = match_agent.invoke({query_data.dict()})
        initial_state = Match_State(
            all_data=[],
            query=query_data,
            done=False,
            offset=0,
            limit=25,
            results={},
            chain=connection_finding_chain()
        )

        result = match_agent.invoke(initial_state)

        matches = result.get("all_data", [])
        logger.info(f"📤 /find_matches response: {matches}")

        matches_json = jsonable_encoder(matches)
        logger.info(f"📤 /find_matches JSON response: {matches_json}")

        return {"success": True, "result": matches_json}
    except Exception as e:
        logger.error(f"❌ Error in /find_matches: {e}")
        raise HTTPException(status_code=500, detail="Match finding failed")

@app.post("/ingest_user", tags=["Users"])
async def ingest_user(req: UserIngestionRequest):
    """Ingest user data into MongoDB collection."""
    try:
        logger.info(f"📥 /ingest_user request: {req.json()}")

        # Convert request → Fyp_data model
        metadata = Metadata(**req.metadata.dict())
        user_data = Fyp_data(
            id=req.id, title=req.title, domain=req.domain,
            idea=req.idea, tech_stack=req.tech_stack,
            interests=req.interests, score=req.score,
            metadata=metadata
        )
        
        with MongoDBService(model=Fyp_data, collection_name="std_profiles") as service:
            service.ingest_documents([user_data])
        
        logger.info(f"✅ Successfully ingested user data for ID: {req.id}")
        return {"success": True, "message": "User data ingested successfully"}
    except Exception as e:
        logger.error(f"❌ Error in /ingest_user: {e}")
        raise HTTPException(status_code=500, detail="User ingestion failed")

@app.get("/stats", tags=["Stats"])
async def get_stats():
    """Get database statistics."""
    try:
        with MongoDBService(model=Fyp_data, collection_name="std_profiles") as service:
            count = service.get_collection_count()
        
        logger.info(f"📊 Stats requested, total profiles = {count}")
        return {"success": True, "total_profiles": count}
    except Exception as e:
        logger.error(f"❌ Error in /stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get stats")

# ---------------------------------------------------
# Global error handler
# ---------------------------------------------------
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    logger.error(f"❌ Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"success": False, "errors": exc.errors()}
    )
