from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import DateTime, Column, String, Enum

from .database import Base

def generate_uuid():
    return str(uuid4())

class Validation(Base):
  __tablename__ = 'validations'

  id = Column(String, primary_key=True, index=True, default=generate_uuid)
  status = Column(Enum("VALID", "INVALID", name="validation_status"))
  session_id = Column(String)
  iban = Column(String)
  timestamp = Column(DateTime, default=datetime.now(timezone.utc))