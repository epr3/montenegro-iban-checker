from enum import Enum

from pydantic import BaseModel, Field, field_validator

from .constants import MONTENEGRO_COUNTRY_CODE, MONTENEGRO_CHECK_DIGITS


class StatusEnum(str, Enum):
  VALID = "VALID"
  INVALID = "INVALID"


class ValidationBase(BaseModel):
  session_id: str = Field(title="Session ID")
  status: StatusEnum = Field(title="Status")
  iban: str = Field(title="IBAN")

class ValidationCreate(ValidationBase):
  pass

class Validation(ValidationBase):
  id: str
  timestamp: str

  class Config:
      orm_mode = True

class IBANModel(BaseModel):
  country_code: str = Field(title="Country code")
  checksum_digits: int = Field(title="Checksum digits")
  bank_code: str = Field(title="Bank code", pattern=r'[0-9]{3}')
  account_number: str = Field(title="Account number", pattern=r'[0-9]{13}')
  national_check_digits: int = Field(title="National check digits", gt=10)

  @field_validator("country_code")
  @classmethod
  def ensure_montenegro_country_code(cls, value: str):
      if value != MONTENEGRO_COUNTRY_CODE:
        raise ValueError("input must be ME")
      return value

  @field_validator("checksum_digits")
  @classmethod
  def ensure_checksum_digits(cls, value: int):
      if value != MONTENEGRO_CHECK_DIGITS:
        raise ValueError("input must be 25")
      return value

