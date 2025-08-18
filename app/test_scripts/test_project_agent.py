#!/usr/bin/env python3
"""
Project Generation Agent Test - Tests the project generation graph
"""

import sys
import traceback
from pathlib import Path
from loguru import logger

# Add the src directory to Python path (from test_scripts directory)
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))


# Configure logger
logger.remove()
logger.add(sys.stdout, level="INFO")
logger.add("test_project_agent.log", level="DEBUG")


def test_project_generation_agent():
    """Test the project generation agent"""
    logger.info("🚀 Testing Project Generation Agent...")
    
    try:
        from src.agent.application.agents.graphs.build_proj_gen_graph import (
            ProjectGraphRunner
        )
        
        # Initialize the runner
        logger.info("Initializing ProjectGraphRunner...")
        runner = ProjectGraphRunner()
        logger.info("✓ Project graph runner initialized")
        
        # Test graph compilation
        if runner.graph is None:
            raise Exception("Graph failed to compile - graph is None")
        logger.info("✓ Graph compiled successfully")
        
        # Test project generation (this will take some time due to API calls)
        logger.info("Starting project generation...")
        logger.warning("⏳ This may take several minutes due to API rate limiting...")
        
        projects = runner.generate_projects()
        
        if not projects:
            raise Exception("No projects generated - returned empty list")
        
        logger.info(f"✓ Generated {len(projects)} projects")
        
        # Validate project structure
        logger.info("Validating project structure...")
        sample_project = projects[0]
        
        required_fields = ["id", "title", "domain", "idea", "tech_stack", "metadata"]
        for field in required_fields:
            if not hasattr(sample_project, field):
                raise Exception(f"Missing required field '{field}' in generated project")
            
            # Check that fields are not empty
            value = getattr(sample_project, field)
            if field in ["title", "domain", "idea"] and (not value or value.strip() == ""):
                raise Exception(f"Field '{field}' is empty in generated project")
        
        logger.info("✓ Project structure validation passed")
        
        # Validate metadata structure
        logger.info("Validating metadata structure...")
        metadata = sample_project.metadata
        required_metadata_fields = ["id", "department", "year", "gpa", "gender", "skills", "email"]
        
        for field in required_metadata_fields:
            if not hasattr(metadata, field):
                raise Exception(f"Missing metadata field '{field}'")
        
        # Validate specific metadata constraints
        if not (2.0 <= metadata.gpa <= 4.0):
            logger.warning(f"⚠️  GPA {metadata.gpa} is outside expected range 2.0-4.0")
        
        if metadata.gender not in ["male", "female"]:
            logger.warning(f"⚠️  Gender '{metadata.gender}' not in expected values")
        
        if not metadata.email.endswith("@nu.edu.pk"):
            logger.warning(f"⚠️  Email '{metadata.email}' doesn't use @nu.edu.pk domain")
        
        logger.info("✓ Metadata structure validation passed")
        
        # Log sample project details
        logger.info("Sample Generated Project:")
        logger.info(f"  Title: {sample_project.title}")
        logger.info(f"  Domain: {sample_project.domain}")
        logger.info(f"  Tech Stack: {', '.join(sample_project.tech_stack[:3])}...")
        logger.info(f"  Department: {sample_project.metadata.department}")
        logger.info(f"  Year: {sample_project.metadata.year}")
        logger.info(f"  GPA: {sample_project.metadata.gpa}")
        
        # Check for variety in generated projects
        titles = [p.title for p in projects]
        unique_titles = set(titles)
        if len(unique_titles) != len(titles):
            logger.warning("⚠️  Some duplicate project titles generated")
        else:
            logger.info("✓ All project titles are unique")
        
        domains = [p.domain for p in projects]
        unique_domains = set(domains)
        logger.info(f"✓ Generated projects span {len(unique_domains)} different domains")
        
        logger.success(f"✅ Project generation test passed - Generated {len(projects)} valid projects")
        return True
        
    except ImportError as e:
        logger.error(f"❌ Failed to import required modules: {e}")
        logger.error("Make sure all dependencies are installed and paths are correct")
        return False
    except Exception as e:
        logger.error(f"❌ Project generation test failed: {e}")
        logger.error("Full traceback:")
        logger.error(traceback.format_exc())
        return False


if __name__ == "__main__":
    success = test_project_generation_agent()
    sys.exit(0 if success else 1)
