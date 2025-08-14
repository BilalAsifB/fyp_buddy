from src.agent.domain.match_state import Match_State

from typing import Literal

from loguru import logger


def should_fetch_more(state: Match_State) -> Literal["fetch_more", "extract"]:
    if state.done:
        logger.debug(f"Done: {state.done} -> Returning extract.")
        return "extract"
    else:
        logger.debug(f"Done: {state.done} -> Returning fetch_more.")
        return "fetch_more"
