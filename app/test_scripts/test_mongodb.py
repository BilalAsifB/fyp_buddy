#!/usr/bin/env python3
"""
MongoDB Test - Tests MongoDB connection and data availability
"""

import sys
from pathlib import Path

# Add the src directory to Python path (from test_scripts directory)
sys.path.insert(0, str(Path(__file__).parent.parent))

from loguru import logger

# Configure logger
logger.remove()
logger.add(sys.stdout, level="INFO")
logger.add("test_mongodb.log", level="DEBUG")


def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    logger.info("🗄️  Testing MongoDB Connection...")
    
    try:
        from src.agent.domain.fyp_data import Fyp_data
        from src.agent.infrastructure.mongo.service import MongoDBService
        
        # Test basic connection with a test collection
        logger.info("Testing basic MongoDB connection...")
        with MongoDBService(
            model=Fyp_data,
            collection_name="test_connection"
        ) as service:
            count = service.get_collection_count()
            logger.info(f"✓ Connected to MongoDB successfully")
            logger.info(f"✓ Test collection has {count} documents")
        
        # Test std_profiles collection (required for match agent)
        logger.info("Checking std_profiles collection...")
        with MongoDBService(
            model=Fyp_data,
            collection_name="std_profiles"
        ) as profiles_service:
            profile_count = profiles_service.get_collection_count()
            logger.info(f"✓ std_profiles collection has {profile_count} documents")
            
            if profile_count == 0:
                logger.warning("⚠️  std_profiles collection is empty")
                logger.warning("   Match agent may not find any matches")
                logger.warning("   Consider running project/interest generation first")
            else:
                # Test fetching a sample document
                logger.info("Testing document retrieval...")
                sample_docs = profiles_service.fetch_documents(limit=1, offset=0)
                if sample_docs:
                    sample = sample_docs[0]
                    logger.info(f"✓ Sample document structure valid")
                    logger.debug(f"Sample title: {sample.title}")
                    logger.debug(f"Sample domain: {sample.domain}")
                else:
                    logger.warning("⚠️  Could not retrieve sample documents")
        
        logger.success("✅ MongoDB connection test passed")
        return True
        
    except ImportError as e:
        logger.error(f"❌ Failed to import required modules: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ MongoDB connection test failed: {e}")
        logger.debug(f"Full error: {type(e).__name__}: {e}")
        return False


if __name__ == "__main__":
    success = test_mongodb_connection()
    sys.exit(0 if success else 1)
