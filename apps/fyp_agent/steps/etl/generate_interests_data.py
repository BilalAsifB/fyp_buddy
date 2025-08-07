from zenml import step

from src.agent.application.agents.graphs.build_interest_gen_graph import (
    InterestGraphRunner,
)
from src.agent.domain.fyp_data import Fyp_data


@step(enable_cache=False, name="generate_interests_data")
def generate_interests_data() -> list[Fyp_data]:
    generator = InterestGraphRunner()
    interests = generator.generate_interests()

    return interests
