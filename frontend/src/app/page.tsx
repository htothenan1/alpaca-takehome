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

// Define SpeechRecognition for TypeScript
type SpeechRecognition =
  | (typeof window & {
      webkitSpeechRecognition: any
    })["webkitSpeechRecognition"]
  | null

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
  const [isRecording, setIsRecording] = useState<boolean>(false)

  let recognition: SpeechRecognition | null = null

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

  // Start voice recording for note content
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in your browser.")
      return
    }

    recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onerror = (event: any) => {
      setError(event.error || "An error occurred during speech recognition.")
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setNewNoteContent((prevContent) => `${prevContent} ${transcript}`)
    }

    recognition.start()
  }

  // Stop voice recording
  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
    }
    setIsRecording(false)
  }

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="Notes Icon" className="text-3xl">
            📝
          </span>
          <h1 className="text-3xl font-bold">My Notes</h1>
        </div>
        <button
          onClick={() => setShowAddNoteModal(true)}
          className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          ➕ Add New Note
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4 w-full max-w-4xl">
        {notes.map((note) => (
          <div
            key={note.id}
            className="relative rounded-md border p-4 shadow-sm hover:shadow-lg"
          >
            {editingNoteId === note.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mb-2 w-full border p-2 text-black"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="mb-2 w-full border p-2 text-black"
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
                  <div className="flex gap-2">
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
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setNoteToDelete(note)}
                    >
                      ❌
                    </button>
                  </div>
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
                onClick={isRecording ? stopRecording : startRecording}
                className={`rounded px-4 py-2 text-white ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
              <button
                onClick={handleCreateNote}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
