from enum import Enum

class Account_type(str,Enum):
    PERSON = "Person"
    ORGANIZATION = "Organization"