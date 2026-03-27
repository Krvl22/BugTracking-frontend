import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

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
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res  = await fetch('http://localhost:3000/manager/projects', { headers })
        const data = await res.json()
        console.log('Manager projects:', data)
        if (data.success) {
          // Controller now returns data.data as plain array
          const list = Array.isArray(data.data) ? data.data : (data.data?.projects || [])
          setProjects(list)
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchProjects()
  }, [])

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
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
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

          {/* Filter + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all',       label: 'All',       active: 'bg-linear-to-r from-blue-500 to-cyan-500 border-transparent text-white' },
                { key: 'active',    label: 'Active',    active: 'bg-green-500/20 border-green-500/30 text-green-400' },
                { key: 'inactive',  label: 'Inactive',  active: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' },
                { key: 'completed', label: 'Completed', active: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
              ].map(btn => (
                <button key={btn.key} onClick={() => setFilter(btn.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filter === btn.key ? btn.active : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>
                  {btn.label} <span className="opacity-60 text-xs ml-1">({counts[btn.key]})</span>
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
              <p className="text-slate-400 text-lg">No projects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(project => (
                <div key={project._id}
                  onClick={() => navigate(`/manager/projects/${project._id}`)}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${statusColor(project.status)}`}>{project.status}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description || 'No description'}</p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Key</span>
                      <span className="text-white font-mono">{project.projectKey}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Team</span>
                      <span className="text-white">{project.teamMembers?.length || 0} members</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Due</span>
                      <span className="text-white">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No deadline'}</span>
                    </div>
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
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: project.status === 'completed' ? '100%' : project.status === 'active' ? '50%' : '20%' }} />
                  </div>
                  <p className="text-slate-500 text-xs mt-2 group-hover:text-slate-400 transition-colors">Click to view details →</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ManagerProjects