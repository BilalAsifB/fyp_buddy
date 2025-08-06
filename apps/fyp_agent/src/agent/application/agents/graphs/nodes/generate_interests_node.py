from .....utils import generate_random_hex
from .....domain.interests_list import Interests_list
from ...chains.interest_generation_chain import build_interest_generation_chain

from loguru import logger

import time
import random


def generate_interests_node(state: Interests_list) -> Interests_list:
    '''
    Generate 100 unique interests for each student.
    '''
    logger.info("[Node] Generating interests...")

    chain = build_interest_generation_chain()

    for i in range(5):
        logger.debug(f"[Node] Generating batch {i+1}/5")

        result = chain.invoke({
            "departments": state.departments,
            "yos": state.yos
        })

        logger.debug(f"Result of batch {i+1}/5:\n{result}")

        for interest in result["all_interests"]:
            interest["id"] = generate_random_hex(16)
            interest["metadata"]["id"] = generate_random_hex(16)

        state.all_interests.extend(result["all_interests"])

        time.sleep(random.randint(30, 60))  # throttle requests

    logger.info("[Node] Finished generating all interests.")

    return state
