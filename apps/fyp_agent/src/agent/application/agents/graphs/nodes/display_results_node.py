from .....domain.state import State

import numpy as np


def display_results_node(state: State) - > State:
    all_scores = np.array([data.score for data in state.all_data])
    norm = np.linalg.norm(all_scores)
    norm_per_scores = (all_scores / norm) * 100

    for score, data in zip(norm_per_scores, state.all_data):
        data.score = score

    return state
