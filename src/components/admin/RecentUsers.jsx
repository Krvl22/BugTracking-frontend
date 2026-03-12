// import React from 'react'

// const RecentUsers = () => {

//   const users = [
//     { id: 1, name: 'John Doe', email: 'john@company.com', status: 'Active', time: '2 days ago' },
//     { id: 2, name: 'Sarah Smith', email: 'sarah@company.com', status: 'Active', time: '5 days ago' },
//     { id: 3, name: 'Mike Johnson', email: 'mike@company.com', status: 'Inactive', time: '1 week ago' },
//   ]

//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm flex-1">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-gray-800">Recent Users</h3>
//         <button className="text-blue-600 text-sm hover:underline">View All</button>
//       </div>

//       {/* Users List */}
//       <div className="flex flex-col gap-3">
//         {users.map((user) => (
//           <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">

//             {/* Avatar + Name + Email */}
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
//                 {user.name.charAt(0)}
//               </div>
//               <div>
//                 <p className="font-semibold text-sm text-gray-800">{user.name}</p>
//                 <p className="text-xs text-gray-500">{user.email}</p>
//               </div>
//             </div>

//             {/* Status + Time */}
//             <div className="flex flex-col items-end gap-1">
//               <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
//                 {user.status}
//               </span>
//               <p className="text-xs text-gray-400">{user.time}</p>
//             </div>

//           </div>
//         ))}
//       </div>

//     </div>
//   )
// }

// export default RecentUsers


const users = [
  { name: "Arjun Mehta", role: "Developer", tasks: 7, bugs: 3, initials: "AM" },
  { name: "Priya Rao", role: "Tester", tasks: 12, bugs: 0, initials: "PR" },
  { name: "Raj Kumar", role: "Developer", tasks: 5, bugs: 8, initials: "RK" },
  { name: "Sneha Verma", role: "Project Manager", tasks: 4, bugs: 0, initials: "SV" },
  { name: "Dev Sharma", role: "Developer", tasks: 9, bugs: 2, initials: "DS" },
];

const roleColors = {
  Developer: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Tester: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  "Project Manager": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
};

const RecentUsers = () => {
  return (
    <div className="flex-1 bg-[#111936] border border-[#1e2a4a] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#1e2a4a] flex items-center justify-between">
        <h3 className="text-white font-semibold text-base">Team Members</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          Manage →
        </button>
      </div>

      <div className="divide-y divide-[#1e2a4a]">
        {users.map((user) => (
          <div
            key={user.name}
            className="px-6 py-4 flex items-center gap-4 hover:bg-[#1a2340] transition-colors"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-md font-medium mt-0.5 inline-block ${roleColors[user.role]}`}>
                {user.role}
              </span>
            </div>

            {/* Stats */}
            <div className="text-right shrink-0">
              <p className="text-[#6b7db3] text-xs">{user.tasks} tasks</p>
              {user.bugs > 0 ? (
                <p className="text-red-400 text-xs font-semibold">{user.bugs} bugs</p>
              ) : (
                <p className="text-emerald-400 text-xs">Clean</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
