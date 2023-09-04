from pydantic import BaseModel, Field, field_validator

from .constants import MONTENEGRO_COUNTRY_CODE, MONTENEGRO_CHECK_DIGITS

class IBANModel(BaseModel):
  country_code: str = Field(title="Country code")
  checksum_digits: int = Field(title="Checksum digits")
  bank_code: str = Field(title="Bank code", pattern=r'[0-9]{3}')
  account_number: str = Field(title="Account number", min_length=13, max_length=13, pattern=r'[0-9]{13}')
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

