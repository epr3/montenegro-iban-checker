from fastapi.testclient import TestClient
from fastapi import status

from iban_checker_api.main import app

client = TestClient(app)

def test_root():
  response = client.get("/")
  assert response.status_code == 200
  assert response.json() == {"Hello": "World"}

def test_check_iban():
  response = client.post("/check-iban", json={
    "country_code": "ME",
    "checksum_digits": 25,
    "national_check_digits": 51,
    "bank_code": "505",
    "account_number": "0000123456789"
    })
  assert response.status_code == status.HTTP_200_OK
  assert set({
    "success": True,
    "message": "IBAN is valid",
    "status": status.HTTP_200_OK}.keys()).issubset(set(response.json().keys()))

def test_check_iban_invalid_country_code():
  response = client.post("/check-iban", json={
    "country_code": "XX",
    "checksum_digits": 25,
    "national_check_digits": 51,
    "bank_code": "505",
    "account_number": "0000123456789"
    })
  assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
  assert set({
    "message": "Country code must be ME",
    "status": status.HTTP_422_UNPROCESSABLE_ENTITY,
    "success": False
    }.keys()).issubset(set(response.json().keys()))


def test_check_iban_invalid_national_check_digits():
  response = client.post("/check-iban", json={
    "country_code": "ME",
    "checksum_digits": 25,
    "national_check_digits": 51,
    "bank_code": "505",
    "account_number": "0000123456788"
    })
  assert response.status_code == status.HTTP_400_BAD_REQUEST
  assert set({
    "message": "National check digits do not match",
    "status": status.HTTP_400_BAD_REQUEST,
    "success": False
    }.keys()).issubset(set(response.json().keys()))