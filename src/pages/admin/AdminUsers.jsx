// import React, { useState, useEffect } from "react";
// import { getAllUsers, deleteUser, blockUser, reactivateUser } from "../../services/userService";
// import { toast } from "react-toastify";

// const AdminUsers = () => {
//   const [users,   setUsers]   = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getAllUsers()
//       .then(res => setUsers(res.data.data)) // ✅ backend returns { success, data: [...] }
//       .catch(() => toast.error("Failed to load users"))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this user?")) return;
//     try {
//       await deleteUser(id);
//       setUsers(users.filter(u => u._id !== id));
//       toast.success("User deleted");
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   const handleBlock = async (id) => {
//     if (!window.confirm("Block this user?")) return;
//     try {
//       await blockUser(id);
//       // update status in UI instantly
//       setUsers(users.map(u =>
//         u._id === id ? { ...u, status: "blocked", isActive: false } : u
//       ));
//       toast.success("User blocked");
//     } catch {
//       toast.error("Block failed");
//     }
//   };

//   const handleReactivate = async (id) => {
//     try {
//       await reactivateUser(id);
//       setUsers(users.map(u =>
//         u._id === id ? { ...u, status: "active", isActive: true } : u
//       ));
//       toast.success("User reactivated");
//     } catch {
//       toast.error("Reactivate failed");
//     }
//   };

//   if (loading) return (
//     <div className="p-6 bg-slate-900 min-h-screen text-white">Loading...</div>
//   );

//   return (
//     <div className="p-6 bg-slate-900 min-h-screen text-white">
//       <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

//       <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-700 text-gray-300">
//             <tr>
//               <th className="p-3">Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Role</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Created At</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id} className="border-t border-slate-700 hover:bg-slate-700/40">

//                 {/* ✅ backend returns firstName + lastName separately */}
//                 <td className="p-3">{user.firstName} {user.lastName}</td>

//                 <td className="p-3">{user.email}</td>

//                 {/* ✅ role is populated object { name: "admin" } */}
//                 <td className="p-3">
//                   <span className="bg-blue-600 px-2 py-1 rounded text-sm capitalize">
//                     {user.role?.name || user.role || "N/A"}
//                   </span>
//                 </td>

//                 {/* ✅ backend has isActive + status fields */}
//                 <td className="p-3">
//                   <span className={`px-2 py-1 rounded text-sm ${
//                     user.isActive
//                       ? "bg-green-600"
//                       : user.status === "blocked"
//                       ? "bg-red-600"
//                       : "bg-yellow-600"
//                   }`}>
//                     {user.isActive ? "Active" : user.status}
//                   </span>
//                 </td>

//                 <td className="p-3">
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </td>

//                 {/* ✅ 3 action buttons based on your backend routes */}
//                 <td className="p-3">
//                   <div className="flex gap-2">
//                     {user.isActive ? (
//                       <button
//                         onClick={() => handleBlock(user._id)}
//                         className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700 text-sm"
//                       >
//                         Block
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleReactivate(user._id)}
//                         className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-sm"
//                       >
//                         Reactivate
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleDelete(user._id)}
//                       className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Empty state */}
//         {users.length === 0 && (
//           <div className="text-center text-slate-400 py-8">No users found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;




import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../services/userService";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">Loading...</div>
  );

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
              <tr key={user._id} className="border-t border-slate-700 hover:bg-slate-700/40">
                <td className="p-3">{user.firstName} {user.lastName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span className="bg-blue-600 px-2 py-1 rounded text-sm capitalize">
                    {user.role?.name || "N/A"}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.isActive ? "bg-green-600" : "bg-red-600"
                  }`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center text-slate-400 py-8">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;