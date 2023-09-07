# Montenegro IBAN checker API

This is the API for the Montenegro IBAN checker. It validates the IBAN and sends it to the client. Also it stores all validation attempts for a specific session in a SQLite database. It uses the MOD 97 specification to validate the IBAN.

The project also contains a launch.json file for debugging with VSCode.

## Libraries used
* loguru
* alembic
* sqlalchemy

## Prerequisites
1. Python 3.11
2. poetry

## Steps to install the project

``` cp .env.example .env.local ```

1. Install dependencies

``` poetry install ```

2. Migrate database

``` poetry run alembic upgrade head```

3. Run project

``` poetry run uvicorn iban_checker_api.main:app --reload```

4. Run tests

``` poetry run pytest --cov ```
