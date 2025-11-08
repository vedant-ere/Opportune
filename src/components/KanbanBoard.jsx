import React, { useState } from "react";
import MainCard from "./MainCard";

const KanbanBoard = ({ applications, onUpdate, onEdit, onDelete }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const columns = [
    { status: "Applied", dotClass: "applied" },
    { status: "Waiting", dotClass: "waiting" },
    { status: "Interview", dotClass: "interview" },
    { status: "Accepted", dotClass: "offer" },
    { status: "Rejected", dotClass: "rejected" },
  ];

  const handleDragStart = (e, application) => {
    setDraggedItem(application);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      const updatedApps = applications.map((app) =>
        app.id === draggedItem.id ? { ...app, status: newStatus } : app
      );
      onUpdate(updatedApps);
    }
    setDraggedItem(null);
  };

  const getApplicationsByStatus = (status) => {
    return applications.filter((app) => app.status === status);
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {columns.map((column) => {
          const columnApps = getApplicationsByStatus(column.status);
          return (
            <div
              key={column.status}
              className="flex-shrink-0 w-80 rounded-lg p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`status-dot ${column.dotClass}`}></span>
                    <h3 className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      {column.status}
                    </h3>
                  </div>
                  <span className="text-sm text-mono" style={{ color: 'var(--text-tertiary)' }}>
                    {columnApps.length}
                  </span>
                </div>
              </div>
              <div className="space-y-3 min-h-[400px]">
                {columnApps.length > 0 ? (
                  columnApps.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <MainCard
                        application={app}
                        onUpdate={onUpdate}
                        applications={applications}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        compact
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg text-sm" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-secondary)' }}>
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
