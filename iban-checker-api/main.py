import uvicorn
import sys
from uuid import uuid4

import loguru

from fastapi import FastAPI, HTTPException
from fastapi import status, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from iban_checker_api.schemas import IBANModel
from iban_checker_api.utils import calculate_check_digits, map_country_chars_to_digits
from iban_checker_api.constants import MONTENEGRO_CHECK_DIGITS

app = FastAPI()
logger = loguru.logger
logger.remove()
logger.add(sys.stdout, format="{time} - {level} - ({extra[request_id]}) {message} ", level="DEBUG")

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

@app.middleware("http")
async def request_middleware(request, call_next):
    request_id = str(uuid4())
    with logger.contextualize(request_id=request_id):
        logger.info("Request started")
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        logger.info("Request ended")
        return response


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(content=jsonable_encoder({"message": str(exc.detail), "request_id": request.state.request_id, "success": False, "error": "internal_server_error", "status": exc.status_code }), status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    formatted_messages = []
    for message in exc.errors():
        formatted_messages.append(f"{message['loc'][1]}: {message['msg']}")
    return JSONResponse(content=jsonable_encoder({"message": formatted_messages, "request_id": request.state.request_id, "success": False, "error": "validation_error", "status": status.HTTP_422_UNPROCESSABLE_ENTITY}), status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/check-iban")
def check_iban(iban: IBANModel, request: Request):
    calculated_national_digits = 98 - int(calculate_check_digits(iban.bank_code + iban.account_number + "00"))

    if calculated_national_digits != iban.national_check_digits:
        raise HTTPException(status_code=400, detail="National check digits do not match")

    check_digits_iban = iban.bank_code + iban.account_number + str(iban.national_check_digits) + map_country_chars_to_digits(iban.country_code) + "00"

    calculated_check_digits = 98 - int(calculate_check_digits(check_digits_iban))

    if calculated_check_digits != iban.checksum_digits != MONTENEGRO_CHECK_DIGITS:
        raise HTTPException(status_code=400, detail="Checksum digits do not match")

    return JSONResponse(content=jsonable_encoder({"success": True, "request_id": request.state.request_id, "message": "IBAN is valid", "status": status.HTTP_200_OK}), status_code=status.HTTP_200_OK)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)