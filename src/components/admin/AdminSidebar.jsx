import React from 'react'
import { Link } from 'react-router-dom'

const AdminSidebar = () => {

  const navLinks = [
    { name: 'Dashboard', path: '/admindashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Analytics', path: '/admin/analytics' },
    { name: 'Settings', path: '/admin/settings' },
  ]

  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col justify-between p-6">

      {/* Top - Logo */}
      <div>
        <h2 className="text-2xl font-bold mb-10">Bug Tracker</h2>

        {/* Nav Links */}
        <nav>
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="block px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom - User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
          A
        </div>
        <div>
          <p className="font-semibold text-sm">Admin User</p>
          <p className="text-xs text-blue-300">admin@company.com</p>
        </div>
      </div>

    </div>
  )
}

export default AdminSidebar




// import { useState } from "react";

// const navItems = [
//   { label: "Dashboard", path: "/admin" },
//   { label: "Projects", path: "/admin/projects" },
//   { label: "Tasks", path: "/admin/tasks" },
//   { label: "Bugs", path: "/admin/bugs" },
//   { label: "Users", path: "/admin/users" },
//   { label: "Reports", path: "/admin/reports" },
// ];

// const AdminSidebar = ({ active = "Dashboard" }) => {
//   const [activeItem, setActiveItem] = useState(active);

//   return (
//     <div className="fixed top-0 left-0 h-screen w-64 bg-[#0f1535] border-r border-[#1e2a4a] flex flex-col z-50">
//       {/* Brand */}
//       <div className="px-6 py-6 border-b border-[#1e2a4a]">
//         <h1 className="text-white text-xl font-bold tracking-tight">Bug Tracker</h1>
//         <p className="text-[#6b7db3] text-xs mt-1">Admin Panel</p>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-4 space-y-1">
//         {navItems.map((item) => (
//           <button
//             key={item.label}
//             onClick={() => setActiveItem(item.label)}
//             className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
//               activeItem === item.label
//                 ? "bg-linear-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg shadow-blue-900/40"
//                 : "text-[#6b7db3] hover:text-white hover:bg-[#1e2a4a]"
//             }`}
//           >
//             {item.label}
//           </button>
//         ))}
//       </nav>

//       {/* User */}
//       <div className="px-4 py-4 border-t border-[#1e2a4a]">
//         <div className="flex items-center gap-3 px-2">
//           <div className="w-9 h-9 rounded-full bg-linear  -to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
//             A
//           </div>
//           <div className="min-w-0">
//             <p className="text-white text-sm font-semibold truncate">Admin</p>
//             <p className="text-[#6b7db3] text-xs truncate">admin@bugtrack.io</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;
