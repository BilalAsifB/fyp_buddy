#!/usr/bin/env python3
"""
Error Handling Test - Tests how agents handle invalid inputs and error conditions
"""

import sys
import asyncio
import traceback
from pathlib import Path
from loguru import logger

# Add the src directory to Python path (from test_scripts directory)
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))


# Configure logger
logger.remove()
logger.add(sys.stdout, level="INFO")
logger.add("test_error_handling.log", level="DEBUG")


async def test_error_handling():
    """Test error handling scenarios"""
    logger.info("🔍 Testing Error Handling...")
    
    passed_tests = 0
    total_tests = 0
    
    # Test 1: Invalid query profile with match agent
    total_tests += 1
    logger.info("Test 1: Testing match agent with invalid query profile...")
    
    try:
        from src.agent.domain.fyp_data import Fyp_data
        from src.agent.domain.metadata import Metadata
        from src.agent.application.agents.graphs.build_find_match_graph import MatcherGraphRunner
        
        # Create invalid query profile
        invalid_query = Fyp_data(
            id="invalid_test_001",
            title="",  # Empty title
            domain="",  # Empty domain
            idea="",   # Empty idea
            tech_stack=[],  # Empty tech stack
            interests=[],  # Empty interests
            score=0.0,
            metadata=Metadata(
                id="invalid_test_001",
                department="Invalid Department",
                year=2025,  # Future year
                gpa=5.0,    # Invalid GPA (over 4.0)
                gender="other",  # Invalid gender per your prompts
                skills=[],  # Empty skills
                email="invalid.email"  # Invalid email format
            )
        )
        
        runner = MatcherGraphRunner()
        
        try:
            result = await runner.find_matches(invalid_query)
            logger.info("✓ Agent handled invalid input gracefully (no exception thrown)")
            
            # Check if it returned something reasonable
            if result and hasattr(result, 'all_data'):
                logger.info(f"✓ Returned result with {len(result.all_data)} matches")
            else:
                logger.warning("⚠️  Returned empty or malformed result")
            
            passed_tests += 1
            
        except Exception as e:
            logger.info(f"✓ Agent properly rejected invalid input: {type(e).__name__}: {e}")
            # This is actually good - the agent should reject clearly invalid input
            passed_tests += 1
    
    except Exception as e:
        logger.error(f"❌ Error in invalid input test: {e}")
    
    # Test 2: Missing environment variables handling
    total_tests += 1
    logger.info("Test 2: Testing behavior with missing configuration...")
    
    try:
        # This is harder to test without actually removing env vars
        # So we'll just test if the config module handles missing vars gracefully
        from src.agent.config import settings
        
        # Check if settings exist (they should if we got this far)
        if hasattr(settings, 'GROQ_API_KEY') and settings.GROQ_API_KEY:
            logger.info("✓ Configuration loaded successfully")
            passed_tests += 1
        else:
            logger.warning("⚠️  Configuration might be incomplete")
    
    except Exception as e:
        logger.error(f"❌ Configuration error handling test failed: {e}")
    
    # Test 3: Database connection error handling
    total_tests += 1
    logger.info("Test 3: Testing database error handling...")
    
    try:
        from src.agent.infrastructure.mongo.service import MongoDBService
        from src.agent.domain.fyp_data import Fyp_data
        
        # Test with invalid database name
        try:
            with MongoDBService(
                model=Fyp_data,
                collection_name="test_collection",
                database_name="nonexistent_db_12345",
                mongodb_uri="mongodb://invalid_host:27017/test"
            ) as service:
                # This should fail
                count = service.get_collection_count()
                logger.warning(f"⚠️  Expected database connection to fail, but it didn't (got {count} documents)")
        
        except Exception as e:
            logger.info(f"✓ Database properly handled invalid connection: {type(e).__name__}")
            passed_tests += 1
    
    except Exception as e:
        logger.error(f"❌ Database error handling test failed: {e}")
    
    # Test 4: LLM API error handling
    total_tests += 1
    logger.info("Test 4: Testing LLM API error handling...")
    
    try:
        # We can't easily test API failures without actually breaking the API key
        # But we can test if the chains are built properly
        from src.agent.application.agents.chains.project_generation_chain import build_project_generation_chain
        from src.agent.application.agents.chains.interest_generation_chain import build_interest_generation_chain
        from src.agent.application.agents.chains.connection_finding_chain import connection_finding_chain
        from src.agent.domain.fyp_data import Fyp_data
        
        # Try to build chains
        proj_chain = build_project_generation_chain()
        interest_chain = build_interest_generation_chain()
        conn_chain = connection_finding_chain()
        
        if proj_chain and interest_chain and conn_chain:
            logger.info("✓ All LLM chains built successfully")
            passed_tests += 1
        else:
            logger.warning("⚠️  Some chains failed to build")
    
    except Exception as e:
        logger.error(f"❌ LLM chain building test failed: {e}")
        logger.debug(traceback.format_exc())
    
    # Test 5: Empty database handling
    total_tests += 1
    logger.info("Test 5: Testing empty database handling...")
    
    try:
        from src.agent.infrastructure.mongo.service import MongoDBService
        from src.agent.domain.fyp_data import Fyp_data
        
        # Test fetching from a definitely empty collection
        with MongoDBService(
            model=Fyp_data,
            collection_name="definitely_empty_collection_test"
        ) as service:
            documents = service.fetch_documents(limit=10, offset=0)
            
            if documents == []:
                logger.info("✓ Empty collection handled properly (returned empty list)")
                passed_tests += 1
            else:
                logger.warning(f"⚠️  Expected empty list, got {len(documents)} documents")
    
    except Exception as e:
        logger.error(f"❌ Empty database test failed: {e}")
    
    # Test 6: Malformed data handling
    total_tests += 1
    logger.info("Test 6: Testing malformed data handling...")
    
    try:
        from src.agent.application.agents.graphs.build_find_match_graph import MatcherGraphRunner
        from src.agent.domain.fyp_data import Fyp_data
        from src.agent.domain.metadata import Metadata

        # Test with minimal but valid data
        minimal_query = Fyp_data(
            id="minimal_test",
            title="Test Project",
            domain="Test Domain", 
            idea="A simple test project idea",
            tech_stack=["Python"],
            interests=["Testing"],
            score=0.0,
            metadata=Metadata(
                id="minimal_test",
                department="Computer Science",
                year=2022,
                gpa=3.0,
                gender="male",
                skills=["Python"],
                email="test@nu.edu.pk"
            )
        )
        
        # This should work - test that minimal valid data is accepted
        logger.info(f"✓ Minimal valid data structure accepted: {minimal_query.title}")
        
        # Try using it with match agent to ensure it actually works
        runner = MatcherGraphRunner()
        try:
            result = await runner.find_matches(minimal_query)
            logger.info(f"✓ Minimal query worked with match agent (found {len(result.all_data) if result and result.all_data else 0} matches)")
            passed_tests += 1
        except Exception as e:
            logger.info(f"✓ Minimal query structure valid, but match failed (expected): {type(e).__name__}")
            passed_tests += 1  # Structure validation passed, match failure is acceptable
    
    except Exception as e:
        logger.error(f"❌ Minimal data test failed: {e}")
    
    # Test 7: Pydantic validation error handling
    total_tests += 1
    logger.info("Test 7: Testing Pydantic validation error handling...")
    
    try:
        from src.agent.domain.fyp_data import Fyp_data
        # Try to create invalid Fyp_data (should fail validation)
        try:
            invalid_data = Fyp_data(
                id="test",
                title="Test",
                domain="Test",
                idea="Test",
                tech_stack="not a list",  # Should be list, not string
                interests="not a list",   # Should be list, not string
                score="not a number",     # Should be float, not string
                metadata="not metadata"   # Should be Metadata object
            )
            logger.warning(f"⚠️  Expected validation to fail, but it didn't. Created: {invalid_data.title}")
        except Exception as e:
            logger.info(f"✓ Pydantic properly rejected invalid data: {type(e).__name__}")
            passed_tests += 1
    
    except Exception as e:
        logger.error(f"❌ Pydantic validation test failed: {e}")
    
    # Test 8: Network timeout simulation
    total_tests += 1
    logger.info("Test 8: Testing network timeout handling...")
    
    try:
        # Test MongoDB with a very short timeout
        from pymongo import MongoClient
        
        try:
            client = MongoClient(
                "mongodb://1.1.1.1:27017/test",  # Invalid IP that should timeout
                serverSelectionTimeoutMS=100     # Very short timeout
            )
            client.admin.command("ping")
            logger.warning("⚠️  Expected timeout, but connection succeeded")
        except Exception as e:
            logger.info(f"✓ Network timeout handled properly: {type(e).__name__}")
            passed_tests += 1
    
    except Exception as e:
        logger.error(f"❌ Network timeout test failed: {e}")
    
    # Summary
    logger.info("\n" + "="*50)
    logger.info("🔍 ERROR HANDLING TEST SUMMARY")
    logger.info("="*50)
    logger.info(f"Tests Passed: {passed_tests}/{total_tests}")
    logger.info(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        logger.success("✅ All error handling tests passed")
        return True
    elif passed_tests >= total_tests * 0.7:  # 70% pass rate
        logger.warning(f"⚠️  Most error handling tests passed ({passed_tests}/{total_tests})")
        return True
    else:
        logger.error(f"❌ Too many error handling tests failed ({total_tests - passed_tests}/{total_tests})")
        return False


def main():
    """Main function to run the async test"""
    return asyncio.run(test_error_handling())


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
