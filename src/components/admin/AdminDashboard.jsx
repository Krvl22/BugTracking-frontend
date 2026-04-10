import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import NotificationBell from '../NotificationBell'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const UsersIcon  = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
const FolderIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
const BugIcon    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
const ShieldIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>

const UserPlusIcon   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
const FolderPlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
const ChartBarIcon   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
const CogIcon        = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>

const roleColor = (r) => ({
  admin:           'bg-purple-500/20 text-purple-400',
  project_manager: 'bg-blue-500/20 text-blue-400',
  developer:       'bg-cyan-500/20 text-cyan-400',
  tester:          'bg-orange-500/20 text-orange-400',
}[r] || 'bg-slate-500/20 text-slate-400')

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats]             = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [projects, setProjects]       = useState([])
  const [loading, setLoading]         = useState(true)
  const mlClass = useSidebarCollapsed('adminSidebarCollapsed') // change key per role

  const navigate = useNavigate()
  const token    = localStorage.getItem('token')
  const headers  = { Authorization: `Bearer ${token}` }

  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || '{}')
  )
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
    const fetchAll = async () => {
      try {
        const [sR, uR, pR] = await Promise.all([
          fetch('http://localhost:3000/admin/stats',        { headers }),
          fetch('http://localhost:3000/admin/recent-users', { headers }),
          fetch('http://localhost:3000/admin/projects',     { headers }),
        ])
        const [sD, uD, pD] = await Promise.all([sR.json(), uR.json(), pR.json()])

        if (sD.success) {
          setStats([
            { label: 'Total Users',     value: String(sD.data.totalUsers    ?? 0), change: '+12%', pos: true,  Icon: UsersIcon,  color: 'from-blue-500 to-cyan-500' },
            { label: 'Active Projects', value: String(sD.data.totalProjects ?? 0), change: '+5%',  pos: true,  Icon: FolderIcon, color: 'from-emerald-500 to-teal-500' },
            { label: 'Total Bugs',      value: String(sD.data.totalBugs     ?? 0), change: '-8%',  pos: false, Icon: BugIcon,    color: 'from-orange-500 to-red-500' },
            { label: 'System Health',   value: sD.data.systemHealth ?? '—',        change: '+2%',  pos: true,  Icon: ShieldIcon, color: 'from-purple-500 to-pink-500' },
          ])
        }
        if (uD.success) setRecentUsers(uD.data || [])
        if (pD.success) setProjects((pD.data || []).filter(p => p.status === 'active'))
      } catch (err) {
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {/* ✅ Reusable AdminSidebar — hidden scrollbar inside */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/*
        ✅ Main content area:
        - overflow-y-auto so the page scrolls
        - [scrollbar-width:thin] + scrollbar-color for a transparent/subtle scrollbar on the MAIN page
        - On webkit: thin transparent track with semi-transparent thumb
      */}
      <div
        //className="lg:ml-64 overflow-y-auto h-screen
        className={`${mlClass} transition-all duration-300
          [scrollbar-width:thin]
          [scrollbar-color:rgba(255,255,255,0.15)_transparent]
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-white/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-white/35`
      }>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-300 text-sm">Welcome back, {currentUser.firstName || 'Admin'}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all"
            >
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
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${s.color} flex items-center justify-center text-white`}>
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
                        {u.profilePic
                          ? <img src={u.profilePic} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                          : <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">{u.firstName?.charAt(0) || 'U'}</div>
                        }
                        <div>
                          <p className="text-white font-medium">{u.firstName} {u.lastName}</p>
                          <p className="text-slate-400 text-sm">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColor(u.role)}`}>{u.role?.replace('_', ' ')}</span>
                        <br />
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{u.status}</span>
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
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${a.color} flex items-center justify-center text-white shrink-0`}><a.Icon /></div>
                    <span className="text-sm">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Active Projects</h2>
              <Link to="/admin/projects" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0
                ? <p className="text-slate-400 text-sm">No active projects</p>
                : projects.map((p, i) => (
                  <div key={i} onClick={() => navigate(`/admin/projects/${p._id}`)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <h3 className="text-white font-medium mb-3">{p.name}</h3>
                    <div className="space-y-1 text-sm mb-3">
                      <div className="flex justify-between"><span className="text-slate-400">Key</span><span className="text-white font-mono">{p.projectKey}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Team</span><span className="text-white">{p.teamMembers?.length || 0} members</span></div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '60%' }} />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">active</span>
                  </div>
                ))
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard