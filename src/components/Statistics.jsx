import React from "react";

const Statistics = ({ applications }) => {
  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    waiting: applications.filter((app) => app.status === "Waiting").length,
    interview: applications.filter((app) => app.status === "Interview").length,
    accepted: applications.filter((app) => app.status === "Accepted").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  const responseRate = stats.total > 0
    ? (((stats.interview + stats.accepted) / stats.total) * 100).toFixed(1)
    : 0;

  const successRate = stats.total > 0
    ? ((stats.accepted / stats.total) * 100).toFixed(1)
    : 0;

  // Calculate interviews this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const interviewsThisWeek = applications.filter((app) => {
    if (app.status === "Interview" && app.applicationDate) {
      const appDate = new Date(app.applicationDate);
      return appDate >= oneWeekAgo;
    }
    return false;
  }).length;

  const StatCard = ({ label, value, sublabel }) => (
    <div className="card-base flex flex-col">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{label}</p>
      <p className="text-3xl font-semibold text-mono text-black">{value}</p>
      {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
    </div>
  );

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Applications"
          value={stats.total}
        />
        <StatCard
          label="Response Rate"
          value={`${responseRate}%`}
          sublabel={`${stats.interview + stats.accepted} responses`}
        />
        <StatCard
          label="Interviews"
          value={stats.interview}
          sublabel={`${interviewsThisWeek} this week`}
        />
        <StatCard
          label="Success Rate"
          value={`${successRate}%`}
          sublabel={`${stats.accepted} offers`}
        />
      </div>

      {/* Active Pipeline */}
      <div className="card-base mt-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Active Pipeline</p>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center">
            <span className="text-mono font-medium text-black">{stats.applied}</span>
            <span className="text-gray-500 ml-1">Applied</span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex items-center">
            <span className="text-mono font-medium text-black">{stats.waiting}</span>
            <span className="text-gray-500 ml-1">Waiting</span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex items-center">
            <span className="text-mono font-medium text-black">{stats.interview}</span>
            <span className="text-gray-500 ml-1">Interview</span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex items-center">
            <span className="text-mono font-medium text-emerald-600">{stats.accepted}</span>
            <span className="text-gray-500 ml-1">Accepted</span>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center">
            <span className="text-mono font-medium text-red-600">{stats.rejected}</span>
            <span className="text-gray-500 ml-1">Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
