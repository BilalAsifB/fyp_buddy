from agent.application.agents.graphs.build_find_match_graph import (
    MatcherGraphRunner
)

from agent.domain.fyp_data import Fyp_data
from agent.domain.match_state import Match_State
from agent.domain.metadata import Metadata
from agent.utils import generate_random_hex


if __name__ == "__main__":
    match = MatcherGraphRunner()

    query = Fyp_data(
        id=generate_random_hex(16),
        title="",
        domain="Genetics and AI",
        idea="Developing a deep learning model that detects the chances of offspring inheriting genetic diseases based on parental genetics.",
        tech_stack=[
            "Python",
            "pandas", "numpy", "biopython", "pysam", "scikit-learn",
            "matplotlib", "seaborn", "plotly",
            "plink", "GATK",
            "PyTorch", "optuna", "Ray Tune",
            "FastAPI", "Flask", "Streamlit", "Gradio", "Docker",
            "AWS EC2", "Google Cloud Run", "Azure ML",
            "pydantic", "cryptography"
        ],
        interests=[],
        score=0.0, 
        metadata=Metadata(
            id=generate_random_hex(16),
            department="Artificial Intelligence",
            year=22,
            gpa=3.1,
            gender="Male",
            skills=[
                "Python programming",
                "Data preprocessing",
                "Bioinformatics",
                "Deep learning",
                "Transformers and CNNs",
                "Hyperparameter tuning",
                "Data visualization",
                "API development",
                "Model deployment",
                "Cloud computing"
            ],
            email="xyz@nu.edu.pk"
        )
    )

    result = match.find_matches(query)

    print(result)
