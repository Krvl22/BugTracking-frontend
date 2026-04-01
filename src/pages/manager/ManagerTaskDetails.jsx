import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'
import { successToast, errorToast } from '../../utils/toast'

const priorityColor = (p) => ({
  high:   'bg-red-500/20 text-red-400 border-red-500/30',
  urgent: 'bg-red-600/20 text-red-300 border-red-600/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low:    'bg-green-500/20 text-green-400 border-green-500/30',
}[p] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const TesterTaskDetails = () => {
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [task, setTask]                   = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [approving, setApproving]         = useState(false)
  const [showBugForm, setShowBugForm]     = useState(false)
  const [bugForm, setBugForm]             = useState({ comment: '', bugSeverity: 'medium' })
  const [bugFile, setBugFile]             = useState(null)
  const [submittingBug, setSubmittingBug] = useState(false)

  const fileRef  = useRef(null)
  const navigate = useNavigate()
  const { id }   = useParams()
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res  = await fetch(`http://localhost:3000/tasks/${id}`, { headers: h })
        const data = await res.json()
        if (data.success) setTask(data.data)
        else setError('Task not found')
      } catch (err) {
        setError('Failed to load task')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTask()
  }, [id])

  // ✅ Approve task → completed
  const handleApprove = async () => {
    setApproving(true)
    try {
      const res  = await fetch(`http://localhost:3000/tester/tasks/${id}/approve`, { method: 'PATCH', headers: h })
      const data = await res.json()
      if (data.success) {
        successToast('Task approved and marked as completed!')
        navigate('/tester/tasks')
      } else {
        errorToast(data.message || 'Failed to approve')
      }
    } catch { errorToast('Server error') }
    finally { setApproving(false) }
  }

  // ✅ Report bug on task
  const handleReportBug = async () => {
    if (!bugForm.comment.trim() || bugForm.comment.trim().length < 10) {
      errorToast('Description must be at least 10 characters')
      return
    }
    if (!bugFile) {
      errorToast('Please attach a screenshot')
      return
    }
    setSubmittingBug(true)
    try {
      const fd = new FormData()
      fd.append('taskId',      id)
      fd.append('comment',     bugForm.comment.trim())
      fd.append('bugSeverity', bugForm.bugSeverity)
      fd.append('attachment',  bugFile)
      const res  = await fetch('http://localhost:3000/tester/bugs', { method: 'POST', headers: h, body: fd })
      const data = await res.json()
      if (data.success) {
        successToast('Bug reported successfully!')
        navigate('/tester/tasks')
      } else {
        errorToast(data.message || 'Failed to report bug')
      }
    } catch { errorToast('Server error') }
    finally { setSubmittingBug(false) }
  }

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

      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => navigate('/tester/tasks')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Tasks</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Task Review</h1>
              {task && <p className="text-slate-300 text-sm font-mono">{task.issueKey}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {task?.status === 'submitted' && !showBugForm && (
              <>
                <button onClick={handleApprove} disabled={approving}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50">
                  {approving ? 'Approving...' : '✓ Approve Task'}
                </button>
                <button onClick={() => setShowBugForm(true)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all">
                  🐛 Report Bug
                </button>
              </>
            )}
            <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
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
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColor(task.priority)}`}>
                  {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  {task.status?.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Title + Description */}
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
                    { label: 'Issue Key',  value: task.issueKey,                                                          mono: true },
                    { label: 'Project',    value: task.project?.name ?? 'N/A' },
                    { label: 'Module',     value: task.module?.name  ?? 'No module' },
                    { label: 'Developer',  value: task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : '—' },
                    { label: 'Due Date',   value: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No due date' },
                    { label: 'Submitted',  value: task.submittedAt ? new Date(task.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-slate-400">{label}</span>
                      <span className={`font-medium ${mono ? 'font-mono text-blue-400' : 'text-white'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Developer's submitted file */}
              {task.attachmentUrl && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">Developer's Submission File</h3>
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
                      Open Submission File
                    </a>
                  )}
                </div>
              )}

              {/* Bug report form */}
              {showBugForm && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Report a Bug</h3>
                    <button onClick={() => { setShowBugForm(false); setBugForm({ comment: '', bugSeverity: 'medium' }); setBugFile(null) }}
                      className="text-slate-400 hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">Bug Description <span className="text-red-400">*</span></label>
                      <textarea
                        value={bugForm.comment}
                        onChange={e => setBugForm(p => ({ ...p, comment: e.target.value }))}
                        placeholder="Describe the bug in detail... (min 10 characters)"
                        rows={5}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                      />
                      {bugForm.comment.length > 0 && bugForm.comment.length < 10 && (
                        <p className="text-red-400 text-xs mt-1">{10 - bugForm.comment.length} more characters needed</p>
                      )}
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">Severity</label>
                      <select value={bugForm.bugSeverity}
                        onChange={e => setBugForm(p => ({ ...p, bugSeverity: e.target.value }))}
                        className="w-full sm:w-48 px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">Screenshot <span className="text-red-400">*</span></label>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className={`flex items-center gap-3 px-4 py-3 border border-dashed rounded-xl cursor-pointer transition-all ${bugFile ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
                      >
                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className={`text-sm truncate ${bugFile ? 'text-green-400' : 'text-slate-400'}`}>
                          {bugFile ? bugFile.name : 'Click to attach screenshot (PNG, JPG — max 5MB)'}
                        </span>
                        {bugFile && (
                          <button onClick={e => { e.stopPropagation(); setBugFile(null) }}
                            className="ml-auto text-red-400 text-xs shrink-0">Remove</button>
                        )}
                      </div>
                      <input ref={fileRef} type="file" className="hidden"
                        accept=".png,.jpg,.jpeg"
                        onChange={e => setBugFile(e.target.files?.[0] || null)} />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleReportBug}
                        disabled={submittingBug || bugForm.comment.trim().length < 10 || !bugFile}
                        className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                        title={!bugFile ? 'Screenshot required' : bugForm.comment.trim().length < 10 ? 'Description too short' : ''}
                      >
                        {submittingBug ? 'Submitting...' : 'Submit Bug Report'}
                      </button>
                      <button
                        onClick={() => { setShowBugForm(false); setBugForm({ comment: '', bugSeverity: 'medium' }); setBugFile(null) }}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all"
                      >
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

export default TesterTaskDetails