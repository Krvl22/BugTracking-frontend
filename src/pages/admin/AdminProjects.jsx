import React from "react";

const projects = [
  {
    projectId: 1,
    projectName: "E Auction",
    manager: "John Wick",
    developers: 5,
    bugCount: 12,
    status: "Active",
    deadline: "25 Jun",
    createdAt: "2026-02-10"
  },
  {
    projectId: 2,
    projectName: "Bug Tracker",
    manager: "John Wick",
    developers: 3,
    bugCount: 6,
    status: "Active",
    deadline: "30 Jun",
    createdAt: "2026-02-15"
  },
];

const AdminProjects = () => {
  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">

      <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>

      <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-700 text-gray-300">
            <tr>
              <th className="p-3">Project Name</th>
              <th className="p-3">Manager</th>
              <th className="p-3">Developers</th>
              <th className="p-3">Bugs</th>
              <th className="p-3">Status</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr
                key={project.projectId}
                className="border-t border-slate-700 hover:bg-slate-700/40"
              >
                <td className="p-3">{project.projectName}</td>

                <td className="p-3">{project.manager}</td>

                <td className="p-3">{project.developers}</td>

                <td className="p-3">{project.bugCount}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      project.status === "Active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>

                <td className="p-3">{project.deadline}</td>

                <td className="p-3">{project.createdAt}</td>

                <td className="p-3 flex gap-2">
                  <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
                    Edit
                  </button>

                  <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
};

export default AdminProjects;