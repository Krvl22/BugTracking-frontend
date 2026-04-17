import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeveloperSidebar from '../../components/developer/DeveloperSidebar'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'


const DeveloperProjects = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projects, setProjects]       = useState([])
  const [loading, setLoading]         = useState(true)
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const mlClass = useSidebarCollapsed('developerSidebarCollapsed')

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetch_ = async () => {
      const token = localStorage.getItem('token')
      const res   = await fetch(`http://localhost:3000/developer/projects?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setProjects(data.data)
      setLoading(false)
    }
    fetch_()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <DeveloperSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">My Projects</h1>
              <p className="text-slate-300 text-sm">Projects you are part of</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Total Projects', value: projects.length,                                       color: 'from-blue-500 to-cyan-500' },
              { label: 'Active',         value: projects.filter(p => p.status === 'active').length,    color: 'from-green-500 to-emerald-500' },
              { label: 'Completed',      value: projects.filter(p => p.status === 'completed').length, color: 'from-purple-500 to-pink-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full bg-linear-to-r ${s.color}`}
                    style={{ width: projects.length ? `${(s.value / projects.length) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Projects — clickable cards */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">All Projects</h2>
            {projects.length === 0 ? (
              <p className="text-slate-400">You are not assigned to any projects yet.</p>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/developer/projects/${project._id}`)}
                    className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">{project.name}</h3>
                          <span className="font-mono text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">{project.projectKey}</span>
                        </div>
                        {project.description && (
                          <p className="text-slate-400 text-sm mb-3">{project.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span>Team: <span className="text-slate-300">{project.teamMembers?.length ?? 0} members</span></span>
                          <span>Start: <span className="text-slate-300">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span></span>
                          <span>Due: <span className="text-slate-300">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No deadline'}</span></span>
                        </div>
                        <p className="text-slate-500 text-xs mt-2">Click to view details →</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 ${
                        project.status === 'active'    ? 'bg-green-500/20 text-green-400' :
                        project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{project.status}</span>
                    </div>

                    {project.teamMembers?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                        <span className="text-slate-400 text-xs mr-1">Team:</span>
                        <div className="flex -space-x-2">
                          {project.teamMembers.slice(0, 6).map((member, i) => (
                            <div key={i} title={`${member.firstName} ${member.lastName}`}
                              className="w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                              {member.firstName?.charAt(0)}
                            </div>
                          ))}
                          {project.teamMembers.length > 6 && (
                            <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-slate-900 flex items-center justify-center text-white text-xs">
                              +{project.teamMembers.length - 6}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DeveloperProjects