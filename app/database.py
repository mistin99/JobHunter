from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from core.config import settings


def _get_session() -> Session:
    engine_cls = create_engine(settings.database_url, isolation_level="REPEATABLE READ")
    session_facotry = sessionmaker(autocommit=False, autoflush=False, bind=engine_cls)
    return session_facotry()


def get_db():
    db = _get_session()
    try:
        yield db
    finally:
        db.close()
