// // // import { useState, useEffect } from 'react'
// // // import { useNavigate } from 'react-router-dom'
// // // import DeveloperSidebar from '../../components/developer/DeveloperSidebar'

// // // const severityColor = (s) => ({
// // //   critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400',
// // //   medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400',
// // // }[s] || 'bg-slate-500/20 text-slate-400')

// // // const DeveloperBugs = () => {
// // //   const [sidebarOpen, setSidebarOpen] = useState(false)
// // //   const [data, setData]               = useState([])
// // //   const [loading, setLoading]         = useState(true)
// // //   const [filter, setFilter]           = useState('all')
// // //   const navigate = useNavigate()
// // //   const user     = JSON.parse(localStorage.getItem('user') || '{}')

// // //   const handleLogout = () => { localStorage.clear(); navigate('/') }

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       const token = localStorage.getItem('token')
// // //       try {
// // //         const res    = await fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`, {
// // //           headers: { Authorization: `Bearer ${token}` }
// // //         })
// // //         const result = await res.json()
// // //         if (result.success) setData(result.data || [])
// // //       } catch (err) { console.error(err) }
// // //       finally { setLoading(false) }
// // //     }
// // //     fetchData()
// // //   }, [])

// // //   if (loading) return (
// // //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// // //       <p className="text-white text-xl">Loading...</p>
// // //     </div>
// // //   )

// // //   const filtered = filter === 'all' ? data :
// // //     filter === 'open'     ? data.filter(b => !b.resolved) :
// // //     filter === 'resolved' ? data.filter(b => b.resolved) :
// // //     data.filter(b => b.bugSeverity === filter)

// // //   return (
// // //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
// // //       <div className="fixed inset-0 overflow-hidden pointer-events-none">
// // //         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
// // //         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
// // //       </div>

// // //       <DeveloperSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// // //       <div className="lg:ml-64">
// // //         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
// // //           <div className="flex items-center space-x-4">
// // //             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
// // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// // //               </svg>
// // //             </button>
// // //             <div>
// // //               <h1 className="text-2xl font-bold text-white">My Bugs</h1>
// // //               <p className="text-slate-300 text-sm">Bugs reported on your tasks</p>
// // //             </div>
// // //           </div>
// // //           <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// // //             Logout
// // //           </button>
// // //         </header>

// // //         <main className="p-4 lg:p-8 relative z-10 space-y-6">

// // //           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// // //             {[
// // //               { label: 'Total Bugs', value: data.length,                                          color: 'from-blue-500 to-cyan-500' },
// // //               { label: 'Open',       value: data.filter(b => !b.resolved).length,                 color: 'from-red-500 to-orange-500' },
// // //               { label: 'Resolved',   value: data.filter(b => b.resolved).length,                  color: 'from-green-500 to-emerald-500' },
// // //               { label: 'Critical',   value: data.filter(b => b.bugSeverity === 'critical').length, color: 'from-red-600 to-red-800' },
// // //             ].map((s, i) => (
// // //               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
// // //                 <p className="text-slate-300 text-sm mb-1">{s.label}</p>
// // //                 <p className="text-3xl font-bold text-white">{s.value}</p>
// // //                 <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
// // //                   <div className={`h-full bg-linear-to-r ${s.color}`} style={{ width: data.length ? `${(s.value / data.length) * 100}%` : '0%' }} />
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// // //             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
// // //               <h2 className="text-xl font-bold text-white">Bug Reports</h2>
// // //               {/* FIX: bg-slate-800 so options are visible */}
// // //               <select value={filter} onChange={e => setFilter(e.target.value)}
// // //                 className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
// // //                 <option value="all"      className="bg-slate-800 text-white">All</option>
// // //                 <option value="open"     className="bg-slate-800 text-white">Open</option>
// // //                 <option value="resolved" className="bg-slate-800 text-white">Resolved</option>
// // //                 <option value="critical" className="bg-slate-800 text-white">Critical</option>
// // //                 <option value="high"     className="bg-slate-800 text-white">High</option>
// // //                 <option value="medium"   className="bg-slate-800 text-white">Medium</option>
// // //                 <option value="low"      className="bg-slate-800 text-white">Low</option>
// // //               </select>
// // //             </div>

// // //             {filtered.length === 0 ? (
// // //               <p className="text-slate-400">No bugs found.</p>
// // //             ) : (
// // //               <div className="space-y-4">
// // //                 {filtered.map(bug => (
// // //                   <div key={bug._id} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all">
// // //                     <div className="flex flex-wrap items-center gap-2 mb-3">
// // //                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>{bug.bugSeverity}</span>
// // //                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
// // //                         {bug.resolved ? 'Resolved' : 'Open'}
// // //                       </span>
// // //                     </div>
// // //                     <p className="text-white font-medium mb-3">{bug.comment}</p>
// // //                     <div className="flex flex-wrap gap-3 text-xs text-slate-400">
// // //                       <span>Task: <span className="text-blue-400 font-mono">{bug.task?.issueKey ?? 'N/A'}</span> — <span className="text-slate-300">{bug.task?.title ?? 'N/A'}</span></span>
// // //                       <span>By: <span className="text-slate-300">{bug.commentedBy?.firstName} {bug.commentedBy?.lastName}</span></span>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </main>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default DeveloperBugs

// // import { useState, useEffect } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import DeveloperSidebar from '../../components/developer/DeveloperSidebar'

// // const severityColor = (s) => ({
// //   critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400',
// //   medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400',
// // }[s] || 'bg-slate-500/20 text-slate-400')

// // const DeveloperBugs = () => {
// //   const [sidebarOpen, setSidebarOpen] = useState(false)
// //   const [data, setData]               = useState([])
// //   const [loading, setLoading]         = useState(true)
// //   const [filter, setFilter]           = useState('all')
// //   const navigate = useNavigate()
// //   const user     = JSON.parse(localStorage.getItem('user') || '{}')

// //   const handleLogout = () => { localStorage.clear(); navigate('/') }

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const token = localStorage.getItem('token')
// //       try {
// //         const res    = await fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`, {
// //           headers: { Authorization: `Bearer ${token}` }
// //         })
// //         const result = await res.json()
// //         if (result.success) setData(result.data || [])
// //       } catch (err) { console.error(err) }
// //       finally { setLoading(false) }
// //     }
// //     fetchData()
// //   }, [])

// //   if (loading) return (
// //     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
// //       <p className="text-white text-xl">Loading...</p>
// //     </div>
// //   )

// //   const filtered = filter === 'all' ? data :
// //     filter === 'open'     ? data.filter(b => !b.resolved) :
// //     filter === 'resolved' ? data.filter(b => b.resolved) :
// //     data.filter(b => b.bugSeverity === filter)

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
// //               <h1 className="text-2xl font-bold text-white">My Bugs</h1>
// //               <p className="text-slate-300 text-sm">Bugs reported on your tasks</p>
// //             </div>
// //           </div>
// //           <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
// //             Logout
// //           </button>
// //         </header>

// //         <main className="p-4 lg:p-8 relative z-10 space-y-6">

// //           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //             {[
// //               { label: 'Total Bugs', value: data.length,                                          color: 'from-blue-500 to-cyan-500' },
// //               { label: 'Open',       value: data.filter(b => !b.resolved).length,                 color: 'from-red-500 to-orange-500' },
// //               { label: 'Resolved',   value: data.filter(b => b.resolved).length,                  color: 'from-green-500 to-emerald-500' },
// //               { label: 'Critical',   value: data.filter(b => b.bugSeverity === 'critical').length, color: 'from-red-600 to-red-800' },
// //             ].map((s, i) => (
// //               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
// //                 <p className="text-slate-300 text-sm mb-1">{s.label}</p>
// //                 <p className="text-3xl font-bold text-white">{s.value}</p>
// //                 <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
// //                   <div className={`h-full bg-linear-to-r ${s.color}`} style={{ width: data.length ? `${(s.value / data.length) * 100}%` : '0%' }} />
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
// //             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
// //               <h2 className="text-xl font-bold text-white">Bug Reports</h2>
// //               <select value={filter} onChange={e => setFilter(e.target.value)}
// //                 className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
// //                 <option value="all"      className="bg-slate-800 text-white">All</option>
// //                 <option value="open"     className="bg-slate-800 text-white">Open</option>
// //                 <option value="resolved" className="bg-slate-800 text-white">Resolved</option>
// //                 <option value="critical" className="bg-slate-800 text-white">Critical</option>
// //                 <option value="high"     className="bg-slate-800 text-white">High</option>
// //                 <option value="medium"   className="bg-slate-800 text-white">Medium</option>
// //                 <option value="low"      className="bg-slate-800 text-white">Low</option>
// //               </select>
// //             </div>

// //             {filtered.length === 0 ? (
// //               <p className="text-slate-400">No bugs found.</p>
// //             ) : (
// //               <div className="space-y-4">
// //                 {filtered.map(bug => (
// //                   <div
// //                     key={bug._id}
// //                     onClick={() => navigate(`/developer/bugs/${bug._id}`)}
// //                     className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
// //                   >
// //                     <div className="flex flex-wrap items-center gap-2 mb-3">
// //                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>{bug.bugSeverity}</span>
// //                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
// //                         {bug.resolved ? 'Resolved' : 'Open'}
// //                       </span>
// //                       {bug.attachmentUrl && (
// //                         <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">📎 Attachment</span>
// //                       )}
// //                     </div>
// //                     <p className="text-white font-medium mb-3 line-clamp-2">{bug.comment}</p>
// //                     <div className="flex flex-wrap justify-between gap-3 text-xs text-slate-400">
// //                       <span>Task: <span className="text-blue-400 font-mono">{bug.task?.issueKey ?? 'N/A'}</span> — <span className="text-slate-300">{bug.task?.title ?? 'N/A'}</span></span>
// //                       <span className="text-blue-400 hover:text-blue-300">View Details →</span>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }

// // export default DeveloperBugs

// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import DeveloperSidebar from '../../components/developer/DeveloperSidebar'

// const severityColor = (s) => ({
//   critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400',
//   medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400',
// }[s] || 'bg-slate-500/20 text-slate-400')

// const DeveloperBugs = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [data, setData]               = useState([])
//   const [loading, setLoading]         = useState(true)
//   const [filter, setFilter]           = useState('all')
//   const navigate = useNavigate()
//   const user     = JSON.parse(localStorage.getItem('user') || '{}')

//   const handleLogout = () => { localStorage.clear(); navigate('/') }

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token')
//       try {
//         const res    = await fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const result = await res.json()
//         if (result.success) setData(result.data || [])
//       } catch (err) { console.error(err) }
//       finally { setLoading(false) }
//     }
//     fetchData()
//   }, [])

//   if (loading) return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//       <p className="text-white text-xl">Loading...</p>
//     </div>
//   )

//   const filtered = filter === 'all' ? data :
//     filter === 'open'     ? data.filter(b => !b.resolved) :
//     filter === 'resolved' ? data.filter(b => b.resolved) :
//     data.filter(b => b.bugSeverity === filter)

//   // All stat cards
//   const statCards = [
//     { label: 'Total Bugs', value: data.length,                                          color: 'from-blue-500 to-cyan-500' },
//     { label: 'Open',       value: data.filter(b => !b.resolved).length,                 color: 'from-red-500 to-orange-500' },
//     { label: 'Resolved',   value: data.filter(b => b.resolved).length,                  color: 'from-green-500 to-emerald-500' },
//     { label: 'Critical',   value: data.filter(b => b.bugSeverity === 'critical').length, color: 'from-red-600 to-red-800' },
//     { label: 'High',       value: data.filter(b => b.bugSeverity === 'high').length,     color: 'from-orange-500 to-red-500' },
//     { label: 'Medium',     value: data.filter(b => b.bugSeverity === 'medium').length,   color: 'from-yellow-500 to-orange-400' },
//     { label: 'Low',        value: data.filter(b => b.bugSeverity === 'low').length,      color: 'from-green-400 to-teal-500' },
//     { label: 'With Files', value: data.filter(b => b.attachmentUrl).length,              color: 'from-blue-400 to-indigo-500' },
//   ]

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
//               <h1 className="text-2xl font-bold text-white">My Bugs</h1>
//               <p className="text-slate-300 text-sm">Bugs reported on your tasks</p>
//             </div>
//           </div>
//           <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//             Logout
//           </button>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10 space-y-6">

//           {/* ALL stat cards — 4 cols lg, 2 cols mobile */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {statCards.map((s, i) => (
//               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
//                 <p className="text-slate-300 text-xs mb-1 leading-tight">{s.label}</p>
//                 <p className="text-2xl font-bold text-white">{s.value}</p>
//                 <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
//                   <div className={`h-full bg-linear-to-r ${s.color}`}
//                     style={{ width: data.length ? `${(s.value / data.length) * 100}%` : '0%' }} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//               <h2 className="text-xl font-bold text-white">Bug Reports</h2>
//               <select value={filter} onChange={e => setFilter(e.target.value)}
//                 className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
//                 <option value="all"      className="bg-slate-800 text-white">All</option>
//                 <option value="open"     className="bg-slate-800 text-white">Open</option>
//                 <option value="resolved" className="bg-slate-800 text-white">Resolved</option>
//                 <option value="critical" className="bg-slate-800 text-white">Critical</option>
//                 <option value="high"     className="bg-slate-800 text-white">High</option>
//                 <option value="medium"   className="bg-slate-800 text-white">Medium</option>
//                 <option value="low"      className="bg-slate-800 text-white">Low</option>
//               </select>
//             </div>

//             {filtered.length === 0 ? (
//               <div className="text-center py-12">
//                 <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-slate-400">No bugs found.</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filtered.map(bug => (
//                   <div
//                     key={bug._id}
//                     onClick={() => navigate(`/developer/bugs/${bug._id}`)}
//                     className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
//                   >
//                     <div className="flex flex-wrap items-center gap-2 mb-3">
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>
//                         {bug.bugSeverity}
//                       </span>
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
//                         {bug.resolved ? 'Resolved' : 'Open'}
//                       </span>
//                       {bug.attachmentUrl && (
//                         <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">📎 Attachment</span>
//                       )}
//                     </div>
//                     <p className="text-white font-medium mb-3 line-clamp-2">{bug.comment}</p>
//                     <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-slate-400">
//                       <div className="flex flex-wrap gap-3">
//                         <span>Task: <span className="text-blue-400 font-mono">{bug.task?.issueKey ?? 'N/A'}</span> — <span className="text-slate-300">{bug.task?.title ?? 'N/A'}</span></span>
//                         <span>By: <span className="text-slate-300">{bug.commentedBy?.firstName} {bug.commentedBy?.lastName}</span></span>
//                         {bug.createdAt && <span>Reported: <span className="text-slate-300">{new Date(bug.createdAt).toLocaleDateString()}</span></span>}
//                       </div>
//                       <span className="text-blue-400 group-hover:text-blue-300 transition-colors">View Details →</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default DeveloperBugs

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeveloperSidebar from '../../components/developer/DeveloperSidebar'

const ITEMS_PER_PAGE = 8

const severityColor = (s) => ({ critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400' }[s] || 'bg-slate-500/20 text-slate-400')

const Pagination = ({ page, totalPages, setPage, total, perPage }) => {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-slate-400 text-sm">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}</p>
      <div className="flex items-center gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm border border-white/10 disabled:opacity-40 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Prev
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'}`}>{p}</button>
          ))}
        </div>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm border border-white/10 disabled:opacity-40 flex items-center gap-1">
          Next <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  )
}

const DeveloperBugs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('all')
  const [page, setPage]               = useState(1)
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      try {
        const res    = await fetch(`http://localhost:3000/developer/bugs?userId=${user._id}`, { headers: { Authorization: `Bearer ${token}` } })
        const result = await res.json()
        if (result.success) setData(result.data || [])
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  useEffect(() => { setPage(1) }, [filter])

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center"><p className="text-white text-xl">Loading...</p></div>

  const filtered   = filter === 'all' ? data : filter === 'open' ? data.filter(b => !b.resolved) : filter === 'resolved' ? data.filter(b => b.resolved) : data.filter(b => b.bugSeverity === filter)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const statCards = [
    { label: 'Total Bugs', value: data.length,                                          color: 'from-blue-500 to-cyan-500' },
    { label: 'Open',       value: data.filter(b => !b.resolved).length,                 color: 'from-red-500 to-orange-500' },
    { label: 'Resolved',   value: data.filter(b => b.resolved).length,                  color: 'from-green-500 to-emerald-500' },
    { label: 'Critical',   value: data.filter(b => b.bugSeverity === 'critical').length, color: 'from-red-600 to-red-800' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>
      <DeveloperSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
            <div><h1 className="text-2xl font-bold text-white">My Bugs</h1><p className="text-slate-300 text-sm">Bugs reported on your tasks</p></div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium">Logout</button>
        </header>
        <main className="p-4 lg:p-8 relative z-10 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statCards.map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
                <p className="text-slate-300 text-xs mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: data.length ? `${(s.value / data.length) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Bug Reports <span className="text-slate-400 text-sm font-normal">({filtered.length})</span></h2>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none">
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {paginated.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-slate-400">No bugs found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map(bug => (
                  <div key={bug._id} onClick={() => navigate(`/developer/bugs/${bug._id}`)} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>{bug.bugSeverity}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{bug.resolved ? 'Resolved' : 'Open'}</span>
                    </div>
                    <p className="text-white font-medium mb-3 line-clamp-2">{bug.comment}</p>
                    <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-slate-400">
                      <div className="flex flex-wrap gap-3">
                        <span>Task: <span className="text-blue-400 font-mono">{bug.task?.issueKey ?? 'N/A'}</span> — <span className="text-slate-300">{bug.task?.title ?? 'N/A'}</span></span>
                        <span>By: <span className="text-slate-300">{bug.commentedBy?.firstName} {bug.commentedBy?.lastName}</span></span>
                        {bug.createdAt && <span>{new Date(bug.createdAt).toLocaleDateString()}</span>}
                      </div>
                      <span className="text-blue-400 group-hover:text-blue-300">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} perPage={ITEMS_PER_PAGE} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DeveloperBugs