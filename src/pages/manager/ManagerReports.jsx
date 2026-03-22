import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

const ManagerReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => { localStorage.clear(); navigate("/") }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3000/manager/reports", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
      console.log("Reports:", result)
      if (result.success) setData(result.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  const statusColors = {
    to_do: 'from-slate-500 to-slate-600',
    assigned: 'from-blue-500 to-blue-600',
    in_progress: 'from-yellow-500 to-orange-500',
    submitted: 'from-purple-500 to-purple-600',
    in_testing: 'from-cyan-500 to-teal-500',
    bug_found: 'from-red-500 to-red-600',
    fix_in_progress: 'from-orange-500 to-orange-600',
    completed: 'from-green-500 to-emerald-500',
  }

  const severityColors = {
    low:      'from-green-500 to-emerald-500',
    medium:   'from-yellow-500 to-amber-500',
    high:     'from-orange-500 to-red-400',
    critical: 'from-red-500 to-red-700',
  }

  const totalTasks = data?.tasksByStatus?.reduce((sum, t) => sum + t.count, 0) || 0
  const totalBugs  = data?.bugsBySeverity?.reduce((sum, b) => sum + b.count, 0) || 0

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

          {/* Top stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Total Projects', value: data?.totalProjects ?? 0, color: 'from-blue-500 to-cyan-500',     icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
              { label: 'Total Tasks',    value: totalTasks,               color: 'from-purple-500 to-pink-500',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { label: 'Total Bugs',     value: totalBugs,                color: 'from-orange-500 to-red-500',   icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Tasks by Status */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Tasks by Status</h2>
              {!data?.tasksByStatus?.length ? (
                <p className="text-slate-400">No task data.</p>
              ) : (
                <div className="space-y-4">
                  {data.tasksByStatus.map((item) => (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300 text-sm capitalize">{item._id?.replace(/_/g, ' ')}</span>
                        <span className="text-white font-bold">{item.count}</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-linear-to-r ${statusColors[item._id] || 'from-blue-500 to-cyan-500'} transition-all duration-500`}
                          style={{ width: totalTasks ? `${(item.count / totalTasks) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bugs by Severity */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Bugs by Severity</h2>
              {!data?.bugsBySeverity?.length ? (
                <p className="text-slate-400">No bug data.</p>
              ) : (
                <div className="space-y-4">
                  {data.bugsBySeverity.map((item) => (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300 text-sm capitalize">{item._id}</span>
                        <span className="text-white font-bold">{item.count}</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-linear-to-r ${severityColors[item._id] || 'from-red-500 to-orange-500'} transition-all duration-500`}
                          style={{ width: totalBugs ? `${(item.count / totalBugs) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
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