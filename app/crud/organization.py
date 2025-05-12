from sqlalchemy.orm import Session
from app.models.organization import Organization,OrganizationCreate

def create_org(db: Session, organization_create: OrganizationCreate):
    organization = Organization(**organization_create.model_dump())
    db.add(organization)
    db.commit()
    db.refresh(organization)
    return organization