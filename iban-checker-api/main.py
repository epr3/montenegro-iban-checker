from fastapi import FastAPI, HTTPException

from iban_checker_api.requests import IBANModel
from iban_checker_api.utils import calculate_check_digits, map_country_chars_to_digits
from iban_checker_api.constants import MONTENEGRO_CHECK_DIGITS

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/check-iban")
def check_iban(iban: IBANModel):
    calculated_national_digits = 98 - int(calculate_check_digits(iban.bank_code + iban.account_number + "00"))

    if calculated_national_digits != iban.national_check_digits:
        raise HTTPException(status_code=400, detail="National check digits do not match")

    check_digits_iban = iban.bank_code + iban.account_number + str(iban.national_check_digits) + map_country_chars_to_digits(iban.country_code) + "00"

    calculated_check_digits = 98 - int(calculate_check_digits(check_digits_iban))

    if calculated_check_digits != iban.checksum_digits != MONTENEGRO_CHECK_DIGITS:
        raise HTTPException(status_code=400, detail="Checksum digits do not match")

    return iban