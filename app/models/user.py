class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self._password = password  # underscore to hint it's meant to be private

    def check_password(self, password):
        return self._password == password

    def update_email(self, new_email):
        self.email = new_email
        print(f"Email updated to {self.email}")

    def __str__(self):
        return f"User(username={self.username}, email={self.email})"