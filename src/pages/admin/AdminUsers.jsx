
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { successToast, errorToast } from '../../utils/toast'

const ITEMS_PER_PAGE = 10

const AdminUsers = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [users, setUsers]               = useState([])
  const [filter, setFilter]             = useState('all')
  const [loading, setLoading]           = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm]                 = useState({ firstName: '', lastName: '', email: '', password: '', role: 'developer' })
  const [formError, setFormError]       = useState('')
  const [page, setPage]                 = useState(1)

  const navigate = useNavigate()
  const token    = localStorage.getItem('token')
  const headers  = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const fetchUsers = async () => {
    try {
      const res  = await fetch('http://localhost:3000/users', { headers })
      const data = await res.json()
      if (data.success) setUsers(data.data.filter(u => u.role !== 'admin'))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])
  useEffect(() => { setPage(1) }, [filter])

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const handleAddUser = async () => {
    setFormError('')
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setFormError('All fields are required'); return
    }
    try {
      const res  = await fetch('http://localhost:3000/users/register', { method: 'POST', headers, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) {
        successToast('User created successfully')
        setShowAddModal(false)
        setForm({ firstName: '', lastName: '', email: '', password: '', role: 'developer' })
        fetchUsers()
        window.dispatchEvent(new Event('notificationUpdated'))
      } else {
        setFormError(data.message || 'Failed to add user')
        errorToast(data.message || 'Failed to add user')
      }
    } catch { setFormError('Server error'); errorToast('Server error while creating user') }
  }

  const handleBlock      = async (e, id) => { e.stopPropagation(); try { await fetch(`http://localhost:3000/users/${id}/block`,      { method: 'PATCH', headers }); successToast('User blocked');      fetchUsers() } catch { errorToast('Failed') } }
  const handleReactivate = async (e, id) => { e.stopPropagation(); try { await fetch(`http://localhost:3000/users/${id}/reactivate`, { method: 'PATCH', headers }); successToast('User reactivated'); fetchUsers() } catch { errorToast('Failed') } }
  const handleDelete     = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this user?')) return
    try { await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE', headers }); successToast('User deleted'); fetchUsers() } catch { console.error('delete error') }
  }

  const statusColor = (s) => ({ active: 'bg-green-500/20 text-green-400', blocked: 'bg-red-500/20 text-red-400', deleted: 'bg-gray-500/20 text-gray-400' }[s] || 'bg-yellow-500/20 text-yellow-400')

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.status === filter)
  const totalPages    = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginated     = filteredUsers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const counts        = { all: users.length, active: users.filter(u => u.status === 'active').length, blocked: users.filter(u => u.status === 'blocked').length, inactive: users.filter(u => u.status === 'inactive').length }

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center"><p className="text-white text-xl">Loading users...</p></div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-64 overflow-y-auto h-screen [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Users</h1>
              <p className="text-slate-300 text-sm">{filteredUsers.length} {filter === 'all' ? 'total' : filter} users</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium">+ Add New User</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium">Logout</button>
          </div>
        </header>
        <main className="p-4 lg:p-8 relative z-10">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'all', label: 'All', active: 'bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent text-white', inactive: 'bg-white/10 border-white/20 text-white hover:bg-white/15' },
              { key: 'active', label: 'Active', active: 'bg-green-500/20 border-green-500/30 text-green-400', inactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' },
              { key: 'blocked', label: 'Blocked', active: 'bg-red-500/20 border-red-500/30 text-red-400', inactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' },
              { key: 'inactive', label: 'Inactive', active: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400', inactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' },
            ].map(btn => (
              <button key={btn.key} onClick={() => setFilter(btn.key)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${filter === btn.key ? btn.active : btn.inactive}`}>
                {btn.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === btn.key ? 'bg-white/20' : 'bg-white/10'}`}>{counts[btn.key]}</span>
              </button>
            ))}
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="text-left p-4 text-slate-300 text-sm font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No {filter} users found</td></tr>
                ) : paginated.map((user, i) => (
                  <tr key={i} onClick={() => navigate(`/admin/users/${user._id}`)} className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">{user.firstName?.charAt(0) || 'U'}</div>
                        <div><p className="text-white font-medium">{user.firstName} {user.lastName}</p><p className="text-slate-400 text-xs">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 capitalize">{user.role?.replace('_', ' ')}</span></td>
                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(user.status)}`}>{user.status}</span></td>
                    <td className="p-4 text-slate-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                        {user.status === 'active'   && <button onClick={e => handleBlock(e, user._id)}      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs">Block</button>}
                        {user.status === 'blocked'  && <button onClick={e => handleReactivate(e, user._id)} className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs">Reactivate</button>}
                        {user.status === 'inactive' && <button onClick={e => handleReactivate(e, user._id)} className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-xs">Activate</button>}
                        <button onClick={e => handleDelete(e, user._id)} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-slate-400 text-sm">Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm border border-white/10 disabled:opacity-40 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'}`}>{p}</button>
                  ))}
                </div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-sm border border-white/10 disabled:opacity-40 flex items-center gap-1">
                  Next <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-slate-900/90 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New User</h2>
              <button onClick={() => { setShowAddModal(false); setFormError('') }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {formError && <p className="text-red-400 text-sm mb-4">{formError}</p>}
            <div className="space-y-4">
              <input type="text" placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500">
                <option value="developer" className="bg-slate-900">Developer</option>
                <option value="tester" className="bg-slate-900">Tester</option>
                <option value="project_manager" className="bg-slate-900">Project Manager</option>
              </select>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={handleAddUser} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium">Add User</button>
              <button onClick={() => { setShowAddModal(false); setFormError('') }} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers