from app.models.user import User 

class Person(User):
    def __init__(self, email, password, first_name, name, phone_number, account_type, postal_address,education,skills):
        super().__init__(email, password, first_name, name, phone_number, account_type, postal_address)
        self.education = education
        self.skills = skills

    def get_summary(self):
        return f"{super().get_summary()},{self.name},{self.first_name},{self.phone_number},{self.account_type},{self.postal_address}"
