import re


def not_empty(value: str) -> str:
    if not value.strip():
        raise ValueError("Field cannot be empty")
    return value


def strong_password(value: str) -> str:
    patterns = [
        len(value) >= 8,
        re.search(r"[A-Z]", value),
        re.search(r"[a-z]", value),
        re.search(r"[\d]", value),
        re.search(r"[\W_]", value),
    ]
    if not all(patterns):
        raise ValueError(
            "Password must be ≥8 chars, with upper, lower, digit, and special char"
        )
    return value
