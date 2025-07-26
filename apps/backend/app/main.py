# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.init import init_db
from app.core.logger import logger
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.security import HTTPBearer



# Import all routers
from app.routes.routes import router as api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🔄 App starting up...")
    await init_db()
    logger.info("✅ DB initialized")
    yield
    logger.info("⛔ App shutting down...")
app = FastAPI(lifespan=lifespan)

# CORS Middleware (adjust origins in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domains in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "DinnerConnect API running 🚀"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error:")
    return JSONResponse(status_code=500, content={"error": "Internal Server Error"})
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "code": 422,
            "message": "Validation failed",
            "errors": jsonable_encoder(exc.errors()),
        },
    )

app.include_router(api_router)
security_scheme = HTTPBearer()
