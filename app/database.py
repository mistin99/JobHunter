from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

def get_engine():
    try:
        return create_engine(settings.database_url)
    except Exception as e:
        print("DB Error:", e)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()