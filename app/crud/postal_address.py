from sqlalchemy.orm import Session
from app.models.postal_address import PostalAddress,PostalAddressCreate


def create_postal_address(db:Session,address_create:PostalAddressCreate,user_id:int,owner_type:str):
    address = PostalAddress(**address_create.model_dump())
    address.owner_id = user_id
    address.owner_type = owner_type
    db.add(address)
    db.commit()
    db.refresh(address)
    return(address)