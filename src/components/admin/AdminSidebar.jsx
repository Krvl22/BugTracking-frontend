// import { useState, useEffect } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'

// const NAV_ITEMS = [
//   {
//     name: 'Dashboard',
//     path: '/admindashboard',
//     d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
//     countKey: null,
//   },
//   {
//     name: 'Users',
//     path: '/admin/users',
//     d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
//     countKey: 'users',
//   },
//   {
//     name: 'Projects',
//     path: '/admin/projects',
//     d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
//     countKey: 'projects',
//   },
//   {
//     name: 'Analytics',
//     path: '/admin/analytics',
//     d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
//     countKey: null,
//   },
//   {
//     name: 'Settings',
//     path: '/admin/settings',
//     d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
//     countKey: null,
//   },
// ]

// const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const location    = useLocation()
//   const navigate    = useNavigate()
//   const token       = localStorage.getItem('token')
//   const headers     = { Authorization: `Bearer ${token}` }

//   const [counts, setCounts]           = useState({ users: 0, projects: 0, bugs: 0 })
//   const [currentUser, setCurrentUser] = useState(() =>
//     JSON.parse(localStorage.getItem('user') || '{}')
//   )

//   // Sync user from localStorage
//   useEffect(() => {
//     const sync = () => setCurrentUser(JSON.parse(localStorage.getItem('user') || '{}'))
//     window.addEventListener('storage', sync)
//     window.addEventListener('userUpdated', sync)
//     return () => {
//       window.removeEventListener('storage', sync)
//       window.removeEventListener('userUpdated', sync)
//     }
//   }, [])

//   // Fetch dynamic counts
//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const [usersRes, statsRes] = await Promise.all([
//           fetch('http://localhost:3000/users', { headers }),
//           fetch('http://localhost:3000/admin/stats', { headers }),
//         ])
//         const [usersData, statsData] = await Promise.all([usersRes.json(), statsRes.json()])

//         const userCount    = usersData.success ? usersData.data.filter(u => u.role !== 'admin').length : 0
//         const projectCount = statsData.success ? (statsData.data.totalProjects ?? 0) : 0
//         const bugCount     = statsData.success ? (statsData.data.totalBugs ?? 0) : 0

//         setCounts({ users: userCount, projects: projectCount, bugs: bugCount })
//       } catch (err) {
//         console.error('Sidebar counts error:', err)
//       }
//     }
//     fetchCounts()

//     // Re-fetch when notificationUpdated fires (e.g. after task create)
//     const handler = () => fetchCounts()
//     window.addEventListener('notificationUpdated', handler)
//     return () => window.removeEventListener('notificationUpdated', handler)
//   }, [])

//   const handleLogout = () => { localStorage.clear(); navigate('/') }

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-black/40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <aside
//         className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:translate-x-0`}
//       >
//         {/*
//           SCROLLBAR RULES:
//           - Main page body: transparent/visible scrollbar (handled in index.css / tailwind)
//           - This sidebar: hidden scrollbar via [scrollbar-width:none] / [-ms-overflow-style:none] / [&::-webkit-scrollbar]:hidden
//         */}
//         <div className="h-full px-3 py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">

//           {/* Brand */}
//           <div className="flex items-center justify-between mb-8 px-3">
//             <Link
//               to="/admindashboard"
//               className="text-xl font-bold text-white hover:text-cyan-300 transition-colors"
//             >
//               Bug Tracker
//             </Link>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="lg:hidden text-white hover:text-slate-300"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Nav */}
//           <nav className="space-y-1 flex-1">
//             {NAV_ITEMS.map(item => {
//               const isActive = location.pathname === item.path
//               const badge    = item.countKey ? counts[item.countKey] : null

//               return (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
//                     isActive
//                       ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
//                       : 'text-slate-300 hover:bg-white/10'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
//                     </svg>
//                     <span className="text-sm font-medium">{item.name}</span>
//                   </div>

//                   {/* Dynamic badge */}
//                   {badge != null && badge > 0 && (
//                     <span
//                       className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center ${
//                         isActive
//                           ? 'bg-white/25 text-white'
//                           : 'bg-blue-500/25 text-blue-300 group-hover:bg-blue-500/40'
//                       }`}
//                     >
//                       {badge}
//                     </span>
//                   )}
//                 </Link>
//               )
//             })}
//           </nav>

//           {/* User profile card at bottom */}
//           <div className="mt-4 pt-4 border-t border-white/10">
//             <Link
//               to="/admin/settings"
//               className="block bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all"
//             >
//               <div className="flex items-center space-x-3">
//                 {currentUser?.profilePic ? (
//                   <img
//                     src={currentUser.profilePic}
//                     className="w-10 h-10 rounded-full object-cover shrink-0"
//                     alt="avatar"
//                   />
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">
//                     {currentUser.firstName?.charAt(0) || 'A'}
//                   </div>
//                 )}
//                 <div className="min-w-0 flex-1">
//                   <p className="text-white text-sm font-medium truncate">
//                     {currentUser.firstName} {currentUser.lastName}
//                   </p>
//                   <p className="text-slate-400 text-xs truncate">{currentUser.email}</p>
//                 </div>
//                 <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//             </Link>
//           </div>

//         </div>
//       </aside>
//     </>
//   )
// }

// export default AdminSidebar

import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NotificationBell from '../NotificationBell'

// ✅ Fixed Settings icon (proper double-path cog)
const SettingsIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

// ✅ Collapse toggle icon
const CollapseIcon = ({ collapsed }) => (
  <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
)

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/admindashboard',
    d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    countKey: null,
  },
  {
    name: 'Users',
    path: '/admin/users',
    d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    countKey: 'users',
  },
  {
    name: 'Projects',
    path: '/admin/projects',
    d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    countKey: 'projects',
  },
  {
    name: 'Analytics',
    path: '/admin/analytics',
    d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    countKey: null,
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    isSettings: true,
    countKey: null,
  },
]

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location    = useLocation()
  const navigate    = useNavigate()
  const token       = localStorage.getItem('token')
  const headers     = { Authorization: `Bearer ${token}` }

  // ✅ Collapsible state — persisted in localStorage
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('adminSidebarCollapsed') === 'true')

  const [counts, setCounts]           = useState({ users: 0, projects: 0, bugs: 0 })
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || '{}')
  )

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('adminSidebarCollapsed', String(next))
      window.dispatchEvent(new Event('sidebarToggled'))
      return next
    })
  }

  useEffect(() => {
    const sync = () => setCurrentUser(JSON.parse(localStorage.getItem('user') || '{}'))
    window.addEventListener('storage', sync)
    window.addEventListener('userUpdated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('userUpdated', sync)
    }
  }, [])

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          fetch('http://localhost:3000/users', { headers }),
          fetch('http://localhost:3000/admin/stats', { headers }),
        ])
        const [usersData, statsData] = await Promise.all([usersRes.json(), statsRes.json()])
        const userCount    = usersData.success ? usersData.data.filter(u => u.role !== 'admin').length : 0
        const projectCount = statsData.success ? (statsData.data.totalProjects ?? 0) : 0
        const bugCount     = statsData.success ? (statsData.data.totalBugs ?? 0) : 0
        setCounts({ users: userCount, projects: projectCount, bugs: bugCount })
      } catch (err) {
        console.error('Sidebar counts error:', err)
      }
    }
    fetchCounts()
    const handler = () => fetchCounts()
    window.addEventListener('notificationUpdated', handler)
    return () => window.removeEventListener('notificationUpdated', handler)
  }, [])

  // ✅ Sidebar width: collapsed = w-16 (icons only), expanded = w-64
  const sidebarW = collapsed ? 'lg:w-16' : 'lg:w-64'
  const contentML = collapsed ? 'lg:ml-16' : 'lg:ml-64'

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300
          w-64 ${sidebarW}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">

          {/* Brand + Collapse Toggle */}
          <div className={`flex items-center mb-8 px-1 ${collapsed ? 'justify-center' : 'justify-between px-3'}`}>
            {!collapsed && (
              <Link to="/admindashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
                Bug Tracker
              </Link>
            )}
            <div className="flex items-center gap-2">
              {/* Mobile close */}
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white hover:text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Desktop collapse toggle */}
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <CollapseIcon collapsed={collapsed} />
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1 flex-1">
            {NAV_ITEMS.map(item => {
              const isActive = location.pathname === item.path
              const badge    = item.countKey ? counts[item.countKey] : null

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group
                    ${collapsed ? 'justify-center' : 'justify-between'}
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-white/10'
                    }`}
                >
                  <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                    {item.isSettings ? (
                      <SettingsIcon />
                    ) : (
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
                      </svg>
                    )}
                    {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                  </div>

                  {!collapsed && badge != null && badge > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center ${
                      isActive ? 'bg-white/25 text-white' : 'bg-blue-500/25 text-blue-300 group-hover:bg-blue-500/40'
                    }`}>
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ✅ NotificationBell — above user profile */}
          <div className={`mt-4 pt-4 border-t border-white/10 flex ${collapsed ? 'justify-center' : 'justify-start px-1'}`}>
            <div className={`${collapsed ? '' : 'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5'}`}>
              {!collapsed && <span className="text-slate-400 text-xs font-medium">Notifications</span>}
              <NotificationBell />
            </div>
          </div>

          {/* User profile card */}
          {!collapsed && (
            <div className="mt-2">
              <Link to="/admin/settings" className="block bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  {currentUser?.profilePic ? (
                    <img src={currentUser.profilePic} className="w-10 h-10 rounded-full object-cover shrink-0" alt="avatar" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">
                      {currentUser.firstName?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-slate-400 text-xs truncate">{currentUser.email}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          )}

          {/* Collapsed: show avatar only */}
          {collapsed && (
            <div className="mt-2 flex justify-center">
              <Link to="/admin/settings" title="Settings">
                {currentUser?.profilePic ? (
                  <img src={currentUser.profilePic} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20" alt="avatar" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.firstName?.charAt(0) || 'A'}
                  </div>
                )}
              </Link>
            </div>
          )}

        </div>
      </aside>

      {/* ✅ Export the contentML class so dashboard can use it */}
      <style>{`:root { --admin-content-ml: ${collapsed ? '4rem' : '16rem'}; }`}</style>
    </>
  )
}

// ✅ Export a hook so dashboards can react to collapse state
export { AdminSidebar as default }