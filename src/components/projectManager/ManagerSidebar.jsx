

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SidebarNotifications from '../SidebarNotifications'

const SettingsIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/managerdashboard',  countKey: null,       icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Projects',  path: '/manager/projects',  countKey: 'projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
  { name: 'Team',      path: '/manager/team',       countKey: null,       icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Bugs',      path: '/manager/bugs',       countKey: 'bugs',     icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { name: 'Reports',   path: '/manager/reports',    countKey: null,       icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { name: 'Settings',  path: '/manager/settings',   countKey: null,       isSettings: true },
]

const ManagerSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location  = useLocation()
  const [user, setUser]     = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
  const [counts, setCounts] = useState({ bugs: 0, projects: 0 })
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('managerSidebarCollapsed') === 'true')

  const toggleCollapse = () => setCollapsed(prev => {
    const next = !prev
    localStorage.setItem('managerSidebarCollapsed', String(next))
    window.dispatchEvent(new CustomEvent('sidebarToggled', { detail: { collapsed: next, role: 'manager' } }))
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
    const h = { Authorization: `Bearer ${token}` }
    const fetchCounts = async () => {
      try {
        const [bRes, pRes] = await Promise.all([
          fetch('http://localhost:3000/manager/bugs', { headers: h }),
          fetch('http://localhost:3000/manager/projects', { headers: h }),
        ])
        const [bData, pData] = await Promise.all([bRes.json(), pRes.json()])
        setCounts({
          bugs: bData.success ? (bData.data || []).filter(b => !b.resolved).length : 0,
          projects: pData.success ? (Array.isArray(pData.data) ? pData.data : []).filter(p => p.status === 'active').length : 0,
        })
      } catch (err) { console.error(err) }
    }
    fetchCounts()
    const h2 = () => fetchCounts()
    window.addEventListener('notificationUpdated', h2)
    return () => window.removeEventListener('notificationUpdated', h2)
  }, [])

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 w-64 ${collapsed ? 'lg:w-16' : 'lg:w-64'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full flex flex-col px-3 py-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden backdrop-blur-xl bg-white/10 border-r border-white/20">

          {/* Brand */}
          <div className={`flex items-center mb-6 ${collapsed ? 'justify-center' : 'justify-between px-1'}`}>
            {!collapsed && (
              <div>
                <Link to="/managerdashboard" className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">Bug Tracker</Link>
                <p className="text-slate-500 text-[10px]">Project Manager</p>
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

          {/* ✅ Inline Notifications */}
          <div className="border-t border-white/8 pt-2">
            <SidebarNotifications collapsed={collapsed} />
          </div>

          {/* User profile */}
          <div className="mt-2 pt-2 border-t border-white/8">
            {!collapsed ? (
              <Link to="/manager/settings" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-all group">
                {user.profilePic ? (
                  <img src={user.profilePic} className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white/15" alt="avatar" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">{user.firstName?.charAt(0) || 'M'}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-slate-500 text-xs truncate">{user.email}</p>
                </div>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            ) : (
              <div className="flex justify-center">
                <Link to="/manager/settings" title="Settings">
                  {user.profilePic ? (
                    <img src={user.profilePic} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/15" alt="avatar" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">{user.firstName?.charAt(0) || 'M'}</div>
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

export default ManagerSidebar