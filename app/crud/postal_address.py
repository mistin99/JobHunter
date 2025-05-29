from sqlalchemy.orm import Session

from models.postal_address import PostalAddress, PostalAddressCreate


def create_postal_address(
    db: Session, address: PostalAddressCreate, user_id: int
):
    address = PostalAddress(**address.model_dump())
    address.owner_id = user_id
    db.add(address)
    db.commit()
    db.refresh(address)
    return address
