from langgraph.graph import StateGraph
from langsmith import Client
from langchain.callbacks.tracers import LangChainTracer

from ....domain.projects_list import Projects_list
from ....domain.project_info import Project_info
from .nodes.generate_projects_node import (
    generate_projects_node
)

from ....config import settings

from loguru import logger


class ProjectGraphRunner:
    def __init__(self) -> None:
        self.graph = self.build_graph()
    
    def build_graph(self) -> StateGraph:
        logger.info("[Graph] Building project generation graph...")

        builder = StateGraph(Projects_list)

        builder.add_node("generate_projects_node", generate_projects_node)
        builder.set_entry_point("generate_projects_node")
        builder.set_finish_point("generate_projects_node")

        graph = builder.compile()

        return graph

    def generate_projects(self) -> list[Project_info]:
        tracer = LangChainTracer(
            project_name=settings.LANGSMITH_PROJECT,
            client=Client(api_key=settings.LANGSMITH_API_KEY)
        )

        initial_state = Projects_list(
            departments=[
                "Artificial Intelligence", "Cyber Security",
                "Computer Science", "Software Engineering", "Data Science"
            ],
            previous_ideas=[],
            yos=[2019, 2020, 2021, 2022],
            all_projects=[]
        )

        logger.info("[Graph] Invoking graph...")
        final_state = self.graph.invoke(initial_state, config={"callbacks": [tracer]})
        final_state = Projects_list(**final_state)
        
        logger.info("[Graph] Graph execution complete.")
        logger.debug(len(final_state.all_projects))

        return final_state.all_projects


# This is required by langgraph.yaml or langgraph.json to work.
projects_agent = ProjectGraphRunner().graph
