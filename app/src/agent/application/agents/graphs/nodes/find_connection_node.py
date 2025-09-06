from src.agent.domain.match_state import Match_State

import time
import random

from loguru import logger

import groq


def find_connection_node(state: Match_State) -> Match_State:
    chain = state.chain

    input_to_llm = [
        {
            "id": data.id,
            "idea": data.idea,
            "interests": data.interests,
            "tech_stack": data.tech_stack,
            "skills": data.metadata.skills
        }
        for data in state.all_data
    ]
    
    result = {}
    try:
        result = chain.invoke({"input": input_to_llm})
    except groq.InternalServerError as e:
        print("Groq failed:", e)

    logger.debug(f"[Node] Connection finding result: {result}")

    id_score = dict(zip(result['id'], result['score']))
    state.results.update(id_score)

    logger.debug(f"[Node] Results updated with scores: {state.results}")
    
    time.sleep(random.randint(15, 30))  # throttling requests

    return state
