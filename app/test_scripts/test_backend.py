#!/usr/bin/env python3
"""
Match Finding Agent Test - Tests the match finding endpoint on Azure
"""

import sys
import asyncio
import traceback
from pathlib import Path
from loguru import logger
import httpx

# Configure logger
logger.remove()
logger.add(sys.stdout, level="INFO")
logger.add("test_match_agent_azure.log", level="DEBUG")

# Change this to your Azure backend URL
AZURE_BACKEND_URL = "https://fyp-backend.ashygrass-953f1123.centralindia.azurecontainerapps.io/find_matches"


async def test_match_agent_azure():
    """Test the match finding agent on Azure deployment"""
    logger.info("🎯 Testing Match Finding Agent on Azure...")

    try:
        # Sample query profile (same structure as your local Fyp_data model)
        query_profile = {
            "id": "22K-4114",
            "title": "AI-Powered Healthcare Diagnosis System",
            "domain": "Healthcare AI",
            "idea": "Develop an AI system that can assist doctors in diagnosing diseases from medical imaging and patient symptoms using machine learning algorithms and computer vision techniques.",
            "tech_stack": ["Python", "TensorFlow", "OpenCV", "Flask", "MongoDB"],
            "interests": ["Artificial Intelligence", "Healthcare", "Machine Learning", "Computer Vision"],
            "score": 0.0,
            "metadata": {
                "id": "22K-4114",
                "department": "Artificial Intelligence",
                "year": 2022,
                "gpa": 3.5,
                "gender": "female",
                "skills": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "OpenCV"],
                "email": "test.query@nu.edu.pk"
            }
        }

        logger.info("Sending request to Azure backend...")
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(AZURE_BACKEND_URL, json=query_profile)

        if response.status_code != 200:
            raise Exception(f"Backend returned status {response.status_code}: {response.text}")

        result = response.json()
        logger.info("✓ Response received from Azure backend")

        # Validate response structure
        if "all_data" not in result:
            raise Exception("Response missing 'all_data' field")

        if "results" not in result:
            raise Exception("Response missing 'results' field")

        matches = result["all_data"]
        if not matches:
            logger.warning("⚠️ No matches found")
            return True

        logger.info(f"✓ Found {len(matches)} matches")

        # Log top matches
        logger.info("Top Matches:")
        for i, match in enumerate(matches[:3]):  # Show top 3
            score = match.get("score", "N/A")
            logger.info(f"  {i+1}. {match.get('title')}")
            logger.info(f"     Domain: {match.get('domain')}")
            logger.info(f"     Score: {score}")
            if "interests" in match:
                common_interests = set(query_profile["interests"]) & set(match["interests"])
                if common_interests:
                    logger.info(f"     Shared interests: {', '.join(common_interests)}")

        logger.success(f"✅ Match finding test passed - Found {len(matches)} matches")
        return True

    except Exception as e:
        logger.error(f"❌ Match finding test failed: {e}")
        logger.error("Full traceback:")
        logger.error(traceback.format_exc())
        return False


def main():
    """Main function to run the async test"""
    return asyncio.run(test_match_agent_azure())


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
