import React, { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import ConfirmDialog from "./ConfirmDialog";

const MainCard = ({ application, onUpdate, applications, compact = false, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "waiting":
        return "text-amber-600";
      case "interview":
        return "text-amber-600";
      case "applied":
        return "text-gray-500";
      case "accepted":
        return "text-emerald-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusDotClass = (status) => {
    switch (status?.toLowerCase()) {
      case "waiting":
        return "status-dot waiting";
      case "interview":
        return "status-dot interview";
      case "applied":
        return "status-dot applied";
      case "accepted":
        return "status-dot offer";
      case "rejected":
        return "status-dot rejected";
      default:
        return "status-dot applied";
    }
  };

  const handleDeleteApplication = () => {
    let updatedApps = applications.filter((app) => app.id !== application.id);
    onUpdate(updatedApps);
    setShowConfirmDelete(false);
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  const isFollowUpSoon = () => {
    if (!application.followupDate) return false;
    const followUp = new Date(application.followupDate);
    const today = new Date();
    const diffDays = Math.ceil((followUp - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };

  if (compact) {
    return (
      <>
        <div className="p-3 rounded-lg transition-all cursor-pointer" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{application.company}</h3>
            {isFollowUpSoon() && <span className="status-dot waiting inline-block ml-1"></span>}
          </div>
          <p className="text-xs mb-2 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{application.position}</p>
          {application.location && (
            <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{application.location}</p>
          )}
          <p className="text-xs text-mono" style={{ color: 'var(--text-tertiary)' }}>
            {new Date(application.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <div className="flex gap-1 mt-3 pt-2" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <button
              onClick={handleEdit}
              className="flex-1 py-1 px-2 text-xs font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Edit
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="flex-1 py-1 px-2 text-xs font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Delete
            </button>
          </div>
        </div>
        {showForm && (
          <ApplicationForm
            onClose={() => setShowForm(false)}
            onSave={onUpdate}
            formData={application}
          />
        )}
        {showConfirmDelete && (
          <ConfirmDialog
            title="Delete Application"
            message={`Are you sure you want to delete the application for ${application.company}?`}
            onConfirm={handleDeleteApplication}
            onCancel={() => setShowConfirmDelete(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="card-base cursor-pointer">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>{application.company || "N/A"}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{application.position || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={getStatusDotClass(application.status)}></span>
              <span className={`text-sm font-medium ${getStatusColor(application.status)}`}>
                {application.status || "N/A"}
              </span>
            </div>
          </div>

          <div className="divider mb-4"></div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--text-tertiary)' }}>Applied</span>
              <span className="font-medium text-mono" style={{ color: 'var(--text-primary)' }}>
                {new Date(application.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            {application.location && (
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-tertiary)' }}>Location</span>
                <span style={{ color: 'var(--text-secondary)' }}>{application.location}</span>
              </div>
            )}
            {application.salary && (
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-tertiary)' }}>Salary</span>
                <span className="text-mono" style={{ color: 'var(--text-secondary)' }}>{application.salary}</span>
              </div>
            )}
            {application.followupDate && (
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-tertiary)' }}>Follow Up</span>
                <span className={`font-medium text-mono ${isFollowUpSoon() ? 'text-amber-600' : ''}`} style={!isFollowUpSoon() ? { color: 'var(--text-secondary)' } : {}}>
                  {new Date(application.followupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {isFollowUpSoon() && <span className="status-dot waiting inline-block ml-2"></span>}
                </span>
              </div>
            )}
          </div>

          {(application.jobUrl || application.contactPerson || application.notes) && (
            <>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm mb-2 text-left transition-colors font-medium"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {showDetails ? "↓ Hide Details" : "→ Show Details"}
              </button>
              {showDetails && (
                <div className="rounded-lg p-3 mb-3 space-y-2" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                  {application.jobUrl && (
                    <div className="text-sm">
                      <span style={{ color: 'var(--text-tertiary)' }}>Job URL:</span>{' '}
                      <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--text-primary)' }}>
                        View Posting
                      </a>
                    </div>
                  )}
                  {application.contactPerson && (
                    <div className="text-sm">
                      <span style={{ color: 'var(--text-tertiary)' }}>Contact:</span>{' '}
                      <span style={{ color: 'var(--text-primary)' }}>{application.contactPerson}</span>
                    </div>
                  )}
                  {application.contactEmail && (
                    <div className="text-sm">
                      <span style={{ color: 'var(--text-tertiary)' }}>Email:</span>{' '}
                      <a href={`mailto:${application.contactEmail}`} className="hover:underline" style={{ color: 'var(--text-primary)' }}>
                        {application.contactEmail}
                      </a>
                    </div>
                  )}
                  {application.notes && (
                    <div className="text-sm">
                      <span className="block mb-1" style={{ color: 'var(--text-tertiary)' }}>Notes:</span>
                      <p style={{ color: 'var(--text-secondary)' }}>{application.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleEdit}
            className="btn-secondary flex-1"
          >
            Edit
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {showForm && (
        <ApplicationForm
          onClose={() => setShowForm(false)}
          onSave={onUpdate}
          formData={application}
        />
      )}

      {showConfirmDelete && (
        <ConfirmDialog
          title="Delete Application"
          message={`Are you sure you want to delete the application for ${application.company}? This action cannot be undone.`}
          onConfirm={handleDeleteApplication}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </>
  );
};

export default MainCard;
