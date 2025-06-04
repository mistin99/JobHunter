from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from core.config import settings


def _get_session() -> Session:
    engine_cls = create_engine(
        settings.database_url,
        isolation_level="REPEATABLE READ",
        pool_pre_ping=True,
        pool_recycle=3600,
        connect_args={"max_allowed_packet": 512 * 1024 * 1024},
    )
    session_facotry = sessionmaker(autocommit=False, autoflush=False, bind=engine_cls)
    return session_facotry()


def get_db():
    db = _get_session()
    try:
        yield db
    finally:
        db.close()
