from abc import ABC

class User(ABC):
    def __init__(self,email,password,first_name,name,phone_number,account_type,postal_address):
        self.email = email
        self.password = password
        self.first_name = first_name
        self.name = name
        self.phone_number = phone_number
        self.account_type = account_type
        self.postal_address = postal_address

    
    def get_summary(self):
        return f"{self.name},{self.first_name},{self.phone_number},{self.account_type},{self.postal_address}"
