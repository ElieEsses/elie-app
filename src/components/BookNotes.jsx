import { Ellipsis,Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { apiFetch } from "../lib/api";
import ConfirmModal from "./ConfirmModal";


export default function BookNotes({ bookId }) {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotes() {
      setLoading(true);
      setError(null);
      setNotes([]);

      try {
        const data = await apiFetch(`/books/${bookId}/notes`);

        if (!cancelled) {
          setNotes(
            data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNotes();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  async function handleAddNote(e) {
    e.preventDefault();

    if (!content.trim() || saving) return;

    setSaving(true);
    setError(null);

    try {
      await apiFetch(`/books/${bookId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const updatedNotes = await apiFetch(`/books/${bookId}/notes`);
      setNotes(updatedNotes);
      setContent("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNote() {
    if (noteToDelete === null) return;

    setDeleting(true);
    setError(null);

    try {
        await apiFetch(`/books/${bookId}/notes/${noteToDelete}`, {
        method: "DELETE",
        });

        setNotes((prev) =>
        prev.filter((note) => note.id !== noteToDelete)
        );

        setNoteToDelete(null);
    } catch (err) {
        setError(err.message);
    } finally {
        setDeleting(false);
    }
  }

  return (
    <section className="book-notes">
      <div className="notes-heading">
        <h2>Thoughts</h2>
        {!loading && <span>{notes.length} notes</span>}
      </div>

      <form className="note-editor" onSubmit={handleAddNote}>
        <textarea
          placeholder="Write a thought about this book..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
        />

        <div className="note-editor-footer">
          <button
            type="submit"
            disabled={!content.trim() || saving}
          >
            {saving ? "Saving..." : "Add Note"}
          </button>
        </div>
      </form>

      {error && <p className="notes-error">{error}</p>}

      <div className="notes-list">
        {loading ? (
          <p className="notes-empty">Loading notes...</p>
        ) : notes.length > 0 ? (
            notes.map((note) => (
            <article key={note.id} className="book-note">
                <div className="note-header">
                    <span className="note-date">
                        {new Date(note.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        })}
                    </span>

                    <button
                    type="button"
                    className="note-menu-button"
                    onClick={() =>
                        setOpenMenuId(openMenuId === note.id ? null : note.id)
                    }
                    aria-label="Note options"
                    >
                    <Ellipsis size={18} />
                    </button>
                    {openMenuId === note.id && (
                        <div className="note-dropdown">
                            <button type="button">
                            <Pencil size={14} />
                            Edit
                            </button>

                            <button
                            type="button"
                            className="note-dropdown-delete"
                            onClick={() => {
                                setNoteToDelete(note.id);
                                setOpenMenuId(null);
                            }}
                            >
                            <Trash size={14} />
                            Delete
                            </button>
                        </div>
                    )}
                </div>

                <p>{note.content}</p>
            </article>
            ))
        ) : (
          <p className="notes-empty">
            No notes yet. Add your first thought above.
          </p>
        )}
      </div>
      {noteToDelete !== null && (
        <ConfirmModal
            title="Delete note?"
            message="This note will be permanently deleted. This cannot be undone."
            onConfirm={handleDeleteNote}
            onCancel={() => setNoteToDelete(null)}
            loading={deleting}
        />
      )}
    </section>
  );
}