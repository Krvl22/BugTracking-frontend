import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
import TaskChat from '../../components/common/TaskChat'

const taskStatusColor = (s) => ({ to_do: 'bg-slate-500/20 text-slate-400', assigned: 'bg-blue-500/20 text-blue-400', in_progress: 'bg-yellow-500/20 text-yellow-400', submitted: 'bg-purple-500/20 text-purple-400', in_testing: 'bg-cyan-500/20 text-cyan-400', bug_found: 'bg-red-500/20 text-red-400', fix_in_progress: 'bg-orange-500/20 text-orange-400', resubmitted: 'bg-indigo-500/20 text-indigo-400', completed: 'bg-green-500/20 text-green-400' }[s] || 'bg-slate-500/20 text-slate-400')
const priorityColor   = (p) => ({ low: 'bg-green-500/20 text-green-400', medium: 'bg-yellow-500/20 text-yellow-400', high: 'bg-orange-500/20 text-orange-400', urgent: 'bg-red-500/20 text-red-400' }[p] || 'bg-slate-500/20 text-slate-400')
const severityColor   = (s) => ({ critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400' }[s] || 'bg-slate-500/20 text-slate-400')
const sprintStatusColor = (s) => ({ planned: 'bg-slate-500/20 text-slate-400 border-slate-500/30', active: 'bg-green-500/20 text-green-400 border-green-500/30', completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const ManagerSprintDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sprint, setSprint]           = useState(null)
  const [bugs, setBugs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeTab, setActiveTab]     = useState('tasks')
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const navigate = useNavigate()
  const { id }   = useParams()
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res  = await fetch(`http://localhost:3000/sprints/${id}`, { headers: h })
        const data = await res.json()
        if (data.success) {
          setSprint(data.data)
          // fetch bugs for all tasks in this sprint
          const taskIds = (data.data.tasks || []).map(t => t._id || t)
          if (taskIds.length > 0) {
            const bugResults = await Promise.all(
              taskIds.map(tid => fetch(`http://localhost:3000/bugcomments/task/${tid}`, { headers: h }).then(r => r.json()).catch(() => ({ success: false })))
            )
            const allBugs = bugResults.flatMap(r => r.success ? r.data || [] : [])
            setBugs(allBugs)
          }
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading sprint...</p>
    </div>
  )

  if (!sprint) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Sprint not found</p>
        <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-300">← Go Back</button>
      </div>
    </div>
  )

  const tasks          = sprint.tasks || []
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const progress       = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
  const openBugs       = bugs.filter(b => !b.resolved).length
  const now            = new Date()
  const endDate        = sprint.endDate ? new Date(sprint.endDate) : null
  const daysLeft       = endDate ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : null
  const isOver         = endDate ? now > endDate : false

  const TABS = [
    { key: 'tasks', label: 'Tasks',   count: tasks.length },
    { key: 'bugs',  label: 'Bugs',    count: bugs.length },
    { key: 'chat',  label: 'Chat',    count: null },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <span className="text-sm">Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{sprint.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${sprintStatusColor(sprint.status)}`}>{sprint.status || 'planned'}</span>
                {sprint.project?.name && <span className="text-slate-400 text-sm">{sprint.project.name}</span>}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium">Logout</button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Tasks',  value: tasks.length,   color: 'text-white' },
              { label: 'Completed',    value: completedTasks, color: 'text-green-400' },
              { label: 'In Progress',  value: tasks.filter(t => ['in_progress','fix_in_progress'].includes(t.status)).length, color: 'text-yellow-400' },
              { label: 'Open Bugs',    value: openBugs,       color: 'text-red-400' },
              { label: 'Progress',     value: `${progress}%`, color: 'text-cyan-400' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Sprint info + progress */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Start', value: sprint.startDate ? new Date(sprint.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                { label: 'End',   value: sprint.endDate   ? new Date(sprint.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                { label: isOver ? 'Status' : 'Time Left', value: isOver ? 'Overdue' : daysLeft !== null ? `${daysLeft}d left` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                  <p className={`text-sm font-medium ${isOver && label !== 'Start' && label !== 'End' ? 'text-red-400' : 'text-white'}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Work Completion</span>
              <span>{completedTasks} / {tasks.length} tasks done</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : progress >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/10">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white/10 text-white border border-white/20 border-b-0' : 'text-slate-400 hover:text-white'}`}>
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No tasks in this sprint</p>
                </div>
              ) : tasks.map(task => (
                <div key={task._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-blue-400 text-sm">{task.issueKey}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${taskStatusColor(task.status)}`}>{task.status?.replace(/_/g, ' ')}</span>
                      </div>
                      <h3 className="text-white font-semibold">{task.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-1">
                        {task.assignedTo && <span>Developer: <span className="text-slate-300">{task.assignedTo.firstName} {task.assignedTo.lastName}</span></span>}
                        {task.testedBy   && <span>Tester: <span className="text-slate-300">{task.testedBy.firstName} {task.testedBy.lastName}</span></span>}
                        {task.dueDate    && <span>Due: <span className="text-slate-300">{new Date(task.dueDate).toLocaleDateString()}</span></span>}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTaskId(selectedTaskId === task._id ? null : task._id)}
                      className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs shrink-0">
                      {selectedTaskId === task._id ? 'Hide Chat' : 'View Chat'}
                    </button>
                  </div>
                  {selectedTaskId === task._id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <TaskChat taskId={task._id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* BUGS TAB */}
          {activeTab === 'bugs' && (
            <div className="space-y-3">
              {bugs.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No bugs reported in this sprint</p>
                </div>
              ) : bugs.map(bug => (
                <div key={bug._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>{bug.bugSeverity}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{bug.resolved ? 'Resolved' : 'Open'}</span>
                    <span className="text-slate-500 text-xs ml-auto">by {bug.commentedBy?.firstName} {bug.commentedBy?.lastName}</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed mb-2">{bug.comment}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>Task: <span className="text-blue-400 font-mono">{bug.task?.issueKey ?? 'N/A'}</span></span>
                    {bug.createdAt && <span>{new Date(bug.createdAt).toLocaleDateString()}</span>}
                  </div>
                  {bug.attachmentUrl && (
                    <a href={bug.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-blue-400 text-xs hover:text-blue-300">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      View attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CHAT TAB — pick a task to chat */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No tasks in this sprint to chat about</p>
                </div>
              ) : (
                <>
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
                    <label className="text-slate-300 text-sm mb-2 block">Select a task to view its chat:</label>
                    <select value={selectedTaskId || ''} onChange={e => setSelectedTaskId(e.target.value || null)}
                      className="w-full sm:w-80 px-3 py-2 bg-slate-800 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                      <option value="">— Select a task —</option>
                      {tasks.map(t => <option key={t._id} value={t._id}>{t.issueKey} — {t.title}</option>)}
                    </select>
                  </div>
                  {selectedTaskId && (
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Task Chat — {tasks.find(t => t._id === selectedTaskId)?.issueKey}
                      </h3>
                      <TaskChat taskId={selectedTaskId} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ManagerSprintDetails