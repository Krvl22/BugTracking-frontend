// import React, { useState, useEffect } from "react";
// import { getAllProjects, deleteProject, changeProjectStatus } from "../../services/projectService";
// import { toast } from "react-toastify";

// const AdminProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading,  setLoading]  = useState(true);

//   useEffect(() => {
//     getAllProjects()
//       .then(res => setProjects(res.data.data)) // ✅ backend returns { success, data: [...] }
//       .catch(() => toast.error("Failed to load projects"))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this project?")) return;
//     try {
//       await deleteProject(id);
//       setProjects(projects.filter(p => p._id !== id));
//       toast.success("Project deleted");
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       await changeProjectStatus(id, newStatus);
//       setProjects(projects.map(p =>
//         p._id === id ? { ...p, status: newStatus } : p
//       ));
//       toast.success("Status updated");
//     } catch {
//       toast.error("Status update failed");
//     }
//   };

//   if (loading) return (
//     <div className="p-6 bg-slate-900 min-h-screen text-white">Loading...</div>
//   );

//   return (
//     <div className="p-6 bg-slate-900 min-h-screen text-white">
//       <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>

//       <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-700 text-gray-300">
//             <tr>
//               <th className="p-3">Project Name</th>
//               <th className="p-3">Key</th>
//               <th className="p-3">Created By</th>
//               <th className="p-3">Team</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Created At</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {projects.map((project) => (
//               <tr key={project._id} className="border-t border-slate-700 hover:bg-slate-700/40">

//                 <td className="p-3 font-medium">{project.name}</td>

//                 {/* ✅ backend has projectKey field */}
//                 <td className="p-3">
//                   <span className="bg-slate-600 px-2 py-1 rounded text-xs">
//                     {project.projectKey}
//                   </span>
//                 </td>

//                 {/* ✅ createdBy is populated { firstName, lastName, email } */}
//                 <td className="p-3">
//                   {project.createdBy?.firstName} {project.createdBy?.lastName}
//                 </td>

//                 {/* ✅ teamMembers is populated array */}
//                 <td className="p-3">
//                   {project.teamMembers?.length || 0} members
//                 </td>

//                 {/* ✅ status dropdown using your changeProjectStatus route */}
//                 <td className="p-3">
//                   <select
//                     value={project.status}
//                     onChange={(e) => handleStatusChange(project._id, e.target.value)}
//                     className={`px-2 py-1 rounded text-sm bg-slate-700 border-0 cursor-pointer ${
//                       project.status === "active"   ? "text-green-400" :
//                       project.status === "inactive" ? "text-red-400"   :
//                       "text-yellow-400"
//                     }`}
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="completed">Completed</option>
//                   </select>
//                 </td>

//                 <td className="p-3">
//                   {new Date(project.createdAt).toLocaleDateString()}
//                 </td>

//                 <td className="p-3">
//                   <button
//                     onClick={() => handleDelete(project._id)}
//                     className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
//                   >
//                     Delete
//                   </button>
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {projects.length === 0 && (
//           <div className="text-center text-slate-400 py-8">No projects found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminProjects;




import React, { useState, useEffect } from "react";
import { getAllProjects, deleteProject } from "../../services/projectService";
import { toast } from "react-toastify";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getAllProjects()
      .then(res => setProjects(res.data.data))
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p._id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">Loading...</div>
  );

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>

      <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-700 text-gray-300">
            <tr>
              <th className="p-3">Project Name</th>
              <th className="p-3">Key</th>
              <th className="p-3">Created By</th>
              <th className="p-3">Team</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-t border-slate-700 hover:bg-slate-700/40">
                <td className="p-3">{project.name}</td>
                <td className="p-3">
                  <span className="bg-slate-600 px-2 py-1 rounded text-xs">
                    {project.projectKey}
                  </span>
                </td>
                <td className="p-3">
                  {project.createdBy?.firstName} {project.createdBy?.lastName}
                </td>
                <td className="p-3">
                  {project.teamMembers?.length || 0} members
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    project.status === "active" ? "bg-green-600" : "bg-red-600"
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="text-center text-slate-400 py-8">No projects found</div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;