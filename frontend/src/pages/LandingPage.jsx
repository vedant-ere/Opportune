import React, { useState, useEffect } from "react";
import MainCard from "../components/MainCard";
import ApplicationForm from "../components/ApplicationForm";

const LandingPage = () => {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedApps = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(storedApps);
  }, []);

  const handleSaveApplication = (newApp) => {
    setApplications((prevApps) => {
      const updatedApps = [...prevApps, newApp];
      localStorage.setItem("applications", JSON.stringify(updatedApps));
      return updatedApps;
    });
  };

  return (
    <div className="text-white mx-auto max-w-6xl">
      <div className="flex flex-col w-full items-center justify-center">
        <h1 className="justify-self-center text-5xl p-5 font-bold ">
          Opportune
        </h1>
        <p className="mb-4">
          track your internships and applications all at one place!
        </p>
      </div>
      {/* TopBar */}
      <div className="flex justify-between m-4">
        <div className="flex gap-6 items-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-1.5 border-gray-800 border rounded-lg bg-gray-700 text-white cursor-pointer"
          >
            + New Application
          </button>
          <button className="px-4 py-1.5 border-gray-800 border rounded-lg bg-gray-700 text-white cursor-pointer">
            Toggle View
          </button>
        </div>
        <div className="flex flex-col">
          <select
            className="text-white px-3 py-1 mb-1 bg-black cursor-pointer"
            name="status"
          >
            <option value="applied">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="applied">Waiting</option>
            <option value="applied">Interview</option>
            <option value="applied">Accepted</option>
            <option value="applied">Rejected</option>
          </select>
          <select
            className="text-white px-3 py-1 bg-black cursor-pointer"
            name="status"
          >
            <option value="applied">Sort By</option>
            <option value="applied">Date (Newest First)</option>
            <option value="applied">Date (Oldest First)</option>
            <option value="applied">Company (A-Z)</option>
          </select>
          <div>Swtich</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-20">
        {applications && applications.length > 0 ? (
          applications.map((app) => <MainCard key={app.id} application={app} />)
        ) : (
          <p>No applications found.</p>
        )}
      </div>
      {showForm && (
        <ApplicationForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveApplication}
        />
      )}
    </div>
  );
};

export default LandingPage;
