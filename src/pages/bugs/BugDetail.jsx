import React from "react";
import PageContainer from "../../components/common/PageContainer";

const bug = {
  id: 1,
  title: "Login Error",
  description: "Users cannot login on E-Auction platform",
  priority: "High",
  status: "Open",
  assignedDeveloper: "John Doe",
  project: "E-Auction",
  createdBy: "John Wick",
  createdAt: "2026-03-10",
};

const BugDetail = () => {
  return (
    <PageContainer title="Bug Details">

      <div className="grid grid-cols-2 gap-4">

        <p><strong>Title:</strong> {bug.title}</p>
        <p><strong>Priority:</strong> {bug.priority}</p>

        <p><strong>Status:</strong> {bug.status}</p>
        <p><strong>Project:</strong> {bug.project}</p>

        <p><strong>Assigned Developer:</strong> {bug.assignedDeveloper}</p>
        <p><strong>Created By:</strong> {bug.createdBy}</p>

        <p className="col-span-2">
          <strong>Description:</strong> {bug.description}
        </p>

        <p><strong>Created At:</strong> {bug.createdAt}</p>

      </div>

      <div className="mt-6 flex gap-3">
        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Edit
        </button>

        <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Delete
        </button>
      </div>

    </PageContainer>
  );
};

export default BugDetail;