from langgraph.graph import END

from .fetch_data_node import fetch_data_node
from .display_results_node import display_results_node

from .....domain.state import State


def should_fetch_more(state: State):
    if state.done:
        return display_results_node
    else:
        fetch_data_node
