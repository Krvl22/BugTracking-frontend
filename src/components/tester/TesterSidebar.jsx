// // // import { Link, useLocation } from "react-router-dom"

// // // const NAV_ITEMS = [
// // //   { name: 'Dashboard',     path: '/testerdashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
// // //   { name: 'Tasks to Test', path: '/tester/tasks',    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
// // //   { name: 'My Bugs',       path: '/tester/bugs',     icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
// // //   { name: 'Reports',       path: '/tester/reports',  icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
// // //   { name: 'Settings',      path: '/tester/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
// // // ]

// // // const TesterSidebar = ({ sidebarOpen, setSidebarOpen }) => {
// // //   const location  = useLocation()
// // //   const user      = JSON.parse(localStorage.getItem('user') || '{}')

// // //   return (
// // //     <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
// // //       <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col no-scrollbar">
// // //         <div className="flex items-center justify-between mb-8 px-3">
// // //           <Link to="/testerdashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
// // //             Bug Tracker
// // //           </Link>
// // //           <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
// // //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //             </svg>
// // //           </button>
// // //         </div>

// // //         <nav className="space-y-1 flex-1">
// // //           {NAV_ITEMS.map((item) => (
// // //             <Link key={item.name} to={item.path}
// // //               className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
// // //                 location.pathname === item.path
// // //                   ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
// // //                   : 'text-slate-300 hover:bg-white/10'
// // //               }`}>
// // //               <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
// // //               </svg>
// // //               {item.name}
// // //             </Link>
// // //           ))}
// // //         </nav>

// // //         {/* User card — links to settings */}
// // //         <div className="mt-4">
// // //           <Link to="/tester/settings" className="block backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all">
// // //             <div className="flex items-center space-x-3">
// // //               {user.profilePic ? (
// // //                 <img src={user.profilePic} className="w-10 h-10 rounded-full object-cover shrink-0" alt="avatar" />
// // //               ) : (
// // //                 <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">
// // //                   {user?.firstName?.[0]}{user?.lastName?.[0]}
// // //                 </div>
// // //               )}
// // //               <div className="flex-1 min-w-0">
// // //                 <p className="text-white text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
// // //                 <p className="text-slate-400 text-xs truncate">{user?.email}</p>
// // //               </div>
// // //               <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// // //               </svg>
// // //             </div>
// // //           </Link>
// // //         </div>

// // //       </div>
// // //     </aside>
// // //   )
// // // }

// // // export default TesterSidebar

// // import { useState, useEffect } from 'react'
// // import { Link, useLocation } from 'react-router-dom'

// // const TesterSidebar = ({ sidebarOpen, setSidebarOpen }) => {
// //   const location = useLocation()
// //   const [user, setUser]     = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
// //   const [counts, setCounts] = useState({ tasks: 0, bugs: 0 })

// //   useEffect(() => {
// //     const sync = () => setUser(JSON.parse(localStorage.getItem('user') || '{}'))
// //     window.addEventListener('storage', sync)
// //     window.addEventListener('userUpdated', sync)
// //     return () => { window.removeEventListener('storage', sync); window.removeEventListener('userUpdated', sync) }
// //   }, [])

// //   useEffect(() => {
// //     const token = localStorage.getItem('token')
// //     const u     = JSON.parse(localStorage.getItem('user') || '{}')
// //     const h     = { Authorization: `Bearer ${token}` }

// //     const fetchCounts = async () => {
// //       try {
// //         const [tRes, bRes] = await Promise.all([
// //           fetch('http://localhost:3000/tester/tasks', { headers: h }),
// //           fetch(`http://localhost:3000/tester/bugs?userId=${u._id}`, { headers: h }),
// //         ])
// //         const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
// //         setCounts({
// //           tasks: tData.success ? (tData.data || []).length : 0,
// //           bugs:  bData.success ? (bData.data || []).filter(b => !b.resolved).length : 0,
// //         })
// //       } catch (err) { console.error(err) }
// //     }

// //     fetchCounts()
// //     const handler = () => fetchCounts()
// //     window.addEventListener('notificationUpdated', handler)
// //     return () => window.removeEventListener('notificationUpdated', handler)
// //   }, [])

// //   const NAV_ITEMS = [
// //     { name: 'Dashboard',     path: '/testerdashboard', count: null,         icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
// //     { name: 'Tasks to Test', path: '/tester/tasks',    count: counts.tasks, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
// //     { name: 'My Bugs',       path: '/tester/bugs',     count: counts.bugs,  icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
// //     { name: 'Reports',       path: '/tester/reports',  count: null,         icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
// //     { name: 'Chat History', path: '/tester/chat-history', count: null, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
// //     { name: 'Settings',      path: '/tester/settings', count: null,         icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
// //   ]

// //   return (
// //     <>
// //       {sidebarOpen && (
// //         <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
// //       )}
// //       <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
// //         <div className="h-full px-3 py-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">
// //           <div className="flex items-center justify-between mb-8 px-3">
// //             <Link to="/testerdashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">Bug Tracker</Link>
// //             <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
// //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //               </svg>
// //             </button>
// //           </div>

// //           <nav className="space-y-1 flex-1">
// //             {NAV_ITEMS.map(item => {
// //               const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
// //               return (
// //                 <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)}
// //                   className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
// //                   <div className="flex items-center gap-3">
// //                     <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
// //                     </svg>
// //                     <span className="text-sm font-medium">{item.name}</span>
// //                   </div>
// //                   {item.count != null && item.count > 0 && (
// //                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center ${isActive ? 'bg-white/25 text-white' : 'bg-blue-500/25 text-blue-300'}`}>
// //                       {item.count}
// //                     </span>
// //                   )}
// //                 </Link>
// //               )
// //             })}
// //           </nav>

// //           <div className="mt-4 pt-4 border-t border-white/10">
// //             <Link to="/tester/settings" className="block bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all group">
// //               <div className="flex items-center space-x-3">
// //                 {user.profilePic ? (
// //                   <img src={user.profilePic} className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/20" alt="avatar" />
// //                 ) : (
// //                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">
// //                     {user?.firstName?.[0]}{user?.lastName?.[0]}
// //                   </div>
// //                 )}
// //                 <div className="flex-1 min-w-0">
// //                   <p className="text-white text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
// //                   <p className="text-slate-400 text-xs truncate">{user?.email}</p>
// //                 </div>
// //                 <svg className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// //                 </svg>
// //               </div>
// //             </Link>
// //           </div>
// //         </div>
// //       </aside>
// //     </>
// //   )
// // }

// // export default TesterSidebar

// import { useState, useEffect } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import NotificationBell from '../NotificationBell'

// // ✅ Fixed Settings icon (proper double-path cog)
// const SettingsIcon = () => (
//   <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//       d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//     />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// )

// const CollapseIcon = ({ collapsed }) => (
//   <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//   </svg>
// )

// const TesterSidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const location = useLocation()
//   const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
//   const [counts, setCounts]   = useState({ tasks: 0, bugs: 0 })
//   const [collapsed, setCollapsed] = useState(() => localStorage.getItem('testerSidebarCollapsed') === 'true')

//   const toggleCollapse = () => {
//     setCollapsed(prev => {
//       const next = !prev
//       localStorage.setItem('testerSidebarCollapsed', String(next))
//       window.dispatchEvent(new Event('sidebarToggled'))
//       return next
//     })
//   }

//   useEffect(() => {
//     const sync = () => setUser(JSON.parse(localStorage.getItem('user') || '{}'))
//     window.addEventListener('storage', sync)
//     window.addEventListener('userUpdated', sync)
//     return () => { window.removeEventListener('storage', sync); window.removeEventListener('userUpdated', sync) }
//   }, [])

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const u     = JSON.parse(localStorage.getItem('user') || '{}')
//     const h     = { Authorization: `Bearer ${token}` }

//     const fetchCounts = async () => {
//       try {
//         const [tRes, bRes] = await Promise.all([
//           fetch('http://localhost:3000/tester/tasks', { headers: h }),
//           fetch(`http://localhost:3000/tester/bugs?userId=${u._id}`, { headers: h }),
//         ])
//         const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
//         setCounts({
//           tasks: tData.success ? (tData.data || []).length : 0,
//           bugs:  bData.success ? (bData.data || []).filter(b => !b.resolved).length : 0,
//         })
//       } catch (err) { console.error(err) }
//     }

//     fetchCounts()
//     const handler = () => fetchCounts()
//     window.addEventListener('notificationUpdated', handler)
//     return () => window.removeEventListener('notificationUpdated', handler)
//   }, [])

//   const NAV_ITEMS = [
//     { name: 'Dashboard',     path: '/testerdashboard',      count: null,         icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//     { name: 'Tasks to Test', path: '/tester/tasks',         count: counts.tasks, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
//     { name: 'My Bugs',       path: '/tester/bugs',          count: counts.bugs,  icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
//     { name: 'Reports',       path: '/tester/reports',       count: null,         icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
//     { name: 'Chat History',  path: '/tester/chat-history',  count: null,         icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
//     { name: 'Settings',      path: '/tester/settings',      count: null,         isSettings: true },
//   ]

//   return (
//     <>
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300
//         w-64 ${collapsed ? 'lg:w-16' : 'lg:w-64'}
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
//       >
//         <div className="h-full px-3 py-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">

//           {/* Brand + Collapse */}
//           <div className={`flex items-center mb-8 ${collapsed ? 'justify-center px-1' : 'justify-between px-3'}`}>
//             {!collapsed && (
//               <Link to="/testerdashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
//                 Bug Tracker
//               </Link>
//             )}
//             <div className="flex items-center gap-2">
//               <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//               <button
//                 onClick={toggleCollapse}
//                 className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
//                 title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//               >
//                 <CollapseIcon collapsed={collapsed} />
//               </button>
//             </div>
//           </div>

//           {/* Nav */}
//           <nav className="space-y-1 flex-1">
//             {NAV_ITEMS.map(item => {
//               const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   onClick={() => setSidebarOpen(false)}
//                   title={collapsed ? item.name : undefined}
//                   className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group
//                     ${collapsed ? 'justify-center' : 'justify-between'}
//                     ${isActive
//                       ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
//                       : 'text-slate-300 hover:bg-white/10 hover:text-white'
//                     }`}
//                 >
//                   <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
//                     {item.isSettings ? <SettingsIcon /> : (
//                       <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
//                       </svg>
//                     )}
//                     {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
//                   </div>
//                   {!collapsed && item.count != null && item.count > 0 && (
//                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center ${
//                       isActive ? 'bg-white/25 text-white' : 'bg-blue-500/25 text-blue-300'
//                     }`}>
//                       {item.count}
//                     </span>
//                   )}
//                 </Link>
//               )
//             })}
//           </nav>

//           {/* ✅ NotificationBell */}
//           <div className={`mt-4 pt-4 border-t border-white/10 flex ${collapsed ? 'justify-center' : 'px-1'}`}>
//             <div className={`${collapsed ? '' : 'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5'}`}>
//               {!collapsed && <span className="text-slate-400 text-xs font-medium">Notifications</span>}
//               <NotificationBell />
//             </div>
//           </div>

//           {/* User profile */}
//           {!collapsed ? (
//             <div className="mt-2">
//               <Link to="/tester/settings" className="block bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all group">
//                 <div className="flex items-center space-x-3">
//                   {user.profilePic ? (
//                     <img src={user.profilePic} className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/20" alt="avatar" />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">
//                       {user?.firstName?.[0]}{user?.lastName?.[0]}
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-white text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
//                     <p className="text-slate-400 text-xs truncate">{user?.email}</p>
//                   </div>
//                   <svg className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </div>
//               </Link>
//             </div>
//           ) : (
//             <div className="mt-2 flex justify-center">
//               <Link to="/tester/settings" title="Settings">
//                 {user.profilePic ? (
//                   <img src={user.profilePic} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20" alt="avatar" />
//                 ) : (
//                   <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
//                     {user?.firstName?.[0]}{user?.lastName?.[0]}
//                   </div>
//                 )}
//               </Link>
//             </div>
//           )}

//         </div>
//       </aside>
//     </>
//   )
// }

// export default TesterSidebar

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SidebarNotifications from '../SidebarNotifications'

const SettingsIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const TesterSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const [user, setUser]     = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
  const [counts, setCounts] = useState({ tasks: 0, bugs: 0 })
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('testerSidebarCollapsed') === 'true')

  const toggleCollapse = () => setCollapsed(prev => {
    const next = !prev
    localStorage.setItem('testerSidebarCollapsed', String(next))
    window.dispatchEvent(new CustomEvent('sidebarToggled', { detail: { collapsed: next, role: 'tester' } }))
    return next
  })

  useEffect(() => {
    const sync = () => setUser(JSON.parse(localStorage.getItem('user') || '{}'))
    window.addEventListener('storage', sync)
    window.addEventListener('userUpdated', sync)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('userUpdated', sync) }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = JSON.parse(localStorage.getItem('user') || '{}')
    const h = { Authorization: `Bearer ${token}` }
    const fetchCounts = async () => {
      try {
        const [tRes, bRes] = await Promise.all([
          fetch('http://localhost:3000/tester/tasks', { headers: h }),
          fetch(`http://localhost:3000/tester/bugs?userId=${u._id}`, { headers: h }),
        ])
        const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
        setCounts({
          tasks: tData.success ? (tData.data || []).length : 0,
          bugs: bData.success ? (bData.data || []).filter(b => !b.resolved).length : 0,
        })
      } catch (err) { console.error(err) }
    }
    fetchCounts()
    const h2 = () => fetchCounts()
    window.addEventListener('notificationUpdated', h2)
    return () => window.removeEventListener('notificationUpdated', h2)
  }, [])

  const NAV_ITEMS = [
    { name: 'Dashboard',     path: '/testerdashboard',     countKey: null,    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Tasks to Test', path: '/tester/tasks',        countKey: 'tasks', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'My Bugs',       path: '/tester/bugs',         countKey: 'bugs',  icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { name: 'Reports',       path: '/tester/reports',      countKey: null,    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Chat History',  path: '/tester/chat-history', countKey: null,    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: 'Settings',      path: '/tester/settings',     countKey: null,    isSettings: true },
  ]

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 w-64 ${collapsed ? 'lg:w-16' : 'lg:w-64'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full flex flex-col px-3 py-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden backdrop-blur-xl bg-slate-900/80 border-r border-white/10">

          <div className={`flex items-center mb-6 ${collapsed ? 'justify-center' : 'justify-between px-1'}`}>
            {!collapsed && (
              <div>
                <Link to="/testerdashboard" className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">Bug Tracker</Link>
                <p className="text-slate-500 text-[10px]">Tester</p>
              </div>
            )}
            <div className="flex items-center gap-1">
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <button onClick={toggleCollapse} className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all" title={collapsed ? 'Expand' : 'Collapse'}>
                <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {!collapsed && <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Main</p>}

          <nav className="space-y-0.5 flex-1">
            {NAV_ITEMS.map(item => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              const badge    = item.countKey ? counts[item.countKey] : null
              return (
                <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} title={collapsed ? item.name : undefined}
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${collapsed ? 'justify-center' : 'justify-between'} ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-white/8 hover:text-white'}`}>
                  <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                    {item.isSettings ? <SettingsIcon /> : (
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    )}
                    {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                  </div>
                  {!collapsed && badge != null && badge > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center ${isActive ? 'bg-white/25 text-white' : 'bg-blue-500/20 text-blue-300'}`}>{badge}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/8 pt-2">
            <SidebarNotifications collapsed={collapsed} />
          </div>

          <div className="mt-2 pt-2 border-t border-white/8">
            {!collapsed ? (
              <Link to="/tester/settings" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-all group">
                {user.profilePic ? (
                  <img src={user.profilePic} className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white/15" alt="avatar" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                </div>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            ) : (
              <div className="flex justify-center">
                <Link to="/tester/settings" title="Settings">
                  {user.profilePic ? (
                    <img src={user.profilePic} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/15" alt="avatar" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default TesterSidebar