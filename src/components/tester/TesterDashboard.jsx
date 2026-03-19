import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // ✅ added

const TesterDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = [
    { label: 'Tasks to Test', value: '12', color: 'from-blue-500 to-cyan-500' },
    { label: 'Bugs Found', value: '28', color: 'from-red-500 to-orange-500' },
    { label: 'Tests Passed', value: '45', color: 'from-green-500 to-emerald-500' },
    { label: 'In Review', value: '6', color: 'from-purple-500 to-pink-500' },
  ];

  const tasksToTest = [
    { id: 'TASK-101', title: 'User authentication flow', module: 'Auth Module', developer: 'John Doe', submitted: '2 hours ago', priority: 'High' },
    { id: 'TASK-102', title: 'Profile page UI updates', module: 'User Module', developer: 'Sarah Smith', submitted: '1 day ago', priority: 'Medium' },
    { id: 'TASK-103', title: 'Payment gateway integration', module: 'Payments', developer: 'Mike Johnson', submitted: '3 hours ago', priority: 'Critical' },
  ];

  const myBugs = [
    { id: 'BUG-201', title: 'Login button not clickable on mobile', status: 'Open', priority: 'High', assignedTo: 'John Doe', reported: '1 day ago' },
    { id: 'BUG-202', title: 'Image upload fails for PNG files', status: 'In Progress', priority: 'Medium', assignedTo: 'Sarah Smith', reported: '2 days ago' },
    { id: 'BUG-203', title: 'API timeout on large requests', status: 'Fixed', priority: 'Critical', assignedTo: 'Mike Johnson', reported: '3 days ago' },
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
              { name: 'Tasks to Test', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { name: 'My Bugs', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
              { name: 'Test Cases', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { name: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
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
                  T
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Tester</p>
                  <p className="text-slate-400 text-xs">tester@company.com</p>
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
                  <h1 className="text-2xl font-bold text-white">Tester Dashboard</h1>
                  <p className="text-slate-300 text-sm">Find bugs, ensure quality</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                  + Report Bug
                </button>
                <button 
                  onClick={handleLogout} // ✅ added
                  className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                >
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
                <p className="text-4xl font-bold text-white mb-3">{stat.value}</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full bg-linear-to-r ${stat.color}`} style={{ width: '70%' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks to Test */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Tasks to Test</h2>
                  <select className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Tasks</option>
                    <option>Critical</option>
                    <option>High Priority</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {tasksToTest.map((task, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-blue-400 text-sm font-mono">{task.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              task.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                              task.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <h3 className="text-white font-medium mb-1">{task.title}</h3>
                          <div className="flex items-center space-x-3 text-sm text-slate-400">
                            <span>Module: {task.module}</span>
                            <span>•</span>
                            <span>By: {task.developer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Submitted {task.submitted}</span>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors">
                            Report Bug
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testing Stats */}
            <div>
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
                <h2 className="text-xl font-bold text-white mb-6">Testing Stats</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Pass Rate</span>
                      <span className="text-green-400 font-bold">78%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-green-500 to-emerald-500" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm">Bug Detection</span>
                      <span className="text-orange-400 font-bold">22%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-orange-500 to-red-500" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Total Tests</span>
                      <span className="text-white font-medium">156</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">This Week</span>
                      <span className="text-white font-medium">24</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Avg Time/Test</span>
                      <span className="text-white font-medium">45 min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {['Create Test Case', 'View Test Plans', 'Bug Reports'].map((action, index) => (
                    <button
                      key={index}
                      className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200 text-left"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* My Reported Bugs */}
          <div className="mt-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">My Reported Bugs</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Bug ID</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Title</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Priority</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Assigned To</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium text-sm">Reported</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBugs.map((bug, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-blue-400 font-mono text-sm">{bug.id}</span>
                        </td>
                        <td className="py-4 px-4 text-white">{bug.title}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bug.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            bug.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {bug.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">{bug.assignedTo}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bug.status === 'Fixed' ? 'bg-green-500/20 text-green-400' :
                            bug.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {bug.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-sm">{bug.reported}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TesterDashboard;


