from sqlalchemy.orm import Session

from core.security import create_verification_token
from models.organization import Organization, OrganizationCreate
from services.email import send_verification_email
from utils import convert_enums_to_values


def create_org(db: Session, organization: OrganizationCreate):
    data = organization.model_dump()
    data = convert_enums_to_values(data)
    db_org = Organization(**data)
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    token = create_verification_token(db_org.id)
    send_verification_email(db_org.email, token)
    return db_org
