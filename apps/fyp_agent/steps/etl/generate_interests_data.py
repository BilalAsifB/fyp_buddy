from zenml import step

from src.agent.application.agents.graphs.build_interest_gen_graph import (
    InterestGraphRunner,
)
from src.agent.domain.interest_info import Interest_info


@step(enable_cache=False, name="generate_interests_data")
def generate_interests_data() -> list[Interest_info]:
    generator = InterestGraphRunner()
    interests = generator.generate_interests()

    return interests
