// import React from 'react'

// const AdminHeader = () => {
//   return (
//     <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">

//       {/* Left - Title */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
//         <p className="text-sm text-gray-500">Welcome back, Admin!</p>
//       </div>

//       {/* Right - Bell and Logout */}
//       <div className="flex items-center gap-4">

//         {/* Notification Bell */}
//         <button className="relative">
//           <span className="text-2xl">🔔</span>
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
//             1
//           </span>
//         </button>

//         {/* Logout Button */}
//         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//           Logout
//         </button>

//       </div>
//     </div>
//   )
// }

// export default AdminHeader




const AdminHeader = ({ title = "Admin Dashboard", subtitle = "Sunday, 01 March 2026" }) => {
  return (
    <div className="bg-[#0f1535] border-b border-[#1e2a4a] px-8 py-5 flex items-center justify-between">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-[#6b7db3] text-sm mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button className="w-10 h-10 rounded-xl bg-[#1e2a4a] border border-[#2d3d6b] text-[#6b7db3] hover:text-white hover:border-blue-500 transition-all flex items-center justify-center text-base">
            &#x1F514;
          </button>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center font-bold">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-[#1e2a4a] border border-[#2d3d6b] rounded-xl px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
            AD
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Admin</p>
            <p className="text-[#6b7db3] text-xs mt-0.5">admin@bugtrack.io</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
