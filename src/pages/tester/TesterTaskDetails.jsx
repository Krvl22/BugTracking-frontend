
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'
import TaskChat from '../../components/common/TaskChat'
import { successToast, errorToast } from '../../utils/toast'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const statusColor = (s) => ({
  submitted:       'bg-purple-500/20 text-purple-400',
  in_testing:      'bg-cyan-500/20 text-cyan-400',
  bug_found:       'bg-red-500/20 text-red-400',
  fix_in_progress: 'bg-orange-500/20 text-orange-400',
  resubmitted:     'bg-indigo-500/20 text-indigo-400',
  completed:       'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const priorityColor = (p) => ({
  urgent: 'bg-red-600/30 text-red-300',
  high:   'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low:    'bg-green-500/20 text-green-400',
}[p] || 'bg-slate-500/20 text-slate-400')

const TesterTaskDetails = () => {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [task, setTask]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [approving, setApproving]     = useState(false)
  const [activeTab, setActiveTab]     = useState('details') // 'details' | 'chat'
  const mlClass = useSidebarCollapsed('testerSidebarCollapsed')

  const token = localStorage.getItem('token')
  const h     = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res    = await fetch(`http://localhost:3000/tasks/${id}`, { headers: h })
        const result = await res.json()
        if (result.success) setTask(result.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetch_()
  }, [id])

  const handleApprove = async () => {
    setApproving(true)
    try {
      const res    = await fetch(`http://localhost:3000/tester/tasks/${id}/approve`, { method: 'PATCH', headers: h })
      const result = await res.json()
      if (result.success) {
        successToast('Task approved!')
        navigate('/tester/tasks')
      } else errorToast(result.message || 'Failed')
    } catch { errorToast('Server error') }
    setApproving(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!task) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white">Task not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => navigate('/tester/tasks')} className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{task.issueKey}</h1>
              <p className="text-slate-300 text-xs">{task.title}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm">Logout</button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Tabs */}
          <div className="flex gap-2">
            {['details', 'chat'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}>
                {tab === 'chat' ? '💬 Chat History' : '📋 Task Details'}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task info */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(task.status)}`}>{task.status?.replace(/_/g, ' ')}</span>
                </div>
                <h2 className="text-white text-xl font-semibold">{task.title}</h2>
                <p className="text-slate-300 text-sm">{task.description || 'No description provided.'}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Project',   value: task.project?.name ?? 'N/A' },
                    { label: 'Module',    value: task.module?.name  ?? 'N/A' },
                    { label: 'Developer', value: task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 'N/A' },
                    { label: 'Due Date',  value: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-slate-400 text-xs mb-0.5">{label}</p>
                      <p className="text-white text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                {task.attachmentUrl && (
                  <div>
                    <p className="text-slate-400 text-xs mb-2">Attachment</p>
                    <img src={task.attachmentUrl} alt="attachment" className="rounded-xl max-h-48 object-cover border border-white/10" />
                  </div>
                )}
                {/* Approve button */}
                {['submitted', 'in_testing', 'resubmitted'].includes(task.status) && (
                  <button onClick={handleApprove} disabled={approving}
                    className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl text-sm font-medium disabled:opacity-50">
                    {approving ? 'Approving...' : '✓ Approve Task'}
                  </button>
                )}
              </div>

              {/* Quick info */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4">Timeline</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Created',   value: task.createdAt  ? new Date(task.createdAt).toLocaleString()  : '—' },
                    { label: 'Assigned',  value: task.assignedAt ? new Date(task.assignedAt).toLocaleString() : '—' },
                    { label: 'Submitted', value: task.submittedAt ? new Date(task.submittedAt).toLocaleString() : '—' },
                    { label: 'Completed', value: task.completedAt ? new Date(task.completedAt).toLocaleString() : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <TaskChat taskId={id} />
          )}

        </main>
      </div>
    </div>
  )
}

export default TesterTaskDetails