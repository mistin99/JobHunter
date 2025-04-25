class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self._password = password 

    def get_password(self, password):
        return self._password == password

    def get_email(self, new_email):
        return self.email = new_email)

    def __str__(self):
        return f"User(username={self.username}, email={self.email})"