import React, { useState } from "react";

const ApplicationForm = ({ onClose, onSave }) => {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [followupDate, setfollowupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Applied");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newApplication = {
      id: Date.now(),
      position,
      company,
      applicationDate,
      followupDate,
      status,
      notes,
    };
    onSave(newApplication);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-30">
      <div className="bg-gray-800 p-6 rounded-lg w-1/2 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">New Application</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="border border-gray-500 rounded-lg px-2 py-2 bg-gray-900 text-white"
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border border-gray-500 rounded-lg p-2 bg-gray-900 text-white"
            required
          />
          <label className="text-white">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-900 p-2 border border-gray-500 rounded-lg text-white"
          >
            <option value="Applied">Applied</option>
            <option value="Waiting">Waiting</option>
            <option value="Interview">Interview</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <label className="text-white">Application Date</label>
          <input
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            className="border border-gray-500 rounded-lg p-2 bg-gray-900 text-white"
            required
          />
          <label className="text-white">Follow Up Date</label>
          <input
            type="date"
            value={followupDate}
            onChange={(e) => setfollowupDate(e.target.value)}
            className="border border-gray-500 rounded-lg p-2 bg-gray-900 text-white"
          />
          <label className="text-white">Notes</label>
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border border-gray-500 rounded-lg p-2 bg-gray-900 text-white"
          ></textarea>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 cursor-pointer w-full mr-4 text-white rounded hover:bg-green-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
