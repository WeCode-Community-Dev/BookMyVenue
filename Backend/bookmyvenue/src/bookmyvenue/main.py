import os
import structlog

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from upstash_redis.asyncio import Redis

from src.bookmyvenue.schema.responce.responces import HealthStatusResponce
from src.bookmyvenue.core.logging import setup_logging
from src.bookmyvenue.core.middleware.logging import LoggingContextMiddleware
from src.bookmyvenue.api.v1.users import users
from src.bookmyvenue.api.v1.owner import owner
from src.bookmyvenue.api.v1.admin import admin
from src.bookmyvenue.api.v1.common import common

setup_logging()
logger = structlog.get_logger()

UPSTASH_REDIS_REST_URL = os.getenv('UPSTASH_REDIS_REST_URL') or ""
UPSTASH_REDIS_REST_TOKEN = os.getenv('UPSTASH_REDIS_REST_TOKEN') or ""

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
        this lifespan function is used to initialize a open connection when the app is up and will close that connection once the app stops running
    """
    logger.info("App has started, setting up the redis client")
    app.state.redis = Redis(url=UPSTASH_REDIS_REST_URL, token=UPSTASH_REDIS_REST_TOKEN)  #app.state is used to pass this variable to anywhree in the program.
    yield

    logger.info("Detected that App has been closed, closing the initialized redis.........")
    await app.state.redis.close()
    

app = FastAPI(lifespan=lifespan) #initializing the app with the lifespan

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,           
    allow_methods=["*"],              
    allow_headers=["*"],             
)
app.add_middleware(LoggingContextMiddleware)



@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    
    origin = request.headers.get("origin")
    
    response = JSONResponse(
        status_code=exc.status_code,
        content={
            "status_code": exc.status_code,
            "message": exc.detail,
            "data": None
        }
    )
    
    # Manually re-attach headers so the browser doesn't block the error message
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        
    return response



@app.get('/health-check')
def start():
    logger.info("the server is running strong")
    return HealthStatusResponce(message="  well!" , status_code=200)

#Including the apis used in the project
app.include_router(users.router , prefix='/api/v1')
app.include_router(owner.router , prefix='/api/v1')
app.include_router(admin.router , prefix='/api/v1')
app.include_router(common.router , prefix='/api/v1')

def main():
    print("Hello from bookmyvenue!")


if __name__ == "__main__":
    main()
