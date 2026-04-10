import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'
import NotificationBell from '../../components/NotificationBell'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const priorityDueColor = (dueDate, status) => {
  if (status === 'completed') return null
  if (!dueDate) return null
  const now  = new Date()
  const due  = new Date(dueDate)
  const diff = (due - now) / (1000 * 60 * 60 * 24) // days
  if (diff < 0)  return 'text-red-400 bg-red-500/10 border-red-500/30'   // Overdue
  if (diff <= 2) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' // Due soon
  return null
}

const severityColor = (s) => ({
  critical: 'bg-red-500/20 text-red-400',
  high:     'bg-orange-500/20 text-orange-400',
  medium:   'bg-yellow-500/20 text-yellow-400',
  low:      'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const TesterDashboard = () => {
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [tasks, setTasks]                 = useState([])
  const [bugs, setBugs]                   = useState([])
  const [stats, setStats]                 = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading]             = useState(true)
  const [approving, setApproving]         = useState(null)

  const mlClass = useSidebarCollapsed('managerSidebarCollapsed') // change key per role

  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tRes, bRes, dRes] = await Promise.all([
          fetch('http://localhost:3000/tester/tasks',                   { headers: h }),
          fetch(`http://localhost:3000/tester/bugs?userId=${user._id}`, { headers: h }),
          fetch(`http://localhost:3000/tester/dashboard?userId=${user._id}`, { headers: h }),
        ])
        const [tData, bData, dData] = await Promise.all([tRes.json(), bRes.json(), dRes.json()])
        if (tData.success) setTasks(tData.data || [])
        if (bData.success) setBugs(bData.data  || [])
        if (dData.success) {
          setStats(dData.data.stats)
          setRecentActivity(dData.data.recentActivity || [])
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const handleApprove = async (taskId) => {
    setApproving(taskId)
    try {
      const res    = await fetch(`http://localhost:3000/tester/tasks/${taskId}/approve`, { method: 'PATCH', headers: h })
      const result = await res.json()
      if (result.success) {
        setTasks(prev => prev.filter(t => t._id !== taskId))
        window.dispatchEvent(new Event('notificationUpdated'))
      }
    } catch (err) { console.error(err) }
    finally { setApproving(null) }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const statCards = [
    { label: 'Tasks To Test',    value: tasks.length,                                color: 'from-blue-500 to-cyan-500',    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Bugs Reported',    value: bugs.length,                                 color: 'from-red-500 to-orange-500',   icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Critical Bugs',    value: stats?.criticalBugs ?? bugs.filter(b => b.bugSeverity === 'critical').length, color: 'from-red-600 to-red-800', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
    { label: 'Resolved Bugs',    value: bugs.filter(b => b.resolved).length,         color: 'from-green-500 to-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'High Priority',    value: tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length, color: 'from-orange-500 to-red-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Open Bugs',        value: bugs.filter(b => !b.resolved).length,        color: 'from-orange-500 to-yellow-500', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* <div className="lg:ml-64 overflow-y-auto h-screen */}
      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen`}>
        [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:bg-white/35">

        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Tester Dashboard</h1>
              <p className="text-slate-300 text-sm">Welcome back, {user?.firstName || 'Tester'}!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* ✅ 6 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-xs mt-1 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ✅ Quick Actions */}
<div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
  <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
  <div className="flex flex-wrap gap-3">
    {[
      {
        label: 'Start Testing',
        path: '/tester/tasks',
        color: 'from-blue-500 to-cyan-500',
        icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        label: 'Report Bug',
        path: '/tester/tasks',
        color: 'from-red-500 to-orange-500',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      },
      {
        label: 'My Bugs',
        path: '/tester/bugs',
        color: 'from-green-500 to-emerald-500',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        label: 'Chat History',
        path: '/tester/chat-history',
        color: 'from-purple-500 to-pink-500',
        icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
      },
    ].map((a, i) => (
      <Link key={i} to={a.path}
        className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${a.color} text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
        </svg>
        {a.label}
      </Link>
    ))}
  </div>
</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Tasks to Test with due date indicators */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Tasks to Test</h2>
                <Link to="/tester/tasks" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
              </div>
              {tasks.length === 0 ? (
                <p className="text-slate-400 text-sm">No tasks to test right now.</p>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map(task => {
                    const dueCls = priorityDueColor(task.dueDate, task.status)
                    return (
                      <div key={task._id}
                        onClick={() => navigate(`/tester/tasks/${task._id}`)}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-blue-400 text-xs">{task.issueKey}</span>
                            <p className="text-white font-medium truncate">{task.title}</p>
                            <p className="text-slate-400 text-xs mt-1">
                              {task.project?.name} • {task.assignedTo?.firstName} {task.assignedTo?.lastName}
                            </p>
                            {/* ✅ Due date indicator */}
                            {task.dueDate && dueCls && (
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs border ${dueCls}`}>
                                {new Date(task.dueDate) < new Date() ? '⚠ Overdue' : '⏰ Due Soon'} — {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                            }`}>{task.priority}</span>
                            <span className="text-blue-400 text-xs group-hover:text-blue-300">Review →</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ✅ Recent Activity Panel */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                <Link to="/tester/bugs" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
              </div>
              {recentActivity.length === 0 && bugs.length === 0 ? (
                <p className="text-slate-400 text-sm">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {(recentActivity.length > 0 ? recentActivity : bugs.slice(0, 5)).map((item, i) => (
                    <div key={item._id || i}
                      onClick={() => navigate(`/tester/bugs/${item._id}`)}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(item.bugSeverity)}`}>
                          {item.bugSeverity}
                        </span>
                        <span className={`text-xs font-medium ${item.resolved ? 'text-green-400' : 'text-red-400'}`}>
                          {item.resolved ? 'Resolved' : 'Open'}
                        </span>
                      </div>
                      <p className="text-white text-sm line-clamp-1 mb-1">{item.comment}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-slate-400 text-xs">
                          {item.task?.issueKey} — {item.task?.title ?? 'N/A'}
                        </p>
                        <span className="text-blue-400 text-xs group-hover:text-blue-300">Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* My Reported Bugs summary */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">My Reported Bugs</h2>
              <Link to="/tester/bugs" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
            </div>
            {bugs.length === 0 ? (
              <p className="text-slate-400 text-sm">No bugs reported yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bugs.slice(0, 4).map(bug => (
                  <div key={bug._id}
                    onClick={() => navigate(`/tester/bugs/${bug._id}`)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>
                        {bug.bugSeverity}
                      </span>
                      <span className={`text-xs font-medium ${bug.resolved ? 'text-green-400' : 'text-red-400'}`}>
                        {bug.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </div>
                    <p className="text-white text-sm line-clamp-1 mb-1">{bug.comment}</p>
                    <p className="text-slate-400 text-xs">
                      {bug.task?.issueKey} — {bug.task?.title ?? 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default TesterDashboard