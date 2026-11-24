import "../styles/Details.css";
import "../styles/NfcModal.css";

import { Check, Copy, Nfc } from "lucide-react";
import { useState } from "react";

export default function NfcLinkModal({ nfcLink, onClose }) {
  const [copied, setCopied] = useState(false);

  function handleCopyNfcUrl() {
    navigator.clipboard.writeText(nfcLink);
    setCopied(true);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="nfc-modal-title">
            <Nfc size={22} />
            <h2>Connect your book</h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="nfc-modal-description">
          Write this link to an NFC tag to open this book with a tap.
        </p>

        <div className="nfc-link-box">
          <span className="nfc-link-label">BOOK LINK</span>
          <span className="nfc-link-url">{nfcLink}</span>
        </div>

        <button
          type="button"
          className="nfc-copy-button"
          onClick={handleCopyNfcUrl}
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? "Copied!" : "Copy link"}
        </button>

        <p className="nfc-modal-hint">
          Use NFC Tools to write this URL to your tag.
        </p>
      </div>
    </div>
  );
}
