// TesterBugs.jsx - UPDATED with Resolve + Reopen buttons
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'
import { successToast, errorToast } from '../../utils/toast'

const severityColor = (s) => ({
  critical: 'bg-red-500/20 text-red-400',
  high:     'bg-orange-500/20 text-orange-400',
  medium:   'bg-yellow-500/20 text-yellow-400',
  low:      'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const bugStatusColor = (s) => ({
  open:        'bg-red-500/20 text-red-400 border-red-500/30',
  in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  verified:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  closed:      'bg-green-500/20 text-green-400 border-green-500/30',
}[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const BUG_STATUS_FLOW = ['open', 'in_progress', 'verified', 'closed']

const TesterBugs = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [data, setData]                 = useState([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState('all')
  const [updatingId, setUpdatingId]     = useState(null)

  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const fetchData = async () => {
    try {
      const res    = await fetch(`http://localhost:3000/tester/bugs?userId=${user._id}`, { headers: h })
      const result = await res.json()
      if (result.success) setData(result.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  // Move to next status in lifecycle
  const handleUpdateBugStatus = async (bugId, newStatus) => {
    setUpdatingId(bugId)
    try {
      const res    = await fetch(`http://localhost:3000/tester/bugs/${bugId}/status`, {
        method: 'PATCH', headers: h,
        body: JSON.stringify({ bugStatus: newStatus }),
      })
      const result = await res.json()
      if (result.success) {
        setData(prev => prev.map(b => b._id === bugId ? { ...b, bugStatus: newStatus } : b))
        successToast(`Bug moved to "${newStatus.replace('_', ' ')}"`)
      } else errorToast(result.message || 'Failed')
    } catch { errorToast('Server error') }
    setUpdatingId(null)
  }

  // Resolve bug
  const handleResolve = async (bugId) => {
    setUpdatingId(bugId)
    try {
      const res    = await fetch(`http://localhost:3000/tester/bugs/${bugId}/resolve`, {
        method: 'PATCH', headers: h
      })
      const result = await res.json()
      if (result.success) {
        setData(prev => prev.map(b => b._id === bugId ? { ...b, resolved: true, bugStatus: 'closed' } : b))
        successToast('Bug marked as resolved!')
      } else errorToast(result.message || 'Failed')
    } catch { errorToast('Server error') }
    setUpdatingId(null)
  }

  // Reopen bug
  const handleReopen = async (bugId) => {
    setUpdatingId(bugId)
    try {
      const res    = await fetch(`http://localhost:3000/tester/bugs/${bugId}/reopen`, {
        method: 'PATCH', headers: h
      })
      const result = await res.json()
      if (result.success) {
        setData(prev => prev.map(b => b._id === bugId ? { ...b, resolved: false, bugStatus: 'open' } : b))
        successToast('Bug reopened!')
      } else errorToast(result.message || 'Failed')
    } catch { errorToast('Server error') }
    setUpdatingId(null)
  }

  const nextStatus = (current) => {
    const idx = BUG_STATUS_FLOW.indexOf(current || 'open')
    return idx < BUG_STATUS_FLOW.length - 1 ? BUG_STATUS_FLOW[idx + 1] : null
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const filtered = filter === 'all'      ? data
                 : filter === 'open'     ? data.filter(b => !b.resolved)
                 : filter === 'resolved' ? data.filter(b => b.resolved)
                 : data.filter(b => b.bugSeverity === filter)

  const statCards = [
    { label: 'Total Bugs',  value: data.length,                                          color: 'from-blue-500 to-cyan-500' },
    { label: 'Open',        value: data.filter(b => !b.resolved).length,                 color: 'from-red-500 to-orange-500' },
    { label: 'Resolved',    value: data.filter(b => b.resolved).length,                  color: 'from-green-500 to-emerald-500' },
    { label: 'Critical',    value: data.filter(b => b.bugSeverity === 'critical').length, color: 'from-red-600 to-red-800' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64 overflow-y-auto h-screen [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">My Bugs</h1>
              <p className="text-slate-300 text-sm">Bugs you have reported</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className={`w-8 h-1 bg-gradient-to-r ${s.color} rounded-full mt-2`} />
              </div>
            ))}
          </div>

          {/* Bug lifecycle legend */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
            <p className="text-slate-400 text-xs mb-2">Bug Lifecycle</p>
            <div className="flex items-center gap-2 flex-wrap">
              {BUG_STATUS_FLOW.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${bugStatusColor(s)}`}>
                    {s.replace('_', ' ')}
                  </span>
                  {i < BUG_STATUS_FLOW.length - 1 && (
                    <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bug list */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">All Reported Bugs</h2>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none">
                <option value="all"      className="bg-slate-800">All</option>
                <option value="open"     className="bg-slate-800">Open</option>
                <option value="resolved" className="bg-slate-800">Resolved</option>
                <option value="critical" className="bg-slate-800">Critical</option>
                <option value="high"     className="bg-slate-800">High</option>
                <option value="medium"   className="bg-slate-800">Medium</option>
                <option value="low"      className="bg-slate-800">Low</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="text-slate-400 text-center py-12">No bugs found.</p>
            ) : (
              <div className="space-y-4">
                {filtered.map(bug => {
                  const next = nextStatus(bug.bugStatus)
                  const isUpdating = updatingId === bug._id
                  return (
                    <div key={bug._id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      {/* Top clickable area */}
                      <div onClick={() => navigate(`/tester/bugs/${bug._id}`)}
                        className="p-5 hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>
                            {bug.bugSeverity}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${bugStatusColor(bug.bugStatus || 'open')}`}>
                            {(bug.bugStatus || 'open').replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {bug.resolved ? '✓ Resolved' : 'Open'}
                          </span>
                          {bug.attachmentUrl && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">📎</span>}
                          <span className="ml-auto text-blue-400 text-xs group-hover:text-blue-300">View →</span>
                        </div>
                        <p className="text-white font-medium mb-2 line-clamp-2">{bug.comment}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>Task: <span className="text-blue-400 font-mono">{bug.task?.issueKey ?? 'N/A'}</span></span>
                          <span>Title: <span className="text-slate-300">{bug.task?.title ?? 'N/A'}</span></span>
                          {bug.createdAt && <span>{new Date(bug.createdAt).toLocaleDateString()}</span>}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="px-5 pb-4 border-t border-white/5" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center gap-2 pt-3">

                          {/* Move to next status (only if not resolved) */}
                          {!bug.resolved && next && (
                            <button
                              onClick={() => handleUpdateBugStatus(bug._id, next)}
                              disabled={isUpdating}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${bugStatusColor(next)}`}>
                              {isUpdating ? 'Updating...' : `→ ${next.replace('_', ' ')}`}
                            </button>
                          )}

                          {/* Resolve button (only if not resolved) */}
                          {!bug.resolved && (
                            <button
                              onClick={() => handleResolve(bug._id)}
                              disabled={isUpdating}
                              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-medium transition-all disabled:opacity-50">
                              {isUpdating ? '...' : '✓ Mark Resolved'}
                            </button>
                          )}

                          {/* Reopen button (only if resolved) */}
                          {bug.resolved && (
                            <button
                              onClick={() => handleReopen(bug._id)}
                              disabled={isUpdating}
                              className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-medium transition-all disabled:opacity-50">
                              {isUpdating ? '...' : '↺ Reopen Bug'}
                            </button>
                          )}

                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default TesterBugs