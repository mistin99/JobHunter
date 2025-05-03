from fastapi import FastAPI
from app.models.person import Person
import mysql.connector

db = mysql.connector.connect(
    host="localhost", user="mistin", password="Creedforce!@3", database="users"
)

app = FastAPI()


@app.get("/")
def read_root():
    mycurser = db.cursor()
    mycurser.execute("SHOW DATABASES")

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
    list = []
    for database in mycurser:
        list.append(database)
    return list
