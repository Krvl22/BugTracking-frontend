import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'

const TesterReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => { localStorage.clear(); navigate("/") }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:3000/tester/dashboard?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) setData(result.data.stats)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  const resolveRate = data?.bugsFound > 0
    ? Math.round((data.resolvedBugs / data.bugsFound) * 100)
    : 0

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              <p className="text-slate-300 text-sm">Your testing statistics</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Tasks For Testing', value: data?.tasksForTesting ?? 0, color: 'from-blue-500 to-cyan-500',     icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { label: 'Bugs Found',        value: data?.bugsFound ?? 0,       color: 'from-red-500 to-orange-500',    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
              { label: 'Resolved Bugs',     value: data?.resolvedBugs ?? 0,    color: 'from-green-500 to-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Total Tasks',       value: data?.totalTasks ?? 0,      color: 'from-purple-500 to-pink-500',   icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white mb-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>
                <h3 className="text-slate-300 text-sm mb-1">{s.label}</h3>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Resolution Rate */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Performance Overview</h2>
            <div className="space-y-6">

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Bug Resolution Rate</span>
                  <span className="text-white font-bold">{resolveRate}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700" style={{ width: `${resolveRate}%` }} />
                </div>
                <p className="text-slate-400 text-xs mt-1">{data?.resolvedBugs ?? 0} out of {data?.bugsFound ?? 0} bugs resolved</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Tasks Pending Test</span>
                  <span className="text-white font-bold">{data?.tasksForTesting ?? 0}</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-700"
                    style={{ width: data?.totalTasks > 0 ? `${Math.round(((data?.tasksForTesting ?? 0) / data.totalTasks) * 100)}%` : '0%' }}
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">Out of {data?.totalTasks ?? 0} total tasks in the system</p>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default TesterReports