from langgraph.graph import StateGraph
from langsmith import Client
from langchain.callbacks.tracers import LangChainTracer

from agent.domain.match_state import Match_State

from agent.application.agents.graphs.nodes.fetch_data_node import (
    fetch_data_node
)

from loguru import logger


class MatcherGraphRunner():
    def __init__(self) -> None:
        self.graph = self.build_graph()

    def build_graph(self) -> StateGraph:
        logger.info("[Graph] Building match finding graph...")

        builder = StateGraph(Match_State)
        
        builder.add_node("fetch_data_node", fetch_data_node)

