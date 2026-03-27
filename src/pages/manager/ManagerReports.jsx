import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts'

// Same color scheme as AdminAnalytics for consistency
const STATUS_COLORS = {
  to_do: '#64748b', assigned: '#3b82f6', in_progress: '#eab308',
  submitted: '#a855f7', in_testing: '#06b6d4', bug_found: '#ef4444',
  fix_in_progress: '#f97316', resubmitted: '#6366f1', completed: '#22c55e',
}
const SEVERITY_COLORS = {
  low: '#22c55e', medium: '#eab308', high: '#f97316', critical: '#ef4444',
}
const FALLBACK = ['#3b82f6','#06b6d4','#22c55e','#eab308','#f97316','#ef4444','#a855f7']

// Progress bar row — same as AdminAnalytics BarRow
const BarRow = ({ label, count, total, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-slate-300 capitalize">{label?.replace(/_/g, ' ')}</span>
      <span className="text-white font-medium">{count} / {total}</span>
    </div>
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: total ? `${(count / total) * 100}%` : '0%', background: color }} />
    </div>
  </div>
)

const ManagerReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token  = localStorage.getItem('token')
        const res    = await fetch('http://localhost:3000/manager/reports', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const result = await res.json()
        if (result.success) setData(result.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  const totalTasks = data?.tasksByStatus?.reduce((s, t) => s + t.count, 0) || 0
  const totalBugs  = data?.bugsBySeverity?.reduce((s, b) => s + b.count, 0) || 0

  // Recharts data format (same as AdminAnalytics)
  const taskPieData = (data?.tasksByStatus || []).map(t => ({
    name:  t._id?.replace(/_/g, ' '),
    value: t.count,
    color: STATUS_COLORS[t._id] || FALLBACK[0],
  }))
  const bugPieData = (data?.bugsBySeverity || []).map(b => ({
    name:  b._id,
    value: b.count,
    color: SEVERITY_COLORS[b._id] || FALLBACK[1],
  }))
  const taskBarData = (data?.tasksByStatus || []).map(t => ({
    name:  t._id?.replace(/_/g, ' '),
    value: t.count,
  }))
  const bugBarData = (data?.bugsBySeverity || []).map(b => ({
    name:  b._id,
    value: b.count,
  }))

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Reports</h1>
              <p className="text-slate-300 text-sm">Project overview and statistics</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Top stats — same as AdminAnalytics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Total Projects', value: data?.totalProjects ?? 0, color: 'from-blue-500 to-cyan-500',   icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
              { label: 'Total Tasks',    value: totalTasks,               color: 'from-purple-500 to-pink-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { label: 'Total Bugs',     value: totalBugs,                color: 'from-orange-500 to-red-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white mb-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Recharts — Pie Charts (same style as AdminAnalytics) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Bug Severity Chart</h2>
              {!bugPieData.length ? (
                <p className="text-slate-400 text-sm">No bug data</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={bugPieData} dataKey="value" nameKey="name" outerRadius={80}>
                      {bugPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Task Status Chart</h2>
              {!taskBarData.length ? (
                <p className="text-slate-400 text-sm">No task data</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={taskBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Progress bars (same as AdminAnalytics style) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-1">Task Status Distribution</h2>
              <p className="text-slate-400 text-sm mb-6">{totalTasks} total tasks</p>
              {!data?.tasksByStatus?.length ? (
                <p className="text-slate-400 text-sm">No task data.</p>
              ) : (
                <div className="space-y-3">
                  {data.tasksByStatus.sort((a, b) => b.count - a.count).map(item => (
                    <BarRow key={item._id} label={item._id} count={item.count} total={totalTasks}
                      color={STATUS_COLORS[item._id] || FALLBACK[0]} />
                  ))}
                </div>
              )}
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-1">Bug Severity Breakdown</h2>
              <p className="text-slate-400 text-sm mb-6">{totalBugs} total bug reports</p>
              {!data?.bugsBySeverity?.length ? (
                <p className="text-slate-400 text-sm">No bug data.</p>
              ) : (
                <div className="space-y-3">
                  {['critical', 'high', 'medium', 'low'].map(sev => {
                    const item = data.bugsBySeverity.find(b => b._id === sev)
                    return (
                      <BarRow key={sev} label={sev} count={item?.count || 0} total={totalBugs}
                        color={SEVERITY_COLORS[sev]} />
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default ManagerReports