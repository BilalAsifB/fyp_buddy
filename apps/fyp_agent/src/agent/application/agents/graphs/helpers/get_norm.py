import numpy as np


def get_norm(vals: list) -> float:
    arr_vals = np.array(vals)
    return float(np.linalg.norm(arr_vals))
