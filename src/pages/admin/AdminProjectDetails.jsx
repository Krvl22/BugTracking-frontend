import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';

const AdminProjectDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [project, setProject]         = useState(null);
  const [modules, setModules]         = useState([]);
  const [tasks, setTasks]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('overview');

  const navigate  = useNavigate();
  const location  = useLocation();
  const { id }    = useParams();
  const token     = localStorage.getItem('token');
  const headers   = { Authorization: `Bearer ${token}` };

  // ── Read logged-in user from localStorage ──
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name: 'Dashboard', path: '/admindashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users',     path: '/admin/users',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Projects',  path: '/admin/projects',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Settings',  path: '/admin/settings',  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // ── 1. Get project detail ──
        const projRes  = await fetch(`http://localhost:3000/projects/${id}`, { headers });
        const projData = await projRes.json();
        if (projData.success) setProject(projData.data);

        // ── 2. Get modules for this project ──
        const modRes  = await fetch(`http://localhost:3000/modules?projectId=${id}`, { headers });
        const modData = await modRes.json();
        if (modData.success) setModules(modData.data);

        // ── 3. Get tasks for this project ──
        const taskRes  = await fetch(`http://localhost:3000/tasks?project=${id}`, { headers });
        const taskData = await taskRes.json();
        if (taskData.success) setTasks(taskData.data);

      } catch (err) {
        console.error('Error fetching project detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // ── Helper: how long the project took (only for completed) ──
  const getProjectDuration = () => {
    if (!project?.startDate || !project?.updatedAt) return null;
    const start = new Date(project.startDate);
    const end   = new Date(project.updatedAt);
    const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days < 30)  return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months ${days % 30} days`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''}`;
  };

  // ── Unique users working on tasks ──
  const usersOnProject = () => {
    const seen = new Set();
    const users = [];
    tasks.forEach(task => {
      if (task.assignedTo && !seen.has(task.assignedTo._id)) {
        seen.add(task.assignedTo._id);
        users.push(task.assignedTo);
      }
    });
    return users;
  };

  // ── Task status helpers ──
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

  const priorityColor = (priority) => {
    const map = {
      low:    'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high:   'bg-orange-500/20 text-orange-400',
      urgent: 'bg-red-500/20 text-red-400',
    };
    return map[priority] || 'bg-slate-500/20 text-slate-400';
  };

  const statusColor = (status) => {
    if (status === 'active')    return 'bg-green-500/20 text-green-400';
    if (status === 'completed') return 'bg-blue-500/20 text-blue-400';
    return 'bg-yellow-500/20 text-yellow-400';
  };

  // ── Task counts ──
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const bugTasks       = tasks.filter(t => t.status === 'bug_found').length;
  const activeTasks    = tasks.filter(t => !['completed'].includes(t.status)).length;
  const progressPct    = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading project...</p>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Project not found</p>
        <Link to="/admin/projects" className="text-blue-400 hover:text-blue-300">← Back to Projects</Link>
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
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20 relative">
          <div className="flex items-center justify-between mb-8 px-3">
            <Link to="/admindashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">Bug Tracker</Link>
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

          {/* ── FIXED: Real admin name from localStorage ── */}
          <div className="absolute bottom-4 left-3 right-3">
            <Link to="/admin/settings" className="block backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex items-center space-x-3">
                {storedUser.profilePic ? (
                  <img src={storedUser.profilePic} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">{storedUser.firstName?.charAt(0)||'A'}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{storedUser.firstName} {storedUser.lastName}</p>
                  <p className="text-slate-400 text-xs truncate">{storedUser.email}</p>
                </div>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">

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
                <button onClick={() => navigate('/admin/projects')}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm">Back to Projects</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-slate-400 text-sm font-mono">{project.projectKey}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* ── Project Info Card ── */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Basic info */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-bold text-white mb-3">{project.name}</h2>
                <p className="text-slate-400 text-sm mb-4">{project.description || 'No description provided'}</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-slate-400 w-24">Project Key</span>
                    <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{project.projectKey}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-slate-400 w-24">Created By</span>
                    <span className="text-white">
                      {project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-slate-400 w-24">Created At</span>
                    <span className="text-white">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  {project.startDate && (
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-slate-400 w-24">Start Date</span>
                      <span className="text-white">{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {project.endDate && (
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-slate-400 w-24">End Date</span>
                      <span className="text-white">{new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {/* ── Show duration only if completed ── */}
                  {project.status === 'completed' && getProjectDuration() && (
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-slate-400 w-24">Duration</span>
                      <span className="text-cyan-400 font-medium">⏱ {getProjectDuration()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick stat cards */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-3xl font-bold text-white">{tasks.length}</p>
                  <p className="text-slate-400 text-xs mt-1">Total Tasks</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
                  <p className="text-slate-400 text-xs mt-1">Completed</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-3xl font-bold text-yellow-400">{activeTasks}</p>
                  <p className="text-slate-400 text-xs mt-1">In Progress</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-3xl font-bold text-red-400">{bugTasks}</p>
                  <p className="text-slate-400 text-xs mt-1">Bugs Found</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Overall Progress</span>
                  <span className="text-white font-medium">{progressPct}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* ── Tabs ── */}
          <div className="flex space-x-2 border-b border-white/10">
            {['overview', 'modules', 'tasks', 'team'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white/10 text-white border border-white/20 border-b-0'
                    : 'text-slate-400 hover:text-white'
                }`}>
                {tab}
                {tab === 'modules' && <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{modules.length}</span>}
                {tab === 'tasks'   && <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{tasks.length}</span>}
                {tab === 'team'    && <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{usersOnProject().length}</span>}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent tasks */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Recent Tasks</h3>
                {tasks.length === 0 ? (
                  <p className="text-slate-400 text-sm">No tasks yet</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 5).map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white text-sm font-medium">{task.title}</p>
                          <p className="text-slate-400 text-xs">{task.issueKey}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColor(task.status)}`}>
                          {task.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modules summary */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Modules</h3>
                {modules.length === 0 ? (
                  <p className="text-slate-400 text-sm">No modules yet</p>
                ) : (
                  <div className="space-y-3">
                    {modules.map((mod, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white text-sm font-medium">{mod.name}</p>
                          <p className="text-slate-400 text-xs">{mod.description || 'No description'}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(mod.status)}`}>
                          {mod.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── MODULES TAB ── */}
          {activeTab === 'modules' && (
            <div>
              {modules.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No modules in this project</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map((mod, i) => (
                    <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-semibold">{mod.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColor(mod.status)}`}>
                          {mod.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{mod.description || 'No description'}</p>

                      {/* Tasks in this module */}
                      <div className="space-y-1 mb-3">
                        <p className="text-slate-400 text-xs">
                          Tasks in module: <span className="text-white font-medium">
                            {tasks.filter(t => t.module?._id === mod._id || t.module === mod._id).length}
                          </span>
                        </p>
                        <p className="text-slate-400 text-xs">
                          Completed: <span className="text-green-400 font-medium">
                            {tasks.filter(t => (t.module?._id === mod._id || t.module === mod._id) && t.status === 'completed').length}
                          </span>
                        </p>
                      </div>

                      <div className="text-xs text-slate-500 pt-3 border-t border-white/10">
                        Created by {mod.createdBy ? `${mod.createdBy.firstName} ${mod.createdBy.lastName}` : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TASKS TAB ── */}
          {activeTab === 'tasks' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
              {tasks.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-400">No tasks in this project</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Task</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Module</th>
                      <th className="text-left p-4 text-slate-300 text-sm font-medium">Assigned To</th>
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
                          {task.module?.name || '—'}
                        </td>
                        <td className="p-4">
                          {task.assignedTo ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                {task.assignedTo.firstName?.charAt(0)}
                              </div>
                              <span className="text-slate-300 text-sm">
                                {task.assignedTo.firstName} {task.assignedTo.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-sm">Unassigned</span>
                          )}
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

          {/* ── TEAM TAB ── */}
          {activeTab === 'team' && (
            <div>
              {usersOnProject().length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                  <p className="text-slate-400">No users assigned to tasks in this project yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {usersOnProject().map((user, i) => {
                    const userTasks      = tasks.filter(t => t.assignedTo?._id === user._id);
                    const userCompleted  = userTasks.filter(t => t.status === 'completed').length;
                    const userInProgress = userTasks.filter(t => ['in_progress', 'assigned'].includes(t.status)).length;
                    return (
                      <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">
                            {user.firstName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                            <p className="text-slate-400 text-xs">{user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Tasks</span>
                            <span className="text-white font-medium">{userTasks.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Completed</span>
                            <span className="text-green-400 font-medium">{userCompleted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">In Progress</span>
                            <span className="text-yellow-400 font-medium">{userInProgress}</span>
                          </div>
                        </div>
                        {/* Mini progress bar */}
                        <div className="mt-4">
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"
                              style={{ width: userTasks.length ? `${Math.round((userCompleted / userTasks.length) * 100)}%` : '0%' }}>
                            </div>
                          </div>
                        </div>
                        {/* View user detail */}
                        <Link to={`/admin/users/${user._id}`}
                          className="mt-4 block text-center py-2 bg-white/5 hover:bg-white/10 text-blue-400 text-xs rounded-lg transition-colors">
                          View Full Profile →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminProjectDetails;