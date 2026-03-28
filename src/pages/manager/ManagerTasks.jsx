import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

const priorityColor = (p) => ({ high: 'bg-red-500/20 text-red-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400', urgent: 'bg-red-600/30 text-red-300' }[p] || 'bg-slate-500/20 text-slate-400')
const statusColor   = (s) => ({ to_do: 'bg-slate-500/20 text-slate-400', assigned: 'bg-blue-500/20 text-blue-400', in_progress: 'bg-yellow-500/20 text-yellow-400', submitted: 'bg-purple-500/20 text-purple-400', in_testing: 'bg-cyan-500/20 text-cyan-400', bug_found: 'bg-red-500/20 text-red-400', fix_in_progress: 'bg-orange-500/20 text-orange-400', resubmitted: 'bg-indigo-500/20 text-indigo-400', completed: 'bg-green-500/20 text-green-400' }[s] || 'bg-slate-500/20 text-slate-400')

const ManagerTasks = () => {
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [tasks, setTasks]                 = useState([])
  const [allUsers, setAllUsers]           = useState([])
  const [projects, setProjects]           = useState([])
  const [modules, setModules]             = useState([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState('all')
  const [assigningTask, setAssigningTask] = useState(null)
  const [assignUserId, setAssignUserId]   = useState('')
  const [toast, setToast]                 = useState('')
  const [showCreate, setShowCreate]       = useState(false)
  const [taskForm, setTaskForm]           = useState({ title: '', description: '', project: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
  const [taskMsg, setTaskMsg]             = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }
  const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchData = async () => {
    try {
      const [tRes, uRes, pRes] = await Promise.all([
        fetch('http://localhost:3000/manager/tasks',    { headers }),
        fetch('http://localhost:3000/manager/team',     { headers }),
        fetch('http://localhost:3000/manager/projects', { headers }),
      ])
      const [tData, uData, pData] = await Promise.all([tRes.json(), uRes.json(), pRes.json()])
      if (tData.success) setTasks(tData.data || [])
      if (uData.success) setAllUsers(uData.data || [])
      if (pData.success) setProjects(Array.isArray(pData.data) ? pData.data : pData.data?.projects || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  // Fetch modules when project selected in create form
  useEffect(() => {
    if (!taskForm.project) { setModules([]); return }
    const fetchModules = async () => {
      try {
        const res  = await fetch(`http://localhost:3000/modules?projectId=${taskForm.project}`, { headers })
        const data = await res.json()
        if (data.success) setModules(data.data || [])
      } catch (err) { console.error(err) }
    }
    fetchModules()
  }, [taskForm.project])

  // Team members of selected project for assignment
  const selectedProject    = projects.find(p => p._id === taskForm.project)
  const projectTeamMembers = selectedProject?.teamMembers?.filter(m => typeof m === 'object') || []

  const handleAssign = async (taskId, userId) => {
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT', headers, body: JSON.stringify({ assignedTo: userId, status: 'assigned' }),
      })
      const data = await res.json()
      if (data.success) { showToast('Task assigned!'); setAssigningTask(null); setAssignUserId(''); fetchData() }
      else showToast(data.message || 'Failed')
    } catch { showToast('Server error') }
  }

  const handleCreateTask = async () => {
    setTaskMsg('')
    if (!taskForm.title.trim()) { setTaskMsg('Title is required'); return }
    if (!taskForm.project)      { setTaskMsg('Please select a project'); return }
    try {
      const payload = {
        title:       taskForm.title.trim(),
        description: taskForm.description.trim(),
        project:     taskForm.project,
        priority:    taskForm.priority,
        ...(taskForm.module     && { module:     taskForm.module }),
        ...(taskForm.assignedTo && { assignedTo: taskForm.assignedTo }),
        ...(taskForm.dueDate    && { dueDate:    taskForm.dueDate }),
      }
      const res  = await fetch('http://localhost:3000/manager/tasks', {
        method: 'POST', headers, body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        setShowCreate(false)
        setTaskForm({ title: '', description: '', project: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
        showToast('Task created!')
        fetchData()
      } else { setTaskMsg(data.message || data.err || 'Failed to create task') }
    } catch { setTaskMsg('Server error') }
  }

  const developers = allUsers.filter(u => u.role === 'developer')
  const testers    = allUsers.filter(u => u.role === 'tester')
  const filtered   = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading tasks...</p>
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
              <h1 className="text-2xl font-bold text-white">Tasks</h1>
              <p className="text-slate-300 text-sm">Manage and assign tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              + Create Task
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
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
              { label: 'Total',       value: tasks.length,                                         color: 'from-blue-500 to-cyan-500' },
              { label: 'To Do',       value: tasks.filter(t => t.status === 'to_do').length,       color: 'from-slate-500 to-slate-600' },
              { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: 'from-yellow-500 to-orange-500' },
              { label: 'Completed',   value: tasks.filter(t => t.status === 'completed').length,   color: 'from-green-500 to-emerald-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full bg-linear-to-r ${s.color}`} style={{ width: tasks.length ? `${(s.value / tasks.length) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">All Tasks</h2>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="all"             className="bg-slate-800 text-white">All Status</option>
                <option value="to_do"           className="bg-slate-800 text-white">To Do</option>
                <option value="assigned"        className="bg-slate-800 text-white">Assigned</option>
                <option value="in_progress"     className="bg-slate-800 text-white">In Progress</option>
                <option value="submitted"       className="bg-slate-800 text-white">Submitted</option>
                <option value="in_testing"      className="bg-slate-800 text-white">In Testing</option>
                <option value="bug_found"       className="bg-slate-800 text-white">Bug Found</option>
                <option value="fix_in_progress" className="bg-slate-800 text-white">Fix In Progress</option>
                <option value="completed"       className="bg-slate-800 text-white">Completed</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="text-slate-400">No tasks found.</p>
            ) : (
              <div className="space-y-3">
                {filtered.map(task => (
                  <div key={task._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">{task.issueKey}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(task.status)}`}>{task.status?.replace(/_/g, ' ')}</span>
                        </div>
                        <h3 className="text-white font-medium mb-1">{task.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>Project: <span className="text-slate-300">{task.project?.name ?? 'N/A'}</span></span>
                          <span>Module: <span className="text-slate-300">{task.module?.name ?? 'N/A'}</span></span>
                          {task.assignedTo && <span>Assigned: <span className="text-slate-300">{task.assignedTo.firstName} {task.assignedTo.lastName} ({task.assignedTo.role})</span></span>}
                          {task.dueDate    && <span>Due: <span className="text-slate-300">{new Date(task.dueDate).toLocaleDateString()}</span></span>}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {assigningTask === task._id ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <select value={assignUserId} onChange={e => setAssignUserId(e.target.value)}
                              className="px-2 py-1.5 bg-slate-800 border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 min-w-[140px]">
                              <option value="" className="bg-slate-800 text-white">— Select user —</option>
                              {developers.length > 0 && (
                                <optgroup label="Developers" className="bg-slate-800 text-slate-400">
                                  {developers.map(u => <option key={u._id} value={u._id} className="bg-slate-800 text-white">{u.firstName} {u.lastName}</option>)}
                                </optgroup>
                              )}
                              {testers.length > 0 && (
                                <optgroup label="Testers" className="bg-slate-800 text-slate-400">
                                  {testers.map(u => <option key={u._id} value={u._id} className="bg-slate-800 text-white">{u.firstName} {u.lastName}</option>)}
                                </optgroup>
                              )}
                            </select>
                            <button onClick={() => assignUserId && handleAssign(task._id, assignUserId)}
                              className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs">✓</button>
                            <button onClick={() => { setAssigningTask(null); setAssignUserId('') }}
                              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs">✕</button>
                          </div>
                        ) : (
                          <button onClick={() => { setAssigningTask(task._id); setAssignUserId(task.assignedTo?._id || '') }}
                            className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors whitespace-nowrap">
                            {task.assignedTo ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Task Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Task</h2>
              <button onClick={() => { setShowCreate(false); setTaskMsg('') }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {taskMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{taskMsg}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Title <span className="text-red-400">*</span></label>
                <input type="text" placeholder="Task title..." value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Description</label>
                <textarea placeholder="Task description..." value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Project <span className="text-red-400">*</span></label>
                <select value={taskForm.project} onChange={e => setTaskForm({ ...taskForm, project: e.target.value, module: '', assignedTo: '' })}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
                  <option value="" className="bg-slate-800 text-white">— Select project —</option>
                  {projects.map(p => <option key={p._id} value={p._id} className="bg-slate-800 text-white">{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Module</label>
                <select value={taskForm.module} onChange={e => setTaskForm({ ...taskForm, module: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  disabled={!taskForm.project}>
                  <option value="" className="bg-slate-800 text-white">— No module —</option>
                  {modules.map(m => <option key={m._id} value={m._id} className="bg-slate-800 text-white">{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Assign To</label>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  disabled={!taskForm.project}>
                  <option value="" className="bg-slate-800 text-white">— Unassigned —</option>
                  {projectTeamMembers.filter(m => m.role === 'developer').length > 0 && (
                    <optgroup label="Developers" className="bg-slate-800 text-slate-400">
                      {projectTeamMembers.filter(m => m.role === 'developer').map(m => (
                        <option key={m._id} value={m._id} className="bg-slate-800 text-white">{m.firstName} {m.lastName}</option>
                      ))}
                    </optgroup>
                  )}
                  {projectTeamMembers.filter(m => m.role === 'tester').length > 0 && (
                    <optgroup label="Testers" className="bg-slate-800 text-slate-400">
                      {projectTeamMembers.filter(m => m.role === 'tester').map(m => (
                        <option key={m._id} value={m._id} className="bg-slate-800 text-white">{m.firstName} {m.lastName}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                {taskForm.project && projectTeamMembers.length === 0 && (
                  <p className="text-slate-500 text-xs mt-1">No team members in this project yet.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
                    <option value="low"    className="bg-slate-800 text-white">Low</option>
                    <option value="medium" className="bg-slate-800 text-white">Medium</option>
                    <option value="high"   className="bg-slate-800 text-white">High</option>
                    <option value="urgent" className="bg-slate-800 text-white">Urgent</option>
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
              <button onClick={() => { setShowCreate(false); setTaskMsg('') }}
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

export default ManagerTasks