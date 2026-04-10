// // import { useState, useEffect } from 'react'
// // import { useNavigate, Link } from 'react-router-dom'
// // import DeveloperSidebar from '../../components/developer/DeveloperSidebar'
// // import NotificationBell from '../../components/NotificationBell'

// // const priorityColor = (p) => ({
// //   high:   'bg-red-500/20 text-red-400',
// //   medium: 'bg-yellow-500/20 text-yellow-400',
// //   low:    'bg-green-500/20 text-green-400',
// //   urgent: 'bg-red-600/30 text-red-300',
// // }[p] || 'bg-slate-500/20 text-slate-400')

// // const severityColor = (s) => ({
// //   critical: 'bg-red-500/20 text-red-400',
// //   high:     'bg-orange-500/20 text-orange-400',
// //   medium:   'bg-yellow-500/20 text-yellow-400',
// //   low:      'bg-green-500/20 text-green-400',
// // }[s] || 'bg-slate-500/20 text-slate-400')

// // const DeveloperDashboard = () => {
// //   const [sidebarOpen, setSidebarOpen] = useState(false)
// //   const [tasks, setTasks]             = useState([])
// //   const [bugs, setBugs]               = useState([])
// //   const [loading, setLoading]         = useState(true)
// //   const navigate = useNavigate()
// //   const user     = JSON.parse(localStorage.getItem('user') || '{}')

// //   const handleLogout = () => { localStorage.clear(); navigate('/') }

// //   useEffect(() => {
// //     const fetch_ = async () => {
// //       const token = localStorage.getItem('token')
// //       const h     = { Authorization: `Bearer ${token}` }
// //       const [tRes, bRes] = await Promise.all([
// //         fetch(`http://localhost:3000/developer/tasks?userId=${user._id}`, { headers: h }),
// //         fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`,  { headers: h }),
// //       ])
// //       const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
// //       if (tData.success) setTasks(tData.data)
// //       if (bData.success) setBugs(bData.data)
// //       setLoading(false)
// //     }
// //     fetch_()
// //   }, [])

// //   // Mark task as in_progress
// //   const handleMarkInProgress = async (taskId) => {
// //     const token = localStorage.getItem('token')
// //     const res   = await fetch(`http://localhost:3000/tasks/${taskId}`, {
// //       method:  'PUT',
// //       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
// //       body:    JSON.stringify({ status: 'in_progress' }),
// //     })
// //     const data = await res.json()
// //     if (data.success) {
// //       setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'in_progress' } : t))
// //     }
// //   }

// //   const statCards = [
// //     { label: 'Assigned Tasks', value: tasks.length,                                         color: 'from-blue-500 to-cyan-500',     icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
// //     { label: 'In Progress',    value: tasks.filter(t => t.status === 'in_progress').length,  color: 'from-yellow-500 to-orange-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
// //     { label: 'Submitted',      value: tasks.filter(t => t.status === 'submitted').length,    color: 'from-purple-500 to-pink-500',   icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
// //     { label: 'Completed',      value: tasks.filter(t => t.status === 'completed').length,    color: 'from-green-500 to-emerald-500', icon: 'M5 13l4 4L19 7' },
// //   ]

// //   if (loading) return (
// //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// //       <p className="text-white text-xl">Loading...</p>
// //     </div>
// //   )

// //   return (
// //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
// //       <div className="fixed inset-0 overflow-hidden pointer-events-none">
// //         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
// //         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
// //       </div>

// //       <DeveloperSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// //       <div className="lg:ml-64">
// //         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
// //           <div className="flex items-center space-x-4">
// //             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
// //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// //               </svg>
// //             </button>
// //             <div>
// //               <h1 className="text-2xl font-bold text-white">Developer Dashboard</h1>
// //               <p className="text-slate-300 text-sm">Welcome back, {user?.firstName}!</p>
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             {/* Notification bell */}
// //             <NotificationBell />
// //             <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// //               Logout
// //             </button>
// //           </div>
// //         </header>

// //         <main className="p-4 lg:p-8 relative z-10 space-y-6">

// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //             {statCards.map((stat, i) => (
// //               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
// //                 <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center text-white mb-4`}>
// //                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
// //                   </svg>
// //                 </div>
// //                 <h3 className="text-slate-300 text-sm mb-1">{stat.label}</h3>
// //                 <p className="text-3xl font-bold text-white">{stat.value}</p>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

// //             {/* My Tasks — with Mark In Progress button */}
// //             <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //               <div className="flex items-center justify-between mb-6">
// //                 <h2 className="text-xl font-bold text-white">My Tasks</h2>
// //                 <Link to="/developer/tasks" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
// //               </div>
// //               <div className="space-y-3">
// //                 {tasks.length === 0 ? (
// //                   <p className="text-slate-400 text-sm">No tasks assigned yet.</p>
// //                 ) : tasks.slice(0, 5).map((task) => (
// //                   <div key={task._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
// //                     <div className="flex items-start justify-between gap-3">
// //                       <div className="flex-1 min-w-0">
// //                         <div className="flex flex-wrap items-center gap-2 mb-1">
// //                           <span className="font-mono text-blue-400 text-xs">{task.issueKey}</span>
// //                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
// //                           <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 capitalize">
// //                             {task.status?.replace(/_/g, ' ')}
// //                           </span>
// //                         </div>
// //                         <p className="text-white font-medium truncate">{task.title}</p>
// //                         <p className="text-slate-400 text-xs mt-1">
// //                           {task.project?.name}{task.module?.name ? ` • ${task.module.name}` : ''}
// //                         </p>
// //                       </div>
// //                       {/* Show Mark In Progress only for assigned tasks */}
// //                       {task.status === 'assigned' && (
// //                         <button
// //                           onClick={() => handleMarkInProgress(task._id)}
// //                           className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-medium transition-all shrink-0"
// //                         >
// //                           Start
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Recent Bugs */}
// //             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //               <div className="flex items-center justify-between mb-6">
// //                 <h2 className="text-xl font-bold text-white">Recent Bugs</h2>
// //                 <Link to="/developer/bugs" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
// //               </div>
// //               <div className="space-y-3">
// //                 {bugs.length === 0 ? (
// //                   <p className="text-slate-400 text-sm">No bugs on your tasks yet.</p>
// //                 ) : bugs.slice(0, 5).map((bug) => (
// //                   <div key={bug._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
// //                     <div className="flex items-center justify-between mb-2">
// //                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>
// //                         {bug.bugSeverity}
// //                       </span>
// //                       <span className={`text-xs ${bug.resolved ? 'text-green-400' : 'text-red-400'}`}>
// //                         {bug.resolved ? 'Resolved' : 'Open'}
// //                       </span>
// //                     </div>
// //                     <p className="text-white text-sm font-medium line-clamp-2">{bug.comment}</p>
// //                     <p className="text-slate-400 text-xs mt-1">Task: {bug.task?.title ?? 'N/A'}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }

// // export default DeveloperDashboard

// import { useState, useEffect } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import DeveloperSidebar from '../../components/developer/DeveloperSidebar'
// import NotificationBell from '../../components/NotificationBell'

// const priorityColor = (p) => ({
//   high: 'bg-red-500/20 text-red-400', medium: 'bg-yellow-500/20 text-yellow-400',
//   low: 'bg-green-500/20 text-green-400', urgent: 'bg-red-600/30 text-red-300',
// }[p] || 'bg-slate-500/20 text-slate-400')

// const statusColor = (s) => ({
//   to_do: 'bg-slate-500/20 text-slate-400', assigned: 'bg-blue-500/20 text-blue-400',
//   in_progress: 'bg-yellow-500/20 text-yellow-400', submitted: 'bg-purple-500/20 text-purple-400',
//   in_testing: 'bg-cyan-500/20 text-cyan-400', bug_found: 'bg-red-500/20 text-red-400',
//   fix_in_progress: 'bg-orange-500/20 text-orange-400', completed: 'bg-green-500/20 text-green-400',
// }[s] || 'bg-slate-500/20 text-slate-400')

// const severityColor = (s) => ({
//   critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400',
//   medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400',
// }[s] || 'bg-slate-500/20 text-slate-400')

// const DeveloperDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [tasks, setTasks]             = useState([])
//   const [bugs, setBugs]               = useState([])
//   const [loading, setLoading]         = useState(true)
//   const navigate = useNavigate()
//   const user     = JSON.parse(localStorage.getItem('user') || '{}')

//   const handleLogout = () => { localStorage.clear(); navigate('/') }

//   useEffect(() => {
//     const fetch_ = async () => {
//       const token = localStorage.getItem('token')
//       const h     = { Authorization: `Bearer ${token}` }
//       const [tRes, bRes] = await Promise.all([
//         fetch(`http://localhost:3000/developer/tasks?userId=${user._id}`, { headers: h }),
//         fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`,  { headers: h }),
//       ])
//       const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
//       if (tData.success) setTasks(tData.data || [])
//       if (bData.success) setBugs(bData.data || [])
//       setLoading(false)
//     }
//     fetch_()
//   }, [])

//   const handleMarkInProgress = async (taskId) => {
//     const token = localStorage.getItem('token')
//     const res   = await fetch(`http://localhost:3000/tasks/${taskId}`, {
//       method: 'PUT',
//       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status: 'in_progress' }),
//     })
//     const data = await res.json()
//     if (data.success) setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'in_progress' } : t))
//   }

//   // All stat cards — shows every status
//   const statCards = [
//     { label: 'Total Tasks',      value: tasks.length,                                                color: 'from-blue-500 to-cyan-500',     icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
//     { label: 'In Progress',      value: tasks.filter(t => t.status === 'in_progress').length,        color: 'from-yellow-500 to-orange-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
//     { label: 'Fix In Progress',  value: tasks.filter(t => t.status === 'fix_in_progress').length,    color: 'from-orange-500 to-red-500',    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
//     { label: 'Submitted',        value: tasks.filter(t => t.status === 'submitted').length,          color: 'from-purple-500 to-pink-500',   icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
//     { label: 'Bug Found',        value: tasks.filter(t => t.status === 'bug_found').length,          color: 'from-red-500 to-rose-600',      icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
//     { label: 'Completed',        value: tasks.filter(t => t.status === 'completed').length,          color: 'from-green-500 to-emerald-500', icon: 'M5 13l4 4L19 7' },
//     { label: 'Open Bugs',        value: bugs.filter(b => !b.resolved).length,                        color: 'from-red-400 to-orange-400',    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
//     { label: 'Resolved Bugs',    value: bugs.filter(b => b.resolved).length,                         color: 'from-teal-500 to-cyan-500',     icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
//   ]

//   if (loading) return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//       <p className="text-white text-xl">Loading...</p>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//       </div>

//       <DeveloperSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="lg:ml-64">
//         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Developer Dashboard</h1>
//               <p className="text-slate-300 text-sm">Welcome back, {user?.firstName}!</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <NotificationBell />
//             <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//               Logout
//             </button>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10 space-y-6">

//           {/* ALL Stat Cards — 4 columns on lg, 2 on sm */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {statCards.map((stat, i) => (
//               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
//                 <div className={`w-10 h-10 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center text-white mb-3`}>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
//                   </svg>
//                 </div>
//                 <h3 className="text-slate-300 text-xs mb-1 leading-tight">{stat.label}</h3>
//                 <p className="text-2xl font-bold text-white">{stat.value}</p>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//             {/* My Tasks */}
//             <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-white">My Tasks</h2>
//                 <Link to="/developer/tasks" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
//               </div>
//               <div className="space-y-3">
//                 {tasks.length === 0 ? (
//                   <p className="text-slate-400 text-sm">No tasks assigned yet.</p>
//                 ) : tasks.slice(0, 6).map((task) => (
//                   <div key={task._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex flex-wrap items-center gap-2 mb-1">
//                           <span className="font-mono text-blue-400 text-xs">{task.issueKey}</span>
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(task.status)}`}>
//                             {task.status?.replace(/_/g, ' ')}
//                           </span>
//                         </div>
//                         <p className="text-white font-medium truncate">{task.title}</p>
//                         <p className="text-slate-400 text-xs mt-1">
//                           {task.project?.name}{task.module?.name ? ` • ${task.module.name}` : ''}
//                         </p>
//                       </div>
//                       {task.status === 'assigned' && (
//                         <button
//                           onClick={() => handleMarkInProgress(task._id)}
//                           className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-medium transition-all shrink-0"
//                         >
//                           Start
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recent Bugs */}
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-white">Recent Bugs</h2>
//                 <Link to="/developer/bugs" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
//               </div>
//               <div className="space-y-3">
//                 {bugs.length === 0 ? (
//                   <p className="text-slate-400 text-sm">No bugs on your tasks yet.</p>
//                 ) : bugs.slice(0, 5).map((bug) => (
//                   <div
//                     key={bug._id}
//                     onClick={() => navigate(`/developer/bugs/${bug._id}`)}
//                     className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>
//                         {bug.bugSeverity}
//                       </span>
//                       <span className={`text-xs ${bug.resolved ? 'text-green-400' : 'text-red-400'}`}>
//                         {bug.resolved ? 'Resolved' : 'Open'}
//                       </span>
//                     </div>
//                     <p className="text-white text-sm font-medium line-clamp-2">{bug.comment}</p>
//                     <p className="text-slate-400 text-xs mt-1">Task: {bug.task?.issueKey} — {bug.task?.title ?? 'N/A'}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default DeveloperDashboard


import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DeveloperSidebar from '../../components/developer/DeveloperSidebar'
import NotificationBell from '../../components/NotificationBell'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const priorityColor = (p) => ({
  high: 'bg-red-500/20 text-red-400', medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400', urgent: 'bg-red-600/30 text-red-300',
}[p] || 'bg-slate-500/20 text-slate-400')

const statusColor = (s) => ({
  to_do:           'bg-slate-500/20 text-slate-400',
  assigned:        'bg-blue-500/20 text-blue-400',
  in_progress:     'bg-yellow-500/20 text-yellow-400',
  submitted:       'bg-purple-500/20 text-purple-400',
  in_testing:      'bg-cyan-500/20 text-cyan-400',
  bug_found:       'bg-red-500/20 text-red-400',
  fix_in_progress: 'bg-orange-500/20 text-orange-400',
  completed:       'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const severityColor = (s) => ({
  critical: 'bg-red-500/20 text-red-400',
  high:     'bg-orange-500/20 text-orange-400',
  medium:   'bg-yellow-500/20 text-yellow-400',
  low:      'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const DeveloperDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tasks, setTasks]             = useState([])
  const [bugs, setBugs]               = useState([])
  const [loading, setLoading]         = useState(true)

  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}` }

  const mlClass = useSidebarCollapsed('developerSidebarCollapsed') // change key per role


  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tRes, bRes] = await Promise.all([
          fetch(`http://localhost:3000/developer/tasks?userId=${user._id}`, { headers: h }),
          fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`,  { headers: h }),
        ])
        const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
        if (tData.success) setTasks(tData.data || [])
        if (bData.success) setBugs(bData.data  || [])
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  // ✅ Start Task — moves assigned → in_progress
  const handleMarkInProgress = async (taskId) => {
    try {
      const res  = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method:  'PUT',
        headers: { ...h, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: 'in_progress' }),
      })
      const data = await res.json()
      if (data.success) setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'in_progress' } : t))
         window.dispatchEvent(new Event("notificationUpdated"))
      } catch (err) { console.error(err) }
  }

  // ✅ Simplified to 4 key stat cards — clean layout
  const statCards = [
    { label: 'Total Tasks',  value: tasks.length,                                             color: 'from-blue-500 to-cyan-500',     icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'In Progress',  value: tasks.filter(t => ['in_progress','fix_in_progress'].includes(t.status)).length, color: 'from-yellow-500 to-orange-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Bugs on Tasks', value: bugs.filter(b => !b.resolved).length,                   color: 'from-red-500 to-rose-600',      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Completed',    value: tasks.filter(t => t.status === 'completed').length,       color: 'from-green-500 to-emerald-500', icon: 'M5 13l4 4L19 7' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <DeveloperSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* <div className="lg:ml-64"> */}
      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen`}>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Developer Dashboard</h1>
              {/* ✅ Actual first name */}
              <p className="text-slate-300 text-sm">Welcome back, {user?.firstName || 'Developer'}!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* ✅ NotificationBell — self-contained, fetches its own notifications */}
            <NotificationBell />
            <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* ✅ 4 key stat cards — clean, not cramped */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center text-white mb-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <h3 className="text-slate-300 text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* My Tasks */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">My Tasks</h2>
                <Link to="/developer/tasks" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
              </div>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-slate-400 text-sm">No tasks assigned yet.</p>
                ) : tasks.slice(0, 6).map(task => (
                  <div key={task._id} onClick={() => navigate(`/developer/tasks/${task._id}`)} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-blue-400 text-xs">{task.issueKey}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(task.status)}`}>
                            {task.status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-white font-medium truncate">{task.title}</p>
                        <p className="text-slate-400 text-xs mt-1">
                          {task.project?.name}{task.module?.name ? ` • ${task.module.name}` : ''}
                        </p>
                      </div>
                      {/* ✅ Start Task button — only on assigned status */}
                      {task.status === 'assigned' && (
                        <button
                          onClick={() => handleMarkInProgress(task._id)}
                          className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-medium transition-all shrink-0"
                        >
                          Start Task
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bugs — clickable to bug detail */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Bugs</h2>
                <Link to="/developer/bugs" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
              </div>
              <div className="space-y-3">
                {bugs.length === 0 ? (
                  <p className="text-slate-400 text-sm">No bugs on your tasks yet.</p>
                ) : bugs.slice(0, 5).map(bug => (
                  <div
                    key={bug._id}
                    onClick={() => navigate(`/developer/bugs/${bug._id}`)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>
                        {bug.bugSeverity}
                      </span>
                      <span className={`text-xs font-medium ${bug.resolved ? 'text-green-400' : 'text-red-400'}`}>
                        {bug.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium line-clamp-2 mb-1">{bug.comment}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 text-xs">Task: {bug.task?.issueKey || 'N/A'}</p>
                      <span className="text-blue-400 text-xs group-hover:text-blue-300">Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default DeveloperDashboard