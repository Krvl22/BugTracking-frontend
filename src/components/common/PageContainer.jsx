import React from "react";

const PageContainer = ({ title, children }) => {
  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">

      {title && (
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
      )}

      <div className="bg-slate-800 rounded-lg shadow-md p-6">
        {children}
      </div>

    </div>
  );
};

export default PageContainer;