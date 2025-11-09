import React, { useState, useEffect, useMemo, useRef } from "react";
import MainCard from "../components/MainCard";
import ApplicationForm from "../components/ApplicationForm";
import Statistics from "../components/Statistics";
import KanbanBoard from "../components/KanbanBoard";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import ThemeToggle from "../components/ThemeToggle";
import NotificationSettings from "../components/NotificationSettings";
import AuthModal from "../components/AuthModal";
import { isAuthenticated, getUser, logout, verifyToken, authenticatedFetch } from "../utils/auth";

const LandingPage = () => {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or kanban
  const [toast, setToast] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const isValid = await verifyToken();
        if (isValid) {
          const user = getUser();
          setCurrentUser(user);
          await loadApplicationsFromDB();
        } else {
          setShowAuthModal(true);
        }
      } else {
        // Load from localStorage for offline viewing
        loadFromLocalStorage();
        setShowAuthModal(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Save to localStorage whenever applications change
  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem("applications", JSON.stringify(applications));
    }
  }, [applications]);

  // Load applications from localStorage
  const loadFromLocalStorage = () => {
    try {
      const storedApps = localStorage.getItem("applications");
      if (storedApps) {
        const parsedApps = JSON.parse(storedApps);
        setApplications(parsedApps);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      showToast("Error loading applications", "error");
    }
  };

  // Load applications from MongoDB
  const loadApplicationsFromDB = async () => {
    try {
      setSyncing(true);
      const user = getUser();
      const response = await authenticatedFetch(`${API_URL}/applications/${user.email}`);
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
        localStorage.setItem("applications", JSON.stringify(data.applications));
      } else {
        // Fallback to localStorage if DB fetch fails
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("Failed to load from database:", error);
      showToast("Using offline data", "warning");
      loadFromLocalStorage();
    } finally {
      setSyncing(false);
    }
  };

  // Sync applications to MongoDB
  const syncToDatabase = async (updatedApps) => {
    if (!isAuthenticated()) return;

    try {
      const user = getUser();
      await authenticatedFetch(`${API_URL}/applications/sync`, {
        method: 'POST',
        body: JSON.stringify({
          userId: user.email,
          applications: updatedApps
        })
      });
    } catch (error) {
      console.error("Failed to sync to database:", error);
      showToast("Data saved locally (will sync when online)", "warning");
    }
  };

  const handleApplicationUpdate = (updatedApps) => {
    setApplications([...updatedApps]);
    syncToDatabase(updatedApps); // Sync to MongoDB
    showToast("Application updated successfully!", "success");
  };

  const handleAuthSuccess = async (user, token) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    showToast(`Welcome back, ${user.name}!`, "success");
    await loadApplicationsFromDB();
  };

  const handleLogout = () => {
    logout();
    setApplications([]);
    setCurrentUser(null);
    setShowAuthModal(true);
    showToast("Logged out successfully", "success");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Filter and search applications
  const filteredAndSortedApps = useMemo(() => {
    let result = [...applications];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (app) =>
          app.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((app) => app.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.applicationDate) - new Date(a.applicationDate);
        case "oldest":
          return new Date(a.applicationDate) - new Date(b.applicationDate);
        case "company":
          return (a.company || "").localeCompare(b.company || "");
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

    return result;
  }, [applications, searchQuery, filterStatus, sortBy]);

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(applications, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `opportune-applications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Applications exported to JSON!", "success");
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      showToast("No applications to export", "warning");
      return;
    }

    const headers = ["Company", "Position", "Status", "Location", "Salary", "Application Date", "Follow-up Date", "Job URL", "Contact Person", "Contact Email", "Notes"];
    const csvData = applications.map((app) => [
      app.company || "",
      app.position || "",
      app.status || "",
      app.location || "",
      app.salary || "",
      app.applicationDate || "",
      app.followupDate || "",
      app.jobUrl || "",
      app.contactPerson || "",
      app.contactEmail || "",
      app.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `opportune-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Applications exported to CSV!", "success");
  };

  // Import from JSON
  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setApplications(imported);
          showToast(`Imported ${imported.length} applications!`, "success");
        } else {
          showToast("Invalid JSON format", "error");
        }
      } catch (error) {
        showToast("Error importing file", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--text-primary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Opportune
            </h1>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Track your job applications with clarity
            </p>
            {currentUser && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Logged in as {currentUser.email}
                {syncing && <span className="ml-2 text-xs">(syncing...)</span>}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {currentUser && (
              <>
                <button
                  onClick={() => setShowNotificationSettings(true)}
                  className="btn-ghost flex items-center gap-2"
                  title="Notification Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="hidden sm:inline">Notifications</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-ghost flex items-center gap-2"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Statistics Dashboard */}
        {applications.length > 0 && <Statistics applications={applications} />}

        {/* Controls Bar */}
        <div className="rounded-lg p-4 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Left side - Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                New Application
              </button>
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "kanban" : "grid")}
                className="btn-secondary"
              >
                {viewMode === "grid" ? "Kanban" : "Grid"}
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    const menu = document.getElementById("export-menu");
                    menu.classList.toggle("hidden");
                  }}
                  className="btn-ghost"
                >
                  Export
                </button>
                <div id="export-menu" className="hidden absolute top-full mt-1 left-0 rounded-lg z-10 min-w-[150px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)' }}>
                  <button
                    onClick={() => {
                      handleExportJSON();
                      document.getElementById("export-menu").classList.add("hidden");
                    }}
                    className="block w-full text-left px-4 py-2 rounded-t-lg text-sm"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV();
                      document.getElementById("export-menu").classList.add("hidden");
                    }}
                    className="block w-full text-left px-4 py-2 rounded-b-lg text-sm"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-ghost"
              >
                Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </div>

            {/* Right side - Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 flex-1 lg:max-w-2xl">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base flex-1"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-base"
              >
                <option value="all">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Waiting">Waiting</option>
                <option value="Interview">Interview</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-base"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="company">Company</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Display */}
        {applications.length === 0 ? (
          <EmptyState onAddNew={() => setShowForm(true)} />
        ) : filteredAndSortedApps.length === 0 ? (
          <div className="text-center py-20 card-base">
            <h2 className="text-xl font-semibold text-black mb-2">No matches found</h2>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedApps.map((app) => (
              <MainCard
                key={app.id}
                application={app}
                onUpdate={handleApplicationUpdate}
                applications={applications}
              />
            ))}
          </div>
        ) : (
          <KanbanBoard
            applications={filteredAndSortedApps}
            onUpdate={handleApplicationUpdate}
          />
        )}

        {/* Application Form Modal */}
        {showForm && (
          <ApplicationForm
            onClose={() => setShowForm(false)}
            onSave={(updatedApps) => {
              handleApplicationUpdate(updatedApps);
              setShowForm(false);
            }}
            formData={null}
          />
        )}

        {/* Notification Settings Modal */}
        {showNotificationSettings && currentUser && (
          <NotificationSettings
            userEmail={currentUser.email}
            onClose={() => setShowNotificationSettings(false)}
          />
        )}

        {/* Authentication Modal */}
        {showAuthModal && (
          <AuthModal
            onClose={() => {
              // Don't allow closing if not authenticated
              if (!isAuthenticated()) {
                showToast("Please login to continue", "warning");
              }
            }}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
