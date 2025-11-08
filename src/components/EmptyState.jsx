import React from "react";

const EmptyState = ({ onAddNew }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 card-base">
      <div className="w-16 h-16 border-2 border-gray-300 rounded-lg mb-6 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-black mb-2">No applications yet</h2>
      <p className="text-gray-500 text-sm mb-8 text-center max-w-md">
        Start tracking your job search by adding your first application
      </p>
      <button
        onClick={onAddNew}
        className="btn-primary"
      >
        Add Application
      </button>
    </div>
  );
};

export default EmptyState;
