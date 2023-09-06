import uvicorn

from typing import Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from fastapi import FastAPI, HTTPException, status, Header, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError

from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from starlette.middleware.base import BaseHTTPMiddleware

from .schemas import IBANModel, ValidationCreate, StatusEnum
from .utils import calculate_check_digits, map_country_chars_to_digits
from .constants import MONTENEGRO_CHECK_DIGITS
from .crud import create_validation, get_validations, count_validations
from .middleware import request_middleware
from .exceptions import http_exception_handler, validation_exception_handler

from .database import SessionLocal

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(BaseHTTPMiddleware, dispatch=request_middleware)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/validations")
async def list_validations(page: int = 1, page_size: int = 12, db: Session = Depends(get_db), x_session_id: Optional[str] = Header(None)):
    if x_session_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Session ID is required")

    validations = get_validations(db, x_session_id, page - 1, page_size)
    count = count_validations(db, x_session_id)
    return JSONResponse(content=jsonable_encoder({ "success": True, "data": validations, "status": status.HTTP_200_OK, "meta": {"count": count, "page": page, "page_size": page_size}}), status_code=status.HTTP_200_OK)

@app.post("/check-iban")
async def check_iban(iban: IBANModel, db: Session = Depends(get_db), x_session_id: Optional[str] = Header(None)):
    if not x_session_id:
        x_session_id = str(uuid4())
    validation_schema = ValidationCreate(session_id=x_session_id, status=StatusEnum.VALID, iban=iban.country_code + str(iban.checksum_digits) + iban.bank_code + iban.account_number + str(iban.national_check_digits))

    calculated_national_digits = 98 - int(calculate_check_digits(iban.bank_code + iban.account_number + "00"))

    if calculated_national_digits != iban.national_check_digits:
        validation_schema.status = StatusEnum.INVALID
        create_validation(db, validation=validation_schema)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="National check digits do not match")

    check_digits_iban = iban.bank_code + iban.account_number + str(iban.national_check_digits) + map_country_chars_to_digits(iban.country_code) + "00"

    calculated_check_digits = 98 - int(calculate_check_digits(check_digits_iban))

    if calculated_check_digits != iban.checksum_digits != MONTENEGRO_CHECK_DIGITS:
        validation_schema.status = StatusEnum.INVALID
        create_validation(db, validation=validation_schema)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Checksum digits do not match")

    validation = create_validation(db, validation=validation_schema)

    return JSONResponse(content=jsonable_encoder({"success": True, "message": "IBAN is valid", "data": validation, "status": status.HTTP_200_OK}), headers={"X-Session-ID": x_session_id}, status_code=status.HTTP_200_OK)


@app.get("/check-iban/{iban}")
async def check_partial_iban(iban: str):
    if not iban:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="IBAN is required")

    if len(iban) > 4:
        if int(iban[2:4]) != MONTENEGRO_CHECK_DIGITS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Checksum digits do not match")

    if len(iban) > 21:
        calculated_national_digits = 98 - int(calculate_check_digits(iban[4:20] + "00"))

        if str(calculated_national_digits) != iban[20:23]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="National check digits do not match")

    if len(iban) != 22:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="IBAN does not have the required length of 22 characters")

    return JSONResponse(content=jsonable_encoder({"success": True, "message": "IBAN is valid", "success": True, "status": status.HTTP_200_OK}), status_code=status.HTTP_200_OK)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)