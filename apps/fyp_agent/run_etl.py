# apps/med_llm_offline/run_etl.py

import yaml
from pathlib import Path
from pydantic import BaseModel

from pipelines.etl import etl_pipeline

CONFIG_PATH = Path(__file__).parent / "configs" / "etl.yaml"


class ETLConfig(BaseModel):
    projects_data_collection_name: str  
    interests_data_collection_name: str
    clear_collection: bool


def load_config(path: Path) -> ETLConfig:
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    return ETLConfig(**data["parameters"])


if __name__ == "__main__":
    config = load_config(CONFIG_PATH)

    etl_pipeline(
        projects_data_collection_name=config.projects_data_collection_name,
        interests_data_collection_name=config.interests_data_collection_name,
        clear_collection=config.clear_collection
    )
