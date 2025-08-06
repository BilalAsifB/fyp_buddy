from zenml import step

from src.agent.application.agents.graphs.build_proj_gen_graph import (
    ProjectGraphRunner,
)
from src.agent.domain.project_info import Project_info


@step(enable_cache=False, name="generate_projects_data")
def generate_projects_data() -> list[Project_info]:
    generator = ProjectGraphRunner()
    projects = generator.generate_projects()

    return projects
