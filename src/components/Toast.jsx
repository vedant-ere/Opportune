import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "#059669";
      case "error":
        return "#DC2626";
      case "warning":
        return "#D97706";
      case "info":
      default:
        return "var(--text-primary)";
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div
        className="px-4 py-3 rounded-lg border-l-2 flex items-center gap-3 min-w-[300px]"
        style={{
          background: 'var(--bg-card)',
          borderColor: getBorderColor(),
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{message}</div>
        <button
          onClick={onClose}
          className="font-bold text-xl transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Toast;
