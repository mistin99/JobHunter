from user import User

class Organization(User):
    def __init__(self, email, password, first_name, name, phone_number, account_type, postal_address,website_url,description):
        super().__init__(email, password, first_name, name, phone_number, account_type, postal_address)
        self.website_url = website_url
        self.description = description