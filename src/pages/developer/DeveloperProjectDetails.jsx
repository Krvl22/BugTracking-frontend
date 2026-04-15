import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DeveloperSidebar from '../../components/developer/DeveloperSidebar'
import NotificationBell from '../../components/NotificationBell'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'


const priorityColor = (p) => ({
  high:   'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low:    'bg-green-500/20 text-green-400',
  urgent: 'bg-red-600/30 text-red-300',
}[p] || 'bg-slate-500/20 text-slate-400')

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

const projectStatusColor = (s) => ({
  active:    'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  inactive:  'bg-yellow-500/20 text-yellow-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const severityColor = (s) => ({
  critical: 'bg-red-500/20 text-red-400',
  high:     'bg-orange-500/20 text-orange-400',
  medium:   'bg-yellow-500/20 text-yellow-400',
  low:      'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const DeveloperProjectDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [project, setProject]         = useState(null)
  const [myTasks, setMyTasks]         = useState([])
  const [modules, setModules]         = useState([])
  const [bugs, setBugs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeTab, setActiveTab]     = useState('overview')
  const [submitting, setSubmitting]   = useState(null)
  const mlClass = useSidebarCollapsed('testerSidebarCollapsed')

  const navigate  = useNavigate()
  const { id }    = useParams()
  const user      = JSON.parse(localStorage.getItem('user') || '{}')
  const token     = localStorage.getItem('token')
  const headers   = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const safe = async (res) => {
          const ct = res.headers.get('content-type') || ''
          if (!ct.includes('application/json')) return { success: false, data: [] }
          return res.json()
        }

        const [pRes, mRes, tRes, bRes] = await Promise.all([
          fetch(`http://localhost:3000/projects/${id}`,          { headers }),
          fetch(`http://localhost:3000/modules?projectId=${id}`, { headers }),
          fetch(`http://localhost:3000/developer/tasks?userId=${user._id}`, { headers }),
          fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`,  { headers }),
        ])

        const [pData, mData, tData, bData] = await Promise.all([
          safe(pRes), safe(mRes), safe(tRes), safe(bRes)
        ])

        if (pData.success) setProject(pData.data)
        if (mData.success) setModules(mData.data)
        // Only tasks belonging to this project
        if (tData.success) setMyTasks(tData.data.filter(t => (t.project?._id || t.project) === id))
        if (bData.success) setBugs(bData.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetch_()
  }, [id])

  const handleSubmit = async (taskId) => {
    setSubmitting(taskId)
    try {
      const res  = await fetch(`http://localhost:3000/developer/tasks/${taskId}/submit`, {
        method: 'PATCH', headers,
      })
      const data = await res.json()
      if (data.success) {
        setMyTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'submitted' } : t))
      }
    } catch (err) { console.error(err) }
    finally { setSubmitting(null) }
  }

  const handleMarkInProgress = async (taskId) => {
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method:  'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: 'in_progress' }),
      })
      const data = await res.json()
      if (data.success) {
        setMyTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'in_progress' } : t))
      }
    } catch (err) { console.error(err) }
  }

  // Bugs on MY tasks in this project
  const myProjectBugs = bugs.filter(b => {
    const taskInProject = myTasks.find(t => t._id === (b.task?._id || b.task))
    return !!taskInProject
  })

  const completedTasks = myTasks.filter(t => t.status === 'completed').length
  const progressPct    = myTasks.length ? Math.round((completedTasks / myTasks.length) * 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading project...</p>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Project not found</p>
        <button onClick={() => navigate('/developer/projects')} className="text-blue-400 hover:text-blue-300">← Back</button>
      </div>
    </div>
  )

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'tasks',    label: 'My Tasks',  count: myTasks.length },
    { key: 'modules',  label: 'Modules',   count: modules.length },
  ]

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
            <button onClick={() => navigate('/developer/projects')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-slate-400 text-sm font-mono">{project.projectKey}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${projectStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stats */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-white">{myTasks.length}</p>
                <p className="text-slate-400 text-xs mt-1">My Tasks</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
                <p className="text-slate-400 text-xs mt-1">Completed</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-red-400">{myProjectBugs.filter(b => !b.resolved).length}</p>
                <p className="text-slate-400 text-xs mt-1">Open Bugs</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-blue-400">{modules.length}</p>
                <p className="text-slate-400 text-xs mt-1">Modules</p>
              </div>
            </div>
            {myTasks.length > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">My Progress</span>
                  <span className="text-white font-medium">{progressPct}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b border-white/10">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white/10 text-white border border-white/20 border-b-0'
                    : 'text-slate-400 hover:text-white'
                }`}>
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Project info */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Description', value: project.description || 'No description' },
                    { label: 'Created By',  value: project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—' },
                    { label: 'Start Date',  value: project.startDate ? new Date(project.startDate).toLocaleDateString() : '—' },
                    { label: 'End Date',    value: project.endDate   ? new Date(project.endDate).toLocaleDateString()   : '—' },
                    { label: 'Team Size',   value: `${project.teamMembers?.length || 0} members` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent bugs on my tasks */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Bugs on My Tasks</h3>
                {myProjectBugs.length === 0 ? (
                  <p className="text-slate-400 text-sm">No bugs reported on your tasks.</p>
                ) : (
                  <div className="space-y-3">
                    {myProjectBugs.slice(0, 5).map(bug => (
                      <div key={bug._id} className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${severityColor(bug.bugSeverity)}`}>{bug.bugSeverity}</span>
                          <span className={`text-xs ${bug.resolved ? 'text-green-400' : 'text-red-400'}`}>
                            {bug.resolved ? 'Resolved' : 'Open'}
                          </span>
                        </div>
                        <p className="text-white text-sm line-clamp-2">{bug.comment}</p>
                        <p className="text-slate-400 text-xs mt-1">Task: {bug.task?.issueKey} — {bug.task?.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Team members */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-4">Team Members</h3>
                {!project.teamMembers?.length ? (
                  <p className="text-slate-400 text-sm">No team members listed.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {project.teamMembers.map(m => (
                      <div key={m._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-linear-to-r ${m.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
                          {m.firstName?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-medium truncate">{m.firstName} {m.lastName}</p>
                          <p className={`text-xs capitalize ${m.role === 'developer' ? 'text-cyan-400' : 'text-orange-400'}`}>{m.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── MY TASKS TAB ── */}
          {activeTab === 'tasks' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
              {myTasks.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-400">No tasks assigned to you in this project.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {myTasks.map(task => (
                    <div key={task._id} className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-mono text-blue-400 text-xs">{task.issueKey}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(task.priority)}`}>{task.priority}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(task.status)}`}>{task.status?.replace(/_/g, ' ')}</span>
                          </div>
                          <p className="text-white font-medium">{task.title}</p>
                          <p className="text-slate-400 text-xs mt-1">
                            Module: {task.module?.name || 'N/A'} • Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {task.status === 'assigned' && (
                            <button
                              onClick={() => handleMarkInProgress(task._id)}
                              className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-medium transition-all"
                            >
                              Start
                            </button>
                          )}
                          {(task.status === 'in_progress' || task.status === 'bug_found' || task.status === 'fix_in_progress') && (
                            <button
                              onClick={() => handleSubmit(task._id)}
                              disabled={submitting === task._id}
                              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                            >
                              {submitting === task._id ? 'Submitting…' : 'Submit'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline bug comments for this task */}
                      {(() => {
                        const taskBugs = bugs.filter(b => (b.task?._id || b.task) === task._id)
                        if (!taskBugs.length) return null
                        return (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            <p className="text-slate-400 text-xs font-medium">Bug Reports ({taskBugs.length})</p>
                            {taskBugs.map(bug => (
                              <div key={bug._id} className="flex items-start gap-2 p-2 bg-red-500/5 rounded-lg border border-red-500/10">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${severityColor(bug.bugSeverity)}`}>{bug.bugSeverity}</span>
                                <p className="text-slate-300 text-xs">{bug.comment}</p>
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MODULES TAB ── */}
          {activeTab === 'modules' && (
            <div>
              {modules.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No modules in this project yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map(mod => {
                    const modTasks      = myTasks.filter(t => (t.module?._id || t.module) === mod._id)
                    const modCompleted  = modTasks.filter(t => t.status === 'completed').length
                    return (
                      <div key={mod._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-white font-semibold">{mod.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            mod.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>{mod.status}</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">{mod.description || 'No description'}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">My Tasks</span>
                            <span className="text-white">{modTasks.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Completed</span>
                            <span className="text-green-400">{modCompleted}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default DeveloperProjectDetails