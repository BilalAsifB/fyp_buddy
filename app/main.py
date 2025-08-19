# main.py
import os
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError

# Import your LangGraph graphs
from src.agent.application.agents.graphs.build_proj_gen_graph import projects_agent
from src.agent.application.agents.graphs.build_interest_gen_graph import interests_agent
from src.agent.application.agents.graphs.build_find_match_graph import match_agent

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
    interests: list[str]

class MatchRequest(BaseModel):
    project_domain: str
    student_interests: list[str]

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
        result = match_agent.invoke({
            "project_domain": req.project_domain,
            "student_interests": req.student_interests
        })
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Error in /find_matches: {e}")
        raise HTTPException(status_code=500, detail="Match finding failed")

# ---------------------------------------------------
# Global error handler (bad JSON, validation, etc.)
# ---------------------------------------------------
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return HTTPException(status_code=422, detail=exc.errors())
