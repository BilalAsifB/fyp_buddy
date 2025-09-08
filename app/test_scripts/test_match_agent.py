#!/usr/bin/env python3
"""
Match Finding Agent Test - Tests the match finding graph
"""

import sys
import asyncio
import traceback
from pathlib import Path
from loguru import logger

# Add the src directory to Python path (from test_scripts directory)
sys.path.insert(0, str(Path(__file__).parent.parent))


# Configure logger
logger.remove()
logger.add(sys.stdout, level="INFO")
logger.add("test_match_agent.log", level="DEBUG")


async def test_match_agent():
    """Test the match finding agent"""
    logger.info("🎯 Testing Match Finding Agent...")
    
    try:
        from src.agent.domain.fyp_data import Fyp_data
        from src.agent.domain.metadata import Metadata
        from src.agent.application.agents.graphs.build_find_match_graph import MatcherGraphRunner
        
        # Create a sample query profile
        logger.info("Creating sample query profile...")
        query_profile = Fyp_data(
            id="22K-4114",
            title="AI-Powered Healthcare Diagnosis System",
            domain="Healthcare AI",
            idea="Develop an AI system that can assist doctors in diagnosing diseases from medical imaging and patient symptoms using machine learning algorithms and computer vision techniques.",
            tech_stack=["Python", "TensorFlow", "OpenCV", "Flask", "MongoDB"],
            interests=["Artificial Intelligence", "Healthcare", "Machine Learning", "Computer Vision"],
            score=0.0,  # Will be ignored in matching
            metadata=Metadata(
                id="22K-4114",
                department="Artificial Intelligence", 
                year=2022,
                gpa=3.5,
                gender="female",
                skills=["Python", "Machine Learning", "Deep Learning", "TensorFlow", "OpenCV"],
                email="test.query@nu.edu.pk"
            )
        )
        
        logger.info("✓ Sample query profile created")
        logger.info(f"  Query Title: {query_profile.title}")
        logger.info(f"  Query Domain: {query_profile.domain}")
        logger.info(f"  Query Interests: {', '.join(query_profile.interests)}")
        
        # Initialize the runner
        logger.info("Initializing MatcherGraphRunner...")
        runner = MatcherGraphRunner()
        logger.info("✓ Match graph runner initialized")
        
        # Test graph compilation
        if runner.graph is None:
            raise Exception("Graph failed to compile - graph is None")
        logger.info("✓ Graph compiled successfully")
        
        # Test match finding
        logger.info("Starting match finding...")
        logger.warning("⏳ This may take some time due to database queries and API calls...")
        
        result = await runner.find_matches(query_profile)
        
        if not result:
            raise Exception("No match result returned")
        
        logger.info("✓ Match finding completed")
        
        # Validate result structure
        if not hasattr(result, 'all_data'):
            raise Exception("Result missing 'all_data' field")
        
        if not hasattr(result, 'results'):
            raise Exception("Result missing 'results' field")
        
        if not result.all_data:
            logger.warning("⚠️  No matches found")
            logger.warning("   This might be due to:")
            logger.warning("   - Empty database (run project/interest generation first)")
            logger.warning("   - No similar profiles in database")
            logger.warning("   - Issues with the matching algorithm")
            
            # Check if database has data
            from src.agent.infrastructure.mongo.service import MongoDBService
            with MongoDBService(
                model=Fyp_data,
                collection_name="std_profiles"
            ) as service:
                count = service.get_collection_count()
                logger.info(f"   Database has {count} profiles to match against")
            
            if count == 0:
                logger.error("❌ Database is empty - cannot test matching")
                return False
            else:
                logger.info("✅ Match agent ran successfully (no matches found, but this is not an error)")
                return True
        
        matches = result.all_data
        logger.info(f"✓ Found {len(matches)} matches")
        
        # Validate match structure
        logger.info("Validating match results...")
        for i, match in enumerate(matches):
            # Check basic fields
            required_fields = ["id", "title", "domain", "idea", "metadata"]
            for field in required_fields:
                if not hasattr(match, field):
                    raise Exception(f"Match {i} missing required field '{field}'")
            
            # Check if score was assigned
            if hasattr(match, 'score'):
                logger.info(f"  Match {i+1}: {match.title} (Score: {match.score:.2f})")
            else:
                logger.warning(f"  Match {i+1}: {match.title} (No score assigned)")
        
        logger.info("✓ Match structure validation passed")
        
        # Validate scoring
        scored_matches = [m for m in matches if hasattr(m, 'score')]
        if scored_matches:
            scores = [m.score for m in scored_matches]
            avg_score = sum(scores) / len(scores)
            max_score = max(scores)
            min_score = min(scores)
            
            logger.info(f"✓ Score statistics:")
            logger.info(f"  Average: {avg_score:.2f}")
            logger.info(f"  Range: {min_score:.2f} - {max_score:.2f}")
            
            # Check if scores are in reasonable range
            if any(score < 0 or score > 5 for score in scores):
                logger.warning("⚠️  Some scores are outside expected range 0-5")
            
            # Check if matches are sorted by score (should be descending)
            if scores == sorted(scores, reverse=True):
                logger.info("✓ Matches are properly sorted by score")
            else:
                logger.warning("⚠️  Matches are not sorted by score")
        
        # Log top matches
        logger.info("Top Matches:")
        for i, match in enumerate(matches[:3]):  # Show top 3
            score = getattr(match, 'score', 'N/A')
            logger.info(f"  {i+1}. {match.title}")
            logger.info(f"     Domain: {match.domain}")
            logger.info(f"     Score: {score}")
            if hasattr(match, 'interests'):
                common_interests = set(query_profile.interests) & set(match.interests)
                if common_interests:
                    logger.info(f"     Shared interests: {', '.join(common_interests)}")
        
        logger.success(f"✅ Match finding test passed - Found {len(matches)} matches")
        return True
        
    except ImportError as e:
        logger.error(f"❌ Failed to import required modules: {e}")
        logger.error("Make sure all dependencies are installed and paths are correct")
        return False
    except Exception as e:
        logger.error(f"❌ Match finding test failed: {e}")
        logger.error("Full traceback:")
        logger.error(traceback.format_exc())
        return False


def main():
    """Main function to run the async test"""
    return asyncio.run(test_match_agent())


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
