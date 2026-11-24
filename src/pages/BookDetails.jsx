import "../styles/Details.css";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import AddBookModal from "../components/AddBookModal";
import BookDetailsActions from "../components/BookDetailsActions";
import BookNotes from "../components/BookNotes";
import ConfirmModal from "../components/ConfirmModal";
import NfcLinkModal from "../components/NfcLinkModal";
import ReadingProgress from "../components/ReadingProgress";
import { apiFetch } from "../lib/api";

export default function BookDetails() {
  const navigate = useNavigate();

  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

      try {
        const data = await apiFetch(`/books/${bookId}`);

        if (!cancelled) {
          setBook(data);
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
                  <BookDetailsActions
                    onShowNfcModal={() => setShowNfcModal(true)}
                    onShowEditModal={() => setShowEditModal(true)}
                  />
                </div>
                <h2>{book.authors.join(", ")}</h2>
                <p>
                  {book.first_publish_year ?? "Unknown"} ·{" "}
                  {book.num_pages ?? "Unknown"} pages
                </p>
              </div>
              <ReadingProgress
                book={book}
                onBookUpdated={handleBookUpdated}
                onError={setError}
              />
            </div>
          </div>
          {readingStatus != "unread" && <BookNotes bookId={book.id} />}
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

      {showNfcModal && (
        <NfcLinkModal nfcLink={nfcUrl} onClose={() => setShowNfcModal(false)} />
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
    </div>
  );
}
