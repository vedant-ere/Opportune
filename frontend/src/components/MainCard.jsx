import React, { useEffect } from "react";
import { useState } from "react";
import ApplicationForm from "./ApplicationForm";

const MainCard = ({ application, onUpdate, applications }) => {
  const [showForm, setShowForm] = useState(false);
  // const [formData, setFormData] = useState(null);

  // useEffect(() => {
  //   const savedData = JSON.parse(localStorage.getItem("applications"));
  //   const existingData = savedData.find((app) => app.id === application.id);
  //   if (existingData) {
  //     setFormData(existingData);
  //   }
  // }, [application]);

  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "waiting":
        return "bg-yellow-700";
      case "interview":
        return "bg-blue-500";
      case "applied":
        return "bg-gray-500";
      case "accepted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-purple-500"; // Default color
    }
  };
  useEffect(() => {
    
  })
  const handleDeleteApplication = () => {
      let updatedApps = applications.filter((app) => app.id !== application.id) 
      onUpdate(updatedApps)
  };
  const handleEdit = () => {
    // setFormData(application);
    setShowForm(true);
  };

  return (
    <div className="py-4 px-4 rounded-md bg-[#2C2C2C] shadow-2xl w-96 hover:transition-transform duration-300 ease-in-out hover:scale-103">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className="mb-3 text-2xl">{application.company || "N/A"}</p>
          <p
            className={`min-w-[100px] px-3 py-1 rounded-lg text-center text-gray-300 transition-colors duration-300 ${getStatusColor(application.status)}`}
          >
            {application.status || "N/A"}
          </p>
        </div>

        <div>
          <p className="mb-3 text-xl text-gray-400">
            {application.position || "N/A"}
          </p>
          <p className="border border-gray-400 mx-6 mb-4"></p>
        </div>
      </div>
      <div>
        <p className="mb-3 text-gray-400">Applied: {application.applicationDate || "N/A"}</p>
        <p className="text-gray-400">Follow Up: {application.followupDate || "N/A"}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => {
            handleEdit();
          }}
          className="py-1 px-4 bg-[#17a2b8] rounded-md"
        >
          Edit
        </button>
        <button
          onClick={handleDeleteApplication}
          className="py-1 px-4 bg-red-500 rounded-md"
        >
          Delete
        </button>
      </div>
      {showForm && (
        <ApplicationForm
          onClose={() => setShowForm(false)}
          onSave={onUpdate}
          formData={application}
        />
      )}
    </div>
  );
};

export default MainCard;
