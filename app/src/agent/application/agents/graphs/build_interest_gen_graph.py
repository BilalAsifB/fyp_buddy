from langgraph.graph import StateGraph
from langsmith import Client
from langchain.callbacks.tracers import LangChainTracer

from src.agent.domain.gen_state import Gen_State
from src.agent.domain.fyp_data import Fyp_data
from src.agent.application.agents.graphs.nodes.generate_interests_node import (
    generate_interests_node
)

from src.agent.config import settings

from loguru import logger


class InterestGraphRunner:
    def __init__(self) -> None:
        self.graph = self.build_graph()

    def build_graph(self) -> StateGraph:
        logger.info("[Graph] Building interest generation graph...")

        builder = StateGraph(Gen_State)

        builder.add_node("generate_interests_node", generate_interests_node)
        builder.set_entry_point("generate_interests_node")
        builder.set_finish_point("generate_interests_node")

        graph = builder.compile()

        return graph

    def generate_interests(self) -> list[Fyp_data]:
        tracer = LangChainTracer(
            project_name=settings.LANGSMITH_PROJECT,
            client=Client(api_key=settings.LANGSMITH_API_KEY)
        )

        initial_state = Gen_State(
            departments=[
                "Artificial Intelligence", "Cyber Security",
                "Computer Science", "Software Engineering", "Data Science"
            ],
            previous_ideas=[],
            yos=[2019, 2020, 2021, 2022],
            all_data=[]
        )

        logger.info("[Graph] Invoking graph...")
        final_state = self.graph.invoke(
            initial_state,
            config={"callbacks": [tracer]}
        )
        final_state = Gen_State(**final_state)
        
        logger.info("[Graph] Graph execution complete.")
        logger.debug(len(final_state.all_data))

        return final_state.all_data


# This is required by langgraph.yaml or langgraph.json to work.
interests_agent = InterestGraphRunner().graph
