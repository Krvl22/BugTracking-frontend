import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

const roleColor = (r) => r === 'developer' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'
const roleGrad  = (r) => r === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'

const ManagerTeam = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projects, setProjects]       = useState([])
  const [allUsers, setAllUsers]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [detailUser, setDetailUser]   = useState(null)
  const [addModal, setAddModal]       = useState(null)
  const [addSearch, setAddSearch]     = useState('')
  const [search, setSearch]           = useState('')
  const [roleFilter, setRoleFilter]   = useState('all')
  const [toast, setToast]             = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }
  const showToast    = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchData = async () => {
    try {
      const [pRes, uRes] = await Promise.all([
        fetch('http://localhost:3000/manager/projects', { headers }),
        fetch('http://localhost:3000/manager/team',     { headers }),
      ])
      const [pData, uData] = await Promise.all([pRes.json(), uRes.json()])
      if (pData.success) setProjects(Array.isArray(pData.data) ? pData.data : pData.data?.projects || [])
      if (uData.success) setAllUsers(uData.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const teamMemberIds = new Set(projects.flatMap(p => (p.teamMembers || []).map(m => (m._id || m).toString())))
  const teamMembers   = allUsers.filter(u => teamMemberIds.has(u._id))
  const notInProject  = (project) => {
    const inProj = new Set((project.teamMembers || []).map(m => (m._id || m).toString()))
    return allUsers.filter(u => !inProj.has(u._id))
  }
  const userProjects = (userId) => projects.filter(p => (p.teamMembers || []).some(m => (m._id || m).toString() === userId))
  const displayed    = teamMembers.filter(u => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const addMember = async (projectId, userId) => {
    try {
      const res  = await fetch(`http://localhost:3000/manager/projects/${projectId}/add-member`, {
        method: 'PATCH', headers, body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (data.success) { showToast('Member added!'); fetchData() }
      else showToast(data.message || 'Failed')
    } catch { showToast('Server error') }
  }

  const removeMember = async (projectId, userId) => {
    if (!window.confirm('Remove this member?')) return
    try {
      const res  = await fetch(`http://localhost:3000/manager/projects/${projectId}/remove-member`, {
        method: 'PATCH', headers, body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (data.success) { showToast('Member removed.'); fetchData() }
      else showToast(data.message || 'Failed')
    } catch { showToast('Server error') }
  }

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading team...</p>
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
              <h1 className="text-2xl font-bold text-white">Team Management</h1>
              <p className="text-slate-300 text-sm">{teamMembers.length} members · {projects.length} projects</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {toast && (
            <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
              {toast}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Team Members',   value: teamMembers.length,                                    color: 'from-blue-500 to-cyan-500' },
              { label: 'Developers',     value: teamMembers.filter(u => u.role === 'developer').length, color: 'from-cyan-500 to-teal-500' },
              { label: 'Testers',        value: teamMembers.filter(u => u.role === 'tester').length,    color: 'from-orange-500 to-red-500' },
              { label: 'Available Pool', value: allUsers.length,                                        color: 'from-purple-500 to-pink-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className={`w-8 h-1 bg-linear-to-r ${s.color} rounded-full mt-2`} />
              </div>
            ))}
          </div>

          {/* Projects & Team per project */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-5">Projects & Team Members</h2>
            {projects.length === 0 ? <p className="text-slate-400 text-sm">No projects found.</p> : (
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div>
                        <h3 className="text-white font-semibold">{project.name}</h3>
                        <span className="text-slate-400 text-xs font-mono">{project.projectKey}</span>
                      </div>
                      <button onClick={() => { setAddModal(project); setAddSearch('') }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-xs font-medium transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Member
                      </button>
                    </div>
                    {(!project.teamMembers || project.teamMembers.length === 0) ? (
                      <p className="text-slate-500 text-xs">No members yet — click Add Member.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {project.teamMembers.map(member => {
                          const u = typeof member === 'object' ? member : allUsers.find(x => x._id === member)
                          if (!u) return null
                          return (
                            <div key={u._id} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold bg-linear-to-r ${roleGrad(u.role)}`}>
                                {u.firstName?.charAt(0)}
                              </div>
                              <span className="text-white text-xs cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => setDetailUser(u)}>
                                {u.firstName} {u.lastName}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleColor(u.role)}`}>{u.role}</span>
                              <button onClick={() => removeMember(project._id, u._id)} className="text-red-400 hover:text-red-300 ml-1 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Members Grid */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Team Members</h2>
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 w-40" />
                </div>
                {/* FIX: bg-slate-800 so dropdown options are visible */}
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="all"       className="bg-slate-800 text-white">All Roles</option>
                  <option value="developer" className="bg-slate-800 text-white">Developers</option>
                  <option value="tester"    className="bg-slate-800 text-white">Testers</option>
                </select>
              </div>
            </div>

            {displayed.length === 0 ? (
              <p className="text-slate-400 text-sm">No team members yet. Add members to your projects above.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayed.map(member => (
                  <div key={member._id} onClick={() => setDetailUser(member)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 bg-linear-to-r ${roleGrad(member.role)}`}>
                        {member.firstName?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate group-hover:text-cyan-300 transition-colors">{member.firstName} {member.lastName}</p>
                        <p className="text-slate-400 text-xs truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor(member.role)}`}>{member.role}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {member.status || 'active'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">{userProjects(member._id).length} project{userProjects(member._id).length !== 1 ? 's' : ''}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Member Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Add Member</h2>
                <p className="text-slate-400 text-xs">to: {addModal.name}</p>
              </div>
              <button onClick={() => setAddModal(null)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative mb-4">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={addSearch} onChange={e => setAddSearch(e.target.value)} placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="overflow-y-auto flex-1 space-y-2">
              {notInProject(addModal)
                .filter(u => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(addSearch.toLowerCase()))
                .map(u => (
                  <div key={u._id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-linear-to-r ${roleGrad(u.role)}`}>
                        {u.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{u.firstName} {u.lastName}</p>
                        <p className="text-slate-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor(u.role)}`}>{u.role}</span>
                      <button onClick={() => { addMember(addModal._id, u._id); setAddModal(null) }}
                        className="px-3 py-1.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium transition-all">
                        Add
                      </button>
                    </div>
                  </div>
                ))
              }
              {notInProject(addModal).length === 0 && (
                <p className="text-slate-400 text-sm text-center py-6">All available members are in this project.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold bg-linear-to-r ${roleGrad(detailUser.role)}`}>
                  {detailUser.firstName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{detailUser.firstName} {detailUser.lastName}</h2>
                  <p className="text-slate-400 text-sm">{detailUser.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor(detailUser.role)}`}>{detailUser.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${detailUser.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {detailUser.status || 'active'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setDetailUser(null)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400">Joined</span>
                <span className="text-white">{detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleDateString() : '—'}</span>
              </div>
              <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400">Projects</span>
                <span className="text-white font-medium">{userProjects(detailUser._id).length}</span>
              </div>
            </div>
            <h3 className="text-white font-semibold text-sm mb-3">Assigned to Your Projects</h3>
            {userProjects(detailUser._id).length === 0 ? (
              <p className="text-slate-400 text-xs">Not in any of your projects.</p>
            ) : (
              <div className="space-y-2 mb-6">
                {userProjects(detailUser._id).map(p => (
                  <div key={p._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white text-sm font-medium">{p.name}</p>
                      <p className="text-slate-400 text-xs font-mono">{p.projectKey}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setDetailUser(null)} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerTeam