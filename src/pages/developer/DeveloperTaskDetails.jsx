import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DeveloperSidebar from '../../components/developer/DeveloperSidebar'
import { successToast, errorToast } from '../../utils/toast'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'


const priorityColor = (p) => ({
  high:   'bg-red-500/20 text-red-400 border-red-500/30',
  urgent: 'bg-red-600/20 text-red-300 border-red-600/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low:    'bg-green-500/20 text-green-400 border-green-500/30',
}[p] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const statusColor = (s) => ({
  to_do:           'bg-slate-500/20 text-slate-400',
  assigned:        'bg-blue-500/20 text-blue-400',
  in_progress:     'bg-yellow-500/20 text-yellow-400',
  submitted:       'bg-purple-500/20 text-purple-400',
  in_testing:      'bg-cyan-500/20 text-cyan-400',
  bug_found:       'bg-red-500/20 text-red-400',
  fix_in_progress: 'bg-orange-500/20 text-orange-400',
  resubmitted:     'bg-indigo-500/20 text-indigo-400',
  completed:       'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const DeveloperTaskDetails = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [task, setTask]                 = useState(null)
  const [bugs, setBugs]                 = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [showSubmit, setShowSubmit]     = useState(false)
  const [submitFile, setSubmitFile]     = useState(null)
  const [submitting, setSubmitting]     = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const mlClass = useSidebarCollapsed('developerSidebarCollapsed')

  const fileRef  = useRef(null)
  const navigate = useNavigate()
  const { id }   = useParams()
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}` }
  const jh       = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const fetchTask = async () => {
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${id}`, { headers: h })
      const data = await res.json()
      if (data.success) {
        setTask(data.data)
        const bugRes  = await fetch(`http://localhost:3000/bugcomments/task/${id}`, { headers: h })
        const bugData = await bugRes.json()
        if (bugData.success) setBugs(bugData.data || [])
      } else {
        setError('Task not found')
      }
    } catch (err) {
      setError('Failed to load task')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTask() }, [id])

  // Start Task — assigned → in_progress
  const handleStartTask = async () => {
    setUpdatingStatus(true)
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT', headers: jh,
        body: JSON.stringify({ status: 'in_progress' }),
      })
      const data = await res.json()
      if (data.success) { setTask(data.data); successToast('Task started!') }
      else errorToast(data.message || 'Failed to start task')
    } catch { errorToast('Server error') }
    finally { setUpdatingStatus(false) }
  }

  // Mark Fix In Progress — bug_found → fix_in_progress
  const handleMarkFixInProgress = async () => {
    setUpdatingStatus(true)
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT', headers: jh,
        body: JSON.stringify({ status: 'fix_in_progress' }),
      })
      const data = await res.json()
      if (data.success) { setTask(data.data); successToast('Marked as Fix In Progress') }
      else errorToast(data.message || 'Failed to update status')
    } catch { errorToast('Server error') }
    finally { setUpdatingStatus(false) }
  }

  // Submit Task — file is required
  const handleSubmit = async () => {
    if (!submitFile) {
      errorToast('Please attach a file before submitting.')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('file', submitFile)
      const res = await fetch(`http://localhost:3000/developer/tasks/${id}/submit`, {
        method: 'PATCH', headers: h, body: fd,
      })
      const data = await res.json()
      if (data.success) {
        setShowSubmit(false)
        setSubmitFile(null)
        successToast('Task submitted for testing!')
        fetchTask()
      } else {
        errorToast(data.message || 'Failed to submit')
      }
    } catch { errorToast('Server error') }
    finally { setSubmitting(false) }
  }

  const canStart   = task?.status === 'assigned'
  const canSubmit  = ['in_progress', 'fix_in_progress', 'bug_found'].includes(task?.status)
  const canMarkFix = task?.status === 'bug_found'

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading task...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
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
            <button onClick={() => navigate('/developer/tasks')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Tasks</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Task Details</h1>
              {task && <p className="text-slate-300 text-sm font-mono">{task.issueKey}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canStart && (
              <button onClick={handleStartTask} disabled={updatingStatus}
                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50">
                {updatingStatus ? 'Starting...' : 'Start Task'}
              </button>
            )}
            {canMarkFix && (
              <button onClick={handleMarkFixInProgress} disabled={updatingStatus}
                className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50">
                {updatingStatus ? 'Updating...' : 'Mark Fix In Progress'}
              </button>
            )}
            {canSubmit && (
              <button onClick={() => setShowSubmit(true)}
                className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                Submit Task
              </button>
            )}
            <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6 max-w-4xl">

          {error && (
            <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm">{error}</div>
          )}

          {task && (
            <>
              {/* Status + Priority badges */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColor(task.priority)}`}>
                  {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(task.status)}`}>
                  {task.status?.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Task title + description */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
                {task.description ? (
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                ) : (
                  <p className="text-slate-500 italic">No description provided.</p>
                )}
              </div>

              {/* Task metadata */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Task Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Issue Key',  value: task.issueKey,                                                      mono: true },
                    { label: 'Project',    value: task.project?.name ?? 'N/A' },
                    { label: 'Module',     value: task.module?.name  ?? 'No module' },
                    { label: 'Created By', value: task.createdBy ? `${task.createdBy.firstName} ${task.createdBy.lastName}` : '—' },
                    { label: 'Due Date',   value: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No due date' },
                    { label: 'Created',    value: new Date(task.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-slate-400">{label}</span>
                      <span className={`font-medium ${mono ? 'font-mono text-blue-400' : 'text-white'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission file — shown to developer too */}
              {task.attachmentUrl && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">Submission File</h3>
                  {/\.(png|jpg|jpeg|gif|webp)$/i.test(task.attachmentUrl) ? (
                    <div>
                      <img src={task.attachmentUrl} alt="Submission"
                        className="rounded-xl max-w-full max-h-96 object-contain border border-white/10 mb-3" />
                      <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium transition-all">
                        Open Full Image
                      </a>
                    </div>
                  ) : (
                    <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-all">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Open Attachment
                    </a>
                  )}
                </div>
              )}

              {/* Bugs on this task */}
              {bugs.length > 0 && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Bugs Reported <span className="text-sm font-normal text-slate-400 ml-2">{bugs.length} bug{bugs.length > 1 ? 's' : ''}</span>
                  </h3>
                  <div className="space-y-3">
                    {bugs.map(bug => (
                      <div key={bug._id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            bug.bugSeverity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            bug.bugSeverity === 'high'     ? 'bg-orange-500/20 text-orange-400' :
                            bug.bugSeverity === 'medium'   ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>{bug.bugSeverity}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {bug.resolved ? 'Resolved' : 'Open'}
                          </span>
                          <span className="text-slate-500 text-xs ml-auto">
                            by {bug.commentedBy?.firstName} {bug.commentedBy?.lastName}
                          </span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">{bug.comment}</p>
                        {bug.attachmentUrl && (
                          <a href={bug.attachmentUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 text-blue-400 text-xs hover:text-blue-300">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            View attachment
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit panel */}
              {showSubmit && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">Submit Task for Testing</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">
                        Attach File <span className="text-red-400">*</span>
                      </label>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className={`flex items-center gap-3 px-4 py-3 border border-dashed rounded-xl cursor-pointer transition-all ${submitFile ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
                      >
                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className={`text-sm truncate ${submitFile ? 'text-green-400' : 'text-slate-400'}`}>
                          {submitFile ? submitFile.name : 'Click to attach a file (PNG, JPG, PDF — max 5MB) — required'}
                        </span>
                        {submitFile && (
                          <button onClick={e => { e.stopPropagation(); setSubmitFile(null) }}
                            className="ml-auto text-red-400 text-xs shrink-0">Remove</button>
                        )}
                      </div>
                      <input ref={fileRef} type="file" className="hidden"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={e => setSubmitFile(e.target.files?.[0] || null)} />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSubmit} disabled={submitting || !submitFile}
                        className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                        {submitting ? 'Submitting...' : 'Confirm Submit'}
                      </button>
                      <button onClick={() => { setShowSubmit(false); setSubmitFile(null) }}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default DeveloperTaskDetails