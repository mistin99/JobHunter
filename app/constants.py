from enum import Enum


class Account_type(str, Enum):
    PERSON = "Person"
    ORGANIZATION = "Organization"


class Account_status(str, Enum):
    VERIFIED = "Verified"
    UNVERIFIED = "Unverified"
