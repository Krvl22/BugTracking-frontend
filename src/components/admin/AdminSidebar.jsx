import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SidebarNotifications from '../SidebarNotifications'

const SettingsIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admindashboard',   countKey: null,       icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Users',     path: '/admin/users',       countKey: 'users',    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Projects',  path: '/admin/projects',    countKey: 'projects', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { name: 'Analytics', path: '/admin/analytics',   countKey: null,       icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { name: 'Settings',  path: '/admin/settings',    countKey: null,       isSettings: true },
]

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const token    = localStorage.getItem('token')
  const headers  = { Authorization: `Bearer ${token}` }
  const [counts, setCounts]       = useState({ users: 0, projects: 0 })
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('adminSidebarCollapsed') === 'true')

  const toggleCollapse = () => setCollapsed(prev => {
    const next = !prev
    localStorage.setItem('adminSidebarCollapsed', String(next))
    window.dispatchEvent(new CustomEvent('sidebarToggled', { detail: { collapsed: next, role: 'admin' } }))
    return next
  })

  useEffect(() => {
    const sync = () => setCurrentUser(JSON.parse(localStorage.getItem('user') || '{}'))
    window.addEventListener('storage', sync)
    window.addEventListener('userUpdated', sync)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('userUpdated', sync) }
  }, [])

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          fetch('http://localhost:3000/users', { headers }),
          fetch('http://localhost:3000/admin/stats', { headers }),
        ])
        const [usersData, statsData] = await Promise.all([usersRes.json(), statsRes.json()])
        setCounts({
          users: usersData.success ? usersData.data.filter(u => u.role !== 'admin').length : 0,
          projects: statsData.success ? (statsData.data.totalProjects ?? 0) : 0,
        })
      } catch (err) { console.error(err) }
    }
    fetchCounts()
    const h = () => fetchCounts()
    window.addEventListener('notificationUpdated', h)
    return () => window.removeEventListener('notificationUpdated', h)
  }, [])

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 w-64 ${collapsed ? 'lg:w-16' : 'lg:w-64'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full flex flex-col px-3 py-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden backdrop-blur-xl bg-slate-900/80 border-r border-white/10">

          <div className={`flex items-center mb-6 ${collapsed ? 'justify-center' : 'justify-between px-1'}`}>
            {!collapsed && (
              <div>
                <Link to="/admindashboard" className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">Bug Tracker</Link>
                <p className="text-slate-500 text-[10px]">Administrator</p>
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
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${collapsed ? 'justify-center' : 'justify-between'} ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-white/8 hover:text-white'}`}>
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
              <Link to="/admin/settings" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-all group">
                {currentUser?.profilePic ? (
                  <img src={currentUser.profilePic} className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white/15" alt="avatar" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">{currentUser.firstName?.charAt(0) || 'A'}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-slate-500 text-xs truncate">{currentUser.email}</p>
                </div>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            ) : (
              <div className="flex justify-center">
                <Link to="/admin/settings" title="Settings">
                  {currentUser?.profilePic ? (
                    <img src={currentUser.profilePic} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/15" alt="avatar" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">{currentUser.firstName?.charAt(0) || 'A'}</div>
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

export default AdminSidebar