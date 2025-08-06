from loguru import logger
from pydantic import BaseModel
from zenml.steps import step

from src.agent.infrastructure.mongo.service import MongoDBService


@step
def ingest_to_mongodb(
    models: list[BaseModel],
    collection_name: str,
    clear_collection: bool = True
) -> None:
    """
    Ingests a list of Pydantic models into a MongoDB collection.
    """
    if not models:
        raise ValueError("No documents provided for ingestion")

    model_type = type(models[0])
    logger.info(
        f"Ingesting {len(models)} documents of type '{model_type.__name__}' into MongoDB collection '{collection_name}'"
    )
    with MongoDBService(model=model_type, collection_name=collection_name) as service:
        if clear_collection:
            logger.warning(
                f"'clear_collection' is set to True. Clearing MongoDB collection '{collection_name}' before ingestion."
            )
            service.clear_collection()
        service.ingest_documents(models)

        count = service.get_collection_count()
        logger.info(
            f"Successfully ingested {count} documents into MongoDB collection '{collection_name}'"
        )
