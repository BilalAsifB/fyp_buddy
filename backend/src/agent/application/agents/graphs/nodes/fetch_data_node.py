from loguru import logger

from src.agent.domain.fyp_data import Fyp_data
from src.agent.domain.match_state import Match_State
from src.agent.infrastructure.mongo.service import MongoDBService


def fetch_data_node(state: Match_State) -> Match_State:
    '''
    Fetch fyp data from mongoDB.
    '''
    logger.info("Fetching data from mongoDB collection...")

    with MongoDBService(
        model=Fyp_data,
        collection_name="std_profiles"
    ) as service:
        data = service.fetch_documents(
            limit=state.limit,
            offset=state.offset,
            query={}
        )

    logger.info("Data fetched.")

    if data:
        logger.debug(f"{len(data)} profiles fetched.")

        state.all_data = data
        state.offset += len(data)
        state.done = False
    else:
        logger.debug("No prfiles fetched.")

        state.done = True

    return state
