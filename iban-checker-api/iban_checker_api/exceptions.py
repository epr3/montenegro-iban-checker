from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

async def http_exception_handler(request, exc):
    error = "internal_server_error"

    if exc.status_code == status.HTTP_400_BAD_REQUEST:
        error = "bad_request"

    return JSONResponse(content=jsonable_encoder({"message": str(exc.detail), "success": False, "error": error, "status": exc.status_code }), status_code=exc.status_code)


async def validation_exception_handler(request, exc):
    formatted_messages = {}
    for message in exc.errors():
        formatted_messages[f"{message['loc'][1]}"] = f"{message['msg']}"
    return JSONResponse(content=jsonable_encoder({"message": formatted_messages, "success": False, "error": "validation_error", "status": status.HTTP_422_UNPROCESSABLE_ENTITY}), status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)