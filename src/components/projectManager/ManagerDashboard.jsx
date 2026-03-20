import React, { useState ,useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 

const ManagerDashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.clear();
    navigate("/"); 
  };
  const [stats, setStats]=useState(null)
  const [projects,setProjects]=useState([])
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const getDashboardData = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:3000/manager/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      setStats(data.data.stats)
      setProjects(data.data.projects)
      setTeam(data.data.team)
    }
    setLoading(false)
  }
  getDashboardData()
}, [])

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
                { name: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
                { name: 'Team',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                { name: 'Tasks',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { name: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              ].map((item, index) => (
                <a key={index} href="#"
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    item.active ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-white/10'
                  }`}>
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
                  PM
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Project Manager</p>
                  <p className="text-slate-400 text-xs">pm@company.com</p>
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
                  <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
                  <p className="text-slate-300 text-sm">Manage your team and projects</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                  + New Project
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
            {[
              { label: 'Active Projects', value: stats?.totalProjects ?? '...', change: '+2',  color: 'from-blue-500 to-cyan-500' },
              { label: 'Total Tasks',     value: stats?.totalTasks    ?? '...', change: '+18', color: 'from-purple-500 to-pink-500' },
              { label: 'Team Members',    value: stats?.teamMembers   ?? '...', change: '+3',  color: 'from-green-500 to-emerald-500' },
              { label: 'Pending Bugs',    value: stats?.pendingBugs   ?? '...', change: '-12', color: 'from-orange-500 to-red-500' },
            ].map((stat, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-300 text-sm">{stat.label}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>{stat.change}</span>
                </div>
                <p className="text-4xl font-bold text-white mb-3">{stat.value}</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full bg-linear-to-r ${stat.color}`} style={{ width: '65%' }}></div>
                </div>
              </div>
            ))}
          </div>
          {/* Projects Overview */}
          <div className="mb-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Active Projects</h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-medium text-lg mb-2">{project.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="text-slate-400">Key: {project.projectKey}</span>
                          <span className="text-slate-400">•</span>
                          {/* ── these don't exist yet — show N/A ── */}
                          <span className="text-slate-400">Team: N/A</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-400">Tasks: N/A</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-400">
                            Due: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No deadline'}
                          </span>
                        </div>
                      </div>
                      <span className={`mt-3 lg:mt-0 inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                        project.status === 'active'    ? 'bg-green-500/20 text-green-400' :
                        project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{project.status}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white font-medium">50%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        {/* hardcoded 50% until we calculate real progress */}
                        <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Performance */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Team Performance</h2>
              <div className="space-y-4">
                {team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                        {member.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.firstName} {member.lastName}</p>
                        <p className="text-slate-400 text-sm capitalize">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {/* hardcoded until we add task counts to backend */}
                      <p className="text-white font-medium">0 Active</p>
                      <p className="text-green-400 text-sm">0 Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Assign Task', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                  { name: 'Create Module', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
                  { name: 'View Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                  { name: 'Team Meeting', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 text-left group"
                  >
                    <svg className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                    <p className="text-white text-sm font-medium">{action.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;



