// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
// import { formatDate } from '../../utils/DateUtils'

// const statusColor = (s) => ({
//   active:    'bg-green-500/20 text-green-400',
//   completed: 'bg-blue-500/20 text-blue-400',
//   inactive:  'bg-yellow-500/20 text-yellow-400',
// }[s] || 'bg-slate-500/20 text-slate-400')

// const ManagerProjects = () => {
//   const [sidebarOpen, setSidebarOpen]   = useState(false)
//   const [projects, setProjects]         = useState([])
//   const [loading, setLoading]           = useState(true)
//   const [filter, setFilter]             = useState('all')
//   const [search, setSearch]             = useState('')
//   const [showCreate, setShowCreate]     = useState(false)
//   const [creating, setCreating]         = useState(false)
//   const [form, setForm]                 = useState({ name: '', description: '', projectKey: '', startDate: '', endDate: '' })
//   const navigate = useNavigate()

//   const user        = JSON.parse(localStorage.getItem('user') || '{}')
//   const token       = localStorage.getItem('token')
//   const authHeaders = { Authorization: `Bearer ${token}` }
//   const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

//   const handleLogout = () => { localStorage.clear(); navigate('/') }

//   const fetchProjects = async () => {
//     try {
//       const res  = await fetch('http://localhost:3000/manager/projects', { headers: authHeaders })
//       const data = await res.json()
//       if (data.success) {
//         const list = Array.isArray(data.data) ? data.data : (data.data?.projects || [])
//         setProjects(list)
//       }
//     } catch (err) { console.error(err) }
//     finally { setLoading(false) }
//   }

//   useEffect(() => { fetchProjects() }, [])

//   const handleStatusChange = async (e, id, status) => {
//     e.stopPropagation()
//     try {
//       await fetch(`http://localhost:3000/projects/${id}/status`, {
//         method: 'PATCH', headers: jsonHeaders, body: JSON.stringify({ status }),
//       })
//       fetchProjects()
//     } catch (err) { console.error(err) }
//   }

//   const handleCreate = async () => {
//     if (!form.name || !form.projectKey) return
//     setCreating(true)
//     try {
//       const res  = await fetch('http://localhost:3000/projects', {
//         method: 'POST', headers: jsonHeaders,
//         body: JSON.stringify({ ...form, createdBy: user._id }),
//       })
//       const data = await res.json()
//       if (data.success) {
//         setShowCreate(false)
//         setForm({ name: '', description: '', projectKey: '', startDate: '', endDate: '' })
//         fetchProjects()
//       } else {
//         alert(data.message || 'Failed to create project')
//       }
//     } catch (err) { console.error(err) }
//     finally { setCreating(false) }
//   }

//   const counts = {
//     all:       projects.length,
//     active:    projects.filter(p => p.status === 'active').length,
//     inactive:  projects.filter(p => p.status === 'inactive').length,
//     completed: projects.filter(p => p.status === 'completed').length,
//   }

//   const filtered = projects
//     .filter(p => filter === 'all' || p.status === filter)
//     .filter(p => `${p.name} ${p.projectKey} ${p.description || ''}`.toLowerCase().includes(search.toLowerCase()))

//   if (loading) return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//       <p className="text-white text-xl">Loading projects...</p>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//       </div>

//       <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="lg:ml-64">
//         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Projects</h1>
//               <p className="text-slate-300 text-sm">{filtered.length} {filter === 'all' ? 'total' : filter} projects</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* CREATE PROJECT BUTTON */}
//             <button onClick={() => setShowCreate(true)}
//               className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               New Project
//             </button>
//             <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//               Logout
//             </button>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10 space-y-6">

//           {/* Stat Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             {[
//               { label: 'Total',     value: counts.all,       color: 'from-blue-500 to-cyan-500' },
//               { label: 'Active',    value: counts.active,    color: 'from-green-500 to-emerald-500' },
//               { label: 'Inactive',  value: counts.inactive,  color: 'from-yellow-500 to-orange-500' },
//               { label: 'Completed', value: counts.completed, color: 'from-purple-500 to-pink-500' },
//             ].map((s, i) => (
//               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
//                 <p className="text-slate-300 text-sm mb-1">{s.label}</p>
//                 <p className="text-3xl font-bold text-white">{s.value}</p>
//                 <div className={`w-8 h-1 bg-linear-to-r ${s.color} rounded-full mt-2`} />
//               </div>
//             ))}
//           </div>

//           {/* Filter + Search */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="flex flex-wrap gap-2">
//               {[
//                 { key: 'all',       label: 'All' },
//                 { key: 'active',    label: 'Active' },
//                 { key: 'inactive',  label: 'Inactive' },
//                 { key: 'completed', label: 'Completed' },
//               ].map(btn => (
//                 <button key={btn.key} onClick={() => setFilter(btn.key)}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
//                     filter === btn.key
//                       ? 'bg-linear-to-r from-blue-500 to-cyan-500 border-transparent text-white'
//                       : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
//                   }`}>
//                   {btn.label} <span className="opacity-60 text-xs ml-1">({counts[btn.key]})</span>
//                 </button>
//               ))}
//             </div>
//             <div className="relative sm:ml-auto">
//               <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
//                 className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52" />
//             </div>
//           </div>

//           {filtered.length === 0 ? (
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
//               <p className="text-slate-400 text-lg mb-4">No projects found</p>
//               <button onClick={() => setShowCreate(true)}
//                 className="px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
//                 Create your first project
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.map(project => (
//                 <div key={project._id}
//                   onClick={() => navigate(`/manager/projects/${project._id}`)}
//                   className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
//                   <div className="flex items-start justify-between mb-3">
//                     <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">{project.name}</h3>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${statusColor(project.status)}`}>{project.status}</span>
//                   </div>
//                   <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description || 'No description'}</p>
//                   <div className="space-y-2 text-sm mb-4">
//                     <div className="flex justify-between"><span className="text-slate-400">Key</span><span className="text-white font-mono">{project.projectKey}</span></div>
//                     <div className="flex justify-between"><span className="text-slate-400">Team</span><span className="text-white">{project.teamMembers?.length || 0} members</span></div>
//                     <div className="flex justify-between"><span className="text-slate-400">Start</span><span className="text-white">{formatDate(project.startDate)}</span></div>
//                     <div className="flex justify-between"><span className="text-slate-400">Due</span><span className="text-white">{formatDate(project.endDate)}</span></div>
//                   </div>

//                   {project.teamMembers?.length > 0 && (
//                     <div className="flex -space-x-2 mb-3">
//                       {project.teamMembers.slice(0, 5).map((m, i) => (
//                         <div key={i} className="w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
//                           {m.firstName?.charAt(0) || '?'}
//                         </div>
//                       ))}
//                       {project.teamMembers.length > 5 && (
//                         <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-slate-900 flex items-center justify-center text-white text-xs">
//                           +{project.teamMembers.length - 5}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
//                     {project.status === 'active' && (
//                       <>
//                         <button onClick={e => handleStatusChange(e, project._id, 'completed')}
//                           className="flex-1 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">Complete</button>
//                         <button onClick={e => handleStatusChange(e, project._id, 'inactive')}
//                           className="flex-1 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-xs transition-colors">Inactive</button>
//                       </>
//                     )}
//                     {project.status === 'inactive' && (
//                       <button onClick={e => handleStatusChange(e, project._id, 'active')}
//                         className="flex-1 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs transition-colors">Activate</button>
//                     )}
//                   </div>
//                   <p className="text-slate-500 text-xs mt-3 group-hover:text-slate-400 transition-colors">Click to view details →</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>

//       {/* CREATE PROJECT MODAL */}
//       {showCreate && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-white">Create New Project</h2>
//               <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <div className="space-y-4">
//               {[
//                 { label: 'Project Name *',  key: 'name',        placeholder: 'My Awesome Project' },
//                 { label: 'Project Key *',   key: 'projectKey',  placeholder: 'MAP' },
//                 { label: 'Description',     key: 'description', placeholder: 'What is this project about?' },
//               ].map(f => (
//                 <div key={f.key}>
//                   <label className="text-slate-300 text-sm mb-1 block">{f.label}</label>
//                   <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
//                     placeholder={f.placeholder}
//                     className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
//                 </div>
//               ))}
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-slate-300 text-sm mb-1 block">Start Date</label>
//                   <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
//                     className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm mb-1 block">End Date</label>
//                   <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
//                     className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button onClick={handleCreate} disabled={creating || !form.name || !form.projectKey}
//                   className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
//                   {creating ? 'Creating...' : 'Create Project'}
//                 </button>
//                 <button onClick={() => setShowCreate(false)}
//                   className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ManagerProjects


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
import { formatDate } from '../../utils/DateUtils'
import { successToast, errorToast } from "../../utils/toast"

const statusColor = (s) => ({
  active:    'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  inactive:  'bg-yellow-500/20 text-yellow-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const ManagerProjects = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projects, setProjects]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('all')
  const [search, setSearch]           = useState('')
  const [showCreate, setShowCreate]   = useState(false)
  const [creating, setCreating]       = useState(false)
  const [createError, setCreateError] = useState('')
  const [form, setForm]               = useState({ name: '', description: '', projectKey: '', startDate: '', endDate: '' })
  const navigate = useNavigate()

  const user        = JSON.parse(localStorage.getItem('user') || '{}')
  const token       = localStorage.getItem('token')
  const authHeaders = { Authorization: `Bearer ${token}` }
  const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const fetchProjects = async () => {
    try {
      const res  = await fetch('http://localhost:3000/manager/projects', { headers: authHeaders })
      const data = await res.json()
      if (data.success) {
        const list = Array.isArray(data.data) ? data.data : (data.data?.projects || [])
        setProjects(list)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleStatusChange = async (e, id, status) => {
    e.stopPropagation()
    try {
      await fetch(`http://localhost:3000/projects/${id}/status`, {
        method: 'PATCH', headers: jsonHeaders, body: JSON.stringify({ status }),
      })
      successToast(`Project status changed to ${status} successfully`)
      fetchProjects()
    } catch (err) { 
      errorToast("Failed to update project status")
      console.error(err) }
  }

  const handleCreate = async () => {
    if (!form.name.trim())       { setCreateError('Project name is required'); return }
    if (!form.projectKey.trim()) { setCreateError('Project key is required');  return }
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      setCreateError('End date cannot be before start date'); return
    }
    setCreating(true)
    setCreateError('')
    try {
      const res  = await fetch('http://localhost:3000/projects', {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({
          name:        form.name.trim(),
          projectKey:  form.projectKey.trim().toUpperCase(),
          description: form.description.trim(),
          createdBy:   user._id,
          startDate:   form.startDate || undefined,
          endDate:     form.endDate   || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowCreate(false)
        setForm({ name: '', description: '', projectKey: '', startDate: '', endDate: '' })
        setCreateError('')
        successToast('Project created successfully!')
        fetchProjects()
        window.dispatchEvent(new Event("notificationUpdated"))
      } else {
        setCreateError(data.message || 'Failed to create project')
        errorToast('Failed to create project')
      }
    } catch (err) { setCreateError('Server error — try again') 
      errorToast("Server error while creating project")
      console.log(err)
    }
    finally { setCreating(false) }
  }

  const counts = {
    all:       projects.length,
    active:    projects.filter(p => p.status === 'active').length,
    inactive:  projects.filter(p => p.status === 'inactive').length,
    completed: projects.filter(p => p.status === 'completed').length,
  }

  const filtered = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => `${p.name} ${p.projectKey} ${p.description || ''}`.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading projects...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-slate-300 text-sm">{filtered.length} {filter === 'all' ? 'total' : filter} projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowCreate(true); setCreateError('') }}
              className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
            <button onClick={handleLogout}
              className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total',     value: counts.all,       color: 'from-blue-500 to-cyan-500' },
              { label: 'Active',    value: counts.active,    color: 'from-green-500 to-emerald-500' },
              { label: 'Inactive',  value: counts.inactive,  color: 'from-yellow-500 to-orange-500' },
              { label: 'Completed', value: counts.completed, color: 'from-purple-500 to-pink-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className={`w-8 h-1 bg-linear-to-r ${s.color} rounded-full mt-2`} />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-wrap gap-2">
              {['all', 'active', 'inactive', 'completed'].map(key => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                    filter === key
                      ? 'bg-linear-to-r from-blue-500 to-cyan-500 border-transparent text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}>
                  {key} <span className="opacity-60 text-xs ml-1">({counts[key]})</span>
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
              <p className="text-slate-400 text-lg mb-4">No projects found</p>
              <button onClick={() => setShowCreate(true)}
                className="px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium">
                Create your first project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(project => (
                <div key={project._id} onClick={() => navigate(`/manager/projects/${project._id}`)}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${statusColor(project.status)}`}>{project.status}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description || 'No description'}</p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-slate-400">Key</span><span className="text-white font-mono">{project.projectKey}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Team</span><span className="text-white">{project.teamMembers?.length || 0} members</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Start</span><span className="text-white">{formatDate(project.startDate)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Due</span><span className="text-white">{formatDate(project.endDate)}</span></div>
                  </div>
                  {project.teamMembers?.length > 0 && (
                    <div className="flex -space-x-2 mb-3">
                      {project.teamMembers.slice(0, 5).map((m, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                          {m.firstName?.charAt(0) || '?'}
                        </div>
                      ))}
                      {project.teamMembers.length > 5 && (
                        <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-slate-900 flex items-center justify-center text-white text-xs">
                          +{project.teamMembers.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                    {project.status === 'active' && (
                      <>
                        <button onClick={e => handleStatusChange(e, project._id, 'completed')}
                          className="flex-1 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">Complete</button>
                        <button onClick={e => handleStatusChange(e, project._id, 'inactive')}
                          className="flex-1 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-xs transition-colors">Inactive</button>
                      </>
                    )}
                    {project.status === 'inactive' && (
                      <button onClick={e => handleStatusChange(e, project._id, 'active')}
                        className="flex-1 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs transition-colors">Activate</button>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-3 group-hover:text-slate-400">Click to view details →</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* CREATE PROJECT MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <button onClick={() => { setShowCreate(false); setCreateError('') }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {createError && (
              <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{createError}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Project Name <span className="text-red-400">*</span></label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. My Awesome Project"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Project Key <span className="text-red-400">*</span></label>
                <input value={form.projectKey}
                  onChange={e => setForm(p => ({ ...p, projectKey: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }))}
                  placeholder="e.g. MAP" maxLength={10}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono" />
                <p className="text-slate-500 text-xs mt-1">Uppercase letters/numbers only, max 10 chars</p>
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What is this project about?"
                  rows={4}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm mb-1 block">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-slate-300 text-sm mb-1 block">End Date</label>
                  <input type="date" value={form.endDate} min={form.startDate || undefined}
                    onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} disabled={creating || !form.name || !form.projectKey}
                  className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
                <button onClick={() => { setShowCreate(false); setCreateError('') }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerProjects