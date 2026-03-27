import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

const taskStatusColor = (s) => ({
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

const priorityColor = (p) => ({
  low:    'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high:   'bg-orange-500/20 text-orange-400',
  urgent: 'bg-red-500/20 text-red-400',
}[p] || 'bg-slate-500/20 text-slate-400')

const statusColor = (s) => ({
  active:    'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  inactive:  'bg-yellow-500/20 text-yellow-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const ManagerProjectDetails = () => {
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [project, setProject]               = useState(null)
  const [modules, setModules]               = useState([])
  const [tasks, setTasks]                   = useState([])
  const [loading, setLoading]               = useState(true)
  const [activeTab, setActiveTab]           = useState('overview')
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [taskForm, setTaskForm]             = useState({
    title: '', description: '', module: '', assignedTo: '', priority: 'medium', dueDate: ''
  })
  const [taskMsg, setTaskMsg]               = useState('')
  const [assigningTask, setAssigningTask]   = useState(null)
  const [assignUserId, setAssignUserId]     = useState('')

  const navigate    = useNavigate()
  const { id }      = useParams()
  const token       = localStorage.getItem('token')
  const authHeaders = { Authorization: `Bearer ${token}` }
  const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const fetchAll = async () => {
    try {
      const [pRes, mRes, tRes] = await Promise.all([
        fetch(`http://localhost:3000/projects/${id}`,           { headers: authHeaders }),
        fetch(`http://localhost:3000/modules?projectId=${id}`,  { headers: authHeaders }),
        fetch(`http://localhost:3000/tasks?project=${id}`,      { headers: authHeaders }),
      ])

      // guard against non-JSON (HTML error pages)
      const safe = async (res) => {
        const ct = res.headers.get('content-type') || ''
        if (!ct.includes('application/json')) return { success: false }
        return res.json()
      }

      const [pData, mData, tData] = await Promise.all([safe(pRes), safe(mRes), safe(tRes)])
      if (pData.success) setProject(pData.data)
      if (mData.success) setModules(mData.data)
      if (tData.success) setTasks(tData.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (id) fetchAll() }, [id])

  // ── Create Task ──
  const handleCreateTask = async () => {
    setTaskMsg('')
    if (!taskForm.title.trim()) { setTaskMsg('Title is required'); return }
    try {
      const payload = {
        title:       taskForm.title.trim(),
        description: taskForm.description.trim(),
        project:     id,
        priority:    taskForm.priority,
        ...(taskForm.module     && { module:     taskForm.module }),
        ...(taskForm.assignedTo && { assignedTo: taskForm.assignedTo }),
        ...(taskForm.dueDate    && { dueDate:    taskForm.dueDate }),
      }
      const res  = await fetch('http://localhost:3000/manager/tasks', {
        method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        setShowCreateTask(false)
        setTaskForm({ title: '', description: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
        fetchAll()
      } else {
        setTaskMsg(data.message || data.err || 'Failed to create task')
      }
    } catch { setTaskMsg('Server error') }
  }

  // ── Assign task — only to developers ──
  const handleAssignTask = async (taskId, userId) => {
    try {
      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT', headers: jsonHeaders,
        body: JSON.stringify({ assignedTo: userId, status: 'assigned' })
      })
      setAssigningTask(null)
      setAssignUserId('')
      fetchAll()
    } catch (err) { console.error(err) }
  }

  const teamMembers  = project?.teamMembers || []
  // FIX: only developers can be assigned tasks
  const developers   = teamMembers.filter(m => typeof m === 'object' && m.role === 'developer')

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const progressPct    = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading project...</p>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Project not found</p>
        <button onClick={() => navigate('/manager/projects')} className="text-blue-400 hover:text-blue-300">← Back</button>
      </div>
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
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => navigate('/manager/projects')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-slate-400 text-sm font-mono">{project.projectKey}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(project.status)}`}>{project.status}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreateTask(true)}
              className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              + Create Task
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Project Info Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-white">{tasks.length}</p>
                <p className="text-slate-400 text-xs mt-1">Total Tasks</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
                <p className="text-slate-400 text-xs mt-1">Completed</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-yellow-400">{tasks.filter(t => t.status === 'in_progress').length}</p>
                <p className="text-slate-400 text-xs mt-1">In Progress</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-cyan-400">{teamMembers.length}</p>
                <p className="text-slate-400 text-xs mt-1">Team Members</p>
              </div>
            </div>
            {tasks.length > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Overall Progress</span>
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
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'tasks',    label: 'Tasks',   count: tasks.length },
              { key: 'modules',  label: 'Modules', count: modules.length },
              { key: 'team',     label: 'Team',    count: teamMembers.length },
            ].map(tab => (
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
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Recent Tasks</h3>
                {tasks.length === 0 ? <p className="text-slate-400 text-sm">No tasks yet</p> : (
                  <div className="space-y-3">
                    {tasks.slice(0, 5).map(task => (
                      <div key={task._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white text-sm font-medium">{task.title}</p>
                          <p className="text-slate-400 text-xs">{task.issueKey}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
                          {task.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Description', value: project.description || 'No description' },
                    { label: 'Created By',  value: project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—' },
                    { label: 'Start Date',  value: project.startDate ? new Date(project.startDate).toLocaleDateString() : '—' },
                    { label: 'End Date',    value: project.endDate   ? new Date(project.endDate).toLocaleDateString()   : '—' },
                    { label: 'Created',     value: new Date(project.createdAt).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TASKS TAB ── */}
          {activeTab === 'tasks' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
              {tasks.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-400 mb-4">No tasks yet</p>
                  <button onClick={() => setShowCreateTask(true)}
                    className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
                    Create First Task
                  </button>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Task</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Priority</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Assigned To</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Due</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="text-white text-sm font-medium">{task.title}</p>
                          <p className="text-slate-400 text-xs font-mono">{task.issueKey}</p>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
                            {task.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                {task.assignedTo.firstName?.charAt(0)}
                              </div>
                              <span className="text-slate-300 text-sm">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-sm">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-400 text-sm">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-4">
                          {/* FIX: Only show assign button if there are developers */}
                          {developers.length > 0 && (
                            assigningTask === task._id ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={assignUserId}
                                  onChange={e => setAssignUserId(e.target.value)}
                                  className="px-2 py-1 bg-slate-800 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                                >
                                  <option value="">— Select Developer —</option>
                                  {developers.map(m => (
                                    <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => assignUserId && handleAssignTask(task._id, assignUserId)}
                                  className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs transition-colors"
                                >✓</button>
                                <button
                                  onClick={() => { setAssigningTask(null); setAssignUserId('') }}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs transition-colors"
                                >✕</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setAssigningTask(task._id); setAssignUserId(task.assignedTo?._id || '') }}
                                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors"
                              >
                                {task.assignedTo ? 'Reassign' : 'Assign'}
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── MODULES TAB ── */}
          {activeTab === 'modules' && (
            <div>
              {modules.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No modules in this project</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map(mod => (
                    <div key={mod._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-semibold">{mod.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColor(mod.status)}`}>{mod.status}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{mod.description || 'No description'}</p>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tasks</span>
                          <span className="text-white">{tasks.filter(t => (t.module?._id || t.module) === mod._id).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Completed</span>
                          <span className="text-green-400">{tasks.filter(t => (t.module?._id || t.module) === mod._id && t.status === 'completed').length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TEAM TAB ── */}
          {activeTab === 'team' && (
            <div>
              {teamMembers.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400 mb-4">No team members assigned yet</p>
                  <button onClick={() => navigate('/manager/team')}
                    className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
                    Go to Team Management
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map(member => {
                    const m = typeof member === 'object' ? member : { _id: member }
                    const userTasks     = tasks.filter(t => (t.assignedTo?._id || t.assignedTo) === m._id)
                    const userCompleted = userTasks.filter(t => t.status === 'completed').length
                    return (
                      <div key={m._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-linear-to-r ${m.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
                            {m.firstName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{m.firstName} {m.lastName}</p>
                            <p className="text-slate-400 text-xs">{m.email}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${m.role === 'developer' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
                              {m.role}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Assigned Tasks</span>
                            <span className="text-white font-medium">{userTasks.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Completed</span>
                            <span className="text-green-400 font-medium">{userCompleted}</span>
                          </div>
                        </div>
                        {userTasks.length > 0 && (
                          <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"
                              style={{ width: `${Math.round((userCompleted / userTasks.length) * 100)}%` }} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ── Create Task Modal ── */}
      {showCreateTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Task</h2>
              <button onClick={() => { setShowCreateTask(false); setTaskMsg('') }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {taskMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{taskMsg}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Title <span className="text-red-400">*</span></label>
                <input type="text" placeholder="Task title..."
                  value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Description</label>
                <textarea placeholder="Task description..."
                  value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Module</label>
                <select value={taskForm.module} onChange={e => setTaskForm({ ...taskForm, module: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500">
                  <option value="">— No module —</option>
                  {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                {/* FIX: Only show developers in assign dropdown */}
                <label className="text-slate-400 text-xs mb-1 block">Assign To (Developer)</label>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500">
                  <option value="">— Unassigned —</option>
                  {developers.map(m => (
                    <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
                  ))}
                </select>
                {developers.length === 0 && (
                  <p className="text-slate-500 text-xs mt-1">No developers in this project's team yet.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Due Date</label>
                  <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreateTask}
                className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
                Create Task
              </button>
              <button onClick={() => { setShowCreateTask(false); setTaskMsg('') }}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerProjectDetails