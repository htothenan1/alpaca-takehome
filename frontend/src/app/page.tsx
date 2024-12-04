"use client"

import React, { useEffect, useState } from "react"

// Define the type for a Note
type Note = {
  id: string
  title: string
  content: string
  created_at: string
  updated_at?: string
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]) // State for storing multiple notes
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState<string>("")
  const [newNoteContent, setNewNoteContent] = useState<string>("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null) // ID of the note being edited
  const [editTitle, setEditTitle] = useState<string>("")
  const [editContent, setEditContent] = useState<string>("")

  // Fetch notes from the backend
  const fetchNotes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/notes")
      if (!response.ok) {
        throw new Error("Failed to fetch notes")
      }
      const data: Note[] = await response.json()
      setNotes(data)
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Function to handle creating a new note
  const handleCreateNote = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNoteTitle,
          content: newNoteContent,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to create note")
      }
      const newNote: Note = await response.json()
      setNotes((prevNotes) => [...prevNotes, newNote])
      setNewNoteTitle("")
      setNewNoteContent("")
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error occurred")
    }
  }

  // Function to handle editing a note
  const handleEditNote = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to update note")
      }
      const updatedNote: Note = await response.json()
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updatedNote : note))
      )
      setEditingNoteId(null) // Exit edit mode
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error occurred")
    }
  }

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <h1 className="text-3xl font-bold">Notes</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-md border p-4 shadow-sm hover:shadow-lg"
          >
            {editingNoteId === note.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mb-2 w-full border p-2"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="mb-2 w-full border p-2"
                />
                <button
                  onClick={() => handleEditNote(note.id)}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingNoteId(null)}
                  className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">{note.title}</h2>
                  <button
                    onClick={() => {
                      setEditingNoteId(note.id)
                      setEditTitle(note.title)
                      setEditContent(note.content)
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✏️
                  </button>
                </div>
                <p>{note.content}</p>
                <p className="text-sm text-gray-500">
                  Created at: {note.created_at}
                </p>
                {note.updated_at && (
                  <p className="text-sm text-gray-500">
                    Updated at: {note.updated_at}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-bold">Create a New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="mt-2 block w-full border p-2 text-black"
        />
        <textarea
          placeholder="Content"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="mt-2 block w-full border p-2"
        />
        <button
          onClick={handleCreateNote}
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add Note
        </button>
      </div>
    </div>
  )
}
