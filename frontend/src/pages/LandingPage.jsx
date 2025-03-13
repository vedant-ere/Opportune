import React from "react";

const LandingPage = () => {
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
          <button className="px-4 py-1.5 border-gray-800 border rounded-lg bg-gray-700 text-white">
            + New Application
          </button>
          <button className="px-4 py-1.5 border-gray-800 border rounded-lg bg-gray-700 text-white">
            Toggle View
          </button>
        </div>
        <div className="flex flex-col">
          <select className="text-white px-3 py-1 mb-1 bg-black" name="status">
            <option value="applied">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="applied">Waiting</option>
            <option value="applied">Interview</option>
            <option value="applied">Accepted</option>
            <option value="applied">Rejected</option>
          </select>
          <select className="text-white px-3 py-1 bg-black" name="status">
            <option value="applied">Sort By</option>
            <option value="applied">Date (Newest First)</option>
            <option value="applied">Date (Oldest First)</option>
            <option value="applied">Company (A-Z)</option>
          </select>
          <div>Swtich</div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default LandingPage;
