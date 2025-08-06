import random
import string


def generate_random_hex(length: int) -> str:
    """Generate a random hex string of specified length.

    Args:
        length: The desired length of the hex string.

    Returns:
        str: Random hex string of the specified length.
    """

    hex_chars = string.hexdigits.lower()
    return "".join(random.choice(hex_chars) for _ in range(length))
