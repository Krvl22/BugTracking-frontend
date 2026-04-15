import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeveloperSidebar from '../../components/developer/DeveloperSidebar'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'


const SEVERITY_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']
const STATUS_COLORS   = ['#3b82f6', '#eab308', '#ef4444', '#a855f7', '#06b6d4', '#22c55e']

const DeveloperAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tasks, setTasks]             = useState([])
  const [bugs, setBugs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const mlClass = useSidebarCollapsed('testerSidebarCollapsed')

  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tRes, bRes] = await Promise.all([
          fetch(`http://localhost:3000/developer/tasks?userId=${user._id}`, { headers: h }),
          fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`,  { headers: h }),
        ])
        const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
        if (tData.success) setTasks(tData.data || [])
        if (bData.success) setBugs(bData.data  || [])
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const completionRate = tasks.length
    ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
    : 0

  const bugResolutionRate = bugs.length
    ? Math.round((bugs.filter(b => b.resolved).length / bugs.length) * 100)
    : 0

  const statusData = [
    { name: 'Assigned',    value: tasks.filter(t => t.status === 'assigned').length },
    { name: 'In Progress', value: tasks.filter(t => ['in_progress', 'fix_in_progress'].includes(t.status)).length },
    { name: 'Bug Found',   value: tasks.filter(t => t.status === 'bug_found').length },
    { name: 'Submitted',   value: tasks.filter(t => ['submitted', 'in_testing', 'resubmitted'].includes(t.status)).length },
    { name: 'Completed',   value: tasks.filter(t => t.status === 'completed').length },
  ].filter(d => d.value > 0)

  const severityData = [
    { name: 'Critical', value: bugs.filter(b => b.bugSeverity === 'critical').length },
    { name: 'High',     value: bugs.filter(b => b.bugSeverity === 'high').length },
    { name: 'Medium',   value: bugs.filter(b => b.bugSeverity === 'medium').length },
    { name: 'Low',      value: bugs.filter(b => b.bugSeverity === 'low').length },
  ].filter(d => d.value > 0)

  const monthlyData = (() => {
    const map = {}
    tasks.filter(t => t.status === 'completed').forEach(t => {
      const month = new Date(t.updatedAt || t.createdAt).toLocaleString('default', { month: 'short' })
      map[month] = (map[month] || 0) + 1
    })
    return Object.entries(map).map(([month, count]) => ({ month, tasks: count }))
  })()

  const projectMap = {}
  tasks.forEach(t => {
    const key  = t.project?._id || t.project
    const name = t.project?.name || 'Unknown'
    if (!projectMap[key]) projectMap[key] = { name, total: 0, done: 0 }
    projectMap[key].total++
    if (t.status === 'completed') projectMap[key].done++
  })
  const projectProgress = Object.values(projectMap)

  const statCards = [
    { label: 'Total Tasks',     value: tasks.length,                                       color: 'from-blue-500 to-cyan-500',    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { label: 'Completed',       value: tasks.filter(t => t.status === 'completed').length,  color: 'from-green-500 to-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Open Bugs',       value: bugs.filter(b => !b.resolved).length,                color: 'from-red-500 to-orange-500',   icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Completion Rate', value: `${completionRate}%`,                                color: 'from-purple-500 to-pink-500',  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <DeveloperSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>

        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">My Analytics</h1>
              <p className="text-slate-300 text-sm">Your performance overview</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${s.color} flex items-center justify-center text-white mb-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>
                <h3 className="text-slate-300 text-sm mb-1">{s.label}</h3>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Performance Overview */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Performance Overview</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300 text-sm">Task Completion Rate</span>
                  <span className="text-white font-bold">{completionRate}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-700" style={{ width: `${completionRate}%` }} />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tasks.filter(t => t.status === 'completed').length} of {tasks.length} tasks completed</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300 text-sm">Bug Resolution Rate</span>
                  <span className="text-white font-bold">{bugResolutionRate}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700" style={{ width: `${bugResolutionRate}%` }} />
                </div>
                <p className="text-slate-400 text-xs mt-1">{bugs.filter(b => b.resolved).length} of {bugs.length} bugs resolved</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300 text-sm">Open Bugs</span>
                  <span className="text-white font-bold">{bugs.filter(b => !b.resolved).length}</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700"
                    style={{ width: bugs.length ? `${Math.round((bugs.filter(b => !b.resolved).length / bugs.length) * 100)}%` : '0%' }} />
                </div>
                <p className="text-slate-400 text-xs mt-1">{bugs.filter(b => !b.resolved).length} of {bugs.length} bugs still open</p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Task Status Breakdown</h2>
              {statusData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <p>No task data yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                      {statusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      formatter={(value, name) => [`${value} tasks`, name]} />
                    <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{value}</span>} wrapperStyle={{ paddingTop: '16px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Bug Severity Breakdown</h2>
              {severityData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <svg className="w-12 h-12 mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No bugs on your tasks yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={severityData} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                      {severityData.map((_, i) => <Cell key={i} fill={SEVERITY_COLORS[i % SEVERITY_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      formatter={(value, name) => [`${value} bugs`, name]} />
                    <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{value}</span>} wrapperStyle={{ paddingTop: '16px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Progress by Project */}
          {projectProgress.length > 0 && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Progress by Project</h2>
              <div className="space-y-5">
                {projectProgress.map((p, i) => {
                  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">{p.name}</span>
                        <span className="text-slate-400">{p.done} / {p.total} tasks</span>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Monthly Trend */}
          {monthlyData.length > 0 && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Monthly Task Completions</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Tasks Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default DeveloperAnalytics