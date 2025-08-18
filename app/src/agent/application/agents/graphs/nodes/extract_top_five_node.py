from bson import ObjectId
from src.agent.domain.match_state import Match_State
from src.agent.domain.fyp_data import Fyp_data
from src.agent.infrastructure.mongo.service import MongoDBService

from loguru import logger


def extract_top_five_node(state: Match_State) -> Match_State:
    """
    Extracts the top five matches from the Match_State based on their scores.
    """
    # Get top 5 results by score
    top_5 = dict(
        sorted(
            state.results.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]
    )

    logger.info("Extracting top 5 matches...")

    # Convert string IDs to ObjectId
    ids_to_fetch = [ObjectId(i) for i in top_5.keys()]

    with MongoDBService(
        model=Fyp_data,
        collection_name="std_profiles"
    ) as service:
        all_data = service.fetch_documents(
            limit=5,
            offset=0,
            query={"_id": {"$in": ids_to_fetch}}
        )

    # Attach score from top_5 to each fetched record
    for data in all_data:
        data.score = top_5.get(str(data.id), 0)  # Convert back to string for lookup

    state.all_data = all_data
    return state
