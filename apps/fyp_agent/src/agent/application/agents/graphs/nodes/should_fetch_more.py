from agent.domain.match_state import Match_State

from typing import Literal

from loguru import logger


def should_fetch_more(state: Match_State) -> Literal["fetch_more", "extract"]:
    if state.done:
        logger.debug(f"Done: {state.done} -> Returning END.")
        return "end"
    else:
        logger.debug(f"Done: {state.done} -> Returning fetch_data_node.")
        return "extract"
