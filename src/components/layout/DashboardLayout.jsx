import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ role, children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;