import React from "react";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@yopmail.com",
    role: "Developer",
    status: "Active",
    createdAt: "2026-03-01"
  },
  {
    id: 2,
    name: "John Wick",
    email: "johnwick@yopmail.com",
    role: "Project Manager",
    status: "Active",
    createdAt: "2026-03-03"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mikw@yopmail.com",
    role: "Tester",
    status: "Disabled",
    createdAt: "2026-03-05"
  },
];

const AdminUsers = () => {
  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">

      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-700 text-gray-300">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-700 hover:bg-slate-700/40"
              >
                <td className="p-3">{user.name}</td>

                <td className="p-3">{user.email}</td>

                <td className="p-3">
                  <span className="bg-blue-600 px-2 py-1 rounded text-sm">
                    {user.role}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.status === "Active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="p-3">{user.createdAt}</td>

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

export default AdminUsers;