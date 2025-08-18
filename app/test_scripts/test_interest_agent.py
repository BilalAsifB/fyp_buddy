#!/usr/bin/env python3
"""
Interest Generation Agent Test - Tests the interest generation graph
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
logger.add("test_interest_agent.log", level="DEBUG")


def test_interest_generation_agent():
    """Test the interest generation agent"""
    logger.info("💡 Testing Interest Generation Agent...")
    
    try:
        from src.agent.application.agents.graphs.build_interest_gen_graph import InterestGraphRunner
        
        # Initialize the runner
        logger.info("Initializing InterestGraphRunner...")
        runner = InterestGraphRunner()
        logger.info("✓ Interest graph runner initialized")
        
        # Test graph compilation
        if runner.graph is None:
            raise Exception("Graph failed to compile - graph is None")
        logger.info("✓ Graph compiled successfully")
        
        # Test interest generation (this will take some time due to API calls)
        logger.info("Starting interest generation...")
        logger.warning("⏳ This may take several minutes due to API rate limiting...")
        
        interests = runner.generate_interests()
        
        if not interests:
            raise Exception("No interests generated - returned empty list")
        
        logger.info(f"✓ Generated {len(interests)} interest profiles")
        
        # Validate interest structure
        logger.info("Validating interest profile structure...")
        sample_interest = interests[0]
        
        required_fields = ["id", "interests", "metadata"]
        for field in required_fields:
            if not hasattr(sample_interest, field):
                raise Exception(f"Missing required field '{field}' in generated interest profile")
        
        logger.info("✓ Interest profile structure validation passed")
        
        # Validate interests field
        logger.info("Validating interests field...")
        if not isinstance(sample_interest.interests, list):
            raise Exception("Interests field should be a list")
        
        if len(sample_interest.interests) == 0:
            raise Exception("Interests field should not be empty")
        
        # Check that interests are meaningful strings
        for i, interest in enumerate(sample_interest.interests):
            if not isinstance(interest, str) or not interest.strip():
                raise Exception(f"Interest {i} is not a valid string")
        
        logger.info(f"✓ Sample profile has {len(sample_interest.interests)} interests")
        
        # Validate metadata structure
        logger.info("Validating metadata structure...")
        metadata = sample_interest.metadata
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
        
        # Log sample interest profile details
        logger.info("Sample Generated Interest Profile:")
        logger.info(f"  Interests: {', '.join(sample_interest.interests)}")
        logger.info(f"  Department: {sample_interest.metadata.department}")
        logger.info(f"  Year: {sample_interest.metadata.year}")
        logger.info(f"  Skills: {', '.join(sample_interest.metadata.skills[:3])}...")
        logger.info(f"  GPA: {sample_interest.metadata.gpa}")
        
        # Check for variety in generated interests
        all_interests = []
        for profile in interests:
            all_interests.extend(profile.interests)
        
        unique_interests = set(all_interests)
        logger.info(f"✓ Generated {len(unique_interests)} unique interests across all profiles")
        
        # Check departments variety
        departments = [p.metadata.department for p in interests]
        unique_departments = set(departments)
        logger.info(f"✓ Interest profiles span {len(unique_departments)} departments")
        
        # Check that profiles are not identical
        interest_sets = [set(p.interests) for p in interests]
        identical_count = 0
        for i, set1 in enumerate(interest_sets):
            for j, set2 in enumerate(interest_sets[i+1:], i+1):
                if set1 == set2:
                    identical_count += 1
        
        if identical_count > 0:
            logger.warning(f"⚠️  Found {identical_count} pairs of identical interest profiles")
        else:
            logger.info("✓ All interest profiles are unique")
        
        logger.success(f"✅ Interest generation test passed - Generated {len(interests)} valid interest profiles")
        return True
        
    except ImportError as e:
        logger.error(f"❌ Failed to import required modules: {e}")
        logger.error("Make sure all dependencies are installed and paths are correct")
        return False
    except Exception as e:
        logger.error(f"❌ Interest generation test failed: {e}")
        logger.error("Full traceback:")
        logger.error(traceback.format_exc())
        return False


if __name__ == "__main__":
    success = test_interest_generation_agent()
    sys.exit(0 if success else 1)
