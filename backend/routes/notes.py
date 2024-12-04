from fastapi import APIRouter, HTTPException
from models.note import Note
from db import notes_collection
from bson import ObjectId
from datetime import datetime
from services.openai_service import enhance_note_content


router = APIRouter()

# Helper function to convert MongoDB document to Python dictionary
def note_serializer(note):
    return {
        "id": str(note["_id"]),
        "title": note["title"],
        "content": note["content"],
        "created_at": note["created_at"],
        "updated_at": note.get("updated_at"),
    }


# Route to populate the database with initial notes
@router.post("/populate")
async def populate_notes():
    initial_notes = [
        {"title": "Note 1", "content": "This is the first note.", "created_at": datetime.utcnow()},
        {"title": "Note 2", "content": "This is the second note.", "created_at": datetime.utcnow()},
    ]
    result = await notes_collection.insert_many(initial_notes)
    return {"inserted_ids": [str(_id) for _id in result.inserted_ids]}


# Route to fetch all notes
@router.get("/notes")
async def get_notes():
    notes = []
    async for note in notes_collection.find():
        notes.append(note_serializer(note))
    return notes


# Route to create a new note
@router.post("/notes")
async def create_note(note: Note):
    new_note = note.dict()
    new_note["created_at"] = datetime.utcnow()
    result = await notes_collection.insert_one(new_note)
    if not result.acknowledged:
        raise HTTPException(status_code=500, detail="Failed to create note")
    created_note = await notes_collection.find_one({"_id": result.inserted_id})
    return note_serializer(created_note)


# Route to update a note
@router.put("/notes/{note_id}")
async def update_note(note_id: str, updated_data: Note):
    updated_fields = updated_data.dict(exclude_unset=True)
    updated_fields["updated_at"] = datetime.utcnow()

    result = await notes_collection.update_one(
        {"_id": ObjectId(note_id)}, {"$set": updated_fields}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Note not found or not updated")
    
    updated_note = await notes_collection.find_one({"_id": ObjectId(note_id)})
    return note_serializer(updated_note)


# Route to delete a note
@router.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    result = await notes_collection.delete_one({"_id": ObjectId(note_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}

# Route to enhance a note using OpenAI
@router.post("/notes/{note_id}/enhance")
async def enhance_note(note_id: str):
    # Fetch the note from the database
    note = await notes_collection.find_one({"_id": ObjectId(note_id)})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    try:
        # Call OpenAI to enhance the note content
        enhanced_content = await enhance_note_content(note["content"])
        # Update the note with the enhanced content
        result = await notes_collection.update_one(
            {"_id": ObjectId(note_id)},
            {"$set": {"content": enhanced_content, "updated_at": datetime.utcnow()}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update note")
        return {"message": "Note enhanced successfully", "enhanced_content": enhanced_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
