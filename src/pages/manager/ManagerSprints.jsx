// // ManagerSprints.jsx - UPDATED with bugs, timeline, % completion
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
// import { successToast, errorToast } from '../../utils/toast'
// import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

// const statusColor = (s) => ({
//   planned:   'bg-slate-500/20 text-slate-400 border-slate-500/30',
//   active:    'bg-green-500/20 text-green-400 border-green-500/30',
//   completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
// }[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

// // Calculate % completion for a sprint
// const calcProgress = (sprint) => {
//   const items = sprint.tasks || []
//   if (items.length === 0) return 0
//   const done = items.filter(t => t.status === 'completed').length
//   return Math.round((done / items.length) * 100)
// }

// // Sprint timeline bar
// const SprintTimeline = ({ startDate, endDate }) => {
//   if (!startDate || !endDate) return null
//   const start = new Date(startDate)
//   const end   = new Date(endDate)
//   const now   = new Date()
//   const total = end - start
//   const elapsed = Math.min(Math.max(now - start, 0), total)
//   const pct = total > 0 ? Math.round((elapsed / total) * 100) : 0
//   const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
//   const isOver   = now > end
//   const mlClass = useSidebarCollapsed('managerSidebarCollapsed')

//   return (
//     <div className="mt-4">
//       <div className="flex justify-between text-xs text-slate-400 mb-1">
//         <span>{new Date(startDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
//         <span className={isOver ? 'text-red-400' : daysLeft <= 3 ? 'text-yellow-400' : 'text-slate-400'}>
//           {isOver ? 'Overdue' : `${daysLeft}d left`}
//         </span>
//         <span>{new Date(endDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
//       </div>
//       <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
//         {/* Time elapsed bar */}
//         <div
//           className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
//           style={{ width: `${pct}%` }}
//         />
//       </div>
//       <p className="text-xs text-slate-500 mt-1">{pct}% of sprint time elapsed</p>
//     </div>
//   )
// }

// const ManagerSprint = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [projects, setProjects]       = useState([])
//   const [project, setProject]         = useState('')
//   const [sprints, setSprints]         = useState([])
//   const [tasks, setTasks]             = useState([])
//   const [bugs, setBugs]               = useState([])  // NEW
//   const [selectedItems, setSelectedItems] = useState([]) // tasks + bugs combined
//   const [loading, setLoading]         = useState(false)
//   const [loadingData, setLoadingData] = useState(false)
//   const [showCreate, setShowCreate]   = useState(false)
//   const [form, setForm]               = useState({ name: '', startDate: '', endDate: '' })
//   const [formError, setFormError]     = useState('')
//   const [itemType, setItemType]       = useState('tasks') // 'tasks' | 'bugs'

//   const navigate = useNavigate()
//   const token    = localStorage.getItem('token')
//   const config   = { headers: { Authorization: `Bearer ${token}` } }

//   const handleLogout = () => { localStorage.clear(); navigate('/') }

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get('http://localhost:3000/manager/projects', config)
//         const list = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.projects || [])
//         setProjects(list)
//       } catch (err) { console.error(err) }
//     }
//     fetchProjects()
//   }, [])

//   useEffect(() => {
//     if (!project) { setSprints([]); setTasks([]); setBugs([]); return }
//     const loadData = async () => {
//       setLoadingData(true)
//       try {
//         const [sprintRes, taskRes, bugRes] = await Promise.all([
//           axios.get(`http://localhost:3000/sprints?projectId=${project}`, config),
//           axios.get(`http://localhost:3000/manager/tasks`, config),
//           axios.get(`http://localhost:3000/manager/bugs`, config),
//         ])
//         // Populate sprint tasks for progress calculation
//         const rawSprints = sprintRes.data?.data || []
//         // fetch each sprint's details for progress
//         const detailedSprints = await Promise.all(
//           rawSprints.map(async (s) => {
//             try {
//               const r = await axios.get(`http://localhost:3000/sprints/${s._id}`, config)
//               return r.data?.data || s
//             } catch { return s }
//           })
//         )
//         setSprints(detailedSprints)

//         const allTasks = taskRes.data?.data || []
//         setTasks(allTasks.filter(t => (t.project?._id || t.project) === project))

//         const allBugs = bugRes.data?.data || []
//         setBugs(allBugs.filter(b => {
//           const taskProject = b.task?.project?._id || b.task?.project
//           return taskProject === project
//         }))
//       } catch (err) { console.error(err) }
//       finally { setLoadingData(false) }
//     }
//     loadData()
//   }, [project])

//   const handleSelectItem = (id) => {
//     setSelectedItems(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     )
//   }

//   const handleCreateSprint = async () => {
//     setFormError('')
//     if (!form.name.trim())  { setFormError('Sprint name is required'); return }
//     if (!project)           { setFormError('Please select a project'); return }
//     if (!form.startDate)    { setFormError('Start date is required'); return }
//     if (!form.endDate)      { setFormError('End date is required'); return }
//     if (new Date(form.endDate) < new Date(form.startDate)) {
//       setFormError('End date cannot be before start date'); return
//     }

//     setLoading(true)
//     try {
//       await axios.post('http://localhost:3000/sprints', {
//         name:      form.name.trim(),
//         project,
//         startDate: form.startDate,
//         endDate:   form.endDate,
//         tasks:     selectedItems,
//       }, config)

//       successToast('Sprint created successfully!')
//       setForm({ name: '', startDate: '', endDate: '' })
//       setSelectedItems([])
//       setShowCreate(false)

//       const res = await axios.get(`http://localhost:3000/sprints?projectId=${project}`, config)
//       setSprints(res.data?.data || [])
//     } catch (err) {
//       errorToast(err.response?.data?.message || 'Failed to create sprint')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const sprintStats = {
//     total:     sprints.length,
//     active:    sprints.filter(s => s.status === 'active').length,
//     planned:   sprints.filter(s => s.status === 'planned').length,
//     completed: sprints.filter(s => s.status === 'completed').length,
//   }

//   // Items to show in modal based on selected tab
//   const modalItems = itemType === 'tasks' ? tasks : bugs

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//       </div>

//       <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>
//         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Sprints</h1>
//               <p className="text-slate-300 text-sm">Plan and track sprint cycles</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => { setShowCreate(true); setFormError(''); setSelectedItems([]) }}
//               disabled={!project}
//               className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               New Sprint
//             </button>
//             <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Logout</button>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10 space-y-6">

//           {/* Project selector */}
//           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//               <div className="flex-1">
//                 <label className="text-slate-300 text-sm font-medium mb-2 block">Select Project</label>
//                 <select
//                   value={project}
//                   onChange={e => { setProject(e.target.value); setSelectedItems([]) }}
//                   className="w-full sm:w-80 px-3 py-2.5 bg-slate-800 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
//                   <option value="">— Choose a project —</option>
//                   {projects.map(p => (
//                     <option key={p._id} value={p._id}>{p.name} ({p.projectKey})</option>
//                   ))}
//                 </select>
//               </div>
//               {project && (
//                 <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
//                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
//                   <span className="text-blue-400 text-sm font-medium">
//                     {projects.find(p => p._id === project)?.name}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Stats */}
//           {project && (
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               {[
//                 { label: 'Total Sprints', value: sprintStats.total,     color: 'from-blue-500 to-cyan-500' },
//                 { label: 'Active',        value: sprintStats.active,    color: 'from-green-500 to-emerald-500' },
//                 { label: 'Planned',       value: sprintStats.planned,   color: 'from-slate-500 to-slate-600' },
//                 { label: 'Completed',     value: sprintStats.completed, color: 'from-purple-500 to-pink-500' },
//               ].map((s, i) => (
//                 <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
//                   <p className="text-slate-300 text-sm mb-1">{s.label}</p>
//                   <p className="text-3xl font-bold text-white">{s.value}</p>
//                   <div className={`w-8 h-1 bg-gradient-to-r ${s.color} rounded-full mt-2`} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Sprint list */}
//           {project && (
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-white">Sprint List</h2>
//                 <span className="text-slate-400 text-sm">{sprints.length} sprints</span>
//               </div>

//               {loadingData ? (
//                 <div className="flex items-center justify-center py-12">
//                   <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
//                 </div>
//               ) : sprints.length === 0 ? (
//                 <div className="text-center py-12">
//                   <p className="text-slate-400 text-sm">No sprints yet. Create your first sprint!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-5">
//                   {sprints.map(sprint => {
//                     const progress   = calcProgress(sprint)
//                     const totalItems = sprint.tasks?.length || 0
//                     const doneItems  = sprint.tasks?.filter(t => t.status === 'completed').length || 0

//                     return (
//                       <div key={sprint._id} className="bg-white/5 rounded-xl p-5 border border-white/10">
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
//                               <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                               </svg>
//                             </div>
//                             <div>
//                               <h3 className="text-white font-semibold">{sprint.name}</h3>
//                               <p className="text-slate-400 text-xs">{totalItems} item{totalItems !== 1 ? 's' : ''} assigned</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-3">
//                             {/* % completion badge */}
//                             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
//                               <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-green-400' : progress > 50 ? 'bg-yellow-400' : 'bg-blue-400'}`} />
//                               <span className="text-white text-sm font-bold">{progress}%</span>
//                               <span className="text-slate-400 text-xs">done</span>
//                             </div>
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor(sprint.status)}`}>
//                               {sprint.status || 'planned'}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Dates */}
//                         <div className="grid grid-cols-3 gap-3 mb-4">
//                           {[
//                             { label: 'Start', value: sprint.startDate ? new Date(sprint.startDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
//                             { label: 'End',   value: sprint.endDate   ? new Date(sprint.endDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
//                             { label: 'Duration', value: sprint.startDate && sprint.endDate ? `${Math.ceil((new Date(sprint.endDate) - new Date(sprint.startDate)) / (1000 * 60 * 60 * 24))} days` : '—' },
//                           ].map(({ label, value }) => (
//                             <div key={label} className="p-2.5 bg-white/5 rounded-lg border border-white/10">
//                               <p className="text-slate-500 text-xs mb-0.5">{label}</p>
//                               <p className="text-white text-sm font-medium">{value}</p>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Timeline bar */}
//                         <SprintTimeline startDate={sprint.startDate} endDate={sprint.endDate} />

//                         {/* Progress bar (task completion) */}
//                         <div className="mt-4">
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
//                           <p className="text-right text-xs text-slate-400 mt-1">{progress}% complete</p>
//                         </div>

//                       </div>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Empty state */}
//           {!project && (
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
//               <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-5">
//                 <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <h3 className="text-white font-semibold text-lg mb-2">Select a Project</h3>
//               <p className="text-slate-400 text-sm">Choose a project above to view and manage its sprints</p>
//             </div>
//           )}

//         </main>
//       </div>

//       {/* CREATE SPRINT MODAL */}
//       {showCreate && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">

//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-xl font-bold text-white">Create Sprint</h2>
//                 <p className="text-slate-400 text-xs mt-0.5">{projects.find(p => p._id === project)?.name}</p>
//               </div>
//               <button onClick={() => { setShowCreate(false); setFormError('') }} className="text-slate-400 hover:text-white">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {formError && (
//               <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{formError}</p>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="text-slate-300 text-sm mb-1.5 block">Sprint Name <span className="text-red-400">*</span></label>
//                 <input type="text" placeholder="e.g. Sprint 1 — Auth Module"
//                   value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
//                   className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-slate-300 text-sm mb-1.5 block">Start Date <span className="text-red-400">*</span></label>
//                   <input type="date" value={form.startDate}
//                     onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
//                     className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm mb-1.5 block">End Date <span className="text-red-400">*</span></label>
//                   <input type="date" value={form.endDate} min={form.startDate || undefined}
//                     onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
//                     className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
//                 </div>
//               </div>

//               {/* Assign items — Tasks or Bugs tab */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="text-slate-300 text-sm">Assign to Sprint</label>
//                   {selectedItems.length > 0 && (
//                     <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
//                       {selectedItems.length} selected
//                     </span>
//                   )}
//                 </div>

//                 {/* Tab switcher */}
//                 <div className="flex gap-2 mb-3">
//                   {['tasks', 'bugs'].map(t => (
//                     <button key={t} onClick={() => setItemType(t)}
//                       className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
//                         itemType === t
//                           ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40'
//                           : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
//                       }`}>
//                       {t === 'tasks' ? `📋 Tasks (${tasks.length})` : `🐛 Bugs (${bugs.length})`}
//                     </button>
//                   ))}
//                 </div>

//                 {modalItems.length === 0 ? (
//                   <div className="px-4 py-6 bg-white/5 border border-white/10 rounded-xl text-center">
//                     <p className="text-slate-400 text-sm">No {itemType} available for this project</p>
//                   </div>
//                 ) : (
//                   <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden">
//                     {modalItems.map((item, idx) => {
//                       const id    = item._id
//                       const label = itemType === 'tasks' ? item.title : item.comment
//                       const key   = itemType === 'tasks' ? item.issueKey : item.task?.issueKey
//                       const prio  = itemType === 'tasks' ? item.priority : item.bugSeverity
//                       const prioColor = {
//                         high: 'bg-red-500/20 text-red-400', urgent: 'bg-red-600/30 text-red-300',
//                         medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400',
//                         critical: 'bg-red-600/30 text-red-300'
//                       }[prio] || 'bg-slate-500/20 text-slate-400'

//                       return (
//                         <label key={id}
//                           className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors ${idx !== 0 ? 'border-t border-white/5' : ''} ${selectedItems.includes(id) ? 'bg-blue-500/5' : ''}`}>
//                           <div
//                             className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${selectedItems.includes(id) ? 'bg-blue-500 border-blue-500' : 'border-white/30'}`}
//                             onClick={() => handleSelectItem(id)}>
//                             {selectedItems.includes(id) && (
//                               <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                               </svg>
//                             )}
//                           </div>
//                           <input type="checkbox" className="hidden" checked={selectedItems.includes(id)} onChange={() => handleSelectItem(id)} />
//                           <div className="flex-1 min-w-0">
//                             <p className="text-white text-sm truncate">{label}</p>
//                             <p className="text-slate-500 text-xs font-mono">{key || '—'}</p>
//                           </div>
//                           <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${prioColor}`}>{prio}</span>
//                         </label>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button onClick={handleCreateSprint} disabled={loading}
//                 className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
//                     </svg>
//                     Creating...
//                   </span>
//                 ) : 'Create Sprint'}
//               </button>
//               <button onClick={() => { setShowCreate(false); setFormError(''); setSelectedItems([]) }}
//                 className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ManagerSprint

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
import { successToast, errorToast } from '../../utils/toast'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const statusColor = (s) => ({
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

// ─── Active Sprint Hero Card ───────────────────────────────────────────────
const ActiveSprintCard = ({ sprint, onClick }) => {
  const progress   = calcProgress(sprint)
  const totalItems = sprint.tasks?.length || 0
  const doneItems  = sprint.tasks?.filter(t => t.status === 'completed').length || 0
  const start      = new Date(sprint.startDate)
  const end        = new Date(sprint.endDate)
  const now        = new Date()
  const total      = end - start
  const elapsed    = Math.min(Math.max(now - start, 0), total)
  const timePct    = total > 0 ? Math.round((elapsed / total) * 100) : 0
  const daysLeft   = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  const isOver     = now > end

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 via-cyan-500/5 to-transparent p-6 cursor-pointer hover:border-green-400/50 transition-all duration-200"
    >
      {/* Active pulse badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 text-xs font-medium">Active</span>
      </div>

      <div className="flex items-start gap-4 mb-5 pr-20">
        <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-0.5">Current Sprint</p>
          <h3 className="text-white font-bold text-lg leading-tight">{sprint.name}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{totalItems} tasks assigned</p>
        </div>
      </div>

      {/* Date row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Start', value: start.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) },
          { label: 'End',   value: end.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) },
          { label: isOver ? 'Overdue' : 'Remaining', value: isOver ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`, danger: isOver },
        ].map(({ label, value, danger }) => (
          <div key={label} className="p-2.5 bg-white/5 rounded-xl border border-white/10">
            <p className="text-slate-500 text-xs mb-0.5">{label}</p>
            <p className={`text-sm font-semibold ${danger ? 'text-red-400' : 'text-white'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Time elapsed bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Time elapsed</span>
          <span className={isOver ? 'text-red-400' : ''}>{timePct}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`}
            style={{ width: `${timePct}%` }}
          />
        </div>
      </div>

      {/* Work completion bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Work completion</span>
          <span>{doneItems} / {totalItems} tasks</span>
        </div>
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
              progress >= 50  ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
              'bg-gradient-to-r from-green-500 to-cyan-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-slate-500 mt-1">{progress}% complete</p>
      </div>
    </div>
  )
}

// ─── Compact Sprint Row ────────────────────────────────────────────────────
const SprintRow = ({ sprint, onClick }) => {
  const progress   = calcProgress(sprint)
  const totalItems = sprint.tasks?.length || 0

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-150 group"
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      {/* Name + tasks */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{sprint.name}</p>
        <p className="text-slate-500 text-xs">{totalItems} task{totalItems !== 1 ? 's' : ''}</p>
      </div>

      {/* Mini progress bar */}
      <div className="w-24 hidden sm:block">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full rounded-full ${
              progress === 100 ? 'bg-green-400' :
              progress >= 50  ? 'bg-yellow-400' : 'bg-blue-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs text-right">{progress}%</p>
      </div>

      {/* Dates */}
      <div className="text-right hidden md:block shrink-0">
        <p className="text-white text-xs font-medium">
          {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString([], { day: '2-digit', month: 'short' }) : '—'}
          {' – '}
          {sprint.endDate   ? new Date(sprint.endDate).toLocaleDateString([],   { day: '2-digit', month: 'short' }) : '—'}
        </p>
      </div>

      {/* Status badge */}
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${statusColor(sprint.status)}`}>
        {sprint.status || 'planned'}
      </span>

      {/* Arrow */}
      <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

// ─── Create Sprint Modal (stable top-level component — prevents cursor jump) ──
const CreateSprintModal = ({
  show, onClose, onSubmit,
  form, setForm, formError,
  loading, tasks, bugs, selectedItems,
  onSelectItem, itemType, setItemType,
  projectName,
}) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Create Sprint</h2>
            <p className="text-slate-400 text-xs mt-0.5">{projectName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {formError && (
          <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{formError}</p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm mb-1.5 block">Sprint Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. Sprint 1 — Auth Module"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Start Date <span className="text-red-400">*</span></label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">End Date <span className="text-red-400">*</span></label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || undefined}
                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 text-sm">Assign to Sprint</label>
              {selectedItems.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {selectedItems.length} selected
                </span>
              )}
            </div>

            <div className="flex gap-2 mb-3">
              {['tasks', 'bugs'].map(t => (
                <button key={t} onClick={() => setItemType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    itemType === t
                      ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}>
                  {t === 'tasks' ? `📋 Tasks (${tasks.length})` : `🐛 Bugs (${bugs.length})`}
                </button>
              ))}
            </div>

            {(itemType === 'tasks' ? tasks : bugs).length === 0 ? (
              <div className="px-4 py-6 bg-white/5 border border-white/10 rounded-xl text-center">
                <p className="text-slate-400 text-sm">No {itemType} available for this project</p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {(itemType === 'tasks' ? tasks : bugs).map((item, idx) => {
                  const id         = item._id
                  const label      = itemType === 'tasks' ? item.title : item.comment
                  const key        = itemType === 'tasks' ? item.issueKey : item.task?.issueKey
                  const prio       = itemType === 'tasks' ? item.priority : item.bugSeverity
                  const prioColor  = {
                    high: 'bg-red-500/20 text-red-400', urgent: 'bg-red-600/30 text-red-300',
                    medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400',
                    critical: 'bg-red-600/30 text-red-300'
                  }[prio] || 'bg-slate-500/20 text-slate-400'
                  const checked    = selectedItems.includes(id)

                  return (
                    <label key={id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors ${idx !== 0 ? 'border-t border-white/5' : ''} ${checked ? 'bg-blue-500/5' : ''}`}>
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-blue-500 border-blue-500' : 'border-white/30'}`}
                        onClick={() => onSelectItem(id)}>
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" className="hidden" checked={checked} onChange={() => onSelectItem(id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{label}</p>
                        <p className="text-slate-500 text-xs font-mono">{key || '—'}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${prioColor}`}>{prio}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onSubmit} disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Creating...
              </span>
            ) : 'Create Sprint'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────
const ManagerSprint = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projects, setProjects]       = useState([])
  const [project, setProject]         = useState('')
  const [sprints, setSprints]         = useState([])
  const [tasks, setTasks]             = useState([])
  const [bugs, setBugs]               = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading]         = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [showCreate, setShowCreate]   = useState(false)
  const [form, setForm]               = useState({ name: '', startDate: '', endDate: '' })
  const [formError, setFormError]     = useState('')
  const [itemType, setItemType]       = useState('tasks')

  const navigate = useNavigate()
  const token    = localStorage.getItem('token')
  const config   = { headers: { Authorization: `Bearer ${token}` } }
  const mlClass  = useSidebarCollapsed('managerSidebarCollapsed')

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res  = await axios.get('http://localhost:3000/manager/projects', config)
        const list = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.projects || [])
        setProjects(list)
      } catch (err) { console.error(err) }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    if (!project) { setSprints([]); setTasks([]); setBugs([]); return }
    const loadData = async () => {
      setLoadingData(true)
      try {
        const [sprintRes, taskRes, bugRes] = await Promise.all([
          axios.get(`http://localhost:3000/sprints?projectId=${project}`, config),
          axios.get(`http://localhost:3000/manager/tasks`, config),
          axios.get(`http://localhost:3000/manager/bugs`, config),
        ])
        const rawSprints = sprintRes.data?.data || []
        const detailedSprints = await Promise.all(
          rawSprints.map(async (s) => {
            try {
              const r = await axios.get(`http://localhost:3000/sprints/${s._id}`, config)
              return r.data?.data || s
            } catch { return s }
          })
        )
        setSprints(detailedSprints)

        const allTasks = taskRes.data?.data || []
        setTasks(allTasks.filter(t => (t.project?._id || t.project) === project))

        const allBugs = bugRes.data?.data || []
        setBugs(allBugs.filter(b => {
          const taskProject = b.task?.project?._id || b.task?.project
          return taskProject === project
        }))
      } catch (err) { console.error(err) }
      finally { setLoadingData(false) }
    }
    loadData()
  }, [project])

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleCreateSprint = async () => {
    setFormError('')
    if (!form.name.trim())  { setFormError('Sprint name is required'); return }
    if (!project)           { setFormError('Please select a project'); return }
    if (!form.startDate)    { setFormError('Start date is required'); return }
    if (!form.endDate)      { setFormError('End date is required'); return }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setFormError('End date cannot be before start date'); return
    }

    setLoading(true)
    try {
      await axios.post('http://localhost:3000/sprints', {
        name:      form.name.trim(),
        project,
        startDate: form.startDate,
        endDate:   form.endDate,
        tasks:     selectedItems,
      }, config)

      successToast('Sprint created successfully!')
      setForm({ name: '', startDate: '', endDate: '' })
      setSelectedItems([])
      setShowCreate(false)

      // Reload sprints
      const res = await axios.get(`http://localhost:3000/sprints?projectId=${project}`, config)
      const rawSprints = res.data?.data || []
      const detailedSprints = await Promise.all(
        rawSprints.map(async (s) => {
          try {
            const r = await axios.get(`http://localhost:3000/sprints/${s._id}`, config)
            return r.data?.data || s
          } catch { return s }
        })
      )
      setSprints(detailedSprints)
    } catch (err) {
      errorToast(err.response?.data?.message || 'Failed to create sprint')
    } finally {
      setLoading(false)
    }
  }

  // Separate active sprint from the rest
  const activeSprint    = sprints.find(s => s.status === 'active')
  const otherSprints    = sprints.filter(s => s.status !== 'active')
  const plannedSprints  = otherSprints.filter(s => s.status === 'planned' || !s.status)
  const completedSprints= otherSprints.filter(s => s.status === 'completed')

  const sprintStats = {
    total:     sprints.length,
    active:    sprints.filter(s => s.status === 'active').length,
    planned:   sprints.filter(s => s.status === 'planned').length,
    completed: sprints.filter(s => s.status === 'completed').length,
  }

  const handleSprintClick = (sprintId) => {
    navigate(`/manager/sprints/${sprintId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen`}>

        {/* Header */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Sprints</h1>
              <p className="text-slate-300 text-sm">Plan and track sprint cycles</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowCreate(true); setFormError(''); setSelectedItems([]) }}
              disabled={!project}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Sprint
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Logout</button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Project selector */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="text-slate-300 text-sm font-medium mb-2 block">Select Project</label>
                <select
                  value={project}
                  onChange={e => { setProject(e.target.value); setSelectedItems([]) }}
                  className="w-full sm:w-80 px-3 py-2.5 bg-slate-800 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">— Choose a project —</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name} ({p.projectKey})</option>
                  ))}
                </select>
              </div>
              {project && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-blue-400 text-sm font-medium">
                    {projects.find(p => p._id === project)?.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {project && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Sprints', value: sprintStats.total,     color: 'from-blue-500 to-cyan-500' },
                { label: 'Active',        value: sprintStats.active,    color: 'from-green-500 to-emerald-500' },
                { label: 'Planned',       value: sprintStats.planned,   color: 'from-slate-500 to-slate-600' },
                { label: 'Completed',     value: sprintStats.completed, color: 'from-purple-500 to-pink-500' },
              ].map((s, i) => (
                <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                  <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <div className={`w-8 h-1 bg-gradient-to-r ${s.color} rounded-full mt-2`} />
                </div>
              ))}
            </div>
          )}

          {/* Sprint content */}
          {project && (
            loadingData ? (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sprints.length === 0 ? (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-white font-medium mb-1">No sprints yet</p>
                <p className="text-slate-400 text-sm">Click "New Sprint" to create your first one</p>
              </div>
            ) : (
              <div className="space-y-6">

                {/* ── Active Sprint ── */}
                {activeSprint && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Current Sprint</p>
                    <ActiveSprintCard sprint={activeSprint} onClick={() => handleSprintClick(activeSprint._id)} />
                  </div>
                )}

                {/* ── Planned Sprints ── */}
                {plannedSprints.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Upcoming</p>
                      <span className="text-xs text-slate-500">{plannedSprints.length} sprint{plannedSprints.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                      {plannedSprints.map(sprint => (
                        <SprintRow key={sprint._id} sprint={sprint} onClick={() => handleSprintClick(sprint._id)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Completed Sprints ── */}
                {completedSprints.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Completed</p>
                      <span className="text-xs text-slate-500">{completedSprints.length} sprint{completedSprints.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5 opacity-75">
                      {completedSprints.map(sprint => (
                        <SprintRow key={sprint._id} sprint={sprint} onClick={() => handleSprintClick(sprint._id)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* If no active sprint but there are sprints */}
                {!activeSprint && sprints.length > 0 && plannedSprints.length === 0 && completedSprints.length === 0 && (
                  <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                    {sprints.map(sprint => (
                      <SprintRow key={sprint._id} sprint={sprint} onClick={() => handleSprintClick(sprint._id)} />
                    ))}
                  </div>
                )}

              </div>
            )
          )}

          {/* Empty state — no project selected */}
          {!project && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Select a Project</h3>
              <p className="text-slate-400 text-sm">Choose a project above to view and manage its sprints</p>
            </div>
          )}

        </main>
      </div>


      <CreateSprintModal
        show={showCreate}
        onClose={() => { setShowCreate(false); setFormError(''); setSelectedItems([]) }}
        onSubmit={handleCreateSprint}
        form={form}
        setForm={setForm}
        formError={formError}
        loading={loading}
        tasks={tasks}
        bugs={bugs}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        itemType={itemType}
        setItemType={setItemType}
        projectName={projects.find(p => p._id === project)?.name}
      />
    </div>
  )
}

export default ManagerSprint