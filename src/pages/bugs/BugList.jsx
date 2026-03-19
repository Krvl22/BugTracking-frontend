// import React from 'react'

// const bugs=[
//     {
//         bugId:1,
//         title:"Login not working",
//         priority:"High",
//         status:"Open",
//         assignedDeveloper:"Sarah Johnson"
//     },
//     {
//         bugId:2,
//         title:"Projects are not opening",
//         priority:"High",
//         status:"Open",
//         assignedDeveloper:"John Willioms"
//     },
//     {
//         bugId:3,
//         title:"Tasks are not opening",
//         priority:"Critical",
//         status:"Pending",
//         assignedDeveloper:"John Doe"
//     }
// ]
// export const BugList = () => {
//   return (
//     <div className="bg-slate-900 min-h-screen text-white">
//         <h1 className="text-2xl font-bold mb-6">Bug Lists</h1>
//         <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">
//             <table className="w-full text-left">
//                 <thead className="bg-slate-700 text-gray-300">
//                     <tr>
//                         <th className="p-3">Bug ID</th>
//                         <th className="p-3">Title</th>
//                         <th className="p-3">Priority</th>
//                         <th className="p-3">Status</th>
//                         <th className="p-3">Assigned Developer</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {bugs.map((bug)=>(
//                         <tr
//                             key={bug.bugId}
//                             className="border-t border-slate-700 hover:bg-slate-700/40"
//                         >
//                         <td className="p-3">BUG-{bug.bugId}</td>
//                         <td className="p-3">{bug.title}</td>
//                         <td className="p-3">{bug.priority}</td>

//                         <td className="p-3">
//                             <span
//                             className={`px-2 py-1 rounded text-sm ${
//                             bug.status === "Open" ? "bg-red-600": bug.status === "Pending"? "bg-yellow-600": "bg-green-600"}`}>
//                             {bug.status}
//                             </span>
//                         </td>

//                         <td className="p-3">{bug.assignedDeveloper}</td>
//                     </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     </div>
//   )
// }
// export default BugList;


import React from "react";
import DataTable from "../../components/common/DataTable";

const bugs = [
  {
    bugId: "BUG-101",
    title: "Login not working",
    priority: "High",
    status: "Open",
    project: "E-Auction",
    createdBy: "Tester",
    assignedDeveloper: "Sarah",
    createdAt: "2026-03-01"
  },
];

const columns = [
  { header: "Bug ID", accessor: "bugId" },
  { header: "Title", accessor: "title" },
  { header: "Project", accessor: "project" },
  { header: "Priority", accessor: "priority" },
  { header: "Status", accessor: "status" },
  { header: "Developer", accessor: "assignedDeveloper" },
  { header: "Created By", accessor: "createdBy" },
  { header: "Created At", accessor: "createdAt" },
];

const BugList = () => {
  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">

      <h1 className="text-2xl font-bold mb-6">Bug List</h1>

      <DataTable columns={columns} data={bugs} />

    </div>
  );
};

export default BugList;