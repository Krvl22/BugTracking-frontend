
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DeveloperSidebar from '../../components/developer/DeveloperSidebar'
import { successToast, errorToast } from '../../utils/toast'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const ITEMS_PER_PAGE = 8

const priorityColor = (p) => ({ high: 'bg-red-500/20 text-red-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400', urgent: 'bg-red-600/30 text-red-300' }[p] || 'bg-slate-500/20 text-slate-400')
const statusColor   = (s) => ({ to_do: 'bg-slate-500/20 text-slate-400', assigned: 'bg-blue-500/20 text-blue-400', in_progress: 'bg-yellow-500/20 text-yellow-400', submitted: 'bg-purple-500/20 text-purple-400', in_testing: 'bg-cyan-500/20 text-cyan-400', bug_found: 'bg-red-500/20 text-red-400', fix_in_progress: 'bg-orange-500/20 text-orange-400', completed: 'bg-green-500/20 text-green-400' }[s] || 'bg-slate-500/20 text-slate-400')

const Pagination = ({ page, totalPages, setPage, total, perPage }) => {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-slate-400 text-sm">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}</p>
      <div className="flex items-center gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm border border-white/10 disabled:opacity-40 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Prev
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'}`}>{p}</button>
          ))}
        </div>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm border border-white/10 disabled:opacity-40 flex items-center gap-1">
          Next <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  )
}

const DeveloperTasks = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [data, setData]                 = useState([])
  const [loading, setLoading]           = useState(true)
  const [submitting, setSubmitting]     = useState(null)
  const [filter, setFilter]             = useState('all')
  const [submitTaskId, setSubmitTaskId] = useState(null)
  const [submitFile, setSubmitFile]     = useState(null)
  const [submitMsg, setSubmitMsg]       = useState('')
  const [page, setPage]                 = useState(1)
  const fileRef  = useRef(null)
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const mlClass = useSidebarCollapsed('developerSidebarCollapsed')

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    try {
      const res    = await fetch(`http://localhost:3000/developer/tasks?userId=${user._id}`, { headers: { Authorization: `Bearer ${token}` } })
      const result = await res.json()
      if (result.success) setData(result.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  useEffect(() => { setPage(1) }, [filter])

  const handleSubmit = async () => {
    if (!submitTaskId) return
    if (!submitFile) { setSubmitMsg('Please attach a file.'); errorToast('File required!'); return }
    setSubmitting(submitTaskId); setSubmitMsg('')
    const token = localStorage.getItem('token')
    try {
      const fd = new FormData(); fd.append('file', submitFile)
      const res    = await fetch(`http://localhost:3000/developer/tasks/${submitTaskId}/submit`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: fd })
      const result = await res.json()
      if (result.success) {
        setData(prev => prev.map(t => t._id === submitTaskId ? { ...t, status: 'submitted' } : t))
        setSubmitTaskId(null); setSubmitFile(null); successToast('Task submitted!')
      } else { setSubmitMsg(result.message || 'Failed'); errorToast('Failed to submit') }
    } catch { setSubmitMsg('Server error'); errorToast('Server error') }
    finally { setSubmitting(null) }
  }

  const handleMarkInProgress = async (taskId) => {
    const token = localStorage.getItem('token')
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${taskId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'in_progress' }) })
      const d    = await res.json()
      if (d.success) { setData(prev => prev.map(t => t._id === taskId ? { ...t, status: 'in_progress' } : t)); successToast('Task started!') }
      else errorToast('Failed to start task')
    } catch { errorToast('Server error') }
  }

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center"><p className="text-white text-xl">Loading...</p></div>

  const statusPriority = { assigned: 1, in_progress: 2, fix_in_progress: 2, bug_found: 2, submitted: 3, in_testing: 4, completed: 5 }
  const sorted   = [...data].sort((a, b) => (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99))
  const filtered = filter === 'all' ? sorted : sorted.filter(t => t.status === filter)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const statCards = [
    { label: 'Total',       value: data.length,                                             color: 'from-blue-500 to-cyan-500' },
    { label: 'Assigned',    value: data.filter(t => t.status === 'assigned').length,        color: 'from-blue-400 to-indigo-500' },
    { label: 'In Progress', value: data.filter(t => t.status === 'in_progress').length,     color: 'from-yellow-500 to-orange-500' },
    { label: 'Bug Found',   value: data.filter(t => t.status === 'bug_found').length,       color: 'from-red-500 to-rose-600' },
    { label: 'Submitted',   value: data.filter(t => t.status === 'submitted').length,       color: 'from-purple-500 to-pink-500' },
    { label: 'In Testing',  value: data.filter(t => t.status === 'in_testing').length,      color: 'from-cyan-500 to-teal-500' },
    { label: 'Fix In Prog', value: data.filter(t => t.status === 'fix_in_progress').length, color: 'from-orange-500 to-amber-500' },
    { label: 'Completed',   value: data.filter(t => t.status === 'completed').length,       color: 'from-green-500 to-emerald-500' },
  ]

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
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
            <div><h1 className="text-2xl font-bold text-white">My Tasks</h1><p className="text-slate-300 text-sm">Your assigned tasks</p></div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium">Logout</button>
        </header>
        <main className="p-4 lg:p-8 relative z-10 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statCards.map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
                <p className="text-slate-300 text-xs mb-1 leading-tight">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: data.length ? `${(s.value / data.length) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">All Tasks <span className="text-slate-400 text-sm font-normal">({filtered.length})</span></h2>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none">
                <option value="all">All Status</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="bug_found">Bug Found</option>
                <option value="fix_in_progress">Fix In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="in_testing">In Testing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {paginated.length === 0 ? <p className="text-slate-400">No tasks found.</p> : (
              <div className="space-y-4">
                {paginated.map(task => (
                  <div key={task._id} onClick={() => navigate(`/developer/tasks/${task._id}`)} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">{task.issueKey}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(task.status)}`}>{task.status?.replace(/_/g, ' ')}</span>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{task.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>Project: <span className="text-slate-300">{task.project?.name ?? 'N/A'}</span></span>
                          <span>Module: <span className="text-slate-300">{task.module?.name ?? 'N/A'}</span></span>
                          <span>Due: <span className="text-slate-300">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span></span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {task.status === 'assigned' && (
                          <button onClick={e => { e.stopPropagation(); handleMarkInProgress(task._id) }} className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-medium">Start</button>
                        )}
                        {['in_progress', 'bug_found', 'fix_in_progress'].includes(task.status) && submitTaskId !== task._id && (
                          <button onClick={e => { e.stopPropagation(); setSubmitTaskId(task._id); setSubmitFile(null); setSubmitMsg('') }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium">Submit Task</button>
                        )}
                      </div>
                    </div>
                    {submitTaskId === task._id && (
                      <div className="mt-4 pt-4 border-t border-white/10" onClick={e => e.stopPropagation()}>
                        {submitMsg && <p className="text-red-400 text-xs mb-2">{submitMsg}</p>}
                        <div onClick={() => fileRef.current?.click()} className={`flex items-center gap-3 px-4 py-3 border border-dashed rounded-xl cursor-pointer mb-3 ${submitFile ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}>
                          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                          <span className={`text-sm truncate ${submitFile ? 'text-green-400' : 'text-slate-400'}`}>{submitFile ? submitFile.name : 'Click to attach file (required)'}</span>
                          {submitFile && <button onClick={e => { e.stopPropagation(); setSubmitFile(null) }} className="ml-auto text-red-400 text-xs">Remove</button>}
                        </div>
                        <input ref={fileRef} type="file" className="hidden" onChange={e => setSubmitFile(e.target.files?.[0] || null)} />
                        <div className="flex gap-2">
                          <button onClick={handleSubmit} disabled={submitting === task._id || !submitFile} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm disabled:opacity-50">{submitting === task._id ? 'Submitting...' : 'Confirm Submit'}</button>
                          <button onClick={() => { setSubmitTaskId(null); setSubmitFile(null); setSubmitMsg('') }} className="px-4 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-sm">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} perPage={ITEMS_PER_PAGE} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DeveloperTasks