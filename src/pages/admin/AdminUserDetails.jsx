import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'
import AdminSidebar from '../../components/admin/AdminSidebar'

const AdminUserDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser]               = useState(null);
  const [tasks, setTasks]             = useState([]);
  const [auditLogs, setAuditLogs]     = useState([]);
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('overview');
  const mlClass = useSidebarCollapsed('adminSidebarCollapsed')

  const navigate  = useNavigate();
  const location  = useLocation();
  const { id }    = useParams(); // user id from URL
  const token     = localStorage.getItem('token');
  const headers   = { Authorization: `Bearer ${token}` };

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // ── 1. Fetch user info from users list ──
        const usersRes  = await fetch(`http://localhost:3000/users`, { headers });
        const usersData = await usersRes.json();
        if (usersData.success) {
          const found = usersData.data.find(u => u._id === id);
          setUser(found || null);
        }

        // ── 2. Fetch tasks assigned to this user ──
        const tasksRes  = await fetch(`http://localhost:3000/tasks?assignedTo=${id}`, { headers });
        const tasksData = await tasksRes.json();
        if (tasksData.success) setTasks(tasksData.data);

        // ── 3. Fetch this user's audit logs (activity) ──
        const logsRes  = await fetch(`http://localhost:3000/audit/user/${id}`, { headers });
        const logsData = await logsRes.json();
        if (logsData.success) setAuditLogs(logsData.data);

        // ── 4. Fetch all projects to find which ones this user created ──
        const projRes  = await fetch(`http://localhost:3000/admin/projects`, { headers });
        const projData = await projRes.json();
        if (projData.success) {
          // Show projects where user is createdBy
          const userProjects = projData.data.filter(
            p => p.createdBy && p.createdBy._id === id
          );
          setProjects(userProjects);
        }

      } catch (err) {
        console.error('Error fetching user detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // ── Helper: task status color ──
  const taskStatusColor = (status) => {
    const map = {
      to_do:           'bg-slate-500/20 text-slate-400',
      assigned:        'bg-blue-500/20 text-blue-400',
      in_progress:     'bg-yellow-500/20 text-yellow-400',
      submitted:       'bg-purple-500/20 text-purple-400',
      in_testing:      'bg-orange-500/20 text-orange-400',
      bug_found:       'bg-red-500/20 text-red-400',
      fix_in_progress: 'bg-orange-500/20 text-orange-400',
      resubmitted:     'bg-purple-500/20 text-purple-400',
      completed:       'bg-green-500/20 text-green-400',
    };
    return map[status] || 'bg-slate-500/20 text-slate-400';
  };

  // ── Helper: priority color ──
  const priorityColor = (priority) => {
    const map = {
      low:    'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high:   'bg-orange-500/20 text-orange-400',
      urgent: 'bg-red-500/20 text-red-400',
    };
    return map[priority] || 'bg-slate-500/20 text-slate-400';
  };

  // ── Helper: audit action color ──
  const actionColor = (action) => {
    if (action.includes('created'))   return 'bg-green-500/20 text-green-400';
    if (action.includes('login'))     return 'bg-blue-500/20 text-blue-400';
    if (action.includes('failed'))    return 'bg-red-500/20 text-red-400';
    if (action.includes('assigned'))  return 'bg-purple-500/20 text-purple-400';
    if (action.includes('completed')) return 'bg-cyan-500/20 text-cyan-400';
    return 'bg-slate-500/20 text-slate-400';
  };

  // ── Count tasks by status ──
  const completedTasks  = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => ['in_progress', 'assigned'].includes(t.status)).length;
  const bugTasks        = tasks.filter(t => t.status === 'bug_found').length;

  // ── Last login from audit logs ──
  const lastLoginLog = auditLogs.find(l => l.action === 'login_success');
  const lastLogin    = lastLoginLog
    ? new Date(lastLoginLog.createdAt).toLocaleString()
    : user?.lastLogin
      ? new Date(user.lastLogin).toLocaleString()
      : 'Never recorded';

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading user details...</p>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">User not found</p>
        <Link to="/admin/users" className="text-blue-400 hover:text-blue-300">← Back to Users</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
      </div>

      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Main Content */}
      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>

        {/* Top Bar */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {/* Back button */}
                <button onClick={() => navigate('/admin/users')}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm">Back to Users</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h1>
                  <p className="text-slate-300 text-sm capitalize">{user.role?.replace('_', ' ')}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* ── User Profile Card ── */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user.firstName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                  <p className="text-slate-400">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 capitalize">
                      {user.role?.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-2xl font-bold text-white">{tasks.length}</p>
                  <p className="text-slate-400 text-xs mt-1">Total Tasks</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-2xl font-bold text-green-400">{completedTasks}</p>
                  <p className="text-slate-400 text-xs mt-1">Completed</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-2xl font-bold text-red-400">{bugTasks}</p>
                  <p className="text-slate-400 text-xs mt-1">Bugs Found</p>
                </div>
              </div>
            </div>

            {/* Info row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-slate-400 text-xs mb-1">Joined</p>
                <p className="text-white text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Last Login</p>
                <p className="text-white text-sm">{lastLogin}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">In Progress Tasks</p>
                <p className="text-white text-sm">{inProgressTasks}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Projects</p>
                <p className="text-white text-sm">{projects.length}</p>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex space-x-2 border-b border-white/10 pb-0">
            {['overview', 'tasks', 'projects', 'activity'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white/10 text-white border border-white/20 border-b-0'
                    : 'text-slate-400 hover:text-white'
                }`}>
                {tab}
                {tab === 'tasks'    && <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{tasks.length}</span>}
                {tab === 'activity' && <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">{auditLogs.length}</span>}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Recent Tasks */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Recent Tasks</h3>
                {tasks.length === 0 ? (
                  <p className="text-slate-400 text-sm">No tasks assigned</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 4).map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white text-sm font-medium">{task.title}</p>
                          <p className="text-slate-400 text-xs">{task.issueKey}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
                          {task.status?.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                {auditLogs.length === 0 ? (
                  <p className="text-slate-400 text-sm">No activity recorded</p>
                ) : (
                  <div className="space-y-3">
                    {auditLogs.slice(0, 4).map((log, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${actionColor(log.action)}`}>
                          {log.action?.replace(/_/g, ' ')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-300 text-xs truncate">{log.targetName || log.details || '—'}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── TASKS TAB ── */}
          {activeTab === 'tasks' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
              {tasks.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-400">No tasks assigned to this user</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Task</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Project</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Priority</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="text-white text-sm font-medium">{task.title}</p>
                          <p className="text-slate-400 text-xs">{task.issueKey}</p>
                        </td>
                        <td className="p-4 text-slate-300 text-sm">
                          {task.project?.name || '—'}
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
                            {task.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-sm">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {activeTab === 'projects' && (
            <div>
              {projects.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No projects created by this user</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, i) => (
                    <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-semibold">{project.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>{project.status}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{project.description || 'No description'}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Key</span>
                        <span className="text-white font-mono">{project.projectKey}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-400">Created</span>
                        <span className="text-white">{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ACTIVITY TAB ── */}
          {activeTab === 'activity' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-6">Full Activity Log</h3>
              {auditLogs.length === 0 ? (
                <p className="text-slate-400 text-sm">No activity recorded for this user</p>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log, i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      {/* Timeline dot */}
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${actionColor(log.action)}`}>
                            {log.action?.replace(/_/g, ' ')}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {log.targetName && (
                          <p className="text-slate-300 text-sm mt-1">
                            Target: <span className="text-white">{log.targetName}</span>
                          </p>
                        )}
                        {log.details && (
                          <p className="text-slate-400 text-xs mt-1">{log.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminUserDetails;

