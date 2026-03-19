import React, { useState } from 'react';

const DeveloperDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: 'Assigned Tasks', value: '8', color: 'from-blue-500 to-cyan-500' },
    { label: 'In Progress', value: '3', color: 'from-yellow-500 to-orange-500' },
    { label: 'Completed', value: '24', color: 'from-green-500 to-emerald-500' },
    { label: 'Bugs Fixed', value: '156', color: 'from-purple-500 to-pink-500' },
  ];

  const myTasks = [
    { id: 'TASK-001', title: 'Fix login authentication bug', priority: 'High', status: 'In Progress', dueDate: '2 days', module: 'Authentication' },
    { id: 'TASK-002', title: 'Implement user profile page', priority: 'Medium', status: 'To Do', dueDate: '5 days', module: 'User Management' },
    { id: 'TASK-003', title: 'Optimize database queries', priority: 'Low', status: 'In Review', dueDate: '1 week', module: 'Backend' },
  ];

  const recentBugs = [
    { id: 'BUG-045', title: 'Button not responsive on mobile', reporter: 'Sarah (Tester)', status: 'Open', priority: 'High' },
    { id: 'BUG-046', title: 'API timeout on large requests', reporter: 'Mike (Tester)', status: 'In Progress', priority: 'Critical' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
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
              { name: 'My Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { name: 'My Bugs', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
              { name: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
              { name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
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
                  D
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Developer</p>
                  <p className="text-slate-400 text-xs">dev@company.com</p>
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
                  <h1 className="text-2xl font-bold text-white">Developer Dashboard</h1>
                  <p className="text-slate-300 text-sm">Let's ship some code today!</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
                <h3 className="text-slate-300 text-sm mb-2">{stat.label}</h3>
                <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full bg-linear-to-r ${stat.color}`} style={{ width: '70%' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Tasks */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">My Tasks</h2>
                  <button className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all duration-200">
                    + New Task
                  </button>
                </div>
                <div className="space-y-4">
                  {myTasks.map((task, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-blue-400 text-sm font-mono">{task.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                              task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <h3 className="text-white font-medium mb-1">{task.title}</h3>
                          <p className="text-slate-400 text-sm">Module: {task.module}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                          task.status === 'To Do' ? 'bg-slate-500/20 text-slate-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Due in {task.dueDate}</span>
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bugs */}
            <div>
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Bugs</h2>
                <div className="space-y-4">
                  {recentBugs.map((bug, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 text-sm font-mono">{bug.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          bug.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {bug.priority}
                        </span>
                      </div>
                      <h3 className="text-white text-sm font-medium mb-2">{bug.title}</h3>
                      <p className="text-slate-400 text-xs mb-3">Reported by {bug.reporter}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        bug.status === 'Open' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {bug.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Commits Today */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">Today's Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Commits</span>
                    <span className="text-white font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Code Reviews</span>
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Pull Requests</span>
                    <span className="text-white font-bold">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeveloperDashboard;


