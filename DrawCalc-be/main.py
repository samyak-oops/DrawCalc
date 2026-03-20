# Use cmd :- uvicorn main:app --reload
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from constants import SERVER_URL, PORT, ENV
from apps.calculator.route import router as calculator_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic (if needed)
    print("Server starting...")
    yield
    # Shutdown logic (if needed)
    print("Server shutting down...")

app = FastAPI(lifespan=lifespan)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Health check route
@app.get("/")
async def health():
    return {"message": "Server is running"}

app.include_router(calculator_router, prefix='/calculate', tags=['calculate'])