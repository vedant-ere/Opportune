import React, { useState, useEffect } from 'react';

const MainCard = ({ application }) => {
  return (
    <div className="p-4 border border-amber-400 w-96">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p className="mb-3">{application.position || "N/A"}</p>
          <p>{application.status || "N/A"}</p>
        </div>
        <div>
          <p className="mb-3">{application.company || "N/A"}</p>
          <p className="border border-gray-300 mx-6 mb-6"></p>
        </div>
      </div>
      <div>
        <p>Applied: {application.applicationDate || "N/A"}</p>
        <p>Follow Up: {application.followupDate || "N/A"}</p>
      </div>
    </div>
  );
};

export default MainCard;
