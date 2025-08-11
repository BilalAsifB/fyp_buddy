from langgraph.graph import StateGraph, END
from langsmith import Client
from langchain.callbacks.tracers import LangChainTracer

from agent.domain.match_state import Match_State
from agent.domain.fyp_data import Fyp_data

from agent.config import settings

from agent.application.agents.graphs.nodes.fetch_data_node import (
    fetch_data_node
)
from agent.application.agents.graphs.nodes.find_connection_node import (
    find_connection_node
)
from agent.application.agents.graphs.nodes.should_fetch_more import (
    should_fetch_more
)
from agent.application.agents.graphs.nodes.extract_top_five_node import (
    extract_top_five_node
)

from loguru import logger


class MatcherGraphRunner():
    def __init__(self) -> None:
        self.graph = self.build_graph()

    def build_graph(self) -> StateGraph:
        logger.info("[Graph] Building match finding graph...")

        builder = StateGraph(Match_State)
        
        builder.add_node("fetch_data_node", fetch_data_node)
        builder.add_node("find_connection_node", find_connection_node)
        builder.add_node("extract_top_five_node", extract_top_five_node)

        builder.set_entry_point("fetch_data_node")
        builder.add_edge("fetch_data_node", "find_connection_node")
        builder.add_conditional_edges(
            "find_connection_node",
            should_fetch_more,
            {
                "extract": "extract_top_five_node",
                "fetch_more": "fetch_data_node"
            }
        )
        builder.set_finish_point("extract_top_five_node")
        
        graph = builder.compile()

        return graph
    
    def find_matches(self, query: Fyp_data) -> Match_State:
        tracer = LangChainTracer(
            project_name=settings.LANGSMITH_PROJECT,
            client=Client(api_key=settings.LANGSMITH_API_KEY)
        )

        initial_state = Match_State(
            all_data=[],
            query=query,
            done=False,
            offset=0,
            limit=20,
            results=[]
        )

        logger.info("[Graph] Invoking graph...")
        final_state = self.graph.invoke(
            initial_state,
            config={"callbacks": [tracer]}
        )
        final_state = Match_State(**final_state)

        logger.info("[Graph] Graph execution complete.")

        return final_state


# This is required by langgraph.yaml or langgraph.json to work.
match_agent = MatcherGraphRunner().graph
