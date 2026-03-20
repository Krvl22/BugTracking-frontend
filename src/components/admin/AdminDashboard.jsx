// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, Link, useLocation } from "react-router-dom";

// const Icons = {
//   Users: () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
//   Projects: () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>),
//   Bug: () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>),
//   Shield: () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>),
//   Bell: () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>),
//   UserPlus: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>),
//   FolderPlus: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>),
//   ChartBar: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>),
//   Cog: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
// };

// const roleColor = (role) => ({ admin:'bg-purple-500/20 text-purple-400', project_manager:'bg-blue-500/20 text-blue-400', developer:'bg-cyan-500/20 text-cyan-400', tester:'bg-orange-500/20 text-orange-400' }[role] || 'bg-slate-500/20 text-slate-400');
// const notifTypeColor = (type) => { if(type?.includes('bug')) return 'bg-red-500/20 text-red-400'; if(type?.includes('completed')) return 'bg-green-500/20 text-green-400'; if(type?.includes('assigned')) return 'bg-blue-500/20 text-blue-400'; return 'bg-slate-500/20 text-slate-400'; };

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen]     = useState(false);
//   const [notifOpen, setNotifOpen]         = useState(false);
//   const [stats, setStats]                 = useState([]);
//   const [recentUsers, setRecentUsers]     = useState([]);
//   const [projects, setProjects]           = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading]             = useState(true);

//   const navigate   = useNavigate();
//   const location   = useLocation();
//   const notifRef   = useRef(null);
//   const token      = localStorage.getItem('token');
//   const headers    = { Authorization: `Bearer ${token}` };
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

//   const navItems = [
//     { name: 'Dashboard', path: '/admindashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//     { name: 'Users',     path: '/admin/users',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
//     { name: 'Projects',  path: '/admin/projects',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
//     { name: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
//     { name: 'Settings',  path: '/admin/settings',  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
//   ];

//   useEffect(() => {
//     const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [sR, uR, pR, nR] = await Promise.all([
//           fetch('http://localhost:3000/admin/stats',        { headers }),
//           fetch('http://localhost:3000/admin/recent-users', { headers }),
//           fetch('http://localhost:3000/admin/projects',     { headers }),
//           fetch('http://localhost:3000/notifications',      { headers }),
//         ]);
//         const [sD, uD, pD, nD] = await Promise.all([sR.json(), uR.json(), pR.json(), nR.json()]);
//         if (sD.success) setStats([
//           { label:'Total Users',     value:String(sD.data.totalUsers),    change:'+12%', positive:true,  icon:'users',    color:'from-blue-500 to-cyan-500' },
//           { label:'Active Projects', value:String(sD.data.totalProjects), change:'+5%',  positive:true,  icon:'projects', color:'from-emerald-500 to-teal-500' },
//           { label:'Total Bugs',      value:String(sD.data.totalBugs),     change:'-8%',  positive:false, icon:'bug',      color:'from-orange-500 to-red-500' },
//           { label:'System Health',   value:sD.data.systemHealth,          change:'+2%',  positive:true,  icon:'shield',   color:'from-purple-500 to-pink-500' },
//         ]);
//         if (uD.success) setRecentUsers(uD.data);
//         if (pD.success) setProjects(pD.data);
//         if (nD.data)    setNotifications(nD.data);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchAll();
//   }, []);

//   const handleLogout = () => { localStorage.clear(); navigate('/'); };

//   const handleMarkAllRead = async () => {
//     try {
//       await fetch('http://localhost:3000/notifications/read-all', { method:'PUT', headers });
//       setNotifications(prev => prev.map(n => ({ ...n, isRead:true })));
//     } catch(err) { console.error(err); }
//   };

//   const handleMarkRead = async (id) => {
//     try {
//       await fetch(`http://localhost:3000/notifications/${id}/read`, { method:'PUT', headers });
//       setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead:true } : n));
//     } catch(err) { console.error(err); }
//   };

//   const unreadCount = notifications.filter(n => !n.isRead).length;
//   const StatIcon = ({ type }) => { const M = { users:Icons.Users, projects:Icons.Projects, bug:Icons.Bug, shield:Icons.Shield }; const I = M[type]||Icons.Shield; return <I />; };

//   if (loading) return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//       <p className="text-white text-xl">Loading dashboard...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
//       </div>

//       {/* Sidebar */}
//       <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
//         <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20">
//           <div className="flex items-center justify-between mb-8 px-3">
//             <h2 className="text-xl font-bold text-white">Bug Tracker</h2>
//             <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
//           </div>
//           <nav className="space-y-2">
//             {navItems.map((item) => (
//               <Link key={item.name} to={item.path} className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${location.pathname === item.path ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-white/10'}`}>
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
//                 {item.name}
//               </Link>
//             ))}
//           </nav>
//           <div className="absolute bottom-4 left-3 right-3">
//             <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">{storedUser.firstName?.charAt(0)||'A'}</div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-white text-sm font-medium truncate">{storedUser.firstName} {storedUser.lastName}</p>
//                   <p className="text-slate-400 text-xs truncate">{storedUser.email}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </aside>

//       <div className="lg:ml-64">
//         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30">
//           <div className="px-4 py-4 lg:px-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
//                 <div>
//                   <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
//                   <p className="text-slate-300 text-sm">Welcome back, {storedUser.firstName || 'Admin'}! 👋</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 {/* Notification Bell */}
//                 <div className="relative" ref={notifRef}>
//                   <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-slate-300 hover:text-white transition-colors">
//                     <Icons.Bell />
//                     {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>}
//                   </button>
//                   {notifOpen && (
//                     <div className="absolute right-0 top-12 w-80 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
//                       <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//                         <h3 className="text-white font-semibold text-sm">Notifications</h3>
//                         {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-blue-400 text-xs hover:text-blue-300">Mark all read</button>}
//                       </div>
//                       <div className="max-h-80 overflow-y-auto">
//                         {notifications.length === 0 ? (
//                           <div className="p-6 text-center"><p className="text-slate-400 text-sm">No notifications yet</p></div>
//                         ) : notifications.slice(0,10).map((notif, i) => (
//                           <div key={i} onClick={() => handleMarkRead(notif._id)} className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-blue-500/5' : ''}`}>
//                             <div className="flex items-start space-x-3">
//                               <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.isRead ? 'bg-blue-400' : 'bg-transparent'}`}></div>
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center justify-between gap-2">
//                                   <p className="text-white text-xs font-medium truncate">{notif.title}</p>
//                                   <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${notifTypeColor(notif.type)}`}>{notif.type?.replace(/_/g,' ')}</span>
//                                 </div>
//                                 <p className="text-slate-400 text-xs mt-0.5">{notif.message}</p>
//                                 <p className="text-slate-500 text-xs mt-1">{new Date(notif.createdAt).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       {notifications.length > 0 && <div className="px-4 py-2 border-t border-white/10 text-center"><p className="text-slate-500 text-xs">{notifications.length} total</p></div>}
//                     </div>
//                   )}
//                 </div>
//                 <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">Logout</button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10">
//           {/* Stat Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {stats.map((stat, i) => (
//               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center text-white`}><StatIcon type={stat.icon} /></div>
//                   <span className={`text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</span>
//                 </div>
//                 <h3 className="text-slate-300 text-sm mb-1">{stat.label}</h3>
//                 <p className="text-3xl font-bold text-white">{stat.value}</p>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Recent Users */}
//             <div className="lg:col-span-2">
//               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-bold text-white">Recent Users</h2>
//                   <Link to="/admin/users" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
//                 </div>
//                 <div className="space-y-4">
//                   {recentUsers.length === 0 ? <p className="text-slate-400 text-sm">No users found</p> : recentUsers.map((user, i) => (
//                     <div key={i} onClick={() => navigate(`/admin/users/${user._id}`)} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
//                       <div className="flex items-center space-x-4">
//                         <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">{user.firstName?.charAt(0)||'U'}</div>
//                         <div>
//                           <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
//                           <p className="text-slate-400 text-sm">{user.email}</p>
//                         </div>
//                       </div>
//                       <div className="text-right space-y-1">
//                         <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColor(user.role)}`}>{user.role?.replace('_',' ')}</span><br/>
//                         <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.status==='active'?'bg-green-500/20 text-green-400':'bg-yellow-500/20 text-yellow-400'}`}>{user.status}</span>
//                         <p className="text-slate-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div>
//               <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                 <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
//                 <div className="space-y-3">
//                   {[
//                     { label:'Add New User',    path:'/admin/users',     Icon:Icons.UserPlus,   color:'from-blue-500 to-cyan-500' },
//                     { label:'Create Project',  path:'/admin/projects',  Icon:Icons.FolderPlus, color:'from-emerald-500 to-teal-500' },
//                     { label:'View Reports',    path:'/admin/analytics', Icon:Icons.ChartBar,   color:'from-purple-500 to-pink-500' },
//                     { label:'System Settings', path:'/admin/settings',  Icon:Icons.Cog,        color:'from-orange-500 to-red-500' },
//                   ].map((action, i) => (
//                     <Link key={i} to={action.path} className="flex items-center space-x-3 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all duration-200">
//                       <div className={`w-8 h-8 rounded-lg bg-linear-to-r ${action.color} flex items-center justify-center text-white shrink-0`}><action.Icon /></div>
//                       <span className="text-sm">{action.label}</span>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Projects */}
//           <div className="mt-6">
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//               <h2 className="text-xl font-bold text-white mb-6">Active Projects</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {projects.length === 0 ? <p className="text-slate-400 text-sm">No projects found</p> : projects.map((project, i) => (
//                   <div key={i} onClick={() => navigate(`/admin/projects/${project._id}`)} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
//                     <h3 className="text-white font-medium mb-3">{project.name}</h3>
//                     <div className="space-y-2 mb-3">
//                       <div className="flex justify-between text-sm"><span className="text-slate-400">Key</span><span className="text-white font-mono">{project.projectKey}</span></div>
//                       <div className="flex justify-between text-sm"><span className="text-slate-400">Created</span><span className="text-white">{new Date(project.createdAt).toLocaleDateString()}</span></div>
//                     </div>
//                     <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
//                       <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500" style={{ width: project.status==='active'?'75%':'40%' }}></div>
//                     </div>
//                     <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">{project.status}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };


// export default AdminDashboard;








import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// ── SVG Icons ──────────────────────────────────────────────────────
const UsersIcon    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const FolderIcon   = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>;
const BugIcon      = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>;
const ShieldIcon   = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;
const BellIcon     = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>;
const UserPlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>;
const FolderPlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>;
const ChartBarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>;
const CogIcon      = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;

// ── Color helpers ──────────────────────────────────────────────────
const roleColor = (r) => ({
  admin:           'bg-purple-500/20 text-purple-400',
  project_manager: 'bg-blue-500/20 text-blue-400',
  developer:       'bg-cyan-500/20 text-cyan-400',
  tester:          'bg-orange-500/20 text-orange-400',
}[r] || 'bg-slate-500/20 text-slate-400');

const notifTypeColor = (t) => {
  if (t?.includes('bug'))       return 'bg-red-500/20 text-red-400';
  if (t?.includes('completed')) return 'bg-green-500/20 text-green-400';
  if (t?.includes('assigned'))  return 'bg-blue-500/20 text-blue-400';
  return 'bg-slate-500/20 text-slate-400';
};

// ── Nav items ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admindashboard', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Users',     path: '/admin/users',     d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Projects',  path: '/admin/projects',  d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { name: 'Analytics', path: '/admin/analytics', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { name: 'Settings',  path: '/admin/settings',  d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [stats, setStats]                 = useState([]);
  const [recentUsers, setRecentUsers]     = useState([]);
  const [projects, setProjects]           = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  const navigate   = useNavigate();
  const location   = useLocation();
  const notifRef   = useRef(null);
  const token      = localStorage.getItem('token');
  const headers    = { Authorization: `Bearer ${token}` };
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sR, uR, pR, nR] = await Promise.all([
          fetch('http://localhost:3000/admin/stats',        { headers }),
          fetch('http://localhost:3000/admin/recent-users', { headers }),
          fetch('http://localhost:3000/admin/projects',     { headers }),
          fetch('http://localhost:3000/notifications',      { headers }),
        ]);
        const [sD, uD, pD, nD] = await Promise.all([sR.json(), uR.json(), pR.json(), nR.json()]);

        if (sD.success) {
          setStats([
            { label: 'Total Users',     value: String(sD.data.totalUsers),    change: '+12%', pos: true,  Icon: UsersIcon,  color: 'from-blue-500 to-cyan-500' },
            { label: 'Active Projects', value: String(sD.data.totalProjects), change: '+5%',  pos: true,  Icon: FolderIcon, color: 'from-emerald-500 to-teal-500' },
            { label: 'Total Bugs',      value: String(sD.data.totalBugs),     change: '-8%',  pos: false, Icon: BugIcon,    color: 'from-orange-500 to-red-500' },
            { label: 'System Health',   value: sD.data.systemHealth,          change: '+2%',  pos: true,  Icon: ShieldIcon, color: 'from-purple-500 to-pink-500' },
          ]);
        }
        if (uD.success) setRecentUsers(uD.data);
        if (pD.success) setProjects(pD.data);
        if (nD.data)    setNotifications(nD.data);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };
  const unreadCount  = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:3000/notifications/read-all', { method: 'PUT', headers });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:3000/notifications/${id}/read`, { method: 'PUT', headers });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-3">
            {/* ── Bug Tracker → redirects to dashboard ── */}
            <Link to="/admindashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
              Bug Tracker
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.name} to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-white/10'
                }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
                </svg>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Real admin name */}
          <div className="mt-4">
            <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                  {storedUser.firstName?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{storedUser.firstName} {storedUser.lastName}</p>
                  <p className="text-slate-400 text-xs truncate">{storedUser.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">

        {/* Header */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-300 text-sm">Welcome back, {storedUser.firstName || 'Admin'}! 👋</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-slate-300 hover:text-white transition-colors">
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <h3 className="text-white font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-blue-400 text-xs hover:text-blue-300">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0
                      ? <p className="text-slate-400 text-sm p-6 text-center">No notifications yet</p>
                      : notifications.slice(0, 10).map((n, i) => (
                        <div key={i} onClick={() => markRead(n._id)}
                          className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-blue-500/5' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-blue-400' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-white text-xs font-medium truncate">{n.title}</p>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${notifTypeColor(n.type)}`}>{n.type?.replace(/_/g, ' ')}</span>
                              </div>
                              <p className="text-slate-400 text-xs mt-0.5">{n.message}</p>
                              <p className="text-slate-500 text-xs mt-1">{new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  {notifications.length > 0 && (
                    <p className="text-slate-500 text-xs text-center py-2 border-t border-white/10">{notifications.length} total</p>
                  )}
                </div>
              )}
            </div>

            <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white`}>
                    <s.Icon />
                  </div>
                  <span className={`text-sm font-medium ${s.pos ? 'text-green-400' : 'text-red-400'}`}>{s.change}</span>
                </div>
                <h3 className="text-slate-300 text-sm mb-1">{s.label}</h3>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Users */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Users</h2>
                <Link to="/admin/users" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
              </div>
              <div className="space-y-4">
                {recentUsers.length === 0
                  ? <p className="text-slate-400 text-sm">No users found</p>
                  : recentUsers.map((u, i) => (
                    <div key={i} onClick={() => navigate(`/admin/users/${u._id}`)}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {u.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{u.firstName} {u.lastName}</p>
                          <p className="text-slate-400 text-sm">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColor(u.role)}`}>{u.role?.replace('_', ' ')}</span><br />
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{u.status}</span>
                        <p className="text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { label: 'Add New User',    path: '/admin/users',     Icon: UserPlusIcon,   color: 'from-blue-500 to-cyan-500' },
                  { label: 'Create Project',  path: '/admin/projects',  Icon: FolderPlusIcon, color: 'from-emerald-500 to-teal-500' },
                  { label: 'View Reports',    path: '/admin/analytics', Icon: ChartBarIcon,   color: 'from-purple-500 to-pink-500' },
                  { label: 'System Settings', path: '/admin/settings',  Icon: CogIcon,        color: 'from-orange-500 to-red-500' },
                ].map((a, i) => (
                  <Link key={i} to={a.path} className="flex items-center space-x-3 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all">
                    <div className={`w-8 h-8 rounded-lg bg-linear-to-r ${a.color} flex items-center justify-center text-white shrink-0`}><a.Icon /></div>
                    <span className="text-sm">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Active Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0
                ? <p className="text-slate-400 text-sm">No projects found</p>
                : projects.map((p, i) => (
                  <div key={i} onClick={() => navigate(`/admin/projects/${p._id}`)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <h3 className="text-white font-medium mb-3">{p.name}</h3>
                    <div className="space-y-1 text-sm mb-3">
                      <div className="flex justify-between"><span className="text-slate-400">Key</span><span className="text-white font-mono">{p.projectKey}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Created</span><span className="text-white">{new Date(p.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500" style={{ width: p.status === 'active' ? '75%' : '40%' }} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">{p.status}</span>
                  </div>
                ))
              }
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;