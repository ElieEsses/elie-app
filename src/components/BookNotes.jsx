import { useEffect, useState } from "react";

import { apiFetch } from "../lib/api";


export default function BookNotes({ bookId }) {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
    </section>
  );
}