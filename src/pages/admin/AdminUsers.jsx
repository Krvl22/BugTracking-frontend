import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { successToast, errorToast } from "../../utils/toast"

const AdminUsers = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [users, setUsers]               = useState([]);
  const [filter, setFilter]             = useState('all'); // ← filter state
  const [loading, setLoading]           = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm]                 = useState({ firstName:'', lastName:'', email:'', password:'', role:'developer' });
  const [formError, setFormError]       = useState('');

  const navigate   = useNavigate();
  const location   = useLocation();
  const token      = localStorage.getItem('token');
  const headers    = { Authorization:`Bearer ${token}`, 'Content-Type':'application/json' };
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name:'Dashboard', path:'/admindashboard', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name:'Users',     path:'/admin/users',     icon:'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name:'Projects',  path:'/admin/projects',  icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name:'Analytics', path:'/admin/analytics', icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name:'Settings',  path:'/admin/settings',  icon:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const fetchUsers = async () => {
    try {
      const res  = await fetch('http://localhost:3000/users', { headers });
      const data = await res.json();
      if (data.success) setUsers(data.data.filter(u => u.role !== 'admin'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);
  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const handleAddUser = async () => {
    setFormError('');
    if (!form.firstName||!form.lastName||!form.email||!form.password) { setFormError('All fields are required'); return; }
    try {
      const res  = await fetch('http://localhost:3000/users/register', { method:'POST', headers, body:JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { 
        successToast("User created successfully"); 
        setShowAddModal(false); setForm({firstName:'',lastName:'',email:'',password:'',role:'developer'}); fetchUsers(); 
       window.dispatchEvent(new Event("notificationUpdated"))}
      else setFormError(data.message || 'Failed to add user');
        errorToast(data.message || "Failed to add user");
    } catch(err) { 
      setFormError('Server error'); 
      errorToast("Server error while creating user");
      console.log(err)
    }
  };

  const handleBlock = async (e, id) => {
    e.stopPropagation();
    try { await fetch(`http://localhost:3000/users/${id}/block`, { method:'PATCH', headers });
    successToast("User blocked successfully");
    fetchUsers(); 
  } catch(err) { errorToast("Failed to block user"); console.error(err); }
  };
  const handleReactivate = async (e, id) => {
    e.stopPropagation();
    try { await fetch(`http://localhost:3000/users/${id}/reactivate`, { method:'PATCH', headers });
    successToast("User reactivated successfully") 
    fetchUsers(); } 
    catch(err) { errorToast("Failed to block user"); console.error(err); }
  };
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this user?')) return;
    try { await fetch(`http://localhost:3000/users/${id}`, { method:'DELETE', headers });
     successToast("User deleted successfully");
    fetchUsers(); } 
    catch(err) { console.error(err); }
  };

  const statusColor = (s) => ({ active:'bg-green-500/20 text-green-400', blocked:'bg-red-500/20 text-red-400', deleted:'bg-gray-500/20 text-gray-400' }[s] || 'bg-yellow-500/20 text-yellow-400');

  // ── Filter logic ──
  const filteredUsers = filter === 'all' ? users : users.filter(u => u.status === filter);

  // ── Filter button counts ──
  const counts = {
    all:      users.length,
    active:   users.filter(u => u.status === 'active').length,
    blocked:  users.filter(u => u.status === 'blocked').length,
    inactive: users.filter(u => u.status === 'inactive').length,
  };

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading users...</p>
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
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${location.pathname===item.path?'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg':'text-slate-300 hover:bg-white/10'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                {item.name}
              </Link>
            ))}
          </nav>
          {/* ── Real admin name ── */}
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

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 py-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
              <div>
                <h1 className="text-2xl font-bold text-white">Manage Users</h1>
                <p className="text-slate-300 text-sm">{filteredUsers.length} {filter === 'all' ? 'total' : filter} users — click row to view details</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">+ Add New User</button>
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
              { key:'all',      label:'All',      color:'bg-white/10 border-white/20 text-white',                     active:'bg-linear-to-r from-blue-500 to-cyan-500 border-transparent text-white' },
              { key:'active',   label:'Active',   color:'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10', active:'bg-green-500/20 border-green-500/30 text-green-400' },
              { key:'blocked',  label:'Blocked',  color:'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10', active:'bg-red-500/20 border-red-500/30 text-red-400' },
              { key:'inactive', label:'Inactive', color:'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10', active:'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' },
            ].map(btn => (
              <button key={btn.key} onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center space-x-2 ${filter === btn.key ? btn.active : btn.color}`}>
                <span>{btn.label}</span>
                <span className="text-xs opacity-70">({counts[btn.key]})</span>
              </button>
            ))}
          </div>

          {/* Users Table */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-300 text-sm font-medium">User</th>
                  <th className="text-left p-4 text-slate-300 text-sm font-medium">Role</th>
                  <th className="text-left p-4 text-slate-300 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-slate-300 text-sm font-medium">Joined</th>
                  <th className="text-left p-4 text-slate-300 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No {filter} users found</td></tr>
                ) : filteredUsers.map((user, i) => (
                  <tr key={i} onClick={() => navigate(`/admin/users/${user._id}`)} className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">{user.firstName?.charAt(0)||'U'}</div>
                        <div><p className="text-white font-medium">{user.firstName} {user.lastName}</p><p className="text-slate-400 text-xs">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 capitalize">{user.role?.replace('_',' ')}</span></td>
                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(user.status)}`}>{user.status}</span></td>
                    <td className="p-4 text-slate-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {user.status === 'active' && (
                          <button onClick={(e) => handleBlock(e, user._id)}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs transition-colors">
                            Block
                          </button>
                        )}
                        {user.status === 'blocked' && (
                          <button onClick={(e) => handleReactivate(e, user._id)}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs transition-colors">
                            Reactivate
                          </button>
                        )}
                        {user.status === 'inactive' && (
                          <button onClick={(e) => handleReactivate(e, user._id)}
                            className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-xs transition-colors">
                            Activate
                          </button>
                        )}
                        <button onClick={(e)=>handleDelete(e,user._id)} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-slate-900/90 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-6">Add New User</h2>
            {formError && <p className="text-red-400 text-sm mb-4">{formError}</p>}
            <div className="space-y-4">
              <input type="text" placeholder="First Name" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500">
                <option value="developer" className="bg-slate-900">Developer</option>
                <option value="tester" className="bg-slate-900">Tester</option>
                <option value="project_manager" className="bg-slate-900">Project Manager</option>
              </select>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={handleAddUser} className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium transition-all">Add User</button>
              <button onClick={()=>{setShowAddModal(false);setFormError('');}} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;