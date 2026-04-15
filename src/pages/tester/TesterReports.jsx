import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']

const TesterReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats]             = useState(null)
  const [bugs, setBugs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const navigate  = useNavigate()
  const mlClass = useSidebarCollapsed('testerSidebarCollapsed')

  const user      = JSON.parse(localStorage.getItem('user') || '{}')
  const token     = localStorage.getItem('token')
  const h         = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const [sRes, bRes] = await Promise.all([
          fetch(`http://localhost:3000/tester/dashboard?userId=${user._id}`, { headers: h }),
          fetch(`http://localhost:3000/tester/bugs?userId=${user._id}`,      { headers: h }),
        ])
        const [sData, bData] = await Promise.all([sRes.json(), bRes.json()])
        if (sData.success) setStats(sData.data.stats)
        if (bData.success) setBugs(bData.data || [])
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetch_()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  const resolveRate  = stats?.bugsFound > 0 ? Math.round((stats.resolvedBugs / stats.bugsFound) * 100) : 0
  const pendingRate  = stats?.totalTasks   > 0 ? Math.round(((stats.tasksForTesting ?? 0) / stats.totalTasks) * 100) : 0

  // Severity breakdown for pie chart
  const severityData = [
    { name: 'Critical', value: bugs.filter(b => b.bugSeverity === 'critical').length },
    { name: 'High',     value: bugs.filter(b => b.bugSeverity === 'high').length },
    { name: 'Medium',   value: bugs.filter(b => b.bugSeverity === 'medium').length },
    { name: 'Low',      value: bugs.filter(b => b.bugSeverity === 'low').length },
  ].filter(d => d.value > 0)

  // Monthly bug trend — group by month
  const monthlyData = (() => {
    const map = {}
    bugs.forEach(b => {
      const month = new Date(b.createdAt).toLocaleString('default', { month: 'short' })
      map[month] = (map[month] || 0) + 1
    })
    return Object.entries(map).map(([month, count]) => ({ month, bugs: count }))
  })()

  const statCards = [
    { label: 'Tasks For Testing', value: stats?.tasksForTesting ?? 0, color: 'from-blue-500 to-cyan-500',     icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Bugs Found',        value: stats?.bugsFound ?? 0,       color: 'from-red-500 to-orange-500',    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Resolved Bugs',     value: stats?.resolvedBugs ?? 0,    color: 'from-green-500 to-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Tasks',       value: stats?.totalTasks ?? 0,      color: 'from-purple-500 to-pink-500',   icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>
      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div><h1 className="text-2xl font-bold text-white">Reports</h1><p className="text-slate-300 text-sm">Your testing statistics</p></div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium">Logout</button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white mb-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                </div>
                <h3 className="text-slate-300 text-sm mb-1">{s.label}</h3>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Performance bars + pie chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Performance Overview</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 text-sm">Bug Resolution Rate</span>
                    <span className="text-white font-bold">{resolveRate}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700" style={{ width: `${resolveRate}%` }} />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{stats?.resolvedBugs ?? 0} of {stats?.bugsFound ?? 0} bugs resolved</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 text-sm">Tasks Pending Test</span>
                    <span className="text-white font-bold">{stats?.tasksForTesting ?? 0}</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-700" style={{ width: `${pendingRate}%` }} />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Out of {stats?.totalTasks ?? 0} total tasks</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 text-sm">Open Bugs</span>
                    <span className="text-white font-bold">{bugs.filter(b => !b.resolved).length}</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-red-500 to-orange-500 transition-all duration-700"
                      style={{ width: bugs.length ? `${Math.round((bugs.filter(b=>!b.resolved).length / bugs.length)*100)}%` : '0%' }} />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{bugs.filter(b=>!b.resolved).length} of {bugs.length} bugs still open</p>
                </div>
              </div>
            </div>

            {/* Severity breakdown pie */}
          
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Bug Severity Breakdown</h2>
              {severityData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <svg className="w-12 h-12 mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No bugs yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={severityData} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                      {severityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      formatter={(value, name) => [`${value} bugs`, name]} />
                    <Legend
                      formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{value}</span>}
                      wrapperStyle={{ paddingTop: '16px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div> 

          {/* Monthly trend bar chart */}
          {monthlyData.length > 0 && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Bug Reporting Trend</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="bugs" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Bugs Reported" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent bugs list */}
          {bugs.length > 0 && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Recent Bug Activity</h2>
              <div className="space-y-3">
                {bugs.slice(0, 5).map(bug => (
                  <div key={bug._id} onClick={() => navigate(`/tester/bugs/${bug._id}`)}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${bug.bugSeverity === 'critical' ? 'bg-red-400' : bug.bugSeverity === 'high' ? 'bg-orange-400' : bug.bugSeverity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                      <div className="min-w-0">
                        <p className="text-white text-sm truncate">{bug.comment}</p>
                        <p className="text-slate-400 text-xs">{bug.task?.issueKey} • {new Date(bug.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`ml-3 shrink-0 text-xs px-2 py-0.5 rounded-full ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {bug.resolved ? 'Resolved' : 'Open'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default TesterReports