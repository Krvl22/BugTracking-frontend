import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const AdminProjects = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [projects, setProjects]         = useState([]);
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter]             = useState('all'); // ← NEW
  const [form, setForm]                 = useState({ name: '', description: '', projectKey: '', createdBy: '', startDate: '', endDate: '' });
  const [formError, setFormError]       = useState('');

  const navigate   = useNavigate();
  const location   = useLocation();
  const token      = localStorage.getItem('token');
  const headers    = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name: 'Dashboard', path: '/admindashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users',     path: '/admin/users',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Projects',  path: '/admin/projects',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Settings',  path: '/admin/settings',  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const fetchProjects = async () => {
    try {
      const res  = await fetch('http://localhost:3000/admin/projects', { headers });
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res  = await fetch('http://localhost:3000/users', { headers });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProjects(); fetchUsers(); }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const handleAddProject = async () => {
    setFormError('');
    if (!form.name || !form.projectKey || !form.createdBy) {
      setFormError('Name, Project Key and Created By are required'); return;
    }
    try {
      const res  = await fetch('http://localhost:3000/projects', { method: 'POST', headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setForm({ name: '', description: '', projectKey: '', createdBy: '', startDate: '', endDate: '' });
        fetchProjects();
      } else {
        setFormError(data.message || 'Failed to create project');
      }
    } catch (err) { setFormError('Server error'); console.error(err); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project?')) return;
    try { await fetch(`http://localhost:3000/projects/${id}`, { method: 'DELETE', headers }); fetchProjects(); }
    catch (err) { console.error(err); }
  };

  const handleStatusChange = async (e, id, status) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:3000/projects/${id}/status`, { method: 'PATCH', headers, body: JSON.stringify({ status }) });
      fetchProjects();
    } catch (err) { console.error(err); }
  };

  const statusColor = (status) => {
    if (status === 'active')    return 'bg-green-500/20 text-green-400';
    if (status === 'completed') return 'bg-blue-500/20 text-blue-400';
    return 'bg-yellow-500/20 text-yellow-400';
  };

  // ── Filter logic ──────────────────────────────────────────────────
  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  // ── Count per status for badges ───────────────────────────────────
  const counts = {
    all:       projects.length,
    active:    projects.filter(p => p.status === 'active').length,
    inactive:  projects.filter(p => p.status === 'inactive').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading projects...</p>
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
            <Link to="/admindashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">Bug Tracker</Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 py-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
                <p className="text-slate-300 text-sm">{filteredProjects.length} {filter === 'all' ? 'total' : filter} projects — click any card to view details</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all text-sm font-medium">
                + Create Project
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10">

          {/* ── Filter Buttons ── */}
          <div className="flex space-x-2 mb-6">
            {[
              { key: 'all',       label: 'All',       active: 'bg-linear-to-r from-blue-500 to-cyan-500 border-transparent text-white',        inactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' },
              { key: 'active',    label: 'Active',    active: 'bg-green-500/20 border-green-500/30 text-green-400',                             inactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' },
              { key: 'inactive',  label: 'Inactive',  active: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',                          inactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' },
              { key: 'completed', label: 'Completed', active: 'bg-blue-500/20 border-blue-500/30 text-blue-400',                                inactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' },
            ].map(btn => (
              <button key={btn.key} onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center space-x-2 ${filter === btn.key ? btn.active : btn.inactive}`}>
                <span>{btn.label}</span>
                <span className="text-xs opacity-70">({counts[btn.key]})</span>
              </button>
            ))}
          </div>

          {/* Project Cards */}
          {filteredProjects.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
              <p className="text-slate-400 text-lg">No {filter === 'all' ? '' : filter} projects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <div key={index} onClick={() => navigate(`/admin/projects/${project._id}`)}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-lg">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(project.status)}`}>{project.status}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{project.description || 'No description'}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Project Key</span><span className="text-white font-mono">{project.projectKey}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Created By</span><span className="text-white">{project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : 'N/A'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Created</span><span className="text-white">{new Date(project.createdAt).toLocaleDateString()}</span></div>
                  </div>
                  <p className="text-slate-500 text-xs mb-3">Click to view full details →</p>
                  <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                    {project.status !== 'completed' && (
                      <button onClick={(e) => handleStatusChange(e, project._id, 'completed')}
                        className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">
                        Mark Complete
                      </button>
                    )}
                    {project.status === 'inactive' && (
                      <button onClick={(e) => handleStatusChange(e, project._id, 'active')}
                        className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs transition-colors">
                        Activate
                      </button>
                    )}
                    <button onClick={(e) => handleDelete(e, project._id)}
                      className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-slate-900/90 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-6">Create Project</h2>
            {formError && <p className="text-red-400 text-sm mb-4">{formError}</p>}
            <div className="space-y-4">
              <input type="text" placeholder="Project Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Project Key (e.g. ECP)" value={form.projectKey}
                onChange={e => setForm({ ...form, projectKey: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <textarea placeholder="Description" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
              <select value={form.createdBy} onChange={e => setForm({ ...form, createdBy: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500">
                <option value="" className="bg-slate-900">Select Created By</option>
                {users.map(u => (
                  <option key={u._id} value={u._id} className="bg-slate-900">{u.firstName} {u.lastName} ({u.role})</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={handleAddProject}
                className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
                Create Project
              </button>
              <button onClick={() => { setShowAddModal(false); setFormError(''); }}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;