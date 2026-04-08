import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';

const AdminProjectDetails = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [project, setProject]           = useState(null)
  const [modules, setModules]           = useState([])
  const [tasks, setTasks]               = useState([])
  const [allUsers, setAllUsers]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [activeTab, setActiveTab]       = useState('overview')

  // Modal states
  const [showAddModule, setShowAddModule]     = useState(false)
  const [showAddTask, setShowAddTask]         = useState(false)
  const [showAddMember, setShowAddMember]     = useState(false)
  const [submitting, setSubmitting]           = useState(false)

  // Forms
  const [moduleForm, setModuleForm] = useState({ name: '', description: '' })
  const [taskForm, setTaskForm]     = useState({ title: '', description: '', priority: 'medium', moduleId: '', assignedTo: '', dueDate: '' })
  const [memberSearch, setMemberSearch] = useState('')

  const [sprints, setSprints] = useState([])
  const [allBugs, setAllBugs] = useState([])

  const navigate  = useNavigate()
  const location  = useLocation()
  const { id }    = useParams()
  const token     = localStorage.getItem('token')
  const headers   = { Authorization: `Bearer ${token}` }
  const jsonH     = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const navItems = [
    { name: 'Dashboard', path: '/admindashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users',     path: '/admin/users',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Projects',  path: '/admin/projects',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Settings',  path: '/admin/settings',  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ]

  const fetchAll = async () => {
    try {
      const [projRes, modRes, taskRes, usersRes, sprintRes, bugRes] = await Promise.all([
        fetch(`http://localhost:3000/projects/${id}`,           { headers }),
        fetch(`http://localhost:3000/modules?projectId=${id}`,  { headers }),
        fetch(`http://localhost:3000/tasks?project=${id}`,      { headers }),
        fetch(`http://localhost:3000/users`,                    { headers }),
        fetch(`http://localhost:3000/sprints?projectId=${id}`,  { headers }),
        fetch(`http://localhost:3000/manager/bugs`,             { headers }),
      ])
      const [projData, modData, taskData, usersData, sprintData, bugData] = await Promise.all([
        projRes.json(), modRes.json(), taskRes.json(), usersRes.json(), sprintRes.json(), bugRes.json()
      ])
      if (projData.success)  setProject(projData.data)
      if (modData.success)   setModules(modData.data)
      if (taskData.success)  setTasks(taskData.data)
      if (usersData.success) setAllUsers(usersData.data)
      if (sprintData.success) setSprints(sprintData.data || [])
      if (bugData.success) {
  const projectTaskIds = new Set(taskData.data?.map(t => t._id) || [])
  const projectBugs = (bugData.data || []).filter(b => {
    const taskId = b.task?._id || b.task
    return projectTaskIds.has(taskId)
  })
  setAllBugs(projectBugs)
}
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [id])

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const handleAddModule = async () => {
    if (!moduleForm.name) return
    setSubmitting(true)
    try {
      const res  = await fetch(`http://localhost:3000/projects/${id}/modules`, {
        method: 'POST', headers: jsonH,
        body: JSON.stringify({ ...moduleForm, project: id, createdBy: storedUser._id }),
      })
      const data = await res.json()
      if (data.success) { setShowAddModule(false); setModuleForm({ name: '', description: '' }); fetchAll() }
      else alert(data.message || 'Failed to add module')
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const handleAddTask = async () => {
    if (!taskForm.title) return
    setSubmitting(true)
    try {
      const body = {
        title:       taskForm.title,
        description: taskForm.description,
        priority:    taskForm.priority,
        project:     id,
        createdBy:   storedUser._id,
        dueDate:     taskForm.dueDate || null,
        ...(taskForm.moduleId   && { module:     taskForm.moduleId }),
        ...(taskForm.assignedTo && { assignedTo: taskForm.assignedTo }),
      }
      const res  = await fetch('http://localhost:3000/tasks', {
        method: 'POST', headers: jsonH, body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setShowAddTask(false)
        setTaskForm({ title: '', description: '', priority: 'medium', moduleId: '', assignedTo: '', dueDate: '' })
        fetchAll()
      } else alert(data.message || 'Failed to add task')
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const handleAddMember = async (userId) => {
    try {
      await fetch(`http://localhost:3000/projects/${id}/members`, {
        method: 'POST', headers: jsonH, body: JSON.stringify({ userId }),
      })
      fetchAll()
    } catch (err) { console.error(err) }
  }

  const handleRemoveMember = async (userId) => {
    try {
      await fetch(`http://localhost:3000/projects/${id}/members`, {
        method: 'DELETE', headers: jsonH, body: JSON.stringify({ userId }),
      })
      fetchAll()
    } catch (err) { console.error(err) }
  }

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

  const severityColor = (s) => ({
    critical: 'bg-red-500/20 text-red-400',
    high:     'bg-orange-500/20 text-orange-400',
    medium:   'bg-yellow-500/20 text-yellow-400',
    low:      'bg-green-500/20 text-green-400',
  }[s] || 'bg-slate-500/20 text-slate-400')

  const statusColor = (s) => ({
    active:    'bg-green-500/20 text-green-400',
    completed: 'bg-blue-500/20 text-blue-400',
  }[s] || 'bg-yellow-500/20 text-yellow-400')

  const sprintStatusColor = (s) => ({
    planned:   'bg-slate-500/20 text-slate-400 border-slate-500/30',
    active:    'bg-green-500/20 text-green-400 border-green-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const bugTasks       = tasks.filter(t => t.status === 'bug_found').length
  const activeTasks    = tasks.filter(t => t.status !== 'completed').length
  const progressPct    = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100)
  const openBugs       = allBugs.filter(b => !b.resolved).length

  const currentMemberIds = new Set((project?.teamMembers || []).map(m => m._id || m))
  const availableUsers   = allUsers.filter(u =>
    !currentMemberIds.has(u._id) &&
    ['developer', 'tester', 'project_manager'].includes(u.role) &&
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(memberSearch.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading project...</p>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Project not found</p>
        <Link to="/admin/projects" className="text-blue-400 hover:text-blue-300">← Back to Projects</Link>
      </div>
    </div>
  )

  const TABS = [
    { key: 'overview', label: 'Overview',  count: null },
    { key: 'modules',  label: 'Modules',   count: modules.length,               countColor: 'bg-blue-500/20 text-blue-400' },
    { key: 'tasks',    label: 'Tasks',     count: tasks.length,                  countColor: 'bg-blue-500/20 text-blue-400' },
    { key: 'team',     label: 'Team',      count: project.teamMembers?.length || 0, countColor: 'bg-blue-500/20 text-blue-400' },
    { key: 'sprints',  label: 'Sprints',   count: sprints.length,                countColor: 'bg-blue-500/20 text-blue-400' },
    { key: 'bugs',     label: 'Bugs',      count: allBugs.length,                countColor: 'bg-red-500/20 text-red-400' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-3">
            <Link to="/admindashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">Bug Tracker</Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="space-y-2 flex-1">
            {navItems.map(item => (
              <Link key={item.name} to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all ${location.pathname === item.path ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-white/10'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <Link to="/admin/settings" className="block backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                  {storedUser.firstName?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{storedUser.firstName} {storedUser.lastName}</p>
                  <p className="text-slate-400 text-xs truncate">{storedUser.email}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => navigate('/admin/projects')} className="flex items-center space-x-2 text-slate-300 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Projects</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-slate-400 text-sm font-mono">{project.projectKey}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(project.status)}`}>{project.status}</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium">Logout</button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Project Info + Stats */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-bold text-white mb-3">{project.name}</h2>
                <p className="text-slate-400 text-sm mb-4">{project.description || 'No description'}</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Project Key', value: project.projectKey },
                    { label: 'Created By',  value: project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—' },
                    { label: 'Created At',  value: new Date(project.createdAt).toLocaleDateString() },
                    { label: 'Start Date',  value: project.startDate ? new Date(project.startDate).toLocaleDateString() : '—' },
                    { label: 'End Date',    value: project.endDate   ? new Date(project.endDate).toLocaleDateString()   : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center space-x-3">
                      <span className="text-slate-400 w-24 shrink-0">{label}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Tasks', value: tasks.length,    color: 'text-white' },
                  { label: 'Completed',   value: completedTasks,  color: 'text-green-400' },
                  { label: 'Open Bugs',   value: openBugs,        color: 'text-red-400' },
                  { label: 'Sprints',     value: sprints.length,  color: 'text-cyan-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {tasks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Overall Progress</span>
                  <span className="text-white font-medium">{progressPct}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-white/10">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all capitalize ${activeTab === tab.key ? 'bg-white/10 text-white border border-white/20 border-b-0' : 'text-slate-400 hover:text-white'}`}>
                {tab.label}
                {tab.count !== null && (
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab.countColor}`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
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
                          <p className="text-slate-400 text-xs font-mono">{task.issueKey}</p>
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
                <h3 className="text-lg font-bold text-white mb-4">Recent Bugs</h3>
                {allBugs.length === 0 ? <p className="text-slate-400 text-sm">No bugs reported</p> : (
                  <div className="space-y-3">
                    {allBugs.slice(0, 5).map(bug => (
                      <div key={bug._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-white text-sm truncate">{bug.comment}</p>
                          <p className="text-slate-400 text-xs font-mono">{bug.task?.issueKey ?? 'N/A'}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${severityColor(bug.bugSeverity)}`}>{bug.bugSeverity}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {bug.resolved ? 'Resolved' : 'Open'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MODULES ── */}
          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowAddModule(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Module
                </button>
              </div>
              {modules.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No modules in this project</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map(mod => (
                    <div key={mod._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-semibold">{mod.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColor(mod.status)}`}>{mod.status}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{mod.description || 'No description'}</p>
                      <div className="space-y-1 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Tasks</span>
                          <span className="text-white">{tasks.filter(t => (t.module?._id || t.module) === mod._id).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completed</span>
                          <span className="text-green-400">{tasks.filter(t => (t.module?._id || t.module) === mod._id && t.status === 'completed').length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TASKS ── */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowAddTask(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </button>
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
                {tasks.length === 0 ? (
                  <div className="p-8 text-center"><p className="text-slate-400">No tasks in this project</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          {['Task', 'Module', 'Assigned To', 'Status', 'Priority', 'Due Date'].map(h => (
                            <th key={h} className="text-left p-4 text-slate-300 text-sm font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map(task => (
                          <tr key={task._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <p className="text-white text-sm font-medium">{task.title}</p>
                              <p className="text-slate-400 text-xs font-mono">{task.issueKey}</p>
                            </td>
                            <td className="p-4 text-slate-300 text-sm">{task.module?.name || '—'}</td>
                            <td className="p-4">
                              {task.assignedTo ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                    {task.assignedTo.firstName?.charAt(0)}
                                  </div>
                                  <span className="text-slate-300 text-sm">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                                </div>
                              ) : <span className="text-slate-500 text-sm">Unassigned</span>}
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
                            <td className="p-4 text-slate-400 text-sm">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TEAM ── */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowAddMember(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Member
                </button>
              </div>
              {(project.teamMembers?.length || 0) === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No team members yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.teamMembers.map(member => (
                    <div key={member._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-gradient-to-r ${member.role === 'developer' ? 'from-cyan-500 to-blue-500' : member.role === 'tester' ? 'from-orange-500 to-red-500' : 'from-purple-500 to-pink-500'}`}>
                          {member.firstName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{member.firstName} {member.lastName}</p>
                          <p className="text-slate-400 text-xs">{member.email}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 capitalize mt-1 inline-block">
                            {member.role?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-slate-400 mb-4">
                        <div className="flex justify-between">
                          <span>Tasks Assigned</span>
                          <span className="text-white">{tasks.filter(t => (t.assignedTo?._id || t.assignedTo) === member._id).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completed</span>
                          <span className="text-green-400">{tasks.filter(t => (t.assignedTo?._id || t.assignedTo) === member._id && t.status === 'completed').length}</span>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveMember(member._id)}
                        className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs transition-colors">
                        Remove from Project
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SPRINTS ── */}
          {activeTab === 'sprints' && (
            <div className="space-y-4">
              {sprints.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-1">No sprints yet</p>
                  <p className="text-slate-400 text-sm">Sprints are created by project managers</p>
                </div>
              ) : sprints.map(sprint => {
                const sprintTasks = tasks.filter(t => t.sprint === sprint._id || t.sprint?._id === sprint._id)
                const done        = sprintTasks.filter(t => t.status === 'completed').length
                const progress    = sprintTasks.length ? Math.round((done / sprintTasks.length) * 100) : 0
                const end         = sprint.endDate ? new Date(sprint.endDate) : null
                const isOver      = end ? new Date() > end : false
                const daysLeft    = end ? Math.ceil((end - new Date()) / 86400000) : null

                return (
                  <div key={sprint._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{sprint.name}</h3>
                          <p className="text-slate-400 text-xs">{sprintTasks.length} task{sprintTasks.length !== 1 ? 's' : ''} assigned</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                          <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-green-400' : progress > 50 ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                          <span className="text-white text-sm font-bold">{progress}%</span>
                          <span className="text-slate-400 text-xs">done</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${sprintStatusColor(sprint.status)}`}>
                          {sprint.status || 'planned'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Start', value: sprint.startDate ? new Date(sprint.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                        { label: 'End',   value: sprint.endDate   ? new Date(sprint.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })   : '—' },
                        { label: isOver ? 'Status' : 'Time Left', value: isOver ? 'Overdue' : daysLeft !== null ? `${daysLeft}d left` : '—' },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                          <p className={`text-sm font-medium ${isOver && label !== 'Start' && label !== 'End' ? 'text-red-400' : 'text-white'}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>Work Completion</span>
                        <span>{done} / {sprintTasks.length} tasks done</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${
                          progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                          progress >= 50  ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                                           'bg-gradient-to-r from-blue-500 to-cyan-400'
                        }`} style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {sprintTasks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-slate-400 text-xs font-medium">Tasks in this sprint:</p>
                        {sprintTasks.slice(0, 4).map(t => (
                          <div key={t._id} className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5">
                            <div>
                              <span className="text-blue-400 text-xs font-mono mr-2">{t.issueKey}</span>
                              <span className="text-white text-sm">{t.title}</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${taskStatusColor(t.status)}`}>
                              {t.status?.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                        {sprintTasks.length > 4 && (
                          <p className="text-slate-500 text-xs">+{sprintTasks.length - 4} more tasks</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── BUGS ── */}
          {activeTab === 'bugs' && (
            <div className="space-y-3">
              {/* Summary bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                {[
                  { label: 'Total Bugs',  value: allBugs.length,                             color: 'text-white' },
                  { label: 'Open',        value: allBugs.filter(b => !b.resolved).length,    color: 'text-red-400' },
                  { label: 'Resolved',    value: allBugs.filter(b => b.resolved).length,     color: 'text-green-400' },
                  { label: 'Critical',    value: allBugs.filter(b => b.bugSeverity === 'critical').length, color: 'text-orange-400' },
                ].map((s, i) => (
                  <div key={i} className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {allBugs.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-1">No bugs reported</p>
                  <p className="text-slate-400 text-sm">This project is bug-free!</p>
                </div>
              ) : allBugs.map(bug => (
                <div key={bug._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>
                      {bug.bugSeverity}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {bug.resolved ? 'Resolved' : 'Open'}
                    </span>
                    <span className="text-slate-500 text-xs ml-auto">
                      by {bug.commentedBy?.firstName} {bug.commentedBy?.lastName}
                    </span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed mb-3">{bug.comment}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <span>Task: <span className="text-blue-400 font-mono">{bug.task?.issueKey ?? 'N/A'}</span></span>
                    {bug.task?.title && <span className="text-slate-300">{bug.task.title}</span>}
                    {bug.createdAt && <span>{new Date(bug.createdAt).toLocaleDateString()}</span>}
                  </div>
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
          )}

        </main>
      </div>

      {/* ── ADD MODULE MODAL ── */}
      {showAddModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Module</h2>
              <button onClick={() => setShowAddModule(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Module Name <span className="text-red-400">*</span></label>
                <input value={moduleForm.name} onChange={e => setModuleForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Authentication"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Description</label>
                <textarea value={moduleForm.description} onChange={e => setModuleForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What does this module cover?" rows={3}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAddModule} disabled={submitting || !moduleForm.name}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Module'}
                </button>
                <button onClick={() => setShowAddModule(false)}
                  className="flex-1 py-3 bg-white/5 text-slate-300 border border-white/10 rounded-xl text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD TASK MODAL ── */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Task</h2>
              <button onClick={() => setShowAddTask(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Task Title <span className="text-red-400">*</span></label>
                <input value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Implement login page"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Description</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Task details..." rows={2}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm mb-1 block">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm mb-1 block">Due Date</label>
                  <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Module (optional)</label>
                <select value={taskForm.moduleId} onChange={e => setTaskForm(p => ({ ...p, moduleId: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="">No module</option>
                  {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Assign To (optional)</label>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm(p => ({ ...p, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="">Unassigned</option>
                  {allUsers.filter(u => u.role === 'developer').map(u => (
                    <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAddTask} disabled={submitting || !taskForm.title}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Task'}
                </button>
                <button onClick={() => setShowAddTask(false)}
                  className="flex-1 py-3 bg-white/5 text-slate-300 border border-white/10 rounded-xl text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MEMBER MODAL ── */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add Team Member</h2>
              <button onClick={() => setShowAddMember(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-4" />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {availableUsers.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No users available</p>
              ) : availableUsers.map(u => (
                <div key={u._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                      {u.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{u.firstName} {u.lastName}</p>
                      <p className="text-slate-400 text-xs capitalize">{u.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button onClick={() => handleAddMember(u._id)}
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs transition-colors">
                    Add
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAddMember(false)}
              className="w-full mt-4 py-2.5 bg-white/5 text-slate-300 border border-white/10 rounded-xl text-sm">
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminProjectDetails