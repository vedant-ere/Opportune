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
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-50 animate-fadeIn">
      <div
        ref={dialogRef}
        className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-2 text-black tracking-tight">{title}</h3>
        <p className="text-gray-600 mb-6 text-sm">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary bg-red-600 hover:bg-red-700 border-red-600"
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
