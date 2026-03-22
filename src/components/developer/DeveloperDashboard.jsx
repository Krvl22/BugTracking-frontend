import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

const DeveloperDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [tasks, setTasks] = useState([])
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getDashboardData = async () => {
      const token = localStorage.getItem("token")

      // Fetch tasks
      const tasksRes = await fetch(`http://localhost:3000/developer/tasks?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const tasksData = await tasksRes.json()
      console.log("Developer tasks:", tasksData)
      if (tasksData.success) {
        setTasks(tasksData.data)
      }

      // Fetch bugs
      const bugsRes = await fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const bugsData = await bugsRes.json()
      console.log("Developer bugs:", bugsData)
      if (bugsData.success) {
        setBugs(bugsData.data)
      }

      setLoading(false)
    }
    getDashboardData()
  }, [])

  // Calculate stats from tasks
  const statCards = [
    { label: 'Assigned Tasks', value: tasks.length, color: 'from-blue-500 to-cyan-500' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: 'from-yellow-500 to-orange-500' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'from-green-500 to-emerald-500' },
    { label: 'Submitted', value: tasks.filter(t => t.status === 'submitted').length, color: 'from-purple-500 to-pink-500' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

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
            <Link to="/developerdashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
              Bug Tracker
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { name: 'Dashboard', path: '/developerdashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', active: true },
              { name: 'My Tasks', path: '/developer/tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { name: 'My Bugs', path: '/developer/bugs', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
              { name: 'Projects', path: '/developer/projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
              { name: 'Profile', path: '/developer/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path}
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
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-3 right-3">
            <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-slate-400 text-xs">{user?.email}</p>
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
                <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
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
            {statCards.map((stat, index) => (
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
                <h2 className="text-xl font-bold text-white mb-6">My Tasks</h2>
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <p className="text-slate-400">No tasks assigned yet.</p>
                  ) : (
                    tasks.map((task) => (
                      <div key={task._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-blue-400 text-sm font-mono">{task.issueKey}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <h3 className="text-white font-medium mb-1">{task.title}</h3>
                            <p className="text-slate-400 text-sm">Module: {task.module?.name ?? 'N/A'}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Bugs */}
            <div>
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">Recent Bugs</h2>
                <div className="space-y-4">
                  {bugs.length === 0 ? (
                    <p className="text-slate-400">No bugs reported yet.</p>
                  ) : (
                    bugs.map((bug) => (
                      <div key={bug._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h3 className="text-white text-sm font-medium mb-2">{bug.comment}</h3>
                        <p className="text-slate-400 text-xs mb-2">Task: {bug.task?.title ?? 'N/A'}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          bug.bugSeverity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          bug.bugSeverity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          bug.bugSeverity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {bug.bugSeverity}
                        </span>
                      </div>
                    ))
                  )}
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