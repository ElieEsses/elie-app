import "../styles/Confirm.css";

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="confirm-overlay">
      <div
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>

          <button
            type="button"
            className="confirm-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
