#!/usr/bin/env python3
import sys
import asyncio
import traceback
from loguru import logger
import httpx

AZURE_BACKEND_URL = "https://fyp-backend.ashygrass-953f1123.centralindia.azurecontainerapps.io"

logger.remove()
logger.add(sys.stdout, level="INFO")
logger.add("test_match_agent_azure.log", level="DEBUG")

async def test_match_agent_azure():
    logger.info("🎯 Testing Match Finding Agent on Azure...")

    # Step 0: Redis health check
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            logger.info("🩺 Checking Redis health...")
            health_resp = await client.get(f"{AZURE_BACKEND_URL}/redis_ping")
            health_resp.raise_for_status()
            health_data = health_resp.json()

            if health_data.get("status") != "healthy":
                logger.error(f"❌ Redis unhealthy: {health_data}")
                return False
            else:
                logger.success("✅ Redis is healthy")
    except Exception as e:
        logger.error(f"❌ Redis health check failed: {e}")
        logger.error(traceback.format_exc())
        return False

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

    try:
        async with httpx.AsyncClient(timeout=600) as client:
            # Step 1: enqueue match job
            logger.info("📤 Sending request to /find_matches...")
            response = await client.post(f"{AZURE_BACKEND_URL}/find_matches", json=query_profile)
            response.raise_for_status()
            job_resp = response.json()
            job_id = job_resp["job_id"]
            logger.info(f"✅ Job enqueued with ID {job_id}")

            # Step 2: poll until done (max ~2 minutes)
            for attempt in range(60):
                status_resp = await client.get(f"{AZURE_BACKEND_URL}/find_matches/{job_id}")
                status_resp.raise_for_status()
                status_data = status_resp.json()

                if status_data["status"] == "done":
                    logger.success("✅ Match job finished")
                    result = status_data["result"] or []
                    logger.info(f"Found {len(result)} matches")

                    for i, match in enumerate(result[:3]):
                        score = match.get("score", "N/A")
                        logger.info(f"  {i+1}. {match.get('title')} | Score: {score}")

                    return True

                elif status_data["status"] == "error":
                    raise Exception(f"Job failed: {status_data['error']}")

                logger.info(f"⏳ Still processing... (attempt {attempt+1})")
                await asyncio.sleep(2)

            raise TimeoutError("Job did not complete in time")

    except Exception as e:
        logger.error(f"❌ Test failed: {e}")
        logger.error(traceback.format_exc())
        return False


def main():
    return asyncio.run(test_match_agent_azure())

if __name__ == "__main__":
    sys.exit(0 if main() else 1)
