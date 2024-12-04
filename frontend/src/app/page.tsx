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
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState<string>("")
  const [newNoteContent, setNewNoteContent] = useState<string>("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState<string>("")
  const [editContent, setEditContent] = useState<string>("")
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false)

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
      setShowAddNoteModal(false)
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
      setEditingNoteId(null)
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error occurred")
    }
  }

  // Function to handle enhancing content with AI
  const enhanceContentWithAI = async (id: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/notes/${id}/enhance`,
        {
          method: "POST",
        }
      )
      if (!response.ok) {
        throw new Error("Failed to enhance note content with AI")
      }
      const { enhanced_content } = await response.json()
      setEditContent(enhanced_content)
    } catch (err: unknown) {
      setError(
        (err as Error).message || "Unknown error occurred during AI enhancement"
      )
    }
  }

  // Function to handle deleting a note
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/notes/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete note")
      }
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
      setNoteToDelete(null)
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error occurred")
    }
  }

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-800 p-6">
      <header className="w-full max-w-4xl bg-teal-500 rounded-lg p-4 text-white shadow-lg mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Alpaca Health Notes</h1>
        <button
          onClick={() => setShowAddNoteModal(true)}
          className="px-4 py-2 bg-white text-teal-500 font-medium rounded-md shadow hover:bg-teal-100"
        >
          ➕ Add New Note
        </button>
      </header>

      {/* Notes Section */}
      <div className="w-full max-w-4xl space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-md shadow p-4 border hover:shadow-lg"
            >
              {editingNoteId === note.id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mb-2 w-full border p-2"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border p-2"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => enhanceContentWithAI(note.id)}
                      className="bg-purple-500 text-white px-4 py-2 rounded mr-2 hover:bg-purple-600"
                    >
                      Enhance with AI
                    </button>
                    <button
                      onClick={() => handleEditNote(note.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">{note.title}</h2>
                    <div className="space-x-2">
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
                      <button
                        onClick={() => setNoteToDelete(note)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                  <p>{note.content}</p>
                  <p className="text-sm text-gray-500">
                    Created: {note.created_at}
                  </p>
                  {note.updated_at && (
                    <p className="text-sm text-gray-500">
                      Updated: {note.updated_at}
                    </p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md bg-white p-6 text-center shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add a New Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="mb-2 w-full border p-2 text-black"
            />
            <textarea
              placeholder="Content"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="mb-2 w-full border p-2 text-black"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={handleCreateNote}
                className="rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
              >
                Add Note
              </button>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {noteToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md bg-white p-6 text-center shadow-lg">
            <h2 className="text-xl font-bold text-red-500">Are you sure?</h2>
            <p className="mt-2 text-gray-700">
              This action is final and cannot be undone.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => handleDeleteNote(noteToDelete.id)}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setNoteToDelete(null)}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
