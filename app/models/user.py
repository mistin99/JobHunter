from abc import ABC
from pydantic import BaseModel
class User(ABC,BaseModel):
    email:str
    password:str
    first_name:str
    name:str
    phone_number:str
    account_type:str
    postal_address:str

    def get_summary(self):
        return f"{self.name},{self.first_name},{self.phone_number},{self.account_type},{self.postal_address}"
