import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-white border-emerald-600 text-black";
      case "error":
        return "bg-white border-red-600 text-black";
      case "warning":
        return "bg-white border-amber-600 text-black";
      case "info":
        return "bg-white border-black text-black";
      default:
        return "bg-white border-gray-400 text-black";
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div
        className={`${getToastStyles()} px-4 py-3 rounded-lg shadow-xl border-l-2 flex items-center gap-3 min-w-[300px]`}
      >
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-black font-bold text-xl"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Toast;
