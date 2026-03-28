import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

const severityColor = (s) => ({ low: 'bg-green-500/20 text-green-400', medium: 'bg-yellow-500/20 text-yellow-400', high: 'bg-orange-500/20 text-orange-400', critical: 'bg-red-500/20 text-red-400' }[s] || 'bg-slate-500/20 text-slate-400')

const ManagerBugs = () => {
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [data, setData]                   = useState([])
  const [allUsers, setAllUsers]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState('all')
  const [reassigningBug, setReassigningBug] = useState(null) // bug._id being reassigned
  const [reassignUserId, setReassignUserId] = useState('')
  const [toast, setToast]                 = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }
  const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchData = async () => {
    try {
      const [bRes, uRes] = await Promise.all([
        fetch('http://localhost:3000/manager/bugs', { headers }),
        fetch('http://localhost:3000/manager/team', { headers }),
      ])
      const [bData, uData] = await Promise.all([bRes.json(), uRes.json()])
      if (bData.success) setData(bData.data || [])
      if (uData.success) setAllUsers(uData.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  // Reassign the bug's task to a different developer
  const handleReassign = async (taskId, userId) => {
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ assignedTo: userId, status: 'fix_in_progress' }),
      })
      const data = await res.json()
      if (data.success) { showToast('Task reassigned to developer!'); setReassigningBug(null); setReassignUserId(''); fetchData() }
      else showToast(data.message || 'Failed to reassign')
    } catch { showToast('Server error') }
  }

  const developers = allUsers.filter(u => u.role === 'developer')
  const filtered   = filter === 'all' ? data :
    filter === 'resolved' ? data.filter(b => b.resolved)  :
    filter === 'open'     ? data.filter(b => !b.resolved) :
    data.filter(b => b.bugSeverity === filter)

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

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
              <h1 className="text-2xl font-bold text-white">Bug Reports</h1>
              <p className="text-slate-300 text-sm">Track and reassign bug fixes</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {toast && (
            <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
              {toast}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Bugs', value: data.length,                                          color: 'from-blue-500 to-cyan-500' },
              { label: 'Open',       value: data.filter(b => !b.resolved).length,                 color: 'from-red-500 to-orange-500' },
              { label: 'Resolved',   value: data.filter(b => b.resolved).length,                  color: 'from-green-500 to-emerald-500' },
              { label: 'Critical',   value: data.filter(b => b.bugSeverity === 'critical').length, color: 'from-red-600 to-red-800' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full bg-linear-to-r ${s.color}`} style={{ width: data.length ? `${(s.value / data.length) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">All Bug Reports</h2>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="all"      className="bg-slate-800 text-white">All</option>
                <option value="open"     className="bg-slate-800 text-white">Open</option>
                <option value="resolved" className="bg-slate-800 text-white">Resolved</option>
                <option value="critical" className="bg-slate-800 text-white">Critical</option>
                <option value="high"     className="bg-slate-800 text-white">High</option>
                <option value="medium"   className="bg-slate-800 text-white">Medium</option>
                <option value="low"      className="bg-slate-800 text-white">Low</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="text-slate-400">No bugs found.</p>
            ) : (
              <div className="space-y-3">
                {filtered.map(bug => (
                  <div key={bug._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>{bug.bugSeverity}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {bug.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{bug.comment}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-3">
                      <span>Task: <span className="text-blue-400 font-mono">{bug.task?.issueKey ?? 'N/A'}</span></span>
                      <span>Title: <span className="text-slate-300">{bug.task?.title ?? 'N/A'}</span></span>
                      <span>Reported by: <span className="text-slate-300">{bug.commentedBy?.firstName} {bug.commentedBy?.lastName}</span></span>
                      {bug.createdAt && <span>Date: <span className="text-slate-300">{new Date(bug.createdAt).toLocaleDateString()}</span></span>}
                    </div>

                    {/* Manager can reassign bug's task to a different developer */}
                    {!bug.resolved && bug.task?._id && developers.length > 0 && (
                      <div className="pt-3 border-t border-white/10">
                        {reassigningBug === bug._id ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-400 text-xs">Assign fix to:</span>
                            <select value={reassignUserId} onChange={e => setReassignUserId(e.target.value)}
                              className="px-2 py-1.5 bg-slate-800 border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 min-w-[140px]">
                              <option value="" className="bg-slate-800 text-white">— Select developer —</option>
                              {developers.map(u => (
                                <option key={u._id} value={u._id} className="bg-slate-800 text-white">{u.firstName} {u.lastName}</option>
                              ))}
                            </select>
                            <button onClick={() => reassignUserId && handleReassign(bug.task._id, reassignUserId)}
                              className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs">✓</button>
                            <button onClick={() => { setReassigningBug(null); setReassignUserId('') }}
                              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs">✕</button>
                          </div>
                        ) : (
                          <button onClick={() => { setReassigningBug(bug._id); setReassignUserId('') }}
                            className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-xs transition-colors">
                            Reassign Fix to Developer
                          </button>
                        )}
                      </div>
                    )}
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

export default ManagerBugs