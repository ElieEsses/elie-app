import "../styles/Details.css";

import { ArrowLeft, ChevronDown, Link as LinkIcon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import AddBookModal from "../components/AddBookModal";
import BookNotes from "../components/BookNotes";
import ConfirmModal from "../components/ConfirmModal";
import NfcLinkModal from "../components/NfcLinkModal";
import { apiFetch } from "../lib/api";

export default function BookDetails() {
  const navigate = useNavigate();

  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagesInput, setPagesInput] = useState("");
  const [nfcUrl, setNfcUrl] = useState(null);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBook, setDeletingBook] = useState(false);

  const readingStatus = ["reading", "finished"].includes(book?.status)
    ? book.status
    : "unread";
  
  useEffect(() => {
    let cancelled = false;

    async function fetchBook() {
      setLoading(true);
      setError(null);
      setBook(null);
      setPagesInput("");

      try {
        const data = await apiFetch(`/books/${bookId}`);

        if (!cancelled) {
          setBook(data);
          setPagesInput(String(data.pages_read))
          console.log(data);
          setNfcUrl(data.nfc_url || null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBook();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  async function handleStatusChange(status) {
    try {
      const updatedBook = await apiFetch(`/books/${bookId}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      setBook(updatedBook);
      setPagesInput(String(updatedBook.pages_read));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReadProgressChange(pages_read) {
    try {
      const updatedBook = await apiFetch(`/books/${bookId}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pages_read }),
      });

      setBook(updatedBook);
      setPagesInput(String(updatedBook.pages_read));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (deletingBook) return;

    setDeletingBook(true);
    setError(null);

    try {
      await apiFetch(`/books/${bookId}`, {
        method: "DELETE",
      });

      navigate("/library");
    } catch (err) {
      setError(err.message);
      setShowDeleteConfirm(false);
    } finally {
      setDeletingBook(false);
    }
  }

  function handleBookUpdated(updatedBook) {
    setBook(updatedBook);
    setShowEditModal(false);
  }
  
  return (
    <div className="book-details-page">
      {showNfcModal && (
        <NfcLinkModal
          nfcLink={nfcUrl}
          onClose={() => setShowNfcModal(false)}
        />
      )}
      {showEditModal && (
        <AddBookModal
          book={book}
          onClose={() => setShowEditModal(false)}
          onBookUpdated={handleBookUpdated}
          onBookDeleted={() => {
            setShowEditModal(false);
            setShowDeleteConfirm(true);
          }}
        />
      )}
      <Link to="/library" className="back-link">
        <ArrowLeft size={17} />
        Back to library
      </Link>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : book ? (
        <>
          <div className="book-detail-content">
            <img
              className="detail-cover"
              src={book.cover_url}
              alt={`Cover of ${book.title}`}
            />

            <div className="detail-info">
              <div className="book-metadata">
                <div className="book-title-row">
                  <h1>{book.title}</h1>
                  <div className="book-title-actions">
                    <button
                    type="button"
                    className="title-actions-button"
                    onClick={() => {setShowNfcModal(true)}}
                    >
                      <LinkIcon size={19} strokeWidth={1.8} />
                    </button>
                    <button
                    type="button"
                    className="title-actions-button"
                    onClick={() => {setShowEditModal(true)}}
                    >
                      <Pencil size={19} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
                <h2>{book.authors.join(", ")}</h2>
                <p>{book.first_publish_year ?? "Unknown"} · {book.num_pages ?? "Unknown"} pages</p>
              </div>

              <div className="reading-section">
                  <label htmlFor="reading-status">Reading status</label>
                  <div className="status-select">
                    <select
                      id="reading-status"
                      value={readingStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="unread">Unread</option>
                      <option value="reading">Reading</option>
                      <option value="finished">Finished</option>
                    </select>
                    <ChevronDown size={16} />
                  </div>

                  {(readingStatus == "finished" || readingStatus == "reading" )&& (
                    <div className={`reading-progress ${readingStatus}`}>
                      <div className="progress-header">
                        <span>Reading progress</span>
                        <span className="progress-count">
                        <input
                          className="pages-read-input"
                          type="number"
                          min="0"
                          max={book.num_pages ?? 0}
                          value={pagesInput}
                          onChange={(e) => setPagesInput(e.target.value)}
                          onBlur={() => handleReadProgressChange(Number(pagesInput))}
                        />
                        / {book.num_pages}
                        </span>
                      </div>

                      {book.num_pages > 0 && (
                        <progress
                          value={Math.min(book.pages_read, book.num_pages)}
                          max={book.num_pages}
                        />
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
          {readingStatus != "unread" && (
            <BookNotes bookId={book.id} />
          )}
        </>
      ) : (
        <p>Book not found.</p>
      )}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete book?"
          message="This book will be permanently deleted. This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={deletingBook}
        />
      )}
    </div>
  );
}
