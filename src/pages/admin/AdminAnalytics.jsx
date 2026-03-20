import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const AdminAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats]             = useState(null);
  const [users, setUsers]             = useState([]);
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const token    = localStorage.getItem('token');
  const headers  = { Authorization: `Bearer ${token}` };

  const navItems = [
    { name: 'Dashboard', path: '/admindashboard',  icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users',     path: '/admin/users',      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Projects',  path: '/admin/projects',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Analytics', path: '/admin/analytics',  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Settings',  path: '/admin/settings',   icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, projRes] = await Promise.all([
          fetch('http://localhost:3000/admin/stats',    { headers }),
          fetch('http://localhost:3000/users',          { headers }),
          fetch('http://localhost:3000/admin/projects', { headers }),
        ]);
        const [statsData, usersData, projData] = await Promise.all([
          statsRes.json(), usersRes.json(), projRes.json()
        ]);
        if (statsData.success) setStats(statsData.data);
        if (usersData.success) setUsers(usersData.data);
        if (projData.success)  setProjects(projData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // Count users by role
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1; return acc;
  }, {});

  // Count projects by status
  const projStatusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1; return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading analytics...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20">
          <div className="flex items-center justify-between mb-8 px-3">
            <h2 className="text-xl font-bold text-white">Bug Tracker</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-white/10'
                }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 left-3 right-3">
            <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">A</div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Admin User</p>
                  <p className="text-slate-400 text-xs">admin@company.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 py-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-slate-300 text-sm">System overview</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Top stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users',    value: stats?.totalUsers,    icon: '👥', color: 'from-blue-500 to-cyan-500' },
              { label: 'Total Projects', value: stats?.totalProjects, icon: '📊', color: 'from-emerald-500 to-teal-500' },
              { label: 'Total Bugs',     value: stats?.totalBugs,     icon: '🐛', color: 'from-orange-500 to-red-500' },
              { label: 'System Health',  value: stats?.systemHealth,  icon: '⚡', color: 'from-purple-500 to-pink-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-2xl mb-4`}>
                  {s.icon}
                </div>
                <h3 className="text-slate-300 text-sm mb-1">{s.label}</h3>
                <p className="text-3xl font-bold text-white">{s.value ?? '—'}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Users by Role */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Users by Role</h2>
              <div className="space-y-4">
                {Object.entries(roleCounts).map(([role, count]) => (
                  <div key={role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300 capitalize">{role.replace('_', ' ')}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${(count / users.length) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <p className="text-slate-400 text-sm">No users found</p>}
              </div>
            </div>

            {/* Projects by Status */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Projects by Status</h2>
              <div className="space-y-4">
                {Object.entries(projStatusCounts).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300 capitalize">{status}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${(count / projects.length) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-slate-400 text-sm">No projects found</p>}
              </div>
            </div>

          </div>

          {/* Recent Activity — latest 5 users */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Recent Registrations</h2>
            <div className="space-y-3">
              {users.slice(0, 5).map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-slate-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">{user.role}</span>
                    <p className="text-slate-400 text-xs mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;