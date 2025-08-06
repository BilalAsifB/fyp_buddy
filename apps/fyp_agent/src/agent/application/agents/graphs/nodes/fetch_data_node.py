from loguru import logger

from .....domain.fyp_data import Fyp_data
from .....domain.state import State
from .....infrastructure.mongo.service import MongoDBService


def fetch_data_node(state: State) -> State:
    '''
    Fetch fyp data from mongoDB.
    '''
    logger.info("Fetching data from mongoDB collection in bacthes of 20.")

    with MongoDBService(
        model=Fyp_data,
        collection_name="all_fyp_data"
    ) as service:
        data = service.fetch_documents(limit=10, query={})

    logger.info("Data fetched.")

    if data:
        logger.debug(f"{len(data)} profiles fetched.")

        state.all_data = data
        state.done = False
    else:
        logger.debug("No prfiles fetched.")

        state.done = True

    return state
