// import React from 'react'

// const QuickActions = () => {

//   const actions = [
//     { id: 1, name: 'Add New User' },
//     { id: 2, name: 'Create Project' },
//     { id: 3, name: 'View Reports' },
//   ]

//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm w-72">

//       <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>

//       <div className="flex flex-col gap-3">
//         {actions.map((action) => (
//           <button
//             key={action.id}
//             className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors text-gray-700"
//           >
//             {action.name}
//           </button>
//         ))}
//       </div>

//     </div>
//   )
// }

// export default QuickActions




const actions = [
  { label: "Create Project", description: "Start a new project", color: "from-blue-600 to-blue-700", hover: "hover:from-blue-500 hover:to-blue-600" },
  { label: "Add Task", description: "Create task under module", color: "from-[#1e2a4a] to-[#1e2a4a]", hover: "hover:from-[#263354] hover:to-[#263354]", border: "border border-[#2d3d6b]" },
  { label: "Assign Developer", description: "Assign task to developer", color: "from-[#1e2a4a] to-[#1e2a4a]", hover: "hover:from-[#263354] hover:to-[#263354]", border: "border border-[#2d3d6b]" },
  { label: "View Reports", description: "Analytics & performance", color: "from-[#1e2a4a] to-[#1e2a4a]", hover: "hover:from-[#263354] hover:to-[#263354]", border: "border border-[#2d3d6b]" },
  { label: "Manage Users", description: "Add or edit team members", color: "from-[#1e2a4a] to-[#1e2a4a]", hover: "hover:from-[#263354] hover:to-[#263354]", border: "border border-[#2d3d6b]" },
  { label: "+ Report Bug", description: "Log a new bug manually", color: "from-red-700 to-red-800", hover: "hover:from-red-600 hover:to-red-700" },
];

const QuickActions = () => {
  return (
    <div className="w-72 bg-[#111936] border border-[#1e2a4a] rounded-2xl overflow-hidden shrink-0">
      <div className="px-6 py-4 border-b border-[#1e2a4a]">
        <h3 className="text-white font-semibold text-base">Quick Actions</h3>
        <p className="text-[#6b7db3] text-xs mt-0.5">Common admin tasks</p>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className={`w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} ${action.hover} ${action.border || ""} transition-all duration-150 group`}
          >
            <p className="text-white text-sm font-semibold">{action.label}</p>
            <p className="text-[#6b7db3] text-xs mt-0.5 group-hover:text-[#8b9fc3] transition-colors">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
