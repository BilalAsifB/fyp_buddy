from agent.domain.match_state import Match_State
from agent.application.agents.chains.connection_finding_chain import (
    connection_finding_chain
)

import time
import random

import groq


def find_connection_node(state: Match_State) -> Match_State:
    chain = connection_finding_chain()

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

    for data in state.all_data:
        if data.id in result:
            data.score = result[data.id]
        else:
            data.score = 0.0

    time.sleep(random.randint(15, 30))  # throttling requests

    return state
