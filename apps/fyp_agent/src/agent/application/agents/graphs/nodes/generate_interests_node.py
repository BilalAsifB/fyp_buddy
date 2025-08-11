from agent.utils import generate_random_hex
from agent.domain.gen_state import Gen_State
from agent.application.agents.chains.interest_generation_chain import (
    build_interest_generation_chain,
)

from loguru import logger

import time
import random


def generate_interests_node(state: Gen_State) -> Gen_State:
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

        for interest in result["all_data"]:
            id = generate_random_hex(16)
            interest["id"] = id
            interest["metadata"]["id"] = id

        state.all_data.extend(result["all_data"])

        time.sleep(random.randint(30, 60))  # throttle requests

    logger.info("[Node] Finished generating all interests.")

    return state
