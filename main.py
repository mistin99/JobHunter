from fastapi import FastAPI
from app.models.person import Person

app = FastAPI()


@app.get("/")
def read_root():
    person = Person(
        email="mistin@abv.bg",
        password="test",
        first_name="Mistin",
        name="Mistinov",
        phone_number="0898866826",
        postal_address="test",
        account_type="Person",
        education="basic",
        skills="None",
    )
    return person
