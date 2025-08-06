from .....domain.state import State
from ...chains.connection_finding_chain import connection_finding_chain

from loguru import logger

import time
import random


def find_connection_node(state: State) -> State:
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

    result = chain.invoke({"input": input_to_llm})

    for data in state.all_data:
        data.score = result[data.id]

    time.sleep(random.randint(15, 30)) # throttling requests.    

    return state
