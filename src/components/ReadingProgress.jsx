import { ChevronDown } from "lucide-react";
import { useState } from "react";

import Stars from "../components/Stars";
import { apiFetch } from "../lib/api";

export default function ReadingProgress({ book, onBookUpdated, onError }) {
  const [pagesInput, setPagesInput] = useState(
    String(book.pages_read ?? 0)
  );

  const readingStatus = ["reading", "finished"].includes(book.status)
    ? book.status
    : "unread";

  async function handleStatusChange(status) {
    try {
      const updatedBook = await apiFetch(`/books/${book.id}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      onBookUpdated(updatedBook);
      setPagesInput(String(updatedBook.pages_read));
    } catch (err) {
      onError(err.message);
    }
  }

  async function handleReadProgressChange(pages_read) {
    try {
      const updatedBook = await apiFetch(`/books/${book.id}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pages_read }),
      });

      onBookUpdated(updatedBook);
      setPagesInput(String(updatedBook.pages_read));
    } catch (err) {
      onError(err.message);
    }
  }

  async function handleRatingChange(rating) {
    try {
      const updatedBook = await apiFetch(`/books/${book.id}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      onBookUpdated(updatedBook);
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <div className="reading-section">
      <div className="reading-section-row">
        <div className="reading-status-group">
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
        </div>
        {readingStatus == "finished" && (
          <div className="reading-rating-group">
            <label htmlFor="reading-label">Rating</label>
            <Stars currentRating={book.rating} onChange={handleRatingChange} />
          </div>
        )}
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
  );
}