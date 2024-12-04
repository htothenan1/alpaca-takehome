from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
database = client["test"]  # Switch to the 'test' database
notes_collection = database["notes"]  # Use the 'notes' collection
