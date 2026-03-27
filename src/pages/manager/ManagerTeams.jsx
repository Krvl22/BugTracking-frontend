// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

// const ManagerTeam = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [data, setData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   const handleLogout = () => { localStorage.clear(); navigate("/") }

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token")
//       const res = await fetch("http://localhost:3000/manager/team", {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       const result = await res.json()
//       console.log("Team:", result)
//       if (result.success) setData(result.data)
//       setLoading(false)
//     }
//     fetchData()
//   }, [])

//   if (loading) return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//       <p className="text-white text-xl">Loading...</p>
//     </div>
//   )

//   const developers = data.filter(m => m.role === 'developer')
//   const testers = data.filter(m => m.role === 'tester')

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
//               <h1 className="text-2xl font-bold text-white">Team</h1>
//               <p className="text-slate-300 text-sm">Manage your team members</p>
//             </div>
//           </div>
//           <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//             Logout
//           </button>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10 space-y-6">

//           {/* Stats */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//             {[
//               { label: 'Total Members', value: data.length,        color: 'from-blue-500 to-cyan-500' },
//               { label: 'Developers',    value: developers.length,  color: 'from-cyan-500 to-teal-500' },
//               { label: 'Testers',       value: testers.length,     color: 'from-orange-500 to-red-500' },
//             ].map((s, i) => (
//               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                 <div className={`w-10 h-10 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white mb-3`}>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                   </svg>
//                 </div>
//                 <p className="text-slate-300 text-sm mb-1">{s.label}</p>
//                 <p className="text-3xl font-bold text-white">{s.value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Developers */}
//           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
//               <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span>
//               Developers
//             </h2>
//             {developers.length === 0 ? (
//               <p className="text-slate-400 text-sm">No developers found.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {developers.map((member) => (
//                   <div key={member._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
//                     <div className="flex items-center space-x-3 mb-3">
//                       <div className="w-12 h-12 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
//                         {member.firstName?.charAt(0)}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-white font-medium truncate">{member.firstName} {member.lastName}</p>
//                         <p className="text-slate-400 text-xs truncate">{member.email}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">Developer</span>
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                         member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
//                       }`}>{member.status || 'active'}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Testers */}
//           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
//               <span className="w-3 h-3 rounded-full bg-orange-400 inline-block"></span>
//               Testers
//             </h2>
//             {testers.length === 0 ? (
//               <p className="text-slate-400 text-sm">No testers found.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {testers.map((member) => (
//                   <div key={member._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
//                     <div className="flex items-center space-x-3 mb-3">
//                       <div className="w-12 h-12 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
//                         {member.firstName?.charAt(0)}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-white font-medium truncate">{member.firstName} {member.lastName}</p>
//                         <p className="text-slate-400 text-xs truncate">{member.email}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">Tester</span>
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                         member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
//                       }`}>{member.status || 'active'}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//         </main>
//       </div>
//     </div>
//   )
// }

// export default ManagerTeam


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

const roleColor = (r) => r === 'developer'
  ? 'bg-cyan-500/20 text-cyan-400'
  : 'bg-orange-500/20 text-orange-400'

const ManagerTeam = () => {
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [allUsers, setAllUsers]             = useState([])      // all devs+testers in system
  const [projects, setProjects]             = useState([])      // all projects with teamMembers
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState('')
  const [roleFilter, setRoleFilter]         = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [detailUser, setDetailUser]         = useState(null)    // member detail modal
  const [addModal, setAddModal]             = useState(null)    // { project } for add-member modal
  const [addSearch, setAddSearch]           = useState('')
  const [actionMsg, setActionMsg]           = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const fetchData = async () => {
    try {
      const [uRes, pRes] = await Promise.all([
        fetch('http://localhost:3000/manager/team',     { headers }),
        fetch('http://localhost:3000/manager/projects', { headers }),
      ])
      const [uData, pData] = await Promise.all([uRes.json(), pRes.json()])
      if (uData.success) setAllUsers(uData.data)
      if (pData.success) setProjects(pData.data.projects || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  // ── All unique team members across all projects ──
  const projectTeamIds = new Set(
    projects.flatMap(p => (p.teamMembers || []).map(m => m._id?.toString() || m.toString()))
  )
  const teamMembers = allUsers.filter(u => projectTeamIds.has(u._id))

  // ── Members not yet in ANY project ──
  const availableToAdd = (projectForModal) => {
    if (!projectForModal) return []
    const inProject = new Set(
      (projectForModal.teamMembers || []).map(m => m._id?.toString() || m.toString())
    )
    return allUsers.filter(u => !inProject.has(u._id))
  }

  // ── Filtered display list ──
  const displayed = teamMembers.filter(u => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    const matchProj   = selectedProject === 'all' || projects
      .find(p => p._id === selectedProject)
      ?.teamMembers?.some(m => (m._id || m).toString() === u._id)
    return matchSearch && matchRole && matchProj
  })

  const addMember = async (projectId, userId) => {
    try {
      const res  = await fetch(`http://localhost:3000/manager/projects/${projectId}/add-member`, {
        method: 'PATCH', headers, body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (data.success) { setActionMsg('Member added!'); fetchData() }
      else setActionMsg(data.message || 'Failed')
    } catch { setActionMsg('Server error') }
    setTimeout(() => setActionMsg(''), 3000)
  }

  const removeMember = async (projectId, userId) => {
    if (!window.confirm('Remove this member from the project?')) return
    try {
      const res  = await fetch(`http://localhost:3000/manager/projects/${projectId}/remove-member`, {
        method: 'PATCH', headers, body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (data.success) { setActionMsg('Member removed.'); fetchData() }
      else setActionMsg(data.message || 'Failed')
    } catch { setActionMsg('Server error') }
    setTimeout(() => setActionMsg(''), 3000)
  }

  // ── User detail: which projects they're in + task stats (derived from projects) ──
  const getUserProjects = (userId) =>
    projects.filter(p => (p.teamMembers || []).some(m => (m._id || m).toString() === userId))

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
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Team Management</h1>
              <p className="text-slate-300 text-sm">{teamMembers.length} members across {projects.length} projects</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Toast */}
          {actionMsg && (
            <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
              {actionMsg}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Members',  value: teamMembers.length,                              color: 'from-blue-500 to-cyan-500' },
              { label: 'Developers',     value: teamMembers.filter(u=>u.role==='developer').length, color: 'from-cyan-500 to-teal-500' },
              { label: 'Testers',        value: teamMembers.filter(u=>u.role==='tester').length,    color: 'from-orange-500 to-red-500' },
              { label: 'Available Pool', value: allUsers.length,                                 color: 'from-purple-500 to-pink-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className={`w-8 h-1 bg-linear-to-r ${s.color} rounded-full mt-2`} />
              </div>
            ))}
          </div>

          {/* Projects — Add Members per project */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-5">Projects & Team</h2>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="text-white font-semibold">{project.name}</h3>
                      <span className="text-slate-400 text-xs font-mono">{project.projectKey}</span>
                    </div>
                    <button
                      onClick={() => { setAddModal(project); setAddSearch('') }}
                      className="px-3 py-1.5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Member
                    </button>
                  </div>
                  {/* Current team members */}
                  {(!project.teamMembers || project.teamMembers.length === 0) ? (
                    <p className="text-slate-500 text-xs">No members yet — click Add Member</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {project.teamMembers.map(member => {
                        const u = typeof member === 'object' ? member : allUsers.find(u => u._id === member)
                        if (!u) return null
                        return (
                          <div key={u._id} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold bg-linear-to-r ${u.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
                              {u.firstName?.charAt(0)}
                            </div>
                            <span
                              className="text-white text-xs cursor-pointer hover:text-cyan-400 transition-colors"
                              onClick={() => setDetailUser(u)}
                            >
                              {u.firstName} {u.lastName}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleColor(u.role)}`}>{u.role}</span>
                            <button
                              onClick={() => removeMember(project._id, u._id)}
                              className="text-red-400 hover:text-red-300 transition-colors ml-1"
                              title="Remove from project"
                            >
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
          </div>

          {/* All Team Members Grid */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">All Team Members</h2>
              <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search members..."
                    className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 w-44"
                  />
                </div>
                {/* Role filter */}
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="all">All Roles</option>
                  <option value="developer">Developers</option>
                  <option value="tester">Testers</option>
                </select>
                {/* Project filter */}
                <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="all">All Projects</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {displayed.length === 0 ? (
              <p className="text-slate-400 text-sm">No team members found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayed.map(member => {
                  const memberProjects = getUserProjects(member._id)
                  return (
                    <div key={member._id}
                      onClick={() => setDetailUser(member)}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 bg-linear-to-r ${member.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
                          {member.firstName?.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium truncate group-hover:text-cyan-300 transition-colors">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-slate-400 text-xs truncate">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColor(member.role)}`}>{member.role}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {member.status || 'active'}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs">
                        {memberProjects.length} project{memberProjects.length !== 1 ? 's' : ''}
                        {memberProjects.length > 0 && `: ${memberProjects.map(p => p.name).join(', ')}`}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* ── Add Member Modal ── */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Add Member</h2>
                <p className="text-slate-400 text-xs">Project: {addModal.name}</p>
              </div>
              <button onClick={() => setAddModal(null)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Search inside modal */}
            <div className="relative mb-4">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={addSearch}
                onChange={e => setAddSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="overflow-y-auto flex-1 space-y-2">
              {availableToAdd(addModal)
                .filter(u => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(addSearch.toLowerCase()))
                .map(u => (
                  <div key={u._id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-linear-to-r ${u.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
                        {u.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{u.firstName} {u.lastName}</p>
                        <p className="text-slate-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor(u.role)}`}>{u.role}</span>
                      <button
                        onClick={() => { addMember(addModal._id, u._id); setAddModal(null) }}
                        className="px-3 py-1.5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-xs font-medium transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))
              }
              {availableToAdd(addModal).length === 0 && (
                <p className="text-slate-400 text-sm text-center py-6">All available members are already in this project.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Member Detail Modal ── */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold bg-linear-to-r ${detailUser.role === 'developer' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'}`}>
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

            {/* Info */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400">Joined</span>
                <span className="text-white">{new Date(detailUser.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400">Projects Assigned</span>
                <span className="text-white font-medium">{getUserProjects(detailUser._id).length}</span>
              </div>
            </div>

            {/* Projects list */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Assigned Projects</h3>
              {getUserProjects(detailUser._id).length === 0 ? (
                <p className="text-slate-400 text-xs">Not assigned to any project yet.</p>
              ) : (
                <div className="space-y-2">
                  {getUserProjects(detailUser._id).map(p => (
                    <div key={p._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-slate-400 text-xs font-mono">{p.projectKey}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setDetailUser(null)}
              className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerTeam