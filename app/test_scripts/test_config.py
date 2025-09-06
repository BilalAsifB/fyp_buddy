#!/usr/bin/env python3
"""
Configuration Test - Tests if all required environment variables and settings are configured
"""

import sys
from pathlib import Path
from loguru import logger

# Add the src directory to Python path (from test_scripts directory)
sys.path.insert(0, str(Path(__file__).parent.parent))

# Configure logger
logger.remove()
logger.add(sys.stdout, level="INFO")
logger.add("test_config.log", level="DEBUG")


def test_configuration():
    """Test if all required configuration is present"""
    logger.info("🔧 Testing Configuration...")
    
    try:
        from src.agent.config import settings
        
        required_settings = [
            "GROQ_API_KEY",
            "LANGSMITH_API_KEY", 
            "MONGODB_URI",
            "MONGODB_DATABASE_NAME"
        ]
        
        missing_settings = []
        present_settings = []
        
        for setting in required_settings:
            if not hasattr(settings, setting) or not getattr(settings, setting):
                missing_settings.append(setting)
            else:
                present_settings.append(setting)
                # Don't log the actual API key values for security
                if "API_KEY" in setting:
                    logger.info(f"✓ {setting}: [CONFIGURED]")
                else:
                    logger.info(f"✓ {setting}: {getattr(settings, setting)}")
        
        if missing_settings:
            logger.error("❌ Missing required settings:")
            for setting in missing_settings:
                logger.error(f"  • {setting}")
            logger.error("\nPlease check your .env file or environment variables")
            return False
        
        logger.success("✅ All configuration settings are present")
        logger.info(f"Found {len(present_settings)} required settings")
        
        return True
        
    except ImportError as e:
        logger.error(f"❌ Failed to import configuration: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Configuration test failed: {e}")
        return False


if __name__ == "__main__":
    success = test_configuration()
    sys.exit(0 if success else 1)
