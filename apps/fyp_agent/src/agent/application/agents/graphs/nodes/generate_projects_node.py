from .....utils import generate_random_hex
from .....domain.projects_list import Projects_list
from ...chains.project_generation_chain import build_project_generation_chain

from loguru import logger

import time
import random


def generate_projects_node(state: Projects_list) -> Projects_list:
    '''
    Generate 100 unique project ideas for each student.
    '''
    logger.info("[Node] Generating project ideas...")
    
    chain = build_project_generation_chain()

    for i in range(5):
        logger.debug(f"[Node] Generating batch {i+1}/5")
        
        result = chain.invoke({
            "departments": state.departments,
            "previous_ideas": state.previous_ideas,
            "yos": state.yos
        })

        logger.debug(f"Result of batch {i+1}/5:\n{result}")

        for proj in result["all_projects"]:
            proj["id"] = generate_random_hex(16)
            proj["metadata"]["id"] = generate_random_hex(16)

        state.previous_ideas.extend([proj["title"] for proj in result["all_projects"]])
        state.all_projects.extend(result["all_projects"])

        time.sleep(random.randint(30, 60))  # throttle requests

    logger.info("[Node] Finished generating all project ideas.")

    return state
