import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

// ── SVG Icons ──────────────────────────────────────────────────────
const UsersIcon  = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const FolderIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>;
const BugIcon    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>;
const ShieldIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;

// ── Color helpers ──────────────────────────────────────────────────
const severityColor = (s) => ({ critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-green-500/20 text-green-400' }[s] || 'bg-slate-500/20 text-slate-400');
const severityBar   = (s) => ({ critical: 'from-red-500 to-red-400', high: 'from-orange-500 to-orange-400', medium: 'from-yellow-500 to-yellow-400', low: 'from-green-500 to-green-400' }[s] || 'from-slate-500 to-slate-400');
const actionColor   = (a) => { if (a?.includes('created')) return 'bg-green-500/20 text-green-400'; if (a?.includes('login')) return 'bg-blue-500/20 text-blue-400'; if (a?.includes('failed')) return 'bg-red-500/20 text-red-400'; if (a?.includes('assigned')) return 'bg-purple-500/20 text-purple-400'; if (a?.includes('completed')) return 'bg-cyan-500/20 text-cyan-400'; return 'bg-slate-500/20 text-slate-400'; };

// ── Reusable bar row ───────────────────────────────────────────────
const BarRow = ({ label, count, total, colorClass, badge }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      {badge
        ? <span className={`capitalize px-2 py-0.5 rounded-full text-xs ${badge}`}>{label}</span>
        : <span className="text-slate-300 capitalize">{label.replace(/_/g, ' ')}</span>}
      <span className="text-white font-medium">{count}{total ? ` / ${total}` : ''}</span>
    </div>
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full bg-linear-to-r ${colorClass} rounded-full`}
        style={{ width: total ? `${(count / total) * 100}%` : '0%' }} />
    </div>
  </div>
);

// ── Nav items ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admindashboard', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Users',     path: '/admin/users',     d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Projects',  path: '/admin/projects',  d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { name: 'Analytics', path: '/admin/analytics', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { name: 'Settings',  path: '/admin/settings',  d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

const AdminAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats]             = useState(null);
  const [users, setUsers]             = useState([]);
  const [projects, setProjects]       = useState([]);
  const [tasks, setTasks]             = useState([]);
  const [bugs, setBugs]               = useState([]);
  const [auditLogs, setAuditLogs]     = useState([]);
  const [loading, setLoading]         = useState(true);

  const navigate   = useNavigate();
  const location   = useLocation();
  const token      = localStorage.getItem('token');
  const headers    = { Authorization: `Bearer ${token}` };
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))

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
        const [sR, uR, pR, tR, bR, lR] = await Promise.all([
          fetch('http://localhost:3000/admin/stats',    { headers }),
          fetch('http://localhost:3000/users',          { headers }),
          fetch('http://localhost:3000/admin/projects', { headers }),
          fetch('http://localhost:3000/tasks',          { headers }),
          fetch('http://localhost:3000/bugs',           { headers }),
          fetch('http://localhost:3000/audit',          { headers }),
        ]);
        const [sD, uD, pD, tD, bD, lD] = await Promise.all([sR.json(), uR.json(), pR.json(), tR.json(), bR.json(), lR.json()]);
        if (sD.success) setStats(sD.data);
        if (uD.success) setUsers(uD.data);
        if (pD.success) setProjects(pD.data);
        if (tD.success) setTasks(tD.data);
        if (bD.success) setBugs(bD.data);
        if (lD.success) setAuditLogs(lD.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // Chart Data
  const bugChartData = Object.entries(bugSeverityCounts).map(([key, value]) => ({
    name: key,
    value
  }));

  const taskChartData = Object.entries(taskStatusCounts).map(([key, value]) => ({
    name: key,
    value
  }));

const COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444"];

  // ── Computed ──────────────────────────────────────────────────────
  const roleCounts        = users.reduce((a, u)    => ({ ...a, [u.role]:         (a[u.role]         || 0) + 1 }), {});
  const projStatusCounts  = projects.reduce((a, p) => ({ ...a, [p.status]:       (a[p.status]       || 0) + 1 }), {});
  const taskStatusCounts  = tasks.reduce((a, t)    => ({ ...a, [t.status]:       (a[t.status]       || 0) + 1 }), {});
  const bugSeverityCounts = bugs.reduce((a, b)     => ({ ...a, [b.bugSeverity]:  (a[b.bugSeverity]  || 0) + 1 }), {});
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const completionRate    = projects.length ? Math.round((completedProjects / projects.length) * 100) : 0;

  const topActiveUsers = Object.values(
    auditLogs.reduce((a, log) => {
      const id = log.performedBy?._id;
      if (!id) return a;
      if (!a[id]) a[id] = { user: log.performedBy, count: 0 };
      a[id].count++;
      return a;
    }, {})
  ).sort((a, b) => b.count - a.count).slice(0, 5);

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading analytics...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
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
            <Link
              to="/admin/settings"
              className="block backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center space-x-3">
                {currentUser?.profilePic ? (
                  <img src={currentUser.profilePic} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
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
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics</h1>
              <p className="text-slate-300 text-sm">Full system overview</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* 1. Stat Cards — SVG icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users',    value: stats?.totalUsers,    Icon: UsersIcon,  color: 'from-blue-500 to-cyan-500' },
              { label: 'Total Projects', value: stats?.totalProjects, Icon: FolderIcon, color: 'from-emerald-500 to-teal-500' },
              { label: 'Total Bugs',     value: stats?.totalBugs,     Icon: BugIcon,    color: 'from-orange-500 to-red-500' },
              { label: 'System Health',  value: stats?.systemHealth,  Icon: ShieldIcon, color: 'from-purple-500 to-pink-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white mb-4`}><s.Icon /></div>
                <h3 className="text-slate-300 text-sm mb-1">{s.label}</h3>
                <p className="text-3xl font-bold text-white">{s.value ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* 2. Project Completion Rate */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Project Completion Rate</h2>
                <p className="text-slate-400 text-sm">{completedProjects} of {projects.length} projects completed</p>
              </div>
              <span className="text-4xl font-bold text-cyan-400">{completionRate}%</span>
            </div>
            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-linear-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${completionRate}%` }} />
            </div>
            <div className="flex space-x-6 text-sm">
              <span className="text-green-400">✓ Completed: {projStatusCounts['completed'] || 0}</span>
              <span className="text-yellow-400">◉ Active: {projStatusCounts['active'] || 0}</span>
              <span className="text-slate-400">○ Inactive: {projStatusCounts['inactive'] || 0}</span>
            </div>
          </div>

          {/* 3. Users by Role + Projects by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Users by Role</h2>
              <div className="space-y-4">
                {Object.entries(roleCounts).map(([r, c]) => (
                  <BarRow key={r} label={r} count={c} total={users.length} colorClass="from-blue-500 to-cyan-500" />
                ))}
                {!users.length && <p className="text-slate-400 text-sm">No users found</p>}
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Projects by Status</h2>
              <div className="space-y-4">
                {Object.entries(projStatusCounts).map(([s, c]) => (
                  <BarRow key={s} label={s} count={c} total={projects.length} colorClass="from-emerald-500 to-teal-500" />
                ))}
                {!projects.length && <p className="text-slate-400 text-sm">No projects found</p>}
              </div>
            </div>
          </div>

          {/* 4. Task Status + Bug Severity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-1">Task Status Distribution</h2>
              <p className="text-slate-400 text-sm mb-6">{tasks.length} total tasks</p>
              {!tasks.length
                ? <p className="text-slate-400 text-sm">No tasks found</p>
                : <div className="space-y-3">
                    {Object.entries(taskStatusCounts).sort((a, b) => b[1] - a[1]).map(([s, c]) => (
                      <BarRow key={s} label={s} count={c} total={tasks.length} colorClass="from-blue-500 to-purple-500" />
                    ))}
                  </div>
              }
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-1">Bug Severity Breakdown</h2>
              <p className="text-slate-400 text-sm mb-6">{bugs.length} total bug reports</p>
              {!bugs.length
                ? <p className="text-slate-400 text-sm">No bug reports found</p>
                : <div className="space-y-3">
                    {['critical', 'high', 'medium', 'low'].map(s => (
                      <BarRow key={s} label={s} count={bugSeverityCounts[s] || 0} total={bugs.length} colorClass={severityBar(s)} badge={severityColor(s)} />
                    ))}
                  </div>
              }
            </div>
          </div>
            
          {/* 4. Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Bug Severity Pie Chart */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Bug Severity Chart</h2>

              {!bugs.length ? (
                <p className="text-slate-400 text-sm">No bug data</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={bugChartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                    >
                      {bugChartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Task Status Bar Chart */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Task Status Chart</h2>

              {!tasks.length ? (
                <p className="text-slate-400 text-sm">No task data</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={taskChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#cbd5f5" />
                    <YAxis stroke="#cbd5f5" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>

          {/* 5. Most Active Users + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-1">Most Active Users</h2>
              <p className="text-slate-400 text-sm mb-6">Ranked by audit log actions</p>
              {!topActiveUsers.length
                ? <p className="text-slate-400 text-sm">No activity yet</p>
                : <div className="space-y-3">
                    {topActiveUsers.map((e, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-yellow-500/30 text-yellow-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-slate-400'}`}>#{i + 1}</div>
                        <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shrink-0">{e.user?.firstName?.charAt(0) || '?'}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{e.user?.firstName} {e.user?.lastName}</p>
                          <p className="text-slate-400 text-xs capitalize">{e.user?.role?.replace('_', ' ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-cyan-400 font-bold text-sm">{e.count}</p>
                          <p className="text-slate-500 text-xs">actions</p>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-1">Recent System Activity</h2>
              <p className="text-slate-400 text-sm mb-6">Last 10 actions</p>
              {!auditLogs.length
                ? <p className="text-slate-400 text-sm">No activity yet</p>
                : <div className="space-y-3">
                    {auditLogs.slice(0, 10).map((log, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${actionColor(log.action)}`}>{log.action?.replace(/_/g, ' ')}</span>
                            <span className="text-slate-500 text-xs">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-300 text-xs mt-1">by <span className="text-white">{log.performedBy?.firstName} {log.performedBy?.lastName}</span>{log.targetName ? ` → ${log.targetName}` : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

          {/* 6. Recent Registrations */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Recent Registrations</h2>
            <div className="space-y-3">
              {users.slice(0, 5).map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">{u.firstName?.charAt(0)}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{u.firstName} {u.lastName}</p>
                      <p className="text-slate-400 text-xs">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 capitalize">{u.role?.replace('_', ' ')}</span>
                    <p className="text-slate-400 text-xs mt-1">{new Date(u.createdAt).toLocaleDateString()}</p>
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