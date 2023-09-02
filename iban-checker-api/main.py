from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/check-iban")
def check_iban(iban: str):
    return iban