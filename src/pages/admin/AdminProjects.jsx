import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import NotificationBell from '../../components/NotificationBell'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'
import { formatDate } from '../../utils/DateUtils'
import { successToast, errorToast } from '../../utils/toast'

const statusColor = (s) => ({
  active:    'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  inactive:  'bg-yellow-500/20 text-yellow-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const AdminProjects = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [projects, setProjects]         = useState([])
  const [users, setUsers]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter]             = useState('all')
  const [search, setSearch]             = useState('')
  const [formError, setFormError]       = useState('')

  // ✅ Sidebar collapse — same key as AdminSidebar uses
  const mlClass = useSidebarCollapsed('adminSidebarCollapsed')

  const navigate    = useNavigate()
  const token       = localStorage.getItem('token')
  const storedUser  = JSON.parse(localStorage.getItem('user') || '{}')
  const authHeaders = { Authorization: `Bearer ${token}` }
  const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const [form, setForm] = useState({
    name: '', description: '', projectKey: '',
    createdBy: storedUser._id || '',
    startDate: '', endDate: '',
  })

  const fetchProjects = async () => {
    try {
      const res  = await fetch('http://localhost:3000/admin/projects', { headers: authHeaders })
      const data = await res.json()
      if (data.success) setProjects(data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchUsers = async () => {
    try {
      const res  = await fetch('http://localhost:3000/users', { headers: authHeaders })
      const data = await res.json()
      if (data.success) setUsers(data.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchProjects(); fetchUsers() }, [])

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const handleAddProject = async () => {
    setFormError('')
    if (!form.name.trim())       { setFormError('Project name is required'); return }
    if (!form.projectKey.trim()) { setFormError('Project key is required');  return }
    if (!form.createdBy)         { setFormError('Please select a creator');  return }
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      setFormError('End date cannot be before start date'); return
    }

    const payload = {
      name:       form.name.trim(),
      projectKey: form.projectKey.trim().toUpperCase(),
      createdBy:  form.createdBy,
    }
    if (form.description.trim()) payload.description = form.description.trim()
    if (form.startDate)          payload.startDate   = form.startDate
    if (form.endDate)            payload.endDate     = form.endDate

    try {
      const res  = await fetch('http://localhost:3000/projects', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(payload) })
      const data = await res.json()
      if (data.success) {
        setShowAddModal(false)
        successToast('Project created successfully')
        setForm({ name: '', description: '', projectKey: '', createdBy: storedUser._id || '', startDate: '', endDate: '' })
        fetchProjects()
        window.dispatchEvent(new Event('notificationUpdated'))
      } else {
        setFormError(data.message || 'Failed to create project')
        errorToast('Failed to create project')
      }
    } catch (err) {
      setFormError('Server error — check console')
      errorToast('Server error while creating project')
      console.error(err)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return
    try {
      await fetch(`http://localhost:3000/projects/${id}`, { method: 'DELETE', headers: jsonHeaders })
      successToast('Project deleted successfully')
      fetchProjects()
    } catch (err) { errorToast('Failed to delete project'); console.error(err) }
  }

  const handleStatusChange = async (e, id, status) => {
    e.stopPropagation()
    try {
      await fetch(`http://localhost:3000/projects/${id}/status`, { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify({ status }) })
      successToast(`Project status changed to ${status}`)
      fetchProjects()
    } catch (err) { errorToast('Failed to update project status'); console.error(err) }
  }

  const filtered = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => `${p.name} ${p.projectKey} ${p.description || ''} ${p.createdBy?.firstName || ''} ${p.createdBy?.lastName || ''}`.toLowerCase().includes(search.toLowerCase()))

  const counts = {
    all:       projects.length,
    active:    projects.filter(p => p.status === 'active').length,
    inactive:  projects.filter(p => p.status === 'inactive').length,
    completed: projects.filter(p => p.status === 'completed').length,
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading projects...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {/* ✅ Shared AdminSidebar — has collapse + notifications built in */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ✅ Dynamic margin — responds to sidebar collapse */}
      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
              <p className="text-slate-300 text-sm">{filtered.length} {filter === 'all' ? 'total' : filter} projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              + Create Project
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10">
          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all',       label: 'All' },
                { key: 'active',    label: 'Active' },
                { key: 'inactive',  label: 'Inactive' },
                { key: 'completed', label: 'Completed' },
              ].map(btn => (
                <button key={btn.key} onClick={() => setFilter(btn.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    filter === btn.key
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}>
                  {btn.label} <span className="opacity-60 text-xs ml-1">({counts[btn.key]})</span>
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, key, creator..."
                className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full sm:w-64" />
            </div>
          </div>

          {/* Project Grid */}
          {filtered.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
              <p className="text-slate-400 text-lg">No {filter === 'all' ? '' : filter} projects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(project => (
                <div key={project._id} onClick={() => navigate(`/admin/projects/${project._id}`)}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-lg">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${statusColor(project.status)}`}>{project.status}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description || 'No description'}</p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-slate-400">Key</span><span className="text-white font-mono">{project.projectKey}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Created By</span><span className="text-white">{project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Start</span><span className="text-white">{formatDate(project.startDate)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">End</span><span className="text-white">{formatDate(project.endDate)}</span></div>
                  </div>
                  <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                    {project.status !== 'completed' && (
                      <button onClick={e => handleStatusChange(e, project._id, 'completed')} className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">Mark Complete</button>
                    )}
                    {project.status === 'active' && (
                      <button onClick={e => handleStatusChange(e, project._id, 'inactive')} className="flex-1 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-xs transition-colors">Mark Inactive</button>
                    )}
                    {project.status === 'inactive' && (
                      <button onClick={e => handleStatusChange(e, project._id, 'active')} className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs transition-colors">Activate</button>
                    )}
                    <button onClick={e => handleDelete(e, project._id)} className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Project</h2>
              <button onClick={() => { setShowAddModal(false); setFormError('') }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {formError && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{formError}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Project Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. E-Commerce Platform" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Project Key <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. ECP" value={form.projectKey}
                  onChange={e => setForm({ ...form, projectKey: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} maxLength={10}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono" />
                <p className="text-slate-500 text-xs mt-1">Uppercase letters/numbers only, max 10 chars</p>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Description</label>
                <textarea placeholder="Briefly describe the project..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Created By <span className="text-red-400">*</span></label>
                <select value={form.createdBy} onChange={e => setForm({ ...form, createdBy: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500">
                  <option value="">— Select a user —</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.firstName} {u.lastName} ({u.role?.replace('_', ' ')}){u._id === storedUser._id ? ' — You' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">End Date</label>
                  <input type="date" value={form.endDate} min={form.startDate || undefined} onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddProject} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">Create Project</button>
              <button onClick={() => { setShowAddModal(false); setFormError('') }} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProjects