from loguru import logger

from zenml import pipeline

from steps.etl import (
    generate_projects_data,
    generate_interests_data,
)

from steps.infrastructure import (
    ingest_to_mongodb,
)


@pipeline(name="etl_pipeline")
def etl_pipeline(
    fyp_data_collection_name: str,
    clear_collection: bool,
):
    """
    ETL pipeline that generates data, creates matches, and ingests them into
    MongoDB.
    """
    logger.info("Starting ETL pipeline...")

    logger.info("Generating synthetic student profiles data...")
    projects_data = generate_projects_data()

    logger.info("Ingesting data into MongoDB...")
    ingest_to_mongodb(
        models=projects_data,
        collection_name=fyp_data_collection_name,
        clear_collection=clear_collection,
    )

    logger.info("Generating synthetic student interests data...")
    interests_data = generate_interests_data()

    logger.info("Ingesting data into MongoDB...")
    ingest_to_mongodb(
        models=interests_data,
        collection_name=fyp_data_collection_name,
        clear_collection=False  # append
    )

