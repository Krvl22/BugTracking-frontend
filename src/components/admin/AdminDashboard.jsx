// import React from 'react'
// import AdminSidebar from './AdminSidebar'
// import AdminHeader from './AdminHeader'
// import StateCard from './StateCard'
// import RecentUsers from './RecentUsers'
// import QuickActions from './QuickActions'

// const AdminDashboard = () => {

//   const stats = [
//     { title: 'Total Users', value: '124', change: '+12%' },
//     { title: 'Active Projects', value: '18', change: '+5%' },
//     { title: 'Total Bugs', value: '342', change: '-8%' },
//     { title: 'System Health', value: '98%', change: '+2%' },
//   ]

//   return (
//     <div className="flex h-screen bg-[#0a0f26]">

//       {/* Left - Sidebar */}
//       <AdminSidebar />

//       {/* Right - Main Content */}
//       <div className="flex-1 ml-64 flex flex-col overflow-y-auto">

//         <AdminHeader
//           title="Admin Dashboard"
//           subtitle="Sunday, 01 March 2026"
//         />

//         <div className="p-8 flex flex-col gap-6">

//           {/* Stat Cards */}
//           <div className="grid grid-cols-4 gap-4">
//             {stats.map((stat) => (
//               <StateCard
//                 key={stat.title}
//                 title={stat.title}
//                 value={stat.value}
//                 change={stat.change}
//               />
//             ))}
//           </div>

//           {/* Bottom Section */}
//           <div className="flex gap-4">
//             <RecentUsers />
//             <QuickActions />
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard





import React, { useState } from 'react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: 'Total Users', value: '124', change: '+12%', icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Projects', value: '18', change: '+5%', icon: '📊', color: 'from-emerald-500 to-teal-500' },
    { label: 'Total Bugs', value: '342', change: '-8%', icon: '🐛', color: 'from-orange-500 to-red-500' },
    { label: 'System Health', value: '98%', change: '+2%', icon: '⚡', color: 'from-purple-500 to-pink-500' },
  ];

  const recentUsers = [
    { name: 'John Doe', email: 'john@company.com', role: 'Developer', status: 'Active', joined: '2 days ago' },
    { name: 'Sarah Smith', email: 'sarah@company.com', role: 'Tester', status: 'Active', joined: '5 days ago' },
    { name: 'Mike Johnson', email: 'mike@company.com', role: 'Manager', status: 'Pending', joined: '1 week ago' },
  ];

  const projects = [
    { name: 'E-Commerce Platform', team: 12, bugs: 23, progress: 75, status: 'On Track' },
    { name: 'Mobile App Redesign', team: 8, bugs: 15, progress: 60, status: 'In Progress' },
    { name: 'API Integration', team: 5, bugs: 8, progress: 90, status: 'Almost Done' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20">
          <div className="flex items-center justify-between mb-8 px-3">
            <h2 className="text-xl font-bold text-white">Bug Tracker</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', active: true },
              { name: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { name: 'Projects', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            ].map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </a>
            ))}
          </nav>

          <div className="absolute bottom-4 left-3 right-3">
            <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Admin User</p>
                  <p className="text-slate-400 text-xs">admin@company.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-slate-300 text-sm">Welcome back, Admin!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-slate-300 text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Users */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Users</h2>
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-slate-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {user.status}
                        </span>
                        <p className="text-slate-400 text-xs mt-1">{user.joined}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  {['Add New User', 'Create Project', 'View Reports', 'System Settings'].map((action, index) => (
                    <button
                      key={index}
                      className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-left transition-all duration-200"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Overview */}
          <div className="mt-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Active Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <h3 className="text-white font-medium mb-3">{project.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Team Size</span>
                        <span className="text-white">{project.team} members</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Open Bugs</span>
                        <span className="text-white">{project.bugs}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;