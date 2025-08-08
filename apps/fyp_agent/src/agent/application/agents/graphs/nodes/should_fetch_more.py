from langgraph.graph import END

from agent.domain.match_state import Match_State

from loguru import logger


def should_fetch_more(state: Match_State):
    if state.done:
        logger.debug(f"Done: {state.done} -> Returning END.")
        return END
    else:
        logger.debug(f"Done: {state.done} -> Returning fetch_data_node.")
        return "fetch_more"
