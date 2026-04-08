// // // // import { useState, useEffect } from 'react'
// // // // import { useNavigate, useParams } from 'react-router-dom'
// // // // import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

// // // // const taskStatusColor = (s) => ({
// // // //   to_do: 'bg-slate-500/20 text-slate-400', assigned: 'bg-blue-500/20 text-blue-400',
// // // //   in_progress: 'bg-yellow-500/20 text-yellow-400', submitted: 'bg-purple-500/20 text-purple-400',
// // // //   in_testing: 'bg-cyan-500/20 text-cyan-400', bug_found: 'bg-red-500/20 text-red-400',
// // // //   fix_in_progress: 'bg-orange-500/20 text-orange-400', resubmitted: 'bg-indigo-500/20 text-indigo-400',
// // // //   completed: 'bg-green-500/20 text-green-400',
// // // // }[s] || 'bg-slate-500/20 text-slate-400')

// // // // const priorityColor = (p) => ({
// // // //   low: 'bg-green-500/20 text-green-400', medium: 'bg-yellow-500/20 text-yellow-400',
// // // //   high: 'bg-orange-500/20 text-orange-400', urgent: 'bg-red-500/20 text-red-400',
// // // // }[p] || 'bg-slate-500/20 text-slate-400')

// // // // const statusColor = (s) => ({
// // // //   active: 'bg-green-500/20 text-green-400', completed: 'bg-blue-500/20 text-blue-400',
// // // //   inactive: 'bg-yellow-500/20 text-yellow-400',
// // // // }[s] || 'bg-slate-500/20 text-slate-400')

// // // // const ManagerProjectDetails = () => {
// // // //   const [sidebarOpen, setSidebarOpen]         = useState(false)
// // // //   const [project, setProject]                 = useState(null)
// // // //   const [modules, setModules]                 = useState([])
// // // //   const [tasks, setTasks]                     = useState([])
// // // //   const [loading, setLoading]                 = useState(true)
// // // //   const [activeTab, setActiveTab]             = useState('overview')
// // // //   const [showCreateTask, setShowCreateTask]   = useState(false)
// // // //   const [showAddModule, setShowAddModule]     = useState(false)
// // // //   const [taskForm, setTaskForm]               = useState({ title: '', description: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
// // // //   const [moduleForm, setModuleForm]           = useState({ name: '', description: '' })
// // // //   const [taskMsg, setTaskMsg]                 = useState('')
// // // //   const [moduleMsg, setModuleMsg]             = useState('')
// // // //   const [assigningTask, setAssigningTask]     = useState(null)
// // // //   const [assignUserId, setAssignUserId]       = useState('')
// // // //   const [toast, setToast]                     = useState('')

// // // //   const navigate    = useNavigate()
// // // //   const { id }      = useParams()
// // // //   const token       = localStorage.getItem('token')
// // // //   const user        = JSON.parse(localStorage.getItem('user') || '{}')
// // // //   const authHeaders = { Authorization: `Bearer ${token}` }
// // // //   const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

// // // //   const handleLogout = () => { localStorage.clear(); navigate('/') }
// // // //   const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

// // // //   const fetchAll = async () => {
// // // //     try {
// // // //       const [pRes, mRes, tRes] = await Promise.all([
// // // //         fetch(`http://localhost:3000/projects/${id}`,          { headers: authHeaders }),
// // // //         fetch(`http://localhost:3000/modules?projectId=${id}`, { headers: authHeaders }),
// // // //         fetch(`http://localhost:3000/tasks?project=${id}`,     { headers: authHeaders }),
// // // //       ])
// // // //       const safe = async (res) => {
// // // //         const ct = res.headers.get('content-type') || ''
// // // //         if (!ct.includes('application/json')) return { success: false }
// // // //         return res.json()
// // // //       }
// // // //       const [pData, mData, tData] = await Promise.all([safe(pRes), safe(mRes), safe(tRes)])
// // // //       if (pData.success) setProject(pData.data)
// // // //       if (mData.success) setModules(mData.data || [])
// // // //       if (tData.success) setTasks(tData.data || [])
// // // //     } catch (err) { console.error(err) }
// // // //     finally { setLoading(false) }
// // // //   }

// // // //   useEffect(() => { if (id) fetchAll() }, [id])

// // // //   // Create Task
// // // //   const handleCreateTask = async () => {
// // // //     setTaskMsg('')
// // // //     if (!taskForm.title.trim()) { setTaskMsg('Title is required'); return }
// // // //     try {
// // // //       const payload = {
// // // //         title:       taskForm.title.trim(),
// // // //         description: taskForm.description.trim(),
// // // //         project:     id,
// // // //         priority:    taskForm.priority,
// // // //         createdBy:   user._id,
// // // //         ...(taskForm.module     && { module:     taskForm.module }),
// // // //         ...(taskForm.assignedTo && { assignedTo: taskForm.assignedTo }),
// // // //         ...(taskForm.dueDate    && { dueDate:    taskForm.dueDate }),
// // // //       }
// // // //       const res  = await fetch('http://localhost:3000/manager/tasks', {
// // // //         method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload)
// // // //       })
// // // //       const data = await res.json()
// // // //       if (data.success) {
// // // //         setShowCreateTask(false)
// // // //         setTaskForm({ title: '', description: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
// // // //         showToast('Task created!'); fetchAll()
// // // //       } else { setTaskMsg(data.message || data.err || 'Failed to create task') }
// // // //     } catch { setTaskMsg('Server error') }
// // // //   }

// // // //   // Add Module
// // // //   const handleAddModule = async () => {
// // // //     setModuleMsg('')
// // // //     if (!moduleForm.name.trim()) { setModuleMsg('Module name is required'); return }
// // // //     try {
// // // //       const res  = await fetch('http://localhost:3000/modules', {
// // // //         method: 'POST', headers: jsonHeaders,
// // // //         body: JSON.stringify({
// // // //           name:        moduleForm.name.trim(),
// // // //           description: moduleForm.description.trim(),
// // // //           project:     id,
// // // //           createdBy:   user._id,
// // // //         })
// // // //       })
// // // //       const data = await res.json()
// // // //       if (data.success) {
// // // //         setShowAddModule(false)
// // // //         setModuleForm({ name: '', description: '' })
// // // //         showToast('Module added!'); fetchAll()
// // // //       } else { setModuleMsg(data.message || data.error || 'Failed to add module') }
// // // //     } catch { setModuleMsg('Server error') }
// // // //   }

// // // //   // Assign task
// // // //   const handleAssignTask = async (taskId, userId) => {
// // // //     try {
// // // //       await fetch(`http://localhost:3000/tasks/${taskId}`, {
// // // //         method: 'PUT', headers: jsonHeaders,
// // // //         body: JSON.stringify({ assignedTo: userId, status: 'assigned' })
// // // //       })
// // // //       setAssigningTask(null); setAssignUserId(''); fetchAll()
// // // //     } catch (err) { console.error(err) }
// // // //   }

// // // //   const teamMembers    = project?.teamMembers || []
// // // //   const assignableTeam = teamMembers.filter(m => typeof m === 'object' && (m.role === 'developer' || m.role === 'tester'))
// // // //   const completedTasks = tasks.filter(t => t.status === 'completed').length
// // // //   const progressPct    = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

// // // //   if (loading) return (
// // // //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// // // //       <p className="text-white text-xl">Loading project...</p>
// // // //     </div>
// // // //   )
// // // //   if (!project) return (
// // // //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// // // //       <div className="text-center">
// // // //         <p className="text-white text-xl mb-4">Project not found</p>
// // // //         <button onClick={() => navigate('/manager/projects')} className="text-blue-400 hover:text-blue-300">← Back</button>
// // // //       </div>
// // // //     </div>
// // // //   )

// // // //   return (
// // // //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
// // // //       <div className="fixed inset-0 overflow-hidden pointer-events-none">
// // // //         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
// // // //         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
// // // //       </div>

// // // //       <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// // // //       <div className="lg:ml-64">
// // // //         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
// // // //           <div className="flex items-center space-x-4">
// // // //             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
// // // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// // // //               </svg>
// // // //             </button>
// // // //             <button onClick={() => navigate('/manager/projects')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
// // // //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// // // //               </svg>
// // // //               <span className="text-sm">Back</span>
// // // //             </button>
// // // //             <div>
// // // //               <h1 className="text-2xl font-bold text-white">{project.name}</h1>
// // // //               <div className="flex items-center gap-2 mt-0.5">
// // // //                 <span className="text-slate-400 text-sm font-mono">{project.projectKey}</span>
// // // //                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(project.status)}`}>{project.status}</span>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //           <div className="flex items-center gap-3">
// // // //             <button onClick={() => setShowCreateTask(true)}
// // // //               className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// // // //               + Create Task
// // // //             </button>
// // // //             <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
// // // //               Logout
// // // //             </button>
// // // //           </div>
// // // //         </header>

// // // //         {toast && (
// // // //           <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
// // // //             {toast}
// // // //           </div>
// // // //         )}

// // // //         <main className="p-4 lg:p-8 relative z-10 space-y-6">

// // // //           {/* Stats */}
// // // //           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // // //             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// // // //               {[
// // // //                 { label: 'Total Tasks',  value: tasks.length,                                         color: 'text-white' },
// // // //                 { label: 'Completed',    value: completedTasks,                                        color: 'text-green-400' },
// // // //                 { label: 'In Progress',  value: tasks.filter(t => t.status === 'in_progress').length,  color: 'text-yellow-400' },
// // // //                 { label: 'Team Members', value: teamMembers.length,                                    color: 'text-cyan-400' },
// // // //               ].map((s, i) => (
// // // //                 <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
// // // //                   <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
// // // //                   <p className="text-slate-400 text-xs mt-1">{s.label}</p>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //             {tasks.length > 0 && (
// // // //               <div>
// // // //                 <div className="flex justify-between text-sm mb-2">
// // // //                   <span className="text-slate-400">Overall Progress</span>
// // // //                   <span className="text-white font-medium">{progressPct}%</span>
// // // //                 </div>
// // // //                 <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
// // // //                   <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
// // // //                     style={{ width: `${progressPct}%` }} />
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           {/* Tabs */}
// // // //           <div className="flex space-x-2 border-b border-white/10">
// // // //             {[
// // // //               { key: 'overview', label: 'Overview' },
// // // //               { key: 'tasks',    label: 'Tasks',   count: tasks.length },
// // // //               { key: 'modules',  label: 'Modules', count: modules.length },
// // // //               { key: 'team',     label: 'Team',    count: teamMembers.length },
// // // //             ].map(tab => (
// // // //               <button key={tab.key} onClick={() => setActiveTab(tab.key)}
// // // //                 className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
// // // //                   activeTab === tab.key ? 'bg-white/10 text-white border border-white/20 border-b-0' : 'text-slate-400 hover:text-white'
// // // //                 }`}>
// // // //                 {tab.label}
// // // //                 {tab.count !== undefined && (
// // // //                   <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{tab.count}</span>
// // // //                 )}
// // // //               </button>
// // // //             ))}
// // // //           </div>

// // // //           {/* OVERVIEW */}
// // // //           {activeTab === 'overview' && (
// // // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // // //               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // // //                 <h3 className="text-lg font-bold text-white mb-4">Recent Tasks</h3>
// // // //                 {tasks.length === 0 ? <p className="text-slate-400 text-sm">No tasks yet</p> : (
// // // //                   <div className="space-y-3">
// // // //                     {tasks.slice(0, 5).map(task => (
// // // //                       <div key={task._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
// // // //                         <div>
// // // //                           <p className="text-white text-sm font-medium">{task.title}</p>
// // // //                           <p className="text-slate-400 text-xs">{task.issueKey}</p>
// // // //                         </div>
// // // //                         <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
// // // //                           {task.status?.replace(/_/g, ' ')}
// // // //                         </span>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // // //                 <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
// // // //                 <div className="space-y-3 text-sm">
// // // //                   {[
// // // //                     { label: 'Description', value: project.description || 'No description' },
// // // //                     { label: 'Created By',  value: project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—' },
// // // //                     { label: 'Start Date',  value: project.startDate ? new Date(project.startDate).toLocaleDateString() : '—' },
// // // //                     { label: 'End Date',    value: project.endDate   ? new Date(project.endDate).toLocaleDateString()   : '—' },
// // // //                     { label: 'Created',     value: new Date(project.createdAt).toLocaleDateString() },
// // // //                   ].map(({ label, value }) => (
// // // //                     <div key={label} className="flex justify-between p-2 bg-white/5 rounded-lg">
// // // //                       <span className="text-slate-400">{label}</span>
// // // //                       <span className="text-white text-right max-w-[60%]">{value}</span>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           )}

// // // //           {/* TASKS */}
// // // //           {activeTab === 'tasks' && (
// // // //             <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
// // // //               {tasks.length === 0 ? (
// // // //                 <div className="p-8 text-center">
// // // //                   <p className="text-slate-400 mb-4">No tasks yet</p>
// // // //                   <button onClick={() => setShowCreateTask(true)}
// // // //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// // // //                     Create First Task
// // // //                   </button>
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="overflow-x-auto">
// // // //                   <table className="w-full">
// // // //                     <thead>
// // // //                       <tr className="border-b border-white/10">
// // // //                         {['Task', 'Status', 'Priority', 'Assigned To', 'Due', 'Action'].map(h => (
// // // //                           <th key={h} className="text-left p-4 text-slate-300 text-sm font-medium">{h}</th>
// // // //                         ))}
// // // //                       </tr>
// // // //                     </thead>
// // // //                     <tbody>
// // // //                       {tasks.map(task => (
// // // //                         <tr key={task._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
// // // //                           <td className="p-4">
// // // //                             <p className="text-white text-sm font-medium">{task.title}</p>
// // // //                             <p className="text-slate-400 text-xs font-mono">{task.issueKey}</p>
// // // //                           </td>
// // // //                           <td className="p-4">
// // // //                             <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
// // // //                               {task.status?.replace(/_/g, ' ')}
// // // //                             </span>
// // // //                           </td>
// // // //                           <td className="p-4">
// // // //                             <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(task.priority)}`}>
// // // //                               {task.priority}
// // // //                             </span>
// // // //                           </td>
// // // //                           <td className="p-4">
// // // //                             {task.assignedTo ? (
// // // //                               <div className="flex items-center gap-2">
// // // //                                 <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
// // // //                                   {task.assignedTo.firstName?.charAt(0)}
// // // //                                 </div>
// // // //                                 <span className="text-slate-300 text-sm">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
// // // //                               </div>
// // // //                             ) : <span className="text-slate-500 text-sm">Unassigned</span>}
// // // //                           </td>
// // // //                           <td className="p-4 text-slate-400 text-sm">
// // // //                             {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
// // // //                           </td>
// // // //                           <td className="p-4">
// // // //                             {assignableTeam.length > 0 && (
// // // //                               assigningTask === task._id ? (
// // // //                                 <div className="flex items-center gap-2">
// // // //                                   <select value={assignUserId} onChange={e => setAssignUserId(e.target.value)}
// // // //                                     className="px-2 py-1 bg-slate-800 border border-white/20 rounded-lg text-white text-xs focus:outline-none">
// // // //                                     <option value="" className="bg-slate-800 text-white">— Select —</option>
// // // //                                     <optgroup label="Developers" className="bg-slate-800 text-slate-400">
// // // //                                       {assignableTeam.filter(m => m.role === 'developer').map(m => (
// // // //                                         <option key={m._id} value={m._id} className="bg-slate-800 text-white">{m.firstName} {m.lastName}</option>
// // // //                                       ))}
// // // //                                     </optgroup>
// // // //                                     <optgroup label="Testers" className="bg-slate-800 text-slate-400">
// // // //                                       {assignableTeam.filter(m => m.role === 'tester').map(m => (
// // // //                                         <option key={m._id} value={m._id} className="bg-slate-800 text-white">{m.firstName} {m.lastName}</option>
// // // //                                       ))}
// // // //                                     </optgroup>
// // // //                                   </select>
// // // //                                   <button onClick={() => assignUserId && handleAssignTask(task._id, assignUserId)}
// // // //                                     className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs">✓</button>
// // // //                                   <button onClick={() => { setAssigningTask(null); setAssignUserId('') }}
// // // //                                     className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs">✕</button>
// // // //                                 </div>
// // // //                               ) : (
// // // //                                 <button onClick={() => { setAssigningTask(task._id); setAssignUserId(task.assignedTo?._id || '') }}
// // // //                                   className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">
// // // //                                   {task.assignedTo ? 'Reassign' : 'Assign'}
// // // //                                 </button>
// // // //                               )
// // // //                             )}
// // // //                           </td>
// // // //                         </tr>
// // // //                       ))}
// // // //                     </tbody>
// // // //                   </table>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}

// // // //           {/* MODULES */}
// // // //           {activeTab === 'modules' && (
// // // //             <div>
// // // //               <div className="flex items-center justify-between mb-4">
// // // //                 <h2 className="text-xl font-bold text-white">Modules</h2>
// // // //                 <button onClick={() => setShowAddModule(true)}
// // // //                   className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// // // //                   + Add Module
// // // //                 </button>
// // // //               </div>
// // // //               {modules.length === 0 ? (
// // // //                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
// // // //                   <p className="text-slate-400 mb-4">No modules in this project yet</p>
// // // //                   <button onClick={() => setShowAddModule(true)}
// // // //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// // // //                     Add First Module
// // // //                   </button>
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // //                   {modules.map(mod => (
// // // //                     <div key={mod._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // // //                       <div className="flex items-start justify-between mb-3">
// // // //                         <h3 className="text-white font-semibold">{mod.name}</h3>
// // // //                         <span className={`px-2 py-1 rounded-full text-xs ${statusColor(mod.status)}`}>{mod.status}</span>
// // // //                       </div>
// // // //                       <p className="text-slate-400 text-sm mb-4">{mod.description || 'No description'}</p>
// // // //                       <div className="text-sm space-y-1">
// // // //                         <div className="flex justify-between">
// // // //                           <span className="text-slate-400">Tasks</span>
// // // //                           <span className="text-white">{tasks.filter(t => (t.module?._id || t.module) === mod._id).length}</span>
// // // //                         </div>
// // // //                         <div className="flex justify-between">
// // // //                           <span className="text-slate-400">Completed</span>
// // // //                           <span className="text-green-400">{tasks.filter(t => (t.module?._id || t.module) === mod._id && t.status === 'completed').length}</span>
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}

// // // //           {/* TEAM */}
// // // //           {activeTab === 'team' && (
// // // //             <div>
// // // //               {teamMembers.length === 0 ? (
// // // //                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
// // // //                   <p className="text-slate-400 mb-4">No team members assigned yet</p>
// // // //                   <button onClick={() => navigate('/manager/team')}
// // // //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// // // //                     Go to Team Management
// // // //                   </button>
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // //                   {teamMembers.map(member => {
// // // //                     const m         = typeof member === 'object' ? member : { _id: member }
// // // //                     const userTasks = tasks.filter(t => (t.assignedTo?._id || t.assignedTo) === m._id)
// // // //                     const userDone  = userTasks.filter(t => t.status === 'completed').length
// // // //                     return (
// // // //                       <div key={m._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // // //                         <div className="flex items-center gap-4 mb-4">
// // // //                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-linear-to-r ${m.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
// // // //                             {m.firstName?.charAt(0) || '?'}
// // // //                           </div>
// // // //                           <div>
// // // //                             <p className="text-white font-semibold">{m.firstName} {m.lastName}</p>
// // // //                             <p className="text-slate-400 text-xs">{m.email}</p>
// // // //                             <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${m.role === 'developer' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
// // // //                               {m.role}
// // // //                             </span>
// // // //                           </div>
// // // //                         </div>
// // // //                         <div className="space-y-2 text-sm">
// // // //                           <div className="flex justify-between">
// // // //                             <span className="text-slate-400">Tasks</span>
// // // //                             <span className="text-white">{userTasks.length}</span>
// // // //                           </div>
// // // //                           <div className="flex justify-between">
// // // //                             <span className="text-slate-400">Completed</span>
// // // //                             <span className="text-green-400">{userDone}</span>
// // // //                           </div>
// // // //                         </div>
// // // //                         {userTasks.length > 0 && (
// // // //                           <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
// // // //                             <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"
// // // //                               style={{ width: `${Math.round((userDone / userTasks.length) * 100)}%` }} />
// // // //                           </div>
// // // //                         )}
// // // //                       </div>
// // // //                     )
// // // //                   })}
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}

// // // //         </main>
// // // //       </div>

// // // //       {/* Create Task Modal */}
// // // //       {showCreateTask && (
// // // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// // // //           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
// // // //             <div className="flex items-center justify-between mb-6">
// // // //               <h2 className="text-xl font-bold text-white">Create Task</h2>
// // // //               <button onClick={() => { setShowCreateTask(false); setTaskMsg('') }} className="text-slate-400 hover:text-white">
// // // //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // //                 </svg>
// // // //               </button>
// // // //             </div>
// // // //             {taskMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{taskMsg}</p>}
// // // //             <div className="space-y-4">
// // // //               <div>
// // // //                 <label className="text-slate-400 text-xs mb-1 block">Title <span className="text-red-400">*</span></label>
// // // //                 <input type="text" placeholder="Task title..." value={taskForm.title}
// // // //                   onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
// // // //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="text-slate-400 text-xs mb-1 block">Description</label>
// // // //                 <textarea placeholder="Task description..." value={taskForm.description}
// // // //                   onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
// // // //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="text-slate-400 text-xs mb-1 block">Module <span className="text-slate-500">(optional)</span></label>
// // // //                 <select value={taskForm.module} onChange={e => setTaskForm({ ...taskForm, module: e.target.value })}
// // // //                   className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// // // //                   <option value="" className="bg-slate-800 text-white">— No module —</option>
// // // //                   {modules.map(m => <option key={m._id} value={m._id} className="bg-slate-800 text-white">{m.name}</option>)}
// // // //                 </select>
// // // //               </div>
// // // //               <div>
// // // //                 <label className="text-slate-400 text-xs mb-1 block">Assign To <span className="text-slate-500">(optional)</span></label>
// // // //                 <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
// // // //                   className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// // // //                   <option value="" className="bg-slate-800 text-white">— Unassigned —</option>
// // // //                   <optgroup label="Developers" className="bg-slate-800 text-slate-400">
// // // //                     {assignableTeam.filter(m => m.role === 'developer').map(m => (
// // // //                       <option key={m._id} value={m._id} className="bg-slate-800 text-white">{m.firstName} {m.lastName}</option>
// // // //                     ))}
// // // //                   </optgroup>
// // // //                   <optgroup label="Testers" className="bg-slate-800 text-slate-400">
// // // //                     {assignableTeam.filter(m => m.role === 'tester').map(m => (
// // // //                       <option key={m._id} value={m._id} className="bg-slate-800 text-white">{m.firstName} {m.lastName}</option>
// // // //                     ))}
// // // //                   </optgroup>
// // // //                 </select>
// // // //               </div>
// // // //               <div className="grid grid-cols-2 gap-3">
// // // //                 <div>
// // // //                   <label className="text-slate-400 text-xs mb-1 block">Priority</label>
// // // //                   <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
// // // //                     className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// // // //                     <option value="low"    className="bg-slate-800 text-white">Low</option>
// // // //                     <option value="medium" className="bg-slate-800 text-white">Medium</option>
// // // //                     <option value="high"   className="bg-slate-800 text-white">High</option>
// // // //                     <option value="urgent" className="bg-slate-800 text-white">Urgent</option>
// // // //                   </select>
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="text-slate-400 text-xs mb-1 block">Due Date</label>
// // // //                   <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
// // // //                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //             <div className="flex gap-3 mt-6">
// // // //               <button onClick={handleCreateTask}
// // // //                 className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
// // // //                 Create Task
// // // //               </button>
// // // //               <button onClick={() => { setShowCreateTask(false); setTaskMsg('') }}
// // // //                 className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
// // // //                 Cancel
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Add Module Modal */}
// // // //       {showAddModule && (
// // // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// // // //           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-sm">
// // // //             <div className="flex items-center justify-between mb-6">
// // // //               <h2 className="text-xl font-bold text-white">Add Module</h2>
// // // //               <button onClick={() => { setShowAddModule(false); setModuleMsg('') }} className="text-slate-400 hover:text-white">
// // // //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // //                 </svg>
// // // //               </button>
// // // //             </div>
// // // //             {moduleMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{moduleMsg}</p>}
// // // //             <div className="space-y-4">
// // // //               <div>
// // // //                 <label className="text-slate-400 text-xs mb-1 block">Module Name <span className="text-red-400">*</span></label>
// // // //                 <input type="text" placeholder="e.g. Authentication, Dashboard..."
// // // //                   value={moduleForm.name} onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })}
// // // //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
// // // //               </div>
// // // //               <div>
// // // //                 <label className="text-slate-400 text-xs mb-1 block">Description <span className="text-slate-500">(optional)</span></label>
// // // //                 <textarea placeholder="Module description..."
// // // //                   value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
// // // //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
// // // //               </div>
// // // //             </div>
// // // //             <div className="flex gap-3 mt-6">
// // // //               <button onClick={handleAddModule}
// // // //                 className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
// // // //                 Add Module
// // // //               </button>
// // // //               <button onClick={() => { setShowAddModule(false); setModuleMsg('') }}
// // // //                 className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
// // // //                 Cancel
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }

// // // // export default ManagerProjectDetails

// // // import { useState, useEffect } from 'react'
// // // import { useNavigate, useParams } from 'react-router-dom'
// // // import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
// // // import { formatDate } from '../../utils/DateUtils'

// // // const taskStatusColor = (s) => ({
// // //   to_do:           'bg-slate-500/20 text-slate-400',
// // //   assigned:        'bg-blue-500/20 text-blue-400',
// // //   in_progress:     'bg-yellow-500/20 text-yellow-400',
// // //   submitted:       'bg-purple-500/20 text-purple-400',
// // //   in_testing:      'bg-cyan-500/20 text-cyan-400',
// // //   bug_found:       'bg-red-500/20 text-red-400',
// // //   fix_in_progress: 'bg-orange-500/20 text-orange-400',
// // //   resubmitted:     'bg-indigo-500/20 text-indigo-400',
// // //   completed:       'bg-green-500/20 text-green-400',
// // // }[s] || 'bg-slate-500/20 text-slate-400')

// // // const priorityColor = (p) => ({
// // //   low:    'bg-green-500/20 text-green-400',
// // //   medium: 'bg-yellow-500/20 text-yellow-400',
// // //   high:   'bg-orange-500/20 text-orange-400',
// // //   urgent: 'bg-red-500/20 text-red-400',
// // // }[p] || 'bg-slate-500/20 text-slate-400')

// // // const statusColor = (s) => ({
// // //   active:    'bg-green-500/20 text-green-400',
// // //   completed: 'bg-blue-500/20 text-blue-400',
// // //   inactive:  'bg-yellow-500/20 text-yellow-400',
// // // }[s] || 'bg-slate-500/20 text-slate-400')

// // // const ManagerProjectDetails = () => {
// // //   const [sidebarOpen, setSidebarOpen]       = useState(false)
// // //   const [project, setProject]               = useState(null)
// // //   const [modules, setModules]               = useState([])
// // //   const [tasks, setTasks]                   = useState([])
// // //   const [loading, setLoading]               = useState(true)
// // //   const [activeTab, setActiveTab]           = useState('overview')
// // //   const [showCreateTask, setShowCreateTask] = useState(false)
// // //   const [showAddModule, setShowAddModule]   = useState(false)
// // //   const [taskForm, setTaskForm]             = useState({ title: '', description: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
// // //   const [moduleForm, setModuleForm]         = useState({ name: '', description: '' })
// // //   const [taskMsg, setTaskMsg]               = useState('')
// // //   const [moduleMsg, setModuleMsg]           = useState('')
// // //   const [assigningTask, setAssigningTask]   = useState(null)
// // //   const [assignUserId, setAssignUserId]     = useState('')
// // //   const [toast, setToast]                   = useState('')

// // //   const navigate    = useNavigate()
// // //   const { id }      = useParams()
// // //   const token       = localStorage.getItem('token')
// // //   const user        = JSON.parse(localStorage.getItem('user') || '{}')
// // //   const authHeaders = { Authorization: `Bearer ${token}` }
// // //   const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

// // //   const handleLogout = () => { localStorage.clear(); navigate('/') }
// // //   const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

// // //   const fetchAll = async () => {
// // //     try {
// // //       const [pRes, mRes, tRes] = await Promise.all([
// // //         fetch(`http://localhost:3000/projects/${id}`,          { headers: authHeaders }),
// // //         fetch(`http://localhost:3000/modules?projectId=${id}`, { headers: authHeaders }),
// // //         fetch(`http://localhost:3000/tasks?project=${id}`,     { headers: authHeaders }),
// // //       ])
// // //       const safe = async (res) => {
// // //         const ct = res.headers.get('content-type') || ''
// // //         if (!ct.includes('application/json')) return { success: false }
// // //         return res.json()
// // //       }
// // //       const [pData, mData, tData] = await Promise.all([safe(pRes), safe(mRes), safe(tRes)])
// // //       if (pData.success) setProject(pData.data)
// // //       if (mData.success) setModules(mData.data || [])
// // //       if (tData.success) setTasks(tData.data || [])
// // //     } catch (err) { console.error(err) }
// // //     finally { setLoading(false) }
// // //   }

// // //   useEffect(() => { if (id) fetchAll() }, [id])

// // //   const handleCreateTask = async () => {
// // //     setTaskMsg('')
// // //     if (!taskForm.title.trim()) { setTaskMsg('Title is required'); return }
// // //     try {
// // //       const payload = {
// // //         title:       taskForm.title.trim(),
// // //         description: taskForm.description.trim(),
// // //         project:     id,
// // //         priority:    taskForm.priority,
// // //         createdBy:   user._id,
// // //         ...(taskForm.module     && { module:     taskForm.module }),
// // //         ...(taskForm.assignedTo && { assignedTo: taskForm.assignedTo }),
// // //         ...(taskForm.dueDate    && { dueDate:    taskForm.dueDate }),
// // //       }
// // //       const res  = await fetch('http://localhost:3000/manager/tasks', {
// // //         method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload)
// // //       })
// // //       const data = await res.json()
// // //       if (data.success) {
// // //         setShowCreateTask(false)
// // //         setTaskForm({ title: '', description: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
// // //         showToast('Task created!'); fetchAll()
// // //       } else { setTaskMsg(data.message || 'Failed to create task') }
// // //     } catch { setTaskMsg('Server error') }
// // //   }

// // //   const handleAddModule = async () => {
// // //     setModuleMsg('')
// // //     if (!moduleForm.name.trim()) { setModuleMsg('Module name is required'); return }
// // //     try {
// // //       const res  = await fetch('http://localhost:3000/modules', {
// // //         method: 'POST', headers: jsonHeaders,
// // //         body: JSON.stringify({ name: moduleForm.name.trim(), description: moduleForm.description.trim(), project: id, createdBy: user._id })
// // //       })
// // //       const data = await res.json()
// // //       if (data.success) {
// // //         setShowAddModule(false)
// // //         setModuleForm({ name: '', description: '' })
// // //         showToast('Module added!'); fetchAll()
// // //       } else { setModuleMsg(data.message || 'Failed to add module') }
// // //     } catch { setModuleMsg('Server error') }
// // //   }

// // //   const handleAssignTask = async (taskId, userId) => {
// // //     try {
// // //       await fetch(`http://localhost:3000/tasks/${taskId}`, {
// // //         method: 'PUT', headers: jsonHeaders,
// // //         body: JSON.stringify({ assignedTo: userId, status: 'assigned' })
// // //       })
// // //       setAssigningTask(null); setAssignUserId(''); fetchAll()
// // //     } catch (err) { console.error(err) }
// // //   }

// // //   const teamMembers    = project?.teamMembers || []
// // //   const assignableTeam = teamMembers.filter(m => typeof m === 'object' && (m.role === 'developer' || m.role === 'tester'))
// // //   const completedTasks = tasks.filter(t => t.status === 'completed').length
// // //   const progressPct    = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

// // //   if (loading) return (
// // //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// // //       <p className="text-white text-xl">Loading project...</p>
// // //     </div>
// // //   )

// // //   if (!project) return (
// // //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// // //       <div className="text-center">
// // //         <p className="text-white text-xl mb-4">Project not found</p>
// // //         <button onClick={() => navigate('/manager/projects')} className="text-blue-400 hover:text-blue-300">← Back</button>
// // //       </div>
// // //     </div>
// // //   )

// // //   return (
// // //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
// // //       <div className="fixed inset-0 overflow-hidden pointer-events-none">
// // //         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
// // //         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
// // //       </div>

// // //       <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// // //       <div className="lg:ml-64">
// // //         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
// // //           <div className="flex items-center space-x-4">
// // //             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
// // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// // //               </svg>
// // //             </button>
// // //             <button onClick={() => navigate('/manager/projects')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
// // //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// // //               </svg>
// // //               <span className="text-sm">Back</span>
// // //             </button>
// // //             <div>
// // //               <h1 className="text-2xl font-bold text-white">{project.name}</h1>
// // //               <div className="flex items-center gap-2 mt-0.5">
// // //                 <span className="text-slate-400 text-sm font-mono">{project.projectKey}</span>
// // //                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(project.status)}`}>{project.status}</span>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="flex items-center gap-3">
// // //             <button onClick={() => setShowCreateTask(true)}
// // //               className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// // //               + Create Task
// // //             </button>
// // //             <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
// // //               Logout
// // //             </button>
// // //           </div>
// // //         </header>

// // //         {toast && (
// // //           <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
// // //             {toast}
// // //           </div>
// // //         )}

// // //         <main className="p-4 lg:p-8 relative z-10 space-y-6">

// // //           {/* Stats + Progress */}
// // //           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // //             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// // //               {[
// // //                 { label: 'Total Tasks',  value: tasks.length,                                        color: 'text-white' },
// // //                 { label: 'Completed',    value: completedTasks,                                       color: 'text-green-400' },
// // //                 { label: 'In Progress',  value: tasks.filter(t => t.status === 'in_progress').length, color: 'text-yellow-400' },
// // //                 { label: 'Team Members', value: teamMembers.length,                                   color: 'text-cyan-400' },
// // //               ].map((s, i) => (
// // //                 <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
// // //                   <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
// // //                   <p className="text-slate-400 text-xs mt-1">{s.label}</p>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //             {tasks.length > 0 && (
// // //               <div>
// // //                 <div className="flex justify-between text-sm mb-2">
// // //                   <span className="text-slate-400">Overall Progress</span>
// // //                   <span className="text-white font-medium">{progressPct}%</span>
// // //                 </div>
// // //                 <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
// // //                   <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
// // //                     style={{ width: `${progressPct}%` }} />
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Tabs */}
// // //           <div className="flex space-x-2 border-b border-white/10">
// // //             {[
// // //               { key: 'overview', label: 'Overview' },
// // //               { key: 'tasks',    label: 'Tasks',   count: tasks.length },
// // //               { key: 'modules',  label: 'Modules', count: modules.length },
// // //               { key: 'team',     label: 'Team',    count: teamMembers.length },
// // //             ].map(tab => (
// // //               <button key={tab.key} onClick={() => setActiveTab(tab.key)}
// // //                 className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white/10 text-white border border-white/20 border-b-0' : 'text-slate-400 hover:text-white'}`}>
// // //                 {tab.label}
// // //                 {tab.count !== undefined && (
// // //                   <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{tab.count}</span>
// // //                 )}
// // //               </button>
// // //             ))}
// // //           </div>

// // //           {/* OVERVIEW */}
// // //           {activeTab === 'overview' && (
// // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // //                 <h3 className="text-lg font-bold text-white mb-4">Recent Tasks</h3>
// // //                 {tasks.length === 0 ? <p className="text-slate-400 text-sm">No tasks yet</p> : (
// // //                   <div className="space-y-3">
// // //                     {tasks.slice(0, 5).map(task => (
// // //                       <div key={task._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
// // //                         <div>
// // //                           <p className="text-white text-sm font-medium">{task.title}</p>
// // //                           <p className="text-slate-400 text-xs">{task.issueKey}</p>
// // //                         </div>
// // //                         <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
// // //                           {task.status?.replace(/_/g, ' ')}
// // //                         </span>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // //                 <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
// // //                 <div className="space-y-3 text-sm">
// // //                   {[
// // //                     { label: 'Description', value: project.description || 'No description' },
// // //                     { label: 'Created By',  value: project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—' },
// // //                     // ✅ formatDate prevents "Invalid Date"
// // //                     { label: 'Start Date',  value: formatDate(project.startDate) },
// // //                     { label: 'End Date',    value: formatDate(project.endDate) },
// // //                     { label: 'Created',     value: formatDate(project.createdAt) },
// // //                   ].map(({ label, value }) => (
// // //                     <div key={label} className="flex justify-between p-2 bg-white/5 rounded-lg">
// // //                       <span className="text-slate-400">{label}</span>
// // //                       <span className="text-white text-right max-w-[60%]">{value}</span>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* TASKS */}
// // //           {activeTab === 'tasks' && (
// // //             <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
// // //               {tasks.length === 0 ? (
// // //                 <div className="p-8 text-center">
// // //                   <p className="text-slate-400 mb-4">No tasks yet</p>
// // //                   <button onClick={() => setShowCreateTask(true)}
// // //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// // //                     Create First Task
// // //                   </button>
// // //                 </div>
// // //               ) : (
// // //                 <div className="overflow-x-auto">
// // //                   <table className="w-full">
// // //                     <thead>
// // //                       <tr className="border-b border-white/10">
// // //                         {['Task', 'Status', 'Priority', 'Assigned To', 'Due', 'Action'].map(h => (
// // //                           <th key={h} className="text-left p-4 text-slate-300 text-sm font-medium">{h}</th>
// // //                         ))}
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {tasks.map(task => (
// // //                         <tr key={task._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
// // //                           <td className="p-4">
// // //                             <p className="text-white text-sm font-medium">{task.title}</p>
// // //                             <p className="text-slate-400 text-xs font-mono">{task.issueKey}</p>
// // //                           </td>
// // //                           <td className="p-4">
// // //                             <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
// // //                               {task.status?.replace(/_/g, ' ')}
// // //                             </span>
// // //                           </td>
// // //                           <td className="p-4">
// // //                             <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(task.priority)}`}>
// // //                               {task.priority}
// // //                             </span>
// // //                           </td>
// // //                           <td className="p-4">
// // //                             {task.assignedTo ? (
// // //                               <div className="flex items-center gap-2">
// // //                                 <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
// // //                                   {task.assignedTo.firstName?.charAt(0)}
// // //                                 </div>
// // //                                 <span className="text-slate-300 text-sm">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
// // //                               </div>
// // //                             ) : <span className="text-slate-500 text-sm">Unassigned</span>}
// // //                           </td>
// // //                           {/* ✅ formatDate on task due date */}
// // //                           <td className="p-4 text-slate-400 text-sm">{formatDate(task.dueDate, '—')}</td>
// // //                           <td className="p-4">
// // //                             {assignableTeam.length > 0 && (
// // //                               assigningTask === task._id ? (
// // //                                 <div className="flex items-center gap-2">
// // //                                   <select value={assignUserId} onChange={e => setAssignUserId(e.target.value)}
// // //                                     className="px-2 py-1 bg-slate-800 border border-white/20 rounded-lg text-white text-xs focus:outline-none">
// // //                                     <option value="">— Select —</option>
// // //                                     <optgroup label="Developers">
// // //                                       {assignableTeam.filter(m => m.role === 'developer').map(m => (
// // //                                         <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
// // //                                       ))}
// // //                                     </optgroup>
// // //                                     <optgroup label="Testers">
// // //                                       {assignableTeam.filter(m => m.role === 'tester').map(m => (
// // //                                         <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
// // //                                       ))}
// // //                                     </optgroup>
// // //                                   </select>
// // //                                   <button onClick={() => assignUserId && handleAssignTask(task._id, assignUserId)}
// // //                                     className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs">✓</button>
// // //                                   <button onClick={() => { setAssigningTask(null); setAssignUserId('') }}
// // //                                     className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs">✕</button>
// // //                                 </div>
// // //                               ) : (
// // //                                 <button onClick={() => { setAssigningTask(task._id); setAssignUserId(task.assignedTo?._id || '') }}
// // //                                   className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">
// // //                                   {task.assignedTo ? 'Reassign' : 'Assign'}
// // //                                 </button>
// // //                               )
// // //                             )}
// // //                           </td>
// // //                         </tr>
// // //                       ))}
// // //                     </tbody>
// // //                   </table>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* MODULES */}
// // //           {activeTab === 'modules' && (
// // //             <div>
// // //               <div className="flex items-center justify-between mb-4">
// // //                 <h2 className="text-xl font-bold text-white">Modules</h2>
// // //                 <button onClick={() => setShowAddModule(true)}
// // //                   className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// // //                   + Add Module
// // //                 </button>
// // //               </div>
// // //               {modules.length === 0 ? (
// // //                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
// // //                   <p className="text-slate-400 mb-4">No modules yet</p>
// // //                   <button onClick={() => setShowAddModule(true)}
// // //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// // //                     Add First Module
// // //                   </button>
// // //                 </div>
// // //               ) : (
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //                   {modules.map(mod => (
// // //                     <div key={mod._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // //                       <div className="flex items-start justify-between mb-3">
// // //                         <h3 className="text-white font-semibold">{mod.name}</h3>
// // //                         <span className={`px-2 py-1 rounded-full text-xs ${statusColor(mod.status)}`}>{mod.status}</span>
// // //                       </div>
// // //                       <p className="text-slate-400 text-sm mb-4">{mod.description || 'No description'}</p>
// // //                       <div className="text-sm space-y-1">
// // //                         <div className="flex justify-between">
// // //                           <span className="text-slate-400">Tasks</span>
// // //                           <span className="text-white">{tasks.filter(t => (t.module?._id || t.module) === mod._id).length}</span>
// // //                         </div>
// // //                         <div className="flex justify-between">
// // //                           <span className="text-slate-400">Completed</span>
// // //                           <span className="text-green-400">{tasks.filter(t => (t.module?._id || t.module) === mod._id && t.status === 'completed').length}</span>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* TEAM */}
// // //           {activeTab === 'team' && (
// // //             <div>
// // //               {teamMembers.length === 0 ? (
// // //                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
// // //                   <p className="text-slate-400 mb-4">No team members assigned yet</p>
// // //                   <button onClick={() => navigate('/manager/team')}
// // //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// // //                     Go to Team Management
// // //                   </button>
// // //                 </div>
// // //               ) : (
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //                   {teamMembers.map(member => {
// // //                     const m         = typeof member === 'object' ? member : { _id: member }
// // //                     const userTasks = tasks.filter(t => (t.assignedTo?._id || t.assignedTo) === m._id)
// // //                     const userDone  = userTasks.filter(t => t.status === 'completed').length
// // //                     return (
// // //                       <div key={m._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // //                         <div className="flex items-center gap-4 mb-4">
// // //                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-linear-to-r ${m.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
// // //                             {m.firstName?.charAt(0) || '?'}
// // //                           </div>
// // //                           <div>
// // //                             <p className="text-white font-semibold">{m.firstName} {m.lastName}</p>
// // //                             <p className="text-slate-400 text-xs">{m.email}</p>
// // //                             <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${m.role === 'developer' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
// // //                               {m.role}
// // //                             </span>
// // //                           </div>
// // //                         </div>
// // //                         <div className="space-y-2 text-sm">
// // //                           <div className="flex justify-between">
// // //                             <span className="text-slate-400">Tasks</span>
// // //                             <span className="text-white">{userTasks.length}</span>
// // //                           </div>
// // //                           <div className="flex justify-between">
// // //                             <span className="text-slate-400">Completed</span>
// // //                             <span className="text-green-400">{userDone}</span>
// // //                           </div>
// // //                         </div>
// // //                         {userTasks.length > 0 && (
// // //                           <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
// // //                             <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"
// // //                               style={{ width: `${Math.round((userDone / userTasks.length) * 100)}%` }} />
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     )
// // //                   })}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}
// // //         </main>
// // //       </div>

// // //       {/* Create Task Modal */}
// // //       {showCreateTask && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// // //           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
// // //             <div className="flex items-center justify-between mb-6">
// // //               <h2 className="text-xl font-bold text-white">Create Task</h2>
// // //               <button onClick={() => { setShowCreateTask(false); setTaskMsg('') }} className="text-slate-400 hover:text-white">
// // //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                 </svg>
// // //               </button>
// // //             </div>
// // //             {taskMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{taskMsg}</p>}
// // //             <div className="space-y-4">
// // //               <div>
// // //                 <label className="text-slate-400 text-xs mb-1 block">Title <span className="text-red-400">*</span></label>
// // //                 <input type="text" placeholder="Task title..." value={taskForm.title}
// // //                   onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
// // //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
// // //               </div>
// // //               <div>
// // //                 <label className="text-slate-400 text-xs mb-1 block">Description</label>
// // //                 <textarea placeholder="Task description..." value={taskForm.description}
// // //                   onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
// // //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
// // //               </div>
// // //               <div>
// // //                 <label className="text-slate-400 text-xs mb-1 block">Module <span className="text-slate-500">(optional)</span></label>
// // //                 <select value={taskForm.module} onChange={e => setTaskForm({ ...taskForm, module: e.target.value })}
// // //                   className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// // //                   <option value="">— No module —</option>
// // //                   {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
// // //                 </select>
// // //               </div>
// // //               <div>
// // //                 <label className="text-slate-400 text-xs mb-1 block">Assign To <span className="text-slate-500">(optional)</span></label>
// // //                 <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
// // //                   className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// // //                   <option value="">— Unassigned —</option>
// // //                   <optgroup label="Developers">
// // //                     {assignableTeam.filter(m => m.role === 'developer').map(m => (
// // //                       <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
// // //                     ))}
// // //                   </optgroup>
// // //                   <optgroup label="Testers">
// // //                     {assignableTeam.filter(m => m.role === 'tester').map(m => (
// // //                       <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
// // //                     ))}
// // //                   </optgroup>
// // //                 </select>
// // //               </div>
// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <label className="text-slate-400 text-xs mb-1 block">Priority</label>
// // //                   <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
// // //                     className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// // //                     <option value="low">Low</option>
// // //                     <option value="medium">Medium</option>
// // //                     <option value="high">High</option>
// // //                     <option value="urgent">Urgent</option>
// // //                   </select>
// // //                 </div>
// // //                 <div>
// // //                   <label className="text-slate-400 text-xs mb-1 block">Due Date</label>
// // //                   <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
// // //                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             <div className="flex gap-3 mt-6">
// // //               <button onClick={handleCreateTask}
// // //                 className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
// // //                 Create Task
// // //               </button>
// // //               <button onClick={() => { setShowCreateTask(false); setTaskMsg('') }}
// // //                 className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
// // //                 Cancel
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Add Module Modal */}
// // //       {showAddModule && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// // //           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-sm">
// // //             <div className="flex items-center justify-between mb-6">
// // //               <h2 className="text-xl font-bold text-white">Add Module</h2>
// // //               <button onClick={() => { setShowAddModule(false); setModuleMsg('') }} className="text-slate-400 hover:text-white">
// // //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                 </svg>
// // //               </button>
// // //             </div>
// // //             {moduleMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{moduleMsg}</p>}
// // //             <div className="space-y-4">
// // //               <div>
// // //                 <label className="text-slate-400 text-xs mb-1 block">Module Name <span className="text-red-400">*</span></label>
// // //                 <input type="text" placeholder="e.g. Authentication, Dashboard..."
// // //                   value={moduleForm.name} onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })}
// // //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
// // //               </div>
// // //               <div>
// // //                 <label className="text-slate-400 text-xs mb-1 block">Description <span className="text-slate-500">(optional)</span></label>
// // //                 <textarea placeholder="Module description..."
// // //                   value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
// // //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
// // //               </div>
// // //             </div>
// // //             <div className="flex gap-3 mt-6">
// // //               <button onClick={handleAddModule}
// // //                 className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
// // //                 Add Module
// // //               </button>
// // //               <button onClick={() => { setShowAddModule(false); setModuleMsg('') }}
// // //                 className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
// // //                 Cancel
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }

// // // export default ManagerProjectDetails

// // import { useState, useEffect } from 'react'
// // import { useNavigate, useParams } from 'react-router-dom'
// // import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
// // import { formatDate } from '../../utils/DateUtils'

// // const taskStatusColor = (s) => ({
// //   to_do:           'bg-slate-500/20 text-slate-400',
// //   assigned:        'bg-blue-500/20 text-blue-400',
// //   in_progress:     'bg-yellow-500/20 text-yellow-400',
// //   submitted:       'bg-purple-500/20 text-purple-400',
// //   in_testing:      'bg-cyan-500/20 text-cyan-400',
// //   bug_found:       'bg-red-500/20 text-red-400',
// //   fix_in_progress: 'bg-orange-500/20 text-orange-400',
// //   resubmitted:     'bg-indigo-500/20 text-indigo-400',
// //   completed:       'bg-green-500/20 text-green-400',
// // }[s] || 'bg-slate-500/20 text-slate-400')

// // const priorityColor = (p) => ({
// //   low:    'bg-green-500/20 text-green-400',
// //   medium: 'bg-yellow-500/20 text-yellow-400',
// //   high:   'bg-orange-500/20 text-orange-400',
// //   urgent: 'bg-red-500/20 text-red-400',
// // }[p] || 'bg-slate-500/20 text-slate-400')

// // const statusColor = (s) => ({
// //   active:    'bg-green-500/20 text-green-400',
// //   completed: 'bg-blue-500/20 text-blue-400',
// //   inactive:  'bg-yellow-500/20 text-yellow-400',
// //   planned:   'bg-slate-500/20 text-slate-400',
// // }[s] || 'bg-slate-500/20 text-slate-400')

// // const sprintStatusColor = (s) => ({
// //   planned:   'bg-slate-500/20 text-slate-400 border-slate-500/30',
// //   active:    'bg-green-500/20 text-green-400 border-green-500/30',
// //   completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
// // }[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

// // const calcProgress = (sprint) => {
// //   const items = sprint.tasks || []
// //   if (items.length === 0) return 0
// //   const done = items.filter(t => t.status === 'completed').length
// //   return Math.round((done / items.length) * 100)
// // }

// // const ManagerProjectDetails = () => {
// //   const [sidebarOpen, setSidebarOpen]       = useState(false)
// //   const [project, setProject]               = useState(null)
// //   const [modules, setModules]               = useState([])
// //   const [tasks, setTasks]                   = useState([])
// //   const [sprints, setSprints]               = useState([])
// //   const [loading, setLoading]               = useState(true)
// //   const [activeTab, setActiveTab]           = useState('overview')
// //   const [showCreateTask, setShowCreateTask] = useState(false)
// //   const [showAddModule, setShowAddModule]   = useState(false)
// //   const [showCreateSprint, setShowCreateSprint] = useState(false)
// //   const [taskForm, setTaskForm]             = useState({ title: '', description: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
// //   const [moduleForm, setModuleForm]         = useState({ name: '', description: '' })
// //   const [sprintForm, setSprintForm]         = useState({ name: '', startDate: '', endDate: '' })
// //   const [selectedSprintTasks, setSelectedSprintTasks] = useState([])
// //   const [taskMsg, setTaskMsg]               = useState('')
// //   const [moduleMsg, setModuleMsg]           = useState('')
// //   const [sprintMsg, setSprintMsg]           = useState('')
// //   const [assigningTask, setAssigningTask]   = useState(null)
// //   const [assignUserId, setAssignUserId]     = useState('')
// //   const [creatingSprint, setCreatingSprint] = useState(false)
// //   const [toast, setToast]                   = useState('')

// //   const navigate    = useNavigate()
// //   const { id }      = useParams()
// //   const token       = localStorage.getItem('token')
// //   const user        = JSON.parse(localStorage.getItem('user') || '{}')
// //   const authHeaders = { Authorization: `Bearer ${token}` }
// //   const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

// //   const handleLogout = () => { localStorage.clear(); navigate('/') }
// //   const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

// //   const fetchAll = async () => {
// //     try {
// //       const [pRes, mRes, tRes] = await Promise.all([
// //         fetch(`http://localhost:3000/projects/${id}`,          { headers: authHeaders }),
// //         fetch(`http://localhost:3000/modules?projectId=${id}`, { headers: authHeaders }),
// //         fetch(`http://localhost:3000/tasks?project=${id}`,     { headers: authHeaders }),
// //       ])
// //       const safe = async (res) => {
// //         const ct = res.headers.get('content-type') || ''
// //         if (!ct.includes('application/json')) return { success: false }
// //         return res.json()
// //       }
// //       const [pData, mData, tData] = await Promise.all([safe(pRes), safe(mRes), safe(tRes)])
// //       if (pData.success) setProject(pData.data)
// //       if (mData.success) setModules(mData.data || [])
// //       if (tData.success) setTasks(tData.data || [])
// //     } catch (err) { console.error(err) }
// //     finally { setLoading(false) }
// //   }

// //   const fetchSprints = async () => {
// //     try {
// //       const res  = await fetch(`http://localhost:3000/sprints?projectId=${id}`, { headers: authHeaders })
// //       const data = await res.json()
// //       if (data.success) {
// //         // fetch each sprint's details for progress calculation
// //         const detailed = await Promise.all(
// //           (data.data || []).map(async (s) => {
// //             try {
// //               const r = await fetch(`http://localhost:3000/sprints/${s._id}`, { headers: authHeaders })
// //               const d = await r.json()
// //               return d.data || s
// //             } catch { return s }
// //           })
// //         )
// //         setSprints(detailed)
// //       }
// //     } catch (err) { console.error(err) }
// //   }

// //   useEffect(() => {
// //     if (id) { fetchAll(); fetchSprints() }
// //   }, [id])

// //   const handleCreateTask = async () => {
// //     setTaskMsg('')
// //     if (!taskForm.title.trim()) { setTaskMsg('Title is required'); return }
// //     try {
// //       const payload = {
// //         title:       taskForm.title.trim(),
// //         description: taskForm.description.trim(),
// //         project:     id,
// //         priority:    taskForm.priority,
// //         createdBy:   user._id,
// //         ...(taskForm.module     && { module:     taskForm.module }),
// //         ...(taskForm.assignedTo && { assignedTo: taskForm.assignedTo }),
// //         ...(taskForm.dueDate    && { dueDate:    taskForm.dueDate }),
// //       }
// //       const res  = await fetch('http://localhost:3000/manager/tasks', {
// //         method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload)
// //       })
// //       const data = await res.json()
// //       if (data.success) {
// //         setShowCreateTask(false)
// //         setTaskForm({ title: '', description: '', module: '', assignedTo: '', priority: 'medium', dueDate: '' })
// //         showToast('Task created!'); fetchAll()
// //       } else { setTaskMsg(data.message || 'Failed to create task') }
// //     } catch { setTaskMsg('Server error') }
// //   }

// //   const handleAddModule = async () => {
// //     setModuleMsg('')
// //     if (!moduleForm.name.trim()) { setModuleMsg('Module name is required'); return }
// //     try {
// //       const res  = await fetch('http://localhost:3000/modules', {
// //         method: 'POST', headers: jsonHeaders,
// //         body: JSON.stringify({ name: moduleForm.name.trim(), description: moduleForm.description.trim(), project: id, createdBy: user._id })
// //       })
// //       const data = await res.json()
// //       if (data.success) {
// //         setShowAddModule(false)
// //         setModuleForm({ name: '', description: '' })
// //         showToast('Module added!'); fetchAll()
// //       } else { setModuleMsg(data.message || 'Failed to add module') }
// //     } catch { setModuleMsg('Server error') }
// //   }

// //   const handleCreateSprint = async () => {
// //     setSprintMsg('')
// //     if (!sprintForm.name.trim())  { setSprintMsg('Sprint name is required'); return }
// //     if (!sprintForm.startDate)    { setSprintMsg('Start date is required'); return }
// //     if (!sprintForm.endDate)      { setSprintMsg('End date is required'); return }
// //     if (new Date(sprintForm.endDate) < new Date(sprintForm.startDate)) {
// //       setSprintMsg('End date cannot be before start date'); return
// //     }
// //     setCreatingSprint(true)
// //     try {
// //       const res  = await fetch('http://localhost:3000/sprints', {
// //         method: 'POST', headers: jsonHeaders,
// //         body: JSON.stringify({
// //           name:      sprintForm.name.trim(),
// //           project:   id,
// //           startDate: sprintForm.startDate,
// //           endDate:   sprintForm.endDate,
// //           tasks:     selectedSprintTasks,
// //         })
// //       })
// //       const data = await res.json()
// //       if (data.success) {
// //         setShowCreateSprint(false)
// //         setSprintForm({ name: '', startDate: '', endDate: '' })
// //         setSelectedSprintTasks([])
// //         showToast('Sprint created!'); fetchSprints()
// //       } else { setSprintMsg(data.message || 'Failed to create sprint') }
// //     } catch { setSprintMsg('Server error') }
// //     finally { setCreatingSprint(false) }
// //   }

// //   const handleAssignTask = async (taskId, userId) => {
// //     try {
// //       await fetch(`http://localhost:3000/tasks/${taskId}`, {
// //         method: 'PUT', headers: jsonHeaders,
// //         body: JSON.stringify({ assignedTo: userId, status: 'assigned' })
// //       })
// //       setAssigningTask(null); setAssignUserId(''); fetchAll()
// //     } catch (err) { console.error(err) }
// //   }

// //   const toggleSprintTask = (taskId) => {
// //     setSelectedSprintTasks(prev =>
// //       prev.includes(taskId) ? prev.filter(x => x !== taskId) : [...prev, taskId]
// //     )
// //   }

// //   const teamMembers    = project?.teamMembers || []
// //   const assignableTeam = teamMembers.filter(m => typeof m === 'object' && (m.role === 'developer' || m.role === 'tester'))
// //   const completedTasks = tasks.filter(t => t.status === 'completed').length
// //   const progressPct    = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

// //   if (loading) return (
// //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// //       <p className="text-white text-xl">Loading project...</p>
// //     </div>
// //   )

// //   if (!project) return (
// //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// //       <div className="text-center">
// //         <p className="text-white text-xl mb-4">Project not found</p>
// //         <button onClick={() => navigate('/manager/projects')} className="text-blue-400 hover:text-blue-300">← Back</button>
// //       </div>
// //     </div>
// //   )

// //   return (
// //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
// //       <div className="fixed inset-0 overflow-hidden pointer-events-none">
// //         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
// //         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
// //       </div>

// //       <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// //       <div className="lg:ml-64">
// //         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
// //           <div className="flex items-center space-x-4">
// //             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
// //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// //               </svg>
// //             </button>
// //             <button onClick={() => navigate('/manager/projects')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
// //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// //               </svg>
// //               <span className="text-sm">Back</span>
// //             </button>
// //             <div>
// //               <h1 className="text-2xl font-bold text-white">{project.name}</h1>
// //               <div className="flex items-center gap-2 mt-0.5">
// //                 <span className="text-slate-400 text-sm font-mono">{project.projectKey}</span>
// //                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(project.status)}`}>{project.status}</span>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <button onClick={() => setShowCreateTask(true)}
// //               className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// //               + Create Task
// //             </button>
// //             <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
// //               Logout
// //             </button>
// //           </div>
// //         </header>

// //         {toast && (
// //           <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
// //             {toast}
// //           </div>
// //         )}

// //         <main className="p-4 lg:p-8 relative z-10 space-y-6">

// //           {/* Stats + Progress */}
// //           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //               {[
// //                 { label: 'Total Tasks',  value: tasks.length,                                        color: 'text-white' },
// //                 { label: 'Completed',    value: completedTasks,                                       color: 'text-green-400' },
// //                 { label: 'In Progress',  value: tasks.filter(t => t.status === 'in_progress').length, color: 'text-yellow-400' },
// //                 { label: 'Team Members', value: teamMembers.length,                                   color: 'text-cyan-400' },
// //               ].map((s, i) => (
// //                 <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
// //                   <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
// //                   <p className="text-slate-400 text-xs mt-1">{s.label}</p>
// //                 </div>
// //               ))}
// //             </div>
// //             {tasks.length > 0 && (
// //               <div>
// //                 <div className="flex justify-between text-sm mb-2">
// //                   <span className="text-slate-400">Overall Progress</span>
// //                   <span className="text-white font-medium">{progressPct}%</span>
// //                 </div>
// //                 <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
// //                   <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
// //                     style={{ width: `${progressPct}%` }} />
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* Tabs */}
// //           <div className="flex flex-wrap gap-1 border-b border-white/10">
// //             {[
// //               { key: 'overview', label: 'Overview' },
// //               { key: 'tasks',    label: 'Tasks',   count: tasks.length },
// //               { key: 'sprints',  label: 'Sprints', count: sprints.length },
// //               { key: 'modules',  label: 'Modules', count: modules.length },
// //               { key: 'team',     label: 'Team',    count: teamMembers.length },
// //             ].map(tab => (
// //               <button key={tab.key} onClick={() => setActiveTab(tab.key)}
// //                 className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white/10 text-white border border-white/20 border-b-0' : 'text-slate-400 hover:text-white'}`}>
// //                 {tab.label}
// //                 {tab.count !== undefined && (
// //                   <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{tab.count}</span>
// //                 )}
// //               </button>
// //             ))}
// //           </div>

// //           {/* OVERVIEW */}
// //           {activeTab === 'overview' && (
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //                 <h3 className="text-lg font-bold text-white mb-4">Recent Tasks</h3>
// //                 {tasks.length === 0 ? <p className="text-slate-400 text-sm">No tasks yet</p> : (
// //                   <div className="space-y-3">
// //                     {tasks.slice(0, 5).map(task => (
// //                       <div key={task._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
// //                         <div>
// //                           <p className="text-white text-sm font-medium">{task.title}</p>
// //                           <p className="text-slate-400 text-xs">{task.issueKey}</p>
// //                         </div>
// //                         <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
// //                           {task.status?.replace(/_/g, ' ')}
// //                         </span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //                 <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
// //                 <div className="space-y-3 text-sm">
// //                   {[
// //                     { label: 'Description', value: project.description || 'No description' },
// //                     { label: 'Created By',  value: project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—' },
// //                     { label: 'Start Date',  value: formatDate(project.startDate) },
// //                     { label: 'End Date',    value: formatDate(project.endDate) },
// //                     { label: 'Created',     value: formatDate(project.createdAt) },
// //                   ].map(({ label, value }) => (
// //                     <div key={label} className="flex justify-between p-2 bg-white/5 rounded-lg">
// //                       <span className="text-slate-400">{label}</span>
// //                       <span className="text-white text-right max-w-[60%]">{value}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* TASKS */}
// //           {activeTab === 'tasks' && (
// //             <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
// //               {tasks.length === 0 ? (
// //                 <div className="p-8 text-center">
// //                   <p className="text-slate-400 mb-4">No tasks yet</p>
// //                   <button onClick={() => setShowCreateTask(true)}
// //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// //                     Create First Task
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div className="overflow-x-auto">
// //                   <table className="w-full">
// //                     <thead>
// //                       <tr className="border-b border-white/10">
// //                         {['Task', 'Status', 'Priority', 'Assigned To', 'Due', 'Action'].map(h => (
// //                           <th key={h} className="text-left p-4 text-slate-300 text-sm font-medium">{h}</th>
// //                         ))}
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {tasks.map(task => (
// //                         <tr key={task._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
// //                           <td className="p-4">
// //                             <p className="text-white text-sm font-medium">{task.title}</p>
// //                             <p className="text-slate-400 text-xs font-mono">{task.issueKey}</p>
// //                           </td>
// //                           <td className="p-4">
// //                             <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
// //                               {task.status?.replace(/_/g, ' ')}
// //                             </span>
// //                           </td>
// //                           <td className="p-4">
// //                             <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(task.priority)}`}>
// //                               {task.priority}
// //                             </span>
// //                           </td>
// //                           <td className="p-4">
// //                             {task.assignedTo ? (
// //                               <div className="flex items-center gap-2">
// //                                 <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
// //                                   {task.assignedTo.firstName?.charAt(0)}
// //                                 </div>
// //                                 <span className="text-slate-300 text-sm">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
// //                               </div>
// //                             ) : <span className="text-slate-500 text-sm">Unassigned</span>}
// //                           </td>
// //                           <td className="p-4 text-slate-400 text-sm">{formatDate(task.dueDate, '—')}</td>
// //                           <td className="p-4">
// //                             {assignableTeam.length > 0 && (
// //                               assigningTask === task._id ? (
// //                                 <div className="flex items-center gap-2">
// //                                   <select value={assignUserId} onChange={e => setAssignUserId(e.target.value)}
// //                                     className="px-2 py-1 bg-slate-800 border border-white/20 rounded-lg text-white text-xs focus:outline-none">
// //                                     <option value="">— Select —</option>
// //                                     <optgroup label="Developers">
// //                                       {assignableTeam.filter(m => m.role === 'developer').map(m => (
// //                                         <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
// //                                       ))}
// //                                     </optgroup>
// //                                     <optgroup label="Testers">
// //                                       {assignableTeam.filter(m => m.role === 'tester').map(m => (
// //                                         <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
// //                                       ))}
// //                                     </optgroup>
// //                                   </select>
// //                                   <button onClick={() => assignUserId && handleAssignTask(task._id, assignUserId)}
// //                                     className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs">✓</button>
// //                                   <button onClick={() => { setAssigningTask(null); setAssignUserId('') }}
// //                                     className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs">✕</button>
// //                                 </div>
// //                               ) : (
// //                                 <button onClick={() => { setAssigningTask(task._id); setAssignUserId(task.assignedTo?._id || '') }}
// //                                   className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">
// //                                   {task.assignedTo ? 'Reassign' : 'Assign'}
// //                                 </button>
// //                               )
// //                             )}
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* SPRINTS */}
// //           {activeTab === 'sprints' && (
// //             <div>
// //               <div className="flex items-center justify-between mb-4">
// //                 <h2 className="text-xl font-bold text-white">Sprints</h2>
// //                 <button
// //                   onClick={() => { setShowCreateSprint(true); setSprintMsg(''); setSelectedSprintTasks([]) }}
// //                   className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// //                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
// //                   </svg>
// //                   New Sprint
// //                 </button>
// //               </div>

// //               {sprints.length === 0 ? (
// //                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
// //                   <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
// //                     <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
// //                     </svg>
// //                   </div>
// //                   <p className="text-white font-semibold mb-1">No sprints yet</p>
// //                   <p className="text-slate-400 text-sm mb-4">Create your first sprint for this project</p>
// //                   <button
// //                     onClick={() => { setShowCreateSprint(true); setSprintMsg(''); setSelectedSprintTasks([]) }}
// //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// //                     Create First Sprint
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div className="space-y-4">
// //                   {sprints.map(sprint => {
// //                     const progress   = calcProgress(sprint)
// //                     const totalItems = sprint.tasks?.length || 0
// //                     const doneItems  = sprint.tasks?.filter(t => t.status === 'completed').length || 0
// //                     const now        = new Date()
// //                     const end        = sprint.endDate ? new Date(sprint.endDate) : null
// //                     const daysLeft   = end ? Math.ceil((end - now) / (1000 * 60 * 60 * 24)) : null
// //                     const isOver     = end ? now > end : false

// //                     return (
// //                       <div key={sprint._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
// //                           <div className="flex items-center gap-3">
// //                             <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
// //                               <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
// //                               </svg>
// //                             </div>
// //                             <div>
// //                               <h3 className="text-white font-semibold">{sprint.name}</h3>
// //                               <p className="text-slate-400 text-xs">{totalItems} task{totalItems !== 1 ? 's' : ''} assigned</p>
// //                             </div>
// //                           </div>
// //                           <div className="flex items-center gap-3">
// //                             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
// //                               <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-green-400' : progress > 50 ? 'bg-yellow-400' : 'bg-blue-400'}`} />
// //                               <span className="text-white text-sm font-bold">{progress}%</span>
// //                               <span className="text-slate-400 text-xs">done</span>
// //                             </div>
// //                             <span className={`px-3 py-1 rounded-full text-xs font-medium border ${sprintStatusColor(sprint.status)}`}>
// //                               {sprint.status || 'planned'}
// //                             </span>
// //                           </div>
// //                         </div>

// //                         <div className="grid grid-cols-3 gap-3 mb-4">
// //                           {[
// //                             { label: 'Start', value: sprint.startDate ? new Date(sprint.startDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
// //                             { label: 'End',   value: sprint.endDate   ? new Date(sprint.endDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
// //                             { label: isOver ? 'Status' : 'Time Left', value: isOver ? 'Overdue' : daysLeft !== null ? `${daysLeft}d left` : '—' },
// //                           ].map(({ label, value }) => (
// //                             <div key={label} className="p-2.5 bg-white/5 rounded-lg border border-white/10">
// //                               <p className="text-slate-500 text-xs mb-0.5">{label}</p>
// //                               <p className={`text-sm font-medium ${label !== 'Start' && label !== 'End' && isOver ? 'text-red-400' : 'text-white'}`}>{value}</p>
// //                             </div>
// //                           ))}
// //                         </div>

// //                         <div>
// //                           <div className="flex justify-between text-xs text-slate-400 mb-1.5">
// //                             <span>Work Completion</span>
// //                             <span>{doneItems} / {totalItems} tasks done</span>
// //                           </div>
// //                           <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
// //                             <div
// //                               className={`h-full rounded-full transition-all duration-500 ${
// //                                 progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
// //                                 progress >= 50  ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
// //                                 'bg-gradient-to-r from-blue-500 to-cyan-400'
// //                               }`}
// //                               style={{ width: `${progress}%` }}
// //                             />
// //                           </div>
// //                         </div>
// //                       </div>
// //                     )
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* MODULES */}
// //           {activeTab === 'modules' && (
// //             <div>
// //               <div className="flex items-center justify-between mb-4">
// //                 <h2 className="text-xl font-bold text-white">Modules</h2>
// //                 <button onClick={() => setShowAddModule(true)}
// //                   className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// //                   + Add Module
// //                 </button>
// //               </div>
// //               {modules.length === 0 ? (
// //                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
// //                   <p className="text-slate-400 mb-4">No modules yet</p>
// //                   <button onClick={() => setShowAddModule(true)}
// //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// //                     Add First Module
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                   {modules.map(mod => (
// //                     <div key={mod._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //                       <div className="flex items-start justify-between mb-3">
// //                         <h3 className="text-white font-semibold">{mod.name}</h3>
// //                         <span className={`px-2 py-1 rounded-full text-xs ${statusColor(mod.status)}`}>{mod.status}</span>
// //                       </div>
// //                       <p className="text-slate-400 text-sm mb-4">{mod.description || 'No description'}</p>
// //                       <div className="text-sm space-y-1">
// //                         <div className="flex justify-between">
// //                           <span className="text-slate-400">Tasks</span>
// //                           <span className="text-white">{tasks.filter(t => (t.module?._id || t.module) === mod._id).length}</span>
// //                         </div>
// //                         <div className="flex justify-between">
// //                           <span className="text-slate-400">Completed</span>
// //                           <span className="text-green-400">{tasks.filter(t => (t.module?._id || t.module) === mod._id && t.status === 'completed').length}</span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* TEAM */}
// //           {activeTab === 'team' && (
// //             <div>
// //               {teamMembers.length === 0 ? (
// //                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
// //                   <p className="text-slate-400 mb-4">No team members assigned yet</p>
// //                   <button onClick={() => navigate('/manager/team')}
// //                     className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
// //                     Go to Team Management
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                   {teamMembers.map(member => {
// //                     const m         = typeof member === 'object' ? member : { _id: member }
// //                     const userTasks = tasks.filter(t => (t.assignedTo?._id || t.assignedTo) === m._id)
// //                     const userDone  = userTasks.filter(t => t.status === 'completed').length
// //                     return (
// //                       <div key={m._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //                         <div className="flex items-center gap-4 mb-4">
// //                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-linear-to-r ${m.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
// //                             {m.firstName?.charAt(0) || '?'}
// //                           </div>
// //                           <div>
// //                             <p className="text-white font-semibold">{m.firstName} {m.lastName}</p>
// //                             <p className="text-slate-400 text-xs">{m.email}</p>
// //                             <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${m.role === 'developer' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
// //                               {m.role}
// //                             </span>
// //                           </div>
// //                         </div>
// //                         <div className="space-y-2 text-sm">
// //                           <div className="flex justify-between">
// //                             <span className="text-slate-400">Tasks</span>
// //                             <span className="text-white">{userTasks.length}</span>
// //                           </div>
// //                           <div className="flex justify-between">
// //                             <span className="text-slate-400">Completed</span>
// //                             <span className="text-green-400">{userDone}</span>
// //                           </div>
// //                         </div>
// //                         {userTasks.length > 0 && (
// //                           <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
// //                             <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"
// //                               style={{ width: `${Math.round((userDone / userTasks.length) * 100)}%` }} />
// //                           </div>
// //                         )}
// //                       </div>
// //                     )
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </main>
// //       </div>

// //       {/* Create Task Modal */}
// //       {showCreateTask && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-6">
// //               <h2 className="text-xl font-bold text-white">Create Task</h2>
// //               <button onClick={() => { setShowCreateTask(false); setTaskMsg('') }} className="text-slate-400 hover:text-white">
// //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>
// //             {taskMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{taskMsg}</p>}
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="text-slate-400 text-xs mb-1 block">Title <span className="text-red-400">*</span></label>
// //                 <input type="text" placeholder="Task title..." value={taskForm.title}
// //                   onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
// //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
// //               </div>
// //               <div>
// //                 <label className="text-slate-400 text-xs mb-1 block">Description</label>
// //                 <textarea placeholder="Task description..." value={taskForm.description}
// //                   onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
// //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
// //               </div>
// //               <div>
// //                 <label className="text-slate-400 text-xs mb-1 block">Module <span className="text-slate-500">(optional)</span></label>
// //                 <select value={taskForm.module} onChange={e => setTaskForm({ ...taskForm, module: e.target.value })}
// //                   className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// //                   <option value="">— No module —</option>
// //                   {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
// //                 </select>
// //               </div>
// //               <div>
// //                 <label className="text-slate-400 text-xs mb-1 block">Assign To <span className="text-slate-500">(optional)</span></label>
// //                 <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
// //                   className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// //                   <option value="">— Unassigned —</option>
// //                   <optgroup label="Developers">
// //                     {assignableTeam.filter(m => m.role === 'developer').map(m => (
// //                       <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
// //                     ))}
// //                   </optgroup>
// //                   <optgroup label="Testers">
// //                     {assignableTeam.filter(m => m.role === 'tester').map(m => (
// //                       <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
// //                     ))}
// //                   </optgroup>
// //                 </select>
// //               </div>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <label className="text-slate-400 text-xs mb-1 block">Priority</label>
// //                   <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
// //                     className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
// //                     <option value="low">Low</option>
// //                     <option value="medium">Medium</option>
// //                     <option value="high">High</option>
// //                     <option value="urgent">Urgent</option>
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label className="text-slate-400 text-xs mb-1 block">Due Date</label>
// //                   <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
// //                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="flex gap-3 mt-6">
// //               <button onClick={handleCreateTask}
// //                 className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
// //                 Create Task
// //               </button>
// //               <button onClick={() => { setShowCreateTask(false); setTaskMsg('') }}
// //                 className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Add Module Modal */}
// //       {showAddModule && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-sm">
// //             <div className="flex items-center justify-between mb-6">
// //               <h2 className="text-xl font-bold text-white">Add Module</h2>
// //               <button onClick={() => { setShowAddModule(false); setModuleMsg('') }} className="text-slate-400 hover:text-white">
// //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>
// //             {moduleMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{moduleMsg}</p>}
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="text-slate-400 text-xs mb-1 block">Module Name <span className="text-red-400">*</span></label>
// //                 <input type="text" placeholder="e.g. Authentication, Dashboard..."
// //                   value={moduleForm.name} onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })}
// //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
// //               </div>
// //               <div>
// //                 <label className="text-slate-400 text-xs mb-1 block">Description <span className="text-slate-500">(optional)</span></label>
// //                 <textarea placeholder="Module description..."
// //                   value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
// //                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
// //               </div>
// //             </div>
// //             <div className="flex gap-3 mt-6">
// //               <button onClick={handleAddModule}
// //                 className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
// //                 Add Module
// //               </button>
// //               <button onClick={() => { setShowAddModule(false); setModuleMsg('') }}
// //                 className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Create Sprint Modal */}
// //       {showCreateSprint && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
// //           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-6">
// //               <div>
// //                 <h2 className="text-xl font-bold text-white">Create Sprint</h2>
// //                 <p className="text-slate-400 text-xs mt-0.5">{project.name}</p>
// //               </div>
// //               <button onClick={() => { setShowCreateSprint(false); setSprintMsg(''); setSelectedSprintTasks([]) }} className="text-slate-400 hover:text-white">
// //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             {sprintMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{sprintMsg}</p>}

// //             <div className="space-y-4">
// //               <div>
// //                 <label className="text-slate-300 text-sm mb-1.5 block">Sprint Name <span className="text-red-400">*</span></label>
// //                 <input type="text" placeholder="e.g. Sprint 1 — Auth Module"
// //                   value={sprintForm.name} onChange={e => setSprintForm(p => ({ ...p, name: e.target.value }))}
// //                   className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
// //               </div>

// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <label className="text-slate-300 text-sm mb-1.5 block">Start Date <span className="text-red-400">*</span></label>
// //                   <input type="date" value={sprintForm.startDate}
// //                     onChange={e => setSprintForm(p => ({ ...p, startDate: e.target.value }))}
// //                     className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
// //                 </div>
// //                 <div>
// //                   <label className="text-slate-300 text-sm mb-1.5 block">End Date <span className="text-red-400">*</span></label>
// //                   <input type="date" value={sprintForm.endDate} min={sprintForm.startDate || undefined}
// //                     onChange={e => setSprintForm(p => ({ ...p, endDate: e.target.value }))}
// //                     className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
// //                 </div>
// //               </div>

// //               {/* Task selector */}
// //               <div>
// //                 <div className="flex items-center justify-between mb-2">
// //                   <label className="text-slate-300 text-sm">Assign Tasks to Sprint <span className="text-slate-500">(optional)</span></label>
// //                   {selectedSprintTasks.length > 0 && (
// //                     <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
// //                       {selectedSprintTasks.length} selected
// //                     </span>
// //                   )}
// //                 </div>
// //                 {tasks.length === 0 ? (
// //                   <div className="px-4 py-5 bg-white/5 border border-white/10 rounded-xl text-center">
// //                     <p className="text-slate-400 text-sm">No tasks in this project yet</p>
// //                   </div>
// //                 ) : (
// //                   <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
// //                     {tasks.map((task, idx) => (
// //                       <label key={task._id}
// //                         className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors ${idx !== 0 ? 'border-t border-white/5' : ''} ${selectedSprintTasks.includes(task._id) ? 'bg-blue-500/5' : ''}`}>
// //                         <div
// //                           className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${selectedSprintTasks.includes(task._id) ? 'bg-blue-500 border-blue-500' : 'border-white/30'}`}
// //                           onClick={() => toggleSprintTask(task._id)}>
// //                           {selectedSprintTasks.includes(task._id) && (
// //                             <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
// //                             </svg>
// //                           )}
// //                         </div>
// //                         <input type="checkbox" className="hidden" checked={selectedSprintTasks.includes(task._id)} onChange={() => toggleSprintTask(task._id)} />
// //                         <div className="flex-1 min-w-0">
// //                           <p className="text-white text-sm truncate">{task.title}</p>
// //                           <p className="text-slate-500 text-xs font-mono">{task.issueKey}</p>
// //                         </div>
// //                         <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${priorityColor(task.priority)}`}>{task.priority}</span>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             <div className="flex gap-3 mt-6">
// //               <button onClick={handleCreateSprint} disabled={creatingSprint}
// //                 className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
// //                 {creatingSprint ? 'Creating...' : 'Create Sprint'}
// //               </button>
// //               <button onClick={() => { setShowCreateSprint(false); setSprintMsg(''); setSelectedSprintTasks([]) }}
// //                 className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default ManagerProjectDetails


// import { useState, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
// import { formatDate } from '../../utils/DateUtils'

// const taskStatusColor = (s) => ({
//   to_do:           'bg-slate-500/20 text-slate-400',
//   assigned:        'bg-blue-500/20 text-blue-400',
//   in_progress:     'bg-yellow-500/20 text-yellow-400',
//   submitted:       'bg-purple-500/20 text-purple-400',
//   in_testing:      'bg-cyan-500/20 text-cyan-400',
//   bug_found:       'bg-red-500/20 text-red-400',
//   fix_in_progress: 'bg-orange-500/20 text-orange-400',
//   resubmitted:     'bg-indigo-500/20 text-indigo-400',
//   completed:       'bg-green-500/20 text-green-400',
// }[s] || 'bg-slate-500/20 text-slate-400')

// const priorityColor = (p) => ({
//   low:    'bg-green-500/20 text-green-400',
//   medium: 'bg-yellow-500/20 text-yellow-400',
//   high:   'bg-orange-500/20 text-orange-400',
//   urgent: 'bg-red-500/20 text-red-400',
// }[p] || 'bg-slate-500/20 text-slate-400')

// const statusColor = (s) => ({
//   active:    'bg-green-500/20 text-green-400',
//   completed: 'bg-blue-500/20 text-blue-400',
//   inactive:  'bg-yellow-500/20 text-yellow-400',
//   planned:   'bg-slate-500/20 text-slate-400',
// }[s] || 'bg-slate-500/20 text-slate-400')

// const sprintStatusColor = (s) => ({
//   planned:   'bg-slate-500/20 text-slate-400 border-slate-500/30',
//   active:    'bg-green-500/20 text-green-400 border-green-500/30',
//   completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
// }[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

// const calcProgress = (sprint) => {
//   const items = sprint.tasks || []
//   if (items.length === 0) return 0
//   const done = items.filter(t => t.status === 'completed').length
//   return Math.round((done / items.length) * 100)
// }

// // Empty task form factory
// const emptyTaskForm = () => ({
//   title: '', description: '', module: '', assignedTo: '', testedBy: '',
//   priority: 'medium', dueDate: '',
// })

// const ManagerProjectDetails = () => {
//   const [sidebarOpen, setSidebarOpen]       = useState(false)
//   const [project, setProject]               = useState(null)
//   const [modules, setModules]               = useState([])
//   const [tasks, setTasks]                   = useState([])
//   const [sprints, setSprints]               = useState([])
//   const [loading, setLoading]               = useState(true)
//   const [activeTab, setActiveTab]           = useState('overview')

//   // Create Task modal (standalone)
//   const [showCreateTask, setShowCreateTask] = useState(false)
//   const [taskForms, setTaskForms]           = useState([emptyTaskForm()])  // array!
//   const [taskMsg, setTaskMsg]               = useState('')
//   // Add Module modal
//   const [showAddModule, setShowAddModule]   = useState(false)
//   const [moduleForm, setModuleForm]         = useState({ name: '', description: '' })
//   const [moduleMsg, setModuleMsg]           = useState('')

//   // Create Sprint modal
//   const [showCreateSprint, setShowCreateSprint]   = useState(false)
//   const [sprintForm, setSprintForm]               = useState({ name: '', startDate: '', endDate: '' })
//   const [sprintTasks, setSprintTasks] = useState([emptyTaskForm()])
//   const [sprintTaskMsg, setSprintTaskMsg]         = useState('')
//   const [sprintMsg, setSprintMsg]                 = useState('')
//   const [creatingSprint, setCreatingSprint]       = useState(false)

//   // Inline assign
//   const [assigningTask, setAssigningTask]   = useState(null)
//   const [assignUserId, setAssignUserId]     = useState('')

//   const [toast, setToast] = useState('')

//   const navigate    = useNavigate()
//   const { id }      = useParams()
//   const token       = localStorage.getItem('token')
//   const user        = JSON.parse(localStorage.getItem('user') || '{}')
//   const authHeaders = { Authorization: `Bearer ${token}` }
//   const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

//   const handleLogout = () => { localStorage.clear(); navigate('/') }
//   const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

//   const fetchAll = async () => {
//     try {
//       const [pRes, mRes, tRes] = await Promise.all([
//         fetch(`http://localhost:3000/projects/${id}`,          { headers: authHeaders }),
//         fetch(`http://localhost:3000/modules?projectId=${id}`, { headers: authHeaders }),
//         fetch(`http://localhost:3000/tasks?project=${id}`,     { headers: authHeaders }),
//       ])
//       const safe = async (res) => {
//         const ct = res.headers.get('content-type') || ''
//         if (!ct.includes('application/json')) return { success: false }
//         return res.json()
//       }
//       const [pData, mData, tData] = await Promise.all([safe(pRes), safe(mRes), safe(tRes)])
//       if (pData.success) setProject(pData.data)
//       if (mData.success) setModules(mData.data || [])
//       if (tData.success) setTasks(tData.data || [])
//     } catch (err) { console.error(err) }
//     finally { setLoading(false) }
//   }

//   const fetchSprints = async () => {
//   try {
//     const res  = await fetch(`http://localhost:3000/sprints?projectId=${id}`, { headers: authHeaders })
//     const data = await res.json()

//     if (data.success) {
//       setSprints(data.data || [])
//     }
//   } catch (err) {
//     console.error(err)
//   }
// }
//   useEffect(() => {
//     if (id) { fetchAll(); fetchSprints() }
//   }, [id])

//   // ---------- handlers ----------

//   const handleCreateTasks = async () => {
//   setTaskMsg('')
//   const validForms = taskForms.filter(f => f.title.trim())
//   if (validForms.length === 0) { setTaskMsg('At least one task title is required'); return }

//   try {
//     const results = await Promise.all(validForms.map(form => {
//       const payload = {
//         title:       form.title.trim(),
//         description: form.description.trim(),
//         project:     id,
//         priority:    form.priority,
//         createdBy:   user._id,
//         ...(form.module     && { module:     form.module }),
//         ...(form.assignedTo && { assignedTo: form.assignedTo }),
//         ...(form.testedBy   && { testedBy:   form.testedBy }),
//         ...(form.dueDate    && { dueDate:    form.dueDate }),
//       }
//       return fetch('http://localhost:3000/manager/tasks', {
//         method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload)
//       }).then(r => r.json())
//     }))

//     const allOk = results.every(r => r.success)
//     if (allOk) {
//       setShowCreateTask(false)
//       setTaskForms([emptyTaskForm()])
//       showToast(`${validForms.length} task${validForms.length > 1 ? 's' : ''} created!`)
//       fetchAll()
//     } else {
//       const failed = results.find(r => !r.success)
//       setTaskMsg(failed?.message || 'Some tasks failed to create')
//     }
//   } catch { setTaskMsg('Server error') }
// }

//   const handleAddModule = async () => {
//     setModuleMsg('')
//     if (!moduleForm.name.trim()) { setModuleMsg('Module name is required'); return }
//     try {
//       const res  = await fetch('http://localhost:3000/modules', {
//         method: 'POST', headers: jsonHeaders,
//         body: JSON.stringify({ name: moduleForm.name.trim(), description: moduleForm.description.trim(), project: id, createdBy: user._id })
//       })
//       const data = await res.json()
//       if (data.success) {
//         setShowAddModule(false)
//         setModuleForm({ name: '', description: '' })
//         showToast('Module added!'); fetchAll()
//       } else { setModuleMsg(data.message || 'Failed to add module') }
//     } catch { setModuleMsg('Server error') }
//   }

//   /**
//    * Create sprint flow:
//    * 1. If sprintTaskForm.title is filled → create a task first, collect its _id
//    * 2. Create the sprint with taskIds = [newTaskId] (or [] if no task title)
//    */
  
//   const handleCreateSprint = async () => {
//   if (!sprintForm.name || !sprintForm.startDate || !sprintForm.endDate) {
//     setSprintMsg("All fields required");
//     return;
//   }

//   setCreatingSprint(true)

//   try {
//     // 1️⃣ Create Sprint
//     const sprintRes = await fetch("http://localhost:3000/sprints", {
//       method: "POST",
//       headers: jsonHeaders,
//       body: JSON.stringify({
//         name: sprintForm.name,
//         project: id,
//         startDate: sprintForm.startDate,
//         endDate: sprintForm.endDate
//       })
//     });

//     const sprintData = await sprintRes.json();
//     if (!sprintData.success) {
//       setSprintMsg("Failed to create sprint");
//       return;
//     }

//     const sprintId = sprintData.data._id;

//     // 2️⃣ IF TASK EXISTS → CREATE INSIDE SPRINT
//     for (let task of sprintTasks) {
//   if (task.title?.trim()) {
//     await fetch("http://localhost:3000/manager/tasks", {
//       method: "POST",
//       headers: jsonHeaders,
//       body: JSON.stringify({
//         title: task.title,
//         description: task.description,
//         project: id,
//         sprint: sprintId,
//         priority: task.priority,
//         createdBy: user._id
//       })
//     });
//   }
// }

//     setShowCreateSprint(false);
//     fetchSprints();
//     setSprintTasks([emptyTaskForm()])
//   } 
//   catch {
//     setSprintMsg("Server error");
//   } finally {
//     setCreatingSprint(false)
//   }
// }
//   const handleAssignTask = async (taskId, userId) => {
//     try {
//       await fetch(`http://localhost:3000/tasks/${taskId}`, {
//         method: 'PUT', headers: jsonHeaders,
//         body: JSON.stringify({ assignedTo: userId, status: 'assigned' })
//       })
//       setAssigningTask(null); setAssignUserId(''); fetchAll()
//     } catch (err) { console.error(err) }
//   }

//   const openCreateSprint = () => {
//     setShowCreateSprint(true)
//     setSprintMsg(''); setSprintTaskMsg('')
//     setSprintForm({ name: '', startDate: '', endDate: '' })
//     setSprintTasks([emptyTaskForm()])
//   }

//   const teamMembers    = project?.teamMembers || []
//   const developers     = teamMembers.filter(m => typeof m === 'object' && m.role === 'developer')
//   const testers        = teamMembers.filter(m => typeof m === 'object' && m.role === 'tester')
//   const assignableTeam = [...developers, ...testers]
//   const completedTasks = tasks.filter(t => t.status === 'completed').length
//   const progressPct    = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//       <p className="text-white text-xl">Loading project...</p>
//     </div>
//   )

//   if (!project) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//       <div className="text-center">
//         <p className="text-white text-xl mb-4">Project not found</p>
//         <button onClick={() => navigate('/manager/projects')} className="text-blue-400 hover:text-blue-300">← Back</button>
//       </div>
//     </div>
//   )

//   // ── shared task form fields (reused in both modals) ──────────────────────
//   const TaskFormFields = ({ form, setForm, errorMsg }) => (
//     <div className="space-y-4">
//       {errorMsg && <p className="text-red-400 text-sm px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{errorMsg}</p>}
//       <div>
//         <label className="text-slate-400 text-xs mb-1 block">Title <span className="text-red-400">*</span></label>
//         <input type="text" placeholder="Task title..." value={form.title}
//           onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//           className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
//       </div>
//       <div>
//         <label className="text-slate-400 text-xs mb-1 block">Description</label>
//         <textarea placeholder="Task description..." value={form.description}
//           onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//           className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
//       </div>
//       <div>
//         <label className="text-slate-400 text-xs mb-1 block">Module <span className="text-slate-500">(optional)</span></label>
//         <select value={form.module} onChange={e => setForm(f => ({ ...f, module: e.target.value }))}
//           className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
//           <option value="">— No module —</option>
//           {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
//         </select>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <div>
//           <label className="text-slate-400 text-xs mb-1 block">Assign Developer <span className="text-slate-500">(optional)</span></label>
//           <select value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
//             className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
//             <option value="">— Unassigned —</option>
//             {developers.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="text-slate-400 text-xs mb-1 block">Assign Tester <span className="text-slate-500">(optional)</span></label>
//           <select value={form.testedBy} onChange={e => setForm(f => ({ ...f, testedBy: e.target.value }))}
//             className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
//             <option value="">— Unassigned —</option>
//             {testers.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>)}
//           </select>
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="text-slate-400 text-xs mb-1 block">Priority</label>
//           <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
//             className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500">
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//             <option value="urgent">Urgent</option>
//           </select>
//         </div>
//         <div>
//           <label className="text-slate-400 text-xs mb-1 block">Due Date</label>
//           <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
//             className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//       </div>

//       <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="lg:ml-64">
//         {/* ── Header ── */}
//         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <button onClick={() => navigate('/manager/projects')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               <span className="text-sm">Back</span>
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-white">{project.name}</h1>
//               <div className="flex items-center gap-2 mt-0.5">
//                 <span className="text-slate-400 text-sm font-mono">{project.projectKey}</span>
//                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(project.status)}`}>{project.status}</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* Contextual primary button */}
//             {activeTab === 'sprints' ? (
//               <button onClick={openCreateSprint}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//                 + New Sprint
//               </button>
//             ) : (
//               <button onClick={() => { setShowCreateTask(true); setTaskMsg(''); setTaskForms([emptyTaskForm()]) }}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//                 + Create Task
//               </button>
//             )}
//             <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
//               Logout
//             </button>
//           </div>
//         </header>

//         {toast && (
//           <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
//             {toast}
//           </div>
//         )}

//         <main className="p-4 lg:p-8 relative z-10 space-y-6">

//           {/* Stats + Progress */}
//           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               {[
//                 { label: 'Total Tasks',  value: tasks.length,                                        color: 'text-white' },
//                 { label: 'Completed',    value: completedTasks,                                       color: 'text-green-400' },
//                 { label: 'In Progress',  value: tasks.filter(t => t.status === 'in_progress').length, color: 'text-yellow-400' },
//                 { label: 'Team Members', value: teamMembers.length,                                   color: 'text-cyan-400' },
//               ].map((s, i) => (
//                 <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
//                   <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
//                   <p className="text-slate-400 text-xs mt-1">{s.label}</p>
//                 </div>
//               ))}
//             </div>
//             {tasks.length > 0 && (
//               <div>
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-slate-400">Overall Progress</span>
//                   <span className="text-white font-medium">{progressPct}%</span>
//                 </div>
//                 <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
//                   <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
//                     style={{ width: `${progressPct}%` }} />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Tabs */}
//           <div className="flex flex-wrap gap-1 border-b border-white/10">
//             {[
//               { key: 'overview', label: 'Overview' },
//               { key: 'tasks',    label: 'Tasks',   count: tasks.length },
//               { key: 'sprints',  label: 'Sprints', count: sprints.length },
//               { key: 'modules',  label: 'Modules', count: modules.length },
//               { key: 'team',     label: 'Team',    count: teamMembers.length },
//             ].map(tab => (
//               <button key={tab.key} onClick={() => setActiveTab(tab.key)}
//                 className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white/10 text-white border border-white/20 border-b-0' : 'text-slate-400 hover:text-white'}`}>
//                 {tab.label}
//                 {tab.count !== undefined && (
//                   <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{tab.count}</span>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* ── OVERVIEW ── */}
//           {activeTab === 'overview' && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                 <h3 className="text-lg font-bold text-white mb-4">Recent Tasks</h3>
//                 {tasks.length === 0 ? <p className="text-slate-400 text-sm">No tasks yet</p> : (
//                   <div className="space-y-3">
//                     {tasks.slice(0, 5).map(task => (
//                       <div key={task._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
//                         <div>
//                           <p className="text-white text-sm font-medium">{task.title}</p>
//                           <p className="text-slate-400 text-xs">{task.issueKey}</p>
//                         </div>
//                         <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
//                           {task.status?.replace(/_/g, ' ')}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                 <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
//                 <div className="space-y-3 text-sm">
//                   {[
//                     { label: 'Description', value: project.description || 'No description' },
//                     { label: 'Created By',  value: project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—' },
//                     { label: 'Start Date',  value: formatDate(project.startDate) },
//                     { label: 'End Date',    value: formatDate(project.endDate) },
//                     { label: 'Created',     value: formatDate(project.createdAt) },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="flex justify-between p-2 bg-white/5 rounded-lg">
//                       <span className="text-slate-400">{label}</span>
//                       <span className="text-white text-right max-w-[60%]">{value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── TASKS ── */}
//           {activeTab === 'tasks' && (
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
//               {tasks.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <p className="text-slate-400 mb-4">No tasks yet</p>
//                   {/* <button onClick={() => { setShowCreateTask(true); setTaskMsg('') }} */}
//                   <button onClick={() => { setShowCreateTask(true); setTaskMsg(''); setTaskForms([emptyTaskForm()]) }}
//                     className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
//                     Create First Task
//                   </button>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-white/10">
//                         {['Task', 'Status', 'Priority', 'Developer', 'Tester', 'Due', 'Action'].map(h => (
//                           <th key={h} className="text-left p-4 text-slate-300 text-sm font-medium">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {tasks.map(task => (
//                         <tr key={task._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
//                           <td className="p-4">
//                             <p className="text-white text-sm font-medium">{task.title}</p>
//                             <p className="text-slate-400 text-xs font-mono">{task.issueKey}</p>
//                           </td>
//                           <td className="p-4">
//                             <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
//                               {task.status?.replace(/_/g, ' ')}
//                             </span>
//                           </td>
//                           <td className="p-4">
//                             <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(task.priority)}`}>
//                               {task.priority}
//                             </span>
//                           </td>
//                           <td className="p-4">
//                             {task.assignedTo
//                               ? <span className="text-slate-300 text-sm">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
//                               : <span className="text-slate-500 text-sm">—</span>}
//                           </td>
//                           <td className="p-4">
//                             {task.testedBy
//                               ? <span className="text-slate-300 text-sm">{task.testedBy.firstName} {task.testedBy.lastName}</span>
//                               : <span className="text-slate-500 text-sm">—</span>}
//                           </td>
//                           <td className="p-4 text-slate-400 text-sm">{formatDate(task.dueDate, '—')}</td>
//                           <td className="p-4">
//                             {assignableTeam.length > 0 && (
//                               assigningTask === task._id ? (
//                                 <div className="flex items-center gap-2">
//                                   <select value={assignUserId} onChange={e => setAssignUserId(e.target.value)}
//                                     className="px-2 py-1 bg-slate-800 border border-white/20 rounded-lg text-white text-xs focus:outline-none">
//                                     <option value="">— Select —</option>
//                                     <optgroup label="Developers">
//                                       {developers.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>)}
//                                     </optgroup>
//                                     <optgroup label="Testers">
//                                       {testers.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>)}
//                                     </optgroup>
//                                   </select>
//                                   <button onClick={() => assignUserId && handleAssignTask(task._id, assignUserId)}
//                                     className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs">✓</button>
//                                   <button onClick={() => { setAssigningTask(null); setAssignUserId('') }}
//                                     className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs">✕</button>
//                                 </div>
//                               ) : (
//                                 <button onClick={() => { setAssigningTask(task._id); setAssignUserId(task.assignedTo?._id || '') }}
//                                   className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">
//                                   {task.assignedTo ? 'Reassign' : 'Assign'}
//                                 </button>
//                               )
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── SPRINTS ── */}
//           {activeTab === 'sprints' && (
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-white">Sprints</h2>
//                 <button onClick={openCreateSprint}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                   New Sprint
//                 </button>
//               </div>

//               {sprints.length === 0 ? (
//                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
//                   <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                     </svg>
//                   </div>
//                   <p className="text-white font-semibold mb-1">No sprints yet</p>
//                   <p className="text-slate-400 text-sm mb-4">Create your first sprint for this project</p>
//                   <button onClick={openCreateSprint}
//                     className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
//                     Create First Sprint
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {sprints.map(sprint => {
//                     const progress   = calcProgress(sprint)
//                     const totalItems = sprint.tasks?.length || 0
//                     const doneItems  = sprint.tasks?.filter(t => t.status === 'completed').length || 0
//                     const now        = new Date()
//                     const end        = sprint.endDate ? new Date(sprint.endDate) : null
//                     const daysLeft   = end ? Math.ceil((end - now) / (1000 * 60 * 60 * 24)) : null
//                     const isOver     = end ? now > end : false

//                     return (
//                       // ── Clickable sprint card → navigates to sprint detail ──
//                       <div key={sprint._id}
//                         onClick={() => navigate(`/manager/sprints/${sprint._id}`)}
//                         className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/15 hover:border-blue-500/40 transition-all group">
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
//                               <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                               </svg>
//                             </div>
//                             <div>
//                               <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">{sprint.name}</h3>
//                               <p className="text-slate-400 text-xs">{totalItems} task{totalItems !== 1 ? 's' : ''} assigned</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-3">
//                             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
//                               <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-green-400' : progress > 50 ? 'bg-yellow-400' : 'bg-blue-400'}`} />
//                               <span className="text-white text-sm font-bold">{progress}%</span>
//                               <span className="text-slate-400 text-xs">done</span>
//                             </div>
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium border ${sprintStatusColor(sprint.status)}`}>
//                               {sprint.status || 'planned'}
//                             </span>
//                             {/* Arrow hint */}
//                             <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                             </svg>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-3 gap-3 mb-4">
//                           {[
//                             { label: 'Start', value: sprint.startDate ? new Date(sprint.startDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
//                             { label: 'End',   value: sprint.endDate   ? new Date(sprint.endDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
//                             { label: isOver ? 'Status' : 'Time Left', value: isOver ? 'Overdue' : daysLeft !== null ? `${daysLeft}d left` : '—' },
//                           ].map(({ label, value }) => (
//                             <div key={label} className="p-2.5 bg-white/5 rounded-lg border border-white/10">
//                               <p className="text-slate-500 text-xs mb-0.5">{label}</p>
//                               <p className={`text-sm font-medium ${label !== 'Start' && label !== 'End' && isOver ? 'text-red-400' : 'text-white'}`}>{value}</p>
//                             </div>
//                           ))}
//                         </div>

//                         <div>
//                           <div className="flex justify-between text-xs text-slate-400 mb-1.5">
//                             <span>Work Completion</span>
//                             <span>{doneItems} / {totalItems} tasks done</span>
//                           </div>
//                           <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
//                             <div
//                               className={`h-full rounded-full transition-all duration-500 ${
//                                 progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
//                                 progress >= 50  ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
//                                 'bg-gradient-to-r from-blue-500 to-cyan-400'
//                               }`}
//                               style={{ width: `${progress}%` }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── MODULES ── */}
//           {activeTab === 'modules' && (
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-white">Modules</h2>
//                 <button onClick={() => setShowAddModule(true)}
//                   className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//                   + Add Module
//                 </button>
//               </div>
//               {modules.length === 0 ? (
//                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
//                   <p className="text-slate-400 mb-4">No modules yet</p>
//                   <button onClick={() => setShowAddModule(true)}
//                     className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
//                     Add First Module
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {modules.map(mod => (
//                     <div key={mod._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                       <div className="flex items-start justify-between mb-3">
//                         <h3 className="text-white font-semibold">{mod.name}</h3>
//                         <span className={`px-2 py-1 rounded-full text-xs ${statusColor(mod.status)}`}>{mod.status}</span>
//                       </div>
//                       <p className="text-slate-400 text-sm mb-4">{mod.description || 'No description'}</p>
//                       <div className="text-sm space-y-1">
//                         <div className="flex justify-between">
//                           <span className="text-slate-400">Tasks</span>
//                           <span className="text-white">{tasks.filter(t => (t.module?._id || t.module) === mod._id).length}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-slate-400">Completed</span>
//                           <span className="text-green-400">{tasks.filter(t => (t.module?._id || t.module) === mod._id && t.status === 'completed').length}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── TEAM ── */}
//           {activeTab === 'team' && (
//             <div>
//               {teamMembers.length === 0 ? (
//                 <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
//                   <p className="text-slate-400 mb-4">No team members assigned yet</p>
//                   <button onClick={() => navigate('/manager/team')}
//                     className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
//                     Go to Team Management
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {teamMembers.map(member => {
//                     const m         = typeof member === 'object' ? member : { _id: member }
//                     const userTasks = tasks.filter(t => (t.assignedTo?._id || t.assignedTo) === m._id)
//                     const userDone  = userTasks.filter(t => t.status === 'completed').length
//                     return (
//                       <div key={m._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                         <div className="flex items-center gap-4 mb-4">
//                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-gradient-to-r ${m.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
//                             {m.firstName?.charAt(0) || '?'}
//                           </div>
//                           <div>
//                             <p className="text-white font-semibold">{m.firstName} {m.lastName}</p>
//                             <p className="text-slate-400 text-xs">{m.email}</p>
//                             <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${m.role === 'developer' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
//                               {m.role}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-slate-400">Tasks</span>
//                             <span className="text-white">{userTasks.length}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-slate-400">Completed</span>
//                             <span className="text-green-400">{userDone}</span>
//                           </div>
//                         </div>
//                         {userTasks.length > 0 && (
//                           <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
//                             <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
//                               style={{ width: `${Math.round((userDone / userTasks.length) * 100)}%` }} />
//                           </div>
//                         )}
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
//         </main>
//       </div>

//       {/* ════════════════════════════════════════
//           Modal — Create Task (standalone)
//       ════════════════════════════════════════ */}
//       {showCreateTask && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//     <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-bold text-white">Create Task{taskForms.length > 1 ? `s (${taskForms.length})` : ''}</h2>
//         <button onClick={() => { setShowCreateTask(false); setTaskMsg(''); setTaskForms([emptyTaskForm()]) }} className="text-slate-400 hover:text-white">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>

//       <div className="space-y-6">
//         {taskForms.map((form, index) => (
//           <div key={index} className="relative">
//             {taskForms.length > 1 && (
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-slate-400 text-xs font-medium">Task {index + 1}</span>
//                 <button
//                   onClick={() => setTaskForms(prev => prev.filter((_, i) => i !== index))}
//                   className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-500/10 rounded-lg">
//                   Remove
//                 </button>
//               </div>
//             )}
//             <TaskFormFields
//               form={form}
//               setForm={(updated) => {
//                 setTaskForms(prev => {
//                   const next = [...prev]
//                   next[index] = typeof updated === 'function' ? updated(prev[index]) : updated
//                   return next
//                 })
//               }}
//               errorMsg={index === 0 ? taskMsg : ''}
//             />
//             {index < taskForms.length - 1 && <div className="mt-4 border-b border-white/10" />}
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={() => setTaskForms(prev => [...prev, emptyTaskForm()])}
//         className="mt-4 w-full py-2 border border-dashed border-white/20 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 rounded-xl text-sm transition-all">
//         + Add Another Task
//       </button>

//       <div className="flex gap-3 mt-4">
//         <button onClick={handleCreateTasks}
//           className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
//           Create {taskForms.length > 1 ? `${taskForms.length} Tasks` : 'Task'}
//         </button>
//         <button onClick={() => { setShowCreateTask(false); setTaskMsg(''); setTaskForms([emptyTaskForm()]) }}
//           className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       {/* ════════════════════════════════════════
//           Modal — Add Module
//       ════════════════════════════════════════ */}
//       {showAddModule && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-sm">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-white">Add Module</h2>
//               <button onClick={() => { setShowAddModule(false); setModuleMsg('') }} className="text-slate-400 hover:text-white">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             {moduleMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{moduleMsg}</p>}
//             <div className="space-y-4">
//               <div>
//                 <label className="text-slate-400 text-xs mb-1 block">Module Name <span className="text-red-400">*</span></label>
//                 <input type="text" placeholder="e.g. Authentication, Dashboard..."
//                   value={moduleForm.name} onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
//               </div>
//               <div>
//                 <label className="text-slate-400 text-xs mb-1 block">Description <span className="text-slate-500">(optional)</span></label>
//                 <textarea placeholder="Module description..."
//                   value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
//               </div>
//             </div>
//             <div className="flex gap-3 mt-6">
//               <button onClick={handleAddModule}
//                 className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
//                 Add Module
//               </button>
//               <button onClick={() => { setShowAddModule(false); setModuleMsg('') }}
//                 className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ════════════════════════════════════════
//           Modal — Create Sprint (with inline task creation)
//       ════════════════════════════════════════ */}
//       {showCreateSprint && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-xl font-bold text-white">Create Sprint</h2>
//                 <p className="text-slate-400 text-xs mt-0.5">{project.name}</p>
//               </div>
//               <button onClick={() => setShowCreateSprint(false)} className="text-slate-400 hover:text-white">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {sprintMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{sprintMsg}</p>}

//             {/* Sprint details */}
//             <div className="space-y-4 mb-6">
//               <div>
//                 <label className="text-slate-300 text-sm mb-1.5 block">Sprint Name <span className="text-red-400">*</span></label>
//                 <input type="text" placeholder="e.g. Sprint 1 — Auth Module"
//                   value={sprintForm.name} onChange={e => setSprintForm(p => ({ ...p, name: e.target.value }))}
//                   className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-slate-300 text-sm mb-1.5 block">Start Date <span className="text-red-400">*</span></label>
//                   <input type="date" value={sprintForm.startDate}
//                     onChange={e => setSprintForm(p => ({ ...p, startDate: e.target.value }))}
//                     className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm mb-1.5 block">End Date <span className="text-red-400">*</span></label>
//                   <input type="date" value={sprintForm.endDate} min={sprintForm.startDate || undefined}
//                     onChange={e => setSprintForm(p => ({ ...p, endDate: e.target.value }))}
//                     className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
//                 </div>
//               </div>
//             </div>

//             {/* Divider with label */}
//             <div className="flex items-center gap-3 mb-5">
//               <div className="flex-1 h-px bg-white/10" />
//               <span className="text-slate-400 text-xs font-medium px-2">Add a Task to this Sprint <span className="text-slate-600">(optional)</span></span>
//               <div className="flex-1 h-px bg-white/10" />
//             </div>

//             {/* Task creation sub-form */}
//             {/* <TaskFormFields form={sprintTaskForm} setForm={setSprintTasks} errorMsg={sprintTaskMsg} /> */}
//             {sprintTasks.map((task, index) => (
//   <div key={index}>
//     <TaskFormFields
//       form={task}
//       setForm={(updated) => {
//         const newTasks = [...sprintTasks]
//         newTasks[index] = updated
//         setSprintTasks(newTasks)
//       }}
//       errorMsg=""
//     />
//   </div>
// ))}

// <button
//   onClick={() => setSprintTasks(prev => [...prev, emptyTaskForm()])}
//   className="mt-2 text-blue-400 text-sm"
// >
//   + Add Another Task
// </button>
//             <div className="flex gap-3 mt-6">
//               <button onClick={handleCreateSprint} disabled={creatingSprint}
//                 className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
//                 {creatingSprint ? 'Creating...' : 'Create Sprint'}
//               </button>
//               <button onClick={() => setShowCreateSprint(false)}
//                 className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ManagerProjectDetails

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
import { formatDate } from '../../utils/DateUtils'

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
  planned:   'bg-slate-500/20 text-slate-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const sprintStatusColor = (s) => ({
  planned:   'bg-slate-500/20 text-slate-400 border-slate-500/30',
  active:    'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const calcProgress = (sprint) => {
  const items = sprint.tasks || []
  if (items.length === 0) return 0
  const done = items.filter(t => t.status === 'completed').length
  return Math.round((done / items.length) * 100)
}

// Empty task form factory
const emptyTaskForm = () => ({
  title: '', description: '', module: '', assignedTo: '', testedBy: '',
  priority: 'medium', dueDate: '',
})

const ManagerProjectDetails = () => {
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [project, setProject]               = useState(null)
  const [modules, setModules]               = useState([])
  const [tasks, setTasks]                   = useState([])
  const [sprints, setSprints]               = useState([])
  const [loading, setLoading]               = useState(true)
  const [activeTab, setActiveTab]           = useState('overview')

  // Create Task modal (standalone)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [taskForms, setTaskForms]           = useState([emptyTaskForm()])
  const [taskMsg, setTaskMsg]               = useState('')

  // Add Module modal
  const [showAddModule, setShowAddModule]   = useState(false)
  const [moduleForm, setModuleForm]         = useState({ name: '', description: '' })
  const [moduleMsg, setModuleMsg]           = useState('')

  // Create Sprint modal
  const [showCreateSprint, setShowCreateSprint] = useState(false)
  const [sprintForm, setSprintForm]             = useState({ name: '', startDate: '', endDate: '' })
  const [sprintTasks, setSprintTasks]           = useState([emptyTaskForm()])
  const [sprintMsg, setSprintMsg]               = useState('')
  const [creatingSprint, setCreatingSprint]     = useState(false)

  // Add Task to existing sprint modal
  const [showAddTaskToSprint, setShowAddTaskToSprint] = useState(false)
  const [selectedSprintId, setSelectedSprintId]       = useState(null)
  const [addSprintTaskForms, setAddSprintTaskForms]   = useState([emptyTaskForm()])
  const [addSprintTaskMsg, setAddSprintTaskMsg]       = useState('')
  const [addingSprintTask, setAddingSprintTask]       = useState(false)

  // Inline assign
  const [assigningTask, setAssigningTask]   = useState(null)
  const [assignUserId, setAssignUserId]     = useState('')

  const [toast, setToast] = useState('')

  const navigate    = useNavigate()
  const { id }      = useParams()
  const token       = localStorage.getItem('token')
  const user        = JSON.parse(localStorage.getItem('user') || '{}')
  const authHeaders = { Authorization: `Bearer ${token}` }
  const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }
  const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchAll = async () => {
    try {
      const [pRes, mRes, tRes] = await Promise.all([
        fetch(`http://localhost:3000/projects/${id}`,          { headers: authHeaders }),
        fetch(`http://localhost:3000/modules?projectId=${id}`, { headers: authHeaders }),
        fetch(`http://localhost:3000/tasks?project=${id}`,     { headers: authHeaders }),
      ])
      const safe = async (res) => {
        const ct = res.headers.get('content-type') || ''
        if (!ct.includes('application/json')) return { success: false }
        return res.json()
      }
      const [pData, mData, tData] = await Promise.all([safe(pRes), safe(mRes), safe(tRes)])
      if (pData.success) setProject(pData.data)
      if (mData.success) setModules(mData.data || [])
      if (tData.success) setTasks(tData.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchSprints = async () => {
    try {
      const res  = await fetch(`http://localhost:3000/sprints?projectId=${id}`, { headers: authHeaders })
      const data = await res.json()
      if (data.success) setSprints(data.data || [])
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (id) { fetchAll(); fetchSprints() }
  }, [id])

  // ---------- handlers ----------

  const handleCreateTasks = async () => {
    setTaskMsg('')
    const validForms = taskForms.filter(f => f.title.trim())
    if (validForms.length === 0) { setTaskMsg('At least one task title is required'); return }

    try {
      const results = await Promise.all(validForms.map(form => {
        const payload = {
          title:       form.title.trim(),
          description: form.description.trim(),
          project:     id,
          priority:    form.priority,
          createdBy:   user._id,
          ...(form.module     && { module:     form.module }),
          ...(form.assignedTo && { assignedTo: form.assignedTo }),
          ...(form.testedBy   && { testedBy:   form.testedBy }),
          ...(form.dueDate    && { dueDate:    form.dueDate }),
        }
        return fetch('http://localhost:3000/manager/tasks', {
          method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload)
        }).then(r => r.json())
      }))

      const allOk = results.every(r => r.success)
      if (allOk) {
        setShowCreateTask(false)
        setTaskForms([emptyTaskForm()])
        showToast(`${validForms.length} task${validForms.length > 1 ? 's' : ''} created!`)
        fetchAll()
      } else {
        const failed = results.find(r => !r.success)
        setTaskMsg(failed?.message || 'Some tasks failed to create')
      }
    } catch { setTaskMsg('Server error') }
  }

  const handleAddModule = async () => {
    setModuleMsg('')
    if (!moduleForm.name.trim()) { setModuleMsg('Module name is required'); return }
    try {
      const res  = await fetch('http://localhost:3000/modules', {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({ name: moduleForm.name.trim(), description: moduleForm.description.trim(), project: id, createdBy: user._id })
      })
      const data = await res.json()
      if (data.success) {
        setShowAddModule(false)
        setModuleForm({ name: '', description: '' })
        showToast('Module added!'); fetchAll()
      } else { setModuleMsg(data.message || 'Failed to add module') }
    } catch { setModuleMsg('Server error') }
  }

  const handleCreateSprint = async () => {
    if (!sprintForm.name || !sprintForm.startDate || !sprintForm.endDate) {
      setSprintMsg('All fields required'); return
    }
    setCreatingSprint(true)
    try {
      const sprintRes = await fetch('http://localhost:3000/sprints', {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({
          name: sprintForm.name, project: id,
          startDate: sprintForm.startDate, endDate: sprintForm.endDate,
        })
      })
      const sprintData = await sprintRes.json()
      if (!sprintData.success) { setSprintMsg('Failed to create sprint'); return }

      const sprintId = sprintData.data._id

      for (const task of sprintTasks) {
        if (task.title?.trim()) {
          await fetch('http://localhost:3000/manager/tasks', {
            method: 'POST', headers: jsonHeaders,
            body: JSON.stringify({
              title:       task.title,
              description: task.description,
              project:     id,
              sprint:      sprintId,
              priority:    task.priority,
              createdBy:   user._id,
              ...(task.module     && { module:     task.module }),
              ...(task.assignedTo && { assignedTo: task.assignedTo }),
              ...(task.testedBy   && { testedBy:   task.testedBy }),
              ...(task.dueDate    && { dueDate:    task.dueDate }),
            })
          })
        }
      }

      setShowCreateSprint(false)
      setSprintForm({ name: '', startDate: '', endDate: '' })
      setSprintTasks([emptyTaskForm()])
      showToast('Sprint created!')
      fetchSprints()
      fetchAll()
    } catch { setSprintMsg('Server error') }
    finally { setCreatingSprint(false) }
  }

  // Add task(s) to an EXISTING sprint
  const handleAddTasksToSprint = async () => {
    setAddSprintTaskMsg('')
    const validForms = addSprintTaskForms.filter(f => f.title.trim())
    if (validForms.length === 0) { setAddSprintTaskMsg('At least one task title is required'); return }

    setAddingSprintTask(true)
    try {
      const results = await Promise.all(validForms.map(form => {
        const payload = {
          title:       form.title.trim(),
          description: form.description.trim(),
          project:     id,
          sprint:      selectedSprintId,
          priority:    form.priority,
          createdBy:   user._id,
          ...(form.module     && { module:     form.module }),
          ...(form.assignedTo && { assignedTo: form.assignedTo }),
          ...(form.testedBy   && { testedBy:   form.testedBy }),
          ...(form.dueDate    && { dueDate:    form.dueDate }),
        }
        return fetch('http://localhost:3000/manager/tasks', {
          method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload)
        }).then(r => r.json())
      }))

      const allOk = results.every(r => r.success)
      if (allOk) {
        setShowAddTaskToSprint(false)
        setAddSprintTaskForms([emptyTaskForm()])
        setSelectedSprintId(null)
        showToast(`${validForms.length} task${validForms.length > 1 ? 's' : ''} added to sprint!`)
        fetchSprints()
        fetchAll()
      } else {
        const failed = results.find(r => !r.success)
        setAddSprintTaskMsg(failed?.message || 'Some tasks failed to create')
      }
    } catch { setAddSprintTaskMsg('Server error') }
    finally { setAddingSprintTask(false) }
  }

  const handleAssignTask = async (taskId, userId) => {
    try {
      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT', headers: jsonHeaders,
        body: JSON.stringify({ assignedTo: userId, status: 'assigned' })
      })
      setAssigningTask(null); setAssignUserId(''); fetchAll()
    } catch (err) { console.error(err) }
  }

  const openCreateSprint = () => {
    setShowCreateSprint(true)
    setSprintMsg('')
    setSprintForm({ name: '', startDate: '', endDate: '' })
    setSprintTasks([emptyTaskForm()])
  }

  const openAddTaskToSprint = (sprintId, e) => {
    e.stopPropagation()
    setSelectedSprintId(sprintId)
    setAddSprintTaskForms([emptyTaskForm()])
    setAddSprintTaskMsg('')
    setShowAddTaskToSprint(true)
  }

  const teamMembers    = project?.teamMembers || []
  const developers     = teamMembers.filter(m => typeof m === 'object' && m.role === 'developer')
  const testers        = teamMembers.filter(m => typeof m === 'object' && m.role === 'tester')
  const assignableTeam = [...developers, ...testers]
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const progressPct    = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading project...</p>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Project not found</p>
        <button onClick={() => navigate('/manager/projects')} className="text-blue-400 hover:text-blue-300">← Back</button>
      </div>
    </div>
  )

  // ── Reusable task form fields ──────────────────────────────────────────────
  // FIX: use index-based updater to avoid stale closures / cursor issues
  const TaskFormFields = ({ form, onChange, errorMsg }) => (
    <div className="space-y-4">
      {errorMsg && <p className="text-red-400 text-sm px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{errorMsg}</p>}
      <div>
        <label className="text-slate-400 text-xs mb-1 block">Title <span className="text-red-400">*</span></label>
        <input
          type="text"
          placeholder="Task title..."
          value={form.title}
          onChange={e => onChange({ ...form, title: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="text-slate-400 text-xs mb-1 block">Description</label>
        <textarea
          placeholder="Task description..."
          value={form.description}
          onChange={e => onChange({ ...form, description: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
          rows={3}
        />
      </div>
      <div>
        <label className="text-slate-400 text-xs mb-1 block">Module <span className="text-slate-500">(optional)</span></label>
        <select
          value={form.module}
          onChange={e => onChange({ ...form, module: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">— No module —</option>
          {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Assign Developer <span className="text-slate-500">(optional)</span></label>
          <select
            value={form.assignedTo}
            onChange={e => onChange({ ...form, assignedTo: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">— Unassigned —</option>
            {developers.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>)}
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Assign Tester <span className="text-slate-500">(optional)</span></label>
          <select
            value={form.testedBy}
            onChange={e => onChange({ ...form, testedBy: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">— Unassigned —</option>
            {testers.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Priority</label>
          <select
            value={form.priority}
            onChange={e => onChange({ ...form, priority: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={e => onChange({ ...form, dueDate: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )

  // ── Reusable multi-task form list ──────────────────────────────────────────
  const MultiTaskFormList = ({ forms, setForms, globalErrorMsg }) => (
    <div className="space-y-6">
      {forms.map((form, index) => (
        <div key={index} className="relative">
          {forms.length > 1 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-xs font-medium">Task {index + 1}</span>
              <button
                onClick={() => setForms(prev => prev.filter((_, i) => i !== index))}
                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-500/10 rounded-lg"
              >
                Remove
              </button>
            </div>
          )}
          <TaskFormFields
            form={form}
            onChange={(updated) => setForms(prev => {
              const next = [...prev]
              next[index] = updated
              return next
            })}
            errorMsg={index === 0 ? globalErrorMsg : ''}
          />
          {index < forms.length - 1 && <div className="mt-4 border-b border-white/10" />}
        </div>
      ))}
      <button
        onClick={() => setForms(prev => [...prev, emptyTaskForm()])}
        className="w-full py-2 border border-dashed border-white/20 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 rounded-xl text-sm transition-all"
      >
        + Add Another Task
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        {/* ── Header ── */}
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
            {activeTab === 'sprints' ? (
              <button onClick={openCreateSprint}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                + New Sprint
              </button>
            ) : (
              <button onClick={() => { setShowCreateTask(true); setTaskMsg(''); setTaskForms([emptyTaskForm()]) }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                + Create Task
              </button>
            )}
            <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        {toast && (
          <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
            {toast}
          </div>
        )}

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stats + Progress */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Tasks',  value: tasks.length,                                        color: 'text-white' },
                { label: 'Completed',    value: completedTasks,                                       color: 'text-green-400' },
                { label: 'In Progress',  value: tasks.filter(t => t.status === 'in_progress').length, color: 'text-yellow-400' },
                { label: 'Team Members', value: teamMembers.length,                                   color: 'text-cyan-400' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            {tasks.length > 0 && (
              <div>
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
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'tasks',    label: 'Tasks',   count: tasks.length },
              { key: 'sprints',  label: 'Sprints', count: sprints.length },
              { key: 'modules',  label: 'Modules', count: modules.length },
              { key: 'team',     label: 'Team',    count: teamMembers.length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white/10 text-white border border-white/20 border-b-0' : 'text-slate-400 hover:text-white'}`}>
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">{tab.count}</span>
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
                      <div key={task._id}
                        onClick={() => navigate(`/manager/tasks/${task._id}`)}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
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
                    { label: 'Start Date',  value: formatDate(project.startDate) },
                    { label: 'End Date',    value: formatDate(project.endDate) },
                    { label: 'Created',     value: formatDate(project.createdAt) },
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

          {/* ── TASKS ── */}
          {activeTab === 'tasks' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
              {tasks.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-400 mb-4">No tasks yet</p>
                  <button onClick={() => { setShowCreateTask(true); setTaskMsg(''); setTaskForms([emptyTaskForm()]) }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
                    Create First Task
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Task', 'Status', 'Priority', 'Developer', 'Tester', 'Due', 'Action'].map(h => (
                          <th key={h} className="text-left p-4 text-slate-300 text-sm font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(task => (
                        <tr
                          key={task._id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => navigate(`/manager/tasks/${task._id}`)}
                        >
                          <td className="p-4">
                            <p className="text-white text-sm font-medium hover:text-blue-300 transition-colors">{task.title}</p>
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
                            {task.assignedTo
                              ? <span className="text-slate-300 text-sm">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                              : <span className="text-slate-500 text-sm">—</span>}
                          </td>
                          <td className="p-4">
                            {task.testedBy
                              ? <span className="text-slate-300 text-sm">{task.testedBy.firstName} {task.testedBy.lastName}</span>
                              : <span className="text-slate-500 text-sm">—</span>}
                          </td>
                          <td className="p-4 text-slate-400 text-sm">{formatDate(task.dueDate, '—')}</td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            {assignableTeam.length > 0 && (
                              assigningTask === task._id ? (
                                <div className="flex items-center gap-2">
                                  <select value={assignUserId} onChange={e => setAssignUserId(e.target.value)}
                                    className="px-2 py-1 bg-slate-800 border border-white/20 rounded-lg text-white text-xs focus:outline-none">
                                    <option value="">— Select —</option>
                                    <optgroup label="Developers">
                                      {developers.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>)}
                                    </optgroup>
                                    <optgroup label="Testers">
                                      {testers.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>)}
                                    </optgroup>
                                  </select>
                                  <button onClick={() => assignUserId && handleAssignTask(task._id, assignUserId)}
                                    className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs">✓</button>
                                  <button onClick={() => { setAssigningTask(null); setAssignUserId('') }}
                                    className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs">✕</button>
                                </div>
                              ) : (
                                <button onClick={() => { setAssigningTask(task._id); setAssignUserId(task.assignedTo?._id || '') }}
                                  className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">
                                  {task.assignedTo ? 'Reassign' : 'Assign'}
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SPRINTS ── */}
          {activeTab === 'sprints' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Sprints</h2>
                <button onClick={openCreateSprint}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Sprint
                </button>
              </div>

              {sprints.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-1">No sprints yet</p>
                  <p className="text-slate-400 text-sm mb-4">Create your first sprint for this project</p>
                  <button onClick={openCreateSprint}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
                    Create First Sprint
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sprints.map(sprint => {
                    const progress   = calcProgress(sprint)
                    const totalItems = sprint.tasks?.length || 0
                    const doneItems  = sprint.tasks?.filter(t => t.status === 'completed').length || 0
                    const now        = new Date()
                    const end        = sprint.endDate ? new Date(sprint.endDate) : null
                    const daysLeft   = end ? Math.ceil((end - now) / (1000 * 60 * 60 * 24)) : null
                    const isOver     = end ? now > end : false

                    return (
                      <div key={sprint._id}
                        onClick={() => navigate(`/manager/sprints/${sprint._id}`)}
                        className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/15 hover:border-blue-500/40 transition-all group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">{sprint.name}</h3>
                              <p className="text-slate-400 text-xs">{totalItems} task{totalItems !== 1 ? 's' : ''} assigned</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Add Task button */}
                            <button
                              onClick={(e) => openAddTaskToSprint(sprint._id, e)}
                              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Add Task
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                              <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-green-400' : progress > 50 ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                              <span className="text-white text-sm font-bold">{progress}%</span>
                              <span className="text-slate-400 text-xs">done</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${sprintStatusColor(sprint.status)}`}>
                              {sprint.status || 'planned'}
                            </span>
                            <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            { label: 'Start', value: sprint.startDate ? new Date(sprint.startDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                            { label: 'End',   value: sprint.endDate   ? new Date(sprint.endDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                            { label: isOver ? 'Status' : 'Time Left', value: isOver ? 'Overdue' : daysLeft !== null ? `${daysLeft}d left` : '—' },
                          ].map(({ label, value }) => (
                            <div key={label} className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                              <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                              <p className={`text-sm font-medium ${label !== 'Start' && label !== 'End' && isOver ? 'text-red-400' : 'text-white'}`}>{value}</p>
                            </div>
                          ))}
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                            <span>Work Completion</span>
                            <span>{doneItems} / {totalItems} tasks done</span>
                          </div>
                          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                progress >= 50  ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                                'bg-gradient-to-r from-blue-500 to-cyan-400'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── MODULES ── */}
          {activeTab === 'modules' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Modules</h2>
                <button onClick={() => setShowAddModule(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                  + Add Module
                </button>
              </div>
              {modules.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400 mb-4">No modules yet</p>
                  <button onClick={() => setShowAddModule(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
                    Add First Module
                  </button>
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

          {/* ── TEAM ── */}
          {activeTab === 'team' && (
            <div>
              {teamMembers.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400 mb-4">No team members assigned yet</p>
                  <button onClick={() => navigate('/manager/team')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
                    Go to Team Management
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map(member => {
                    const m         = typeof member === 'object' ? member : { _id: member }
                    const userTasks = tasks.filter(t => (t.assignedTo?._id || t.assignedTo) === m._id)
                    const userDone  = userTasks.filter(t => t.status === 'completed').length
                    return (
                      <div key={m._id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-gradient-to-r ${m.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
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
                            <span className="text-slate-400">Tasks</span>
                            <span className="text-white">{userTasks.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Completed</span>
                            <span className="text-green-400">{userDone}</span>
                          </div>
                        </div>
                        {userTasks.length > 0 && (
                          <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                              style={{ width: `${Math.round((userDone / userTasks.length) * 100)}%` }} />
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

      {/* ════════════════════════════════════════
          Modal — Create Task (standalone)
      ════════════════════════════════════════ */}
      {showCreateTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Create Task{taskForms.length > 1 ? `s (${taskForms.length})` : ''}
              </h2>
              <button onClick={() => { setShowCreateTask(false); setTaskMsg(''); setTaskForms([emptyTaskForm()]) }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <MultiTaskFormList forms={taskForms} setForms={setTaskForms} globalErrorMsg={taskMsg} />

            <div className="flex gap-3 mt-4">
              <button onClick={handleCreateTasks}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
                Create {taskForms.length > 1 ? `${taskForms.length} Tasks` : 'Task'}
              </button>
              <button onClick={() => { setShowCreateTask(false); setTaskMsg(''); setTaskForms([emptyTaskForm()]) }}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          Modal — Add Module
      ════════════════════════════════════════ */}
      {showAddModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Module</h2>
              <button onClick={() => { setShowAddModule(false); setModuleMsg('') }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {moduleMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{moduleMsg}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Module Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. Authentication, Dashboard..."
                  value={moduleForm.name} onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Description <span className="text-slate-500">(optional)</span></label>
                <textarea placeholder="Module description..."
                  value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddModule}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
                Add Module
              </button>
              <button onClick={() => { setShowAddModule(false); setModuleMsg('') }}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          Modal — Create Sprint
      ════════════════════════════════════════ */}
      {showCreateSprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Create Sprint</h2>
                <p className="text-slate-400 text-xs mt-0.5">{project.name}</p>
              </div>
              <button onClick={() => setShowCreateSprint(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {sprintMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{sprintMsg}</p>}

            {/* Sprint details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-slate-300 text-sm mb-1.5 block">Sprint Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. Sprint 1 — Auth Module"
                  value={sprintForm.name} onChange={e => setSprintForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm mb-1.5 block">Start Date <span className="text-red-400">*</span></label>
                  <input type="date" value={sprintForm.startDate}
                    onChange={e => setSprintForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-slate-300 text-sm mb-1.5 block">End Date <span className="text-red-400">*</span></label>
                  <input type="date" value={sprintForm.endDate} min={sprintForm.startDate || undefined}
                    onChange={e => setSprintForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Optional task section */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-400 text-xs font-medium px-2">Add Tasks <span className="text-slate-600">(optional)</span></span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <MultiTaskFormList forms={sprintTasks} setForms={setSprintTasks} globalErrorMsg="" />

            <div className="flex gap-3 mt-6">
              <button onClick={handleCreateSprint} disabled={creatingSprint}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                {creatingSprint ? 'Creating...' : 'Create Sprint'}
              </button>
              <button onClick={() => setShowCreateSprint(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          Modal — Add Task to Existing Sprint
      ════════════════════════════════════════ */}
      {showAddTaskToSprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Add Task to Sprint</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  {sprints.find(s => s._id === selectedSprintId)?.name || ''}
                </p>
              </div>
              <button onClick={() => { setShowAddTaskToSprint(false); setSelectedSprintId(null) }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <MultiTaskFormList forms={addSprintTaskForms} setForms={setAddSprintTaskForms} globalErrorMsg={addSprintTaskMsg} />

            <div className="flex gap-3 mt-6">
              <button onClick={handleAddTasksToSprint} disabled={addingSprintTask}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                {addingSprintTask ? 'Adding...' : `Add ${addSprintTaskForms.filter(f => f.title.trim()).length || ''} Task${addSprintTaskForms.length > 1 ? 's' : ''}`}
              </button>
              <button onClick={() => { setShowAddTaskToSprint(false); setSelectedSprintId(null) }}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">
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