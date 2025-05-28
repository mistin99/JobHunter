from enum import Enum
from typing import Any


def convert_enums_to_values(data: dict[str, Any]) -> dict[str, str]:
    for key, value in data.items():
        if isinstance(value, Enum):
            data[key] = value.value
    return data
