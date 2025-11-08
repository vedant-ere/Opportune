import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onCancel();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [onCancel]);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 animate-fadeIn" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
      <div
        ref={dialogRef}
        className="p-6 rounded-lg max-w-md w-full mx-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-lg)' }}
      >
        <h3 className="text-lg font-semibold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ background: '#DC2626', border: '1px solid #DC2626' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#B91C1C'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#DC2626'}
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ConfirmDialog;
