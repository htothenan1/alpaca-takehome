from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.notes import router as notes_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
async def health_check():
    return {"status": "healthy"}

# Include notes routes
app.include_router(notes_router, prefix="/api")
