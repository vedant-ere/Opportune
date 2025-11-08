import React, { useState, useEffect, useMemo, useRef } from "react";
import MainCard from "../components/MainCard";
import ApplicationForm from "../components/ApplicationForm";
import Statistics from "../components/Statistics";
import KanbanBoard from "../components/KanbanBoard";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";

const LandingPage = () => {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or kanban
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedApps = localStorage.getItem("applications");
    try {
      const parsedApps = storedApps ? JSON.parse(storedApps) : [];
      setApplications(parsedApps);
    } catch (error) {
      console.error("Error parsing applications from localStorage:", error);
      setApplications([]);
      showToast("Error loading applications", "error");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const handleApplicationUpdate = (updatedApps) => {
    setApplications([...updatedApps]);
    showToast("Application updated successfully!", "success");
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

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-black mb-2 tracking-tight">
            Opportune
          </h1>
          <p className="text-gray-600 text-base">
            Track your job applications with clarity
          </p>
        </div>

        {/* Statistics Dashboard */}
        {applications.length > 0 && <Statistics applications={applications} />}

        {/* Controls Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
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
                <div id="export-menu" className="hidden absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      handleExportJSON();
                      document.getElementById("export-menu").classList.add("hidden");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-black rounded-t-lg text-sm"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV();
                      document.getElementById("export-menu").classList.add("hidden");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-black rounded-b-lg text-sm"
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
