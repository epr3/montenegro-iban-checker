from uuid import uuid4

from fastapi.testclient import TestClient
from fastapi import status
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from iban_checker_api.database import Base
from iban_checker_api.main import app, get_db

SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

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


def test_get_validations():
  response = client.get("/validations", headers={"X-Session-ID": str(uuid4())})
  assert response.status_code == status.HTTP_200_OK
  assert set({
    "success": True,
    "data": [],
    "status": status.HTTP_200_OK}.keys()).issubset(set(response.json().keys()))

def test_get_validations_fail():
  response = client.get("/validations")
  assert response.status_code == status.HTTP_400_BAD_REQUEST
  assert set({
    "success": False,
    "data": [],
    "status": status.HTTP_400_BAD_REQUEST}.keys()).issubset(set(response.json().keys()))