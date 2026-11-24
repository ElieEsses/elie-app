import { Link as LinkIcon, Pencil } from "lucide-react";

export default function BookDetailsActions({
  onShowNfcModal,
  onShowEditModal,
}) {
  return (
    <div className="book-title-actions">
      <button
        type="button"
        className="title-actions-button"
        onClick={onShowNfcModal}
      >
        <LinkIcon size={19} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        className="title-actions-button"
        onClick={onShowEditModal}
      >
        <Pencil size={19} strokeWidth={1.8} />
      </button>
    </div>
  );
}
