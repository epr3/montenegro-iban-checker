from uuid import uuid4

from .logger import logger

async def request_middleware(request, call_next):
    request_id = str(uuid4())
    with logger.contextualize(request_id=request_id):
        logger.info("Request started")
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        logger.info("Request ended")
        return response