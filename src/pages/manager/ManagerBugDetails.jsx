import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
import TaskChat from '../../components/common/TaskChat'
import { successToast, errorToast } from '../../utils/toast'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const severityColor = (s) => ({
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low:      'bg-green-500/20 text-green-400 border-green-500/30',
}[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const ManagerBugDetails = () => {
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [bug, setBug]                       = useState(null)
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')
  const [resolving, setResolving]           = useState(false)
  const [developers, setDevelopers]         = useState([])
  const [reassigning, setReassigning]       = useState(false)
  const [reassignUserId, setReassignUserId] = useState('')
  const [activeTab, setActiveTab]           = useState('details')
  const mlClass = useSidebarCollapsed('managerSidebarCollapsed')

  const navigate = useNavigate()
  const { id }   = useParams()
  const token    = localStorage.getItem('token')
  const headers  = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bugRes, teamRes] = await Promise.all([
          fetch(`http://localhost:3000/bugcomments/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:3000/manager/team',      { headers: { Authorization: `Bearer ${token}` } }),
        ])
        const [bugData, teamData] = await Promise.all([bugRes.json(), teamRes.json()])

        if (bugData.success) setBug(bugData.data)
        else setError(bugData.message || 'Bug not found')

        if (teamData.success) setDevelopers((teamData.data || []).filter(u => u.role === 'developer'))
      } catch (err) {
        setError('Server error — could not load bug')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const handleResolve = async () => {
    setResolving(true)
    try {
      const res    = await fetch(`http://localhost:3000/bugcomments/${id}/resolve`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) { setBug(result.data); successToast('Bug marked as resolved!') }
      else errorToast(result.message || 'Failed to resolve')
    } catch { errorToast('Server error') }
    finally { setResolving(false) }
  }

  const handleReassign = async () => {
    if (!reassignUserId || !bug?.task?._id) return
    setReassigning(true)
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${bug.task._id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ assignedTo: reassignUserId, status: 'fix_in_progress' }),
      })
      const data = await res.json()
      if (data.success) { successToast('Task reassigned to developer'); setReassignUserId('') }
      else errorToast(data.message || 'Failed to reassign')
    } catch { errorToast('Server error') }
    finally { setReassigning(false) }
  }

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

      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => navigate('/manager/bugs')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Bugs</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Bug Details</h1>
              <p className="text-slate-300 text-sm">Full bug report</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {bug && !bug.resolved && (
              <button onClick={handleResolve} disabled={resolving}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50">
                {resolving ? 'Resolving...' : '✓ Mark Resolved'}
              </button>
            )}
            <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 max-w-3xl space-y-6">

          {error && (
            <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm">{error}</div>
          )}

          {bug && (
            <>
              {/* Status badges */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${severityColor(bug.bugSeverity)}`}>
                  {bug.bugSeverity?.charAt(0).toUpperCase() + bug.bugSeverity?.slice(1)} Severity
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${bug.resolved ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                  {bug.resolved ? '✓ Resolved' : '● Open'}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                {[
                  { key: 'details', label: '🐛 Details' },
                  { key: 'chat',    label: '💬 Chat' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Bug description */}
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h2 className="text-lg font-bold text-white mb-4">Bug Description</h2>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{bug.comment}</p>
                  </div>

                  {/* Linked task */}
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold text-white mb-4">Linked Task</h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: 'Issue Key',  value: bug.task?.issueKey ?? 'N/A', mono: true },
                        { label: 'Task Title', value: bug.task?.title    ?? 'N/A' },
                        { label: 'Reported',   value: bug.createdAt ? new Date(bug.createdAt).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' },
                      ].map(({ label, value, mono }) => (
                        <div key={label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-slate-400">{label}</span>
                          <span className={`font-medium ${mono ? 'font-mono text-blue-400' : 'text-white'}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reported by */}
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold text-white mb-4">Reported By</h3>
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shrink-0">
                        {bug.commentedBy?.firstName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{bug.commentedBy?.firstName} {bug.commentedBy?.lastName}</p>
                        <p className="text-slate-400 text-xs capitalize">{bug.commentedBy?.role || 'Tester'}</p>
                      </div>
                      <p className="ml-auto text-slate-400 text-xs">
                        {bug.createdAt ? new Date(bug.createdAt).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Manager actions — Reassign */}
                  {!bug.resolved && bug.task?._id && developers.length > 0 && (
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-lg font-bold text-white mb-4">Manager Actions</h3>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Reassign fix to a developer</label>
                        <div className="flex gap-3 flex-wrap">
                          <select value={reassignUserId} onChange={e => setReassignUserId(e.target.value)}
                            className="flex-1 min-w-[200px] px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                            <option value="">— Select developer —</option>
                            {developers.map(u => (
                              <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
                            ))}
                          </select>
                          <button onClick={handleReassign} disabled={!reassignUserId || reassigning}
                            className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50">
                            {reassigning ? 'Reassigning...' : 'Reassign Fix'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resolution info */}
                  {bug.resolved && bug.resolvedAt && (
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-lg font-bold text-white mb-3">Resolution</h3>
                      <div className="flex justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-sm">
                        <span className="text-slate-400">Resolved At</span>
                        <span className="text-green-400 font-medium">{new Date(bug.resolvedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Attachment */}
                  {bug.attachmentUrl && (
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-lg font-bold text-white mb-4">Attachment</h3>
                      {/\.(png|jpg|jpeg|gif|webp)$/i.test(bug.attachmentUrl) ? (
                        <div>
                          <img src={bug.attachmentUrl} alt="Bug attachment"
                            className="rounded-xl max-w-full max-h-96 object-contain border border-white/10 mb-3" />
                          <a href={bug.attachmentUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium transition-all">
                            Open Full Image
                          </a>
                        </div>
                      ) : (
                        <a href={bug.attachmentUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-all">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Open Attachment
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Chat Tab */}
              {activeTab === 'chat' && bug.task?._id && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Task Chat
                  </h3>
                  <TaskChat taskId={bug.task._id} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default ManagerBugDetails