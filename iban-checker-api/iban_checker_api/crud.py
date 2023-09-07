from sqlalchemy.orm import Session

from . import models, schemas

def get_validations(db: Session, session_id: str, skip: int = 0, limit: int = 6):
  return db.query(models.Validation).filter(models.Validation.session_id == session_id).offset(skip * limit).limit(limit).all()

def count_validations(db: Session, session_id: str):
  return db.query(models.Validation).filter(models.Validation.session_id == session_id).count()

def create_validation(db: Session, validation: schemas.ValidationCreate):
  db_validation = models.Validation(**validation.model_dump())
  db.add(db_validation)
  db.commit()
  db.refresh(db_validation)
  return db_validation