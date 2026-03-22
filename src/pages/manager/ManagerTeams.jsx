import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

const ManagerTeam = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => { localStorage.clear(); navigate("/") }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3000/manager/team", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
      console.log("Team:", result)
      if (result.success) setData(result.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  const developers = data.filter(m => m.role === 'developer')
  const testers = data.filter(m => m.role === 'tester')

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
              <h1 className="text-2xl font-bold text-white">Team</h1>
              <p className="text-slate-300 text-sm">Manage your team members</p>
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
              { label: 'Total Members', value: data.length,        color: 'from-blue-500 to-cyan-500' },
              { label: 'Developers',    value: developers.length,  color: 'from-cyan-500 to-teal-500' },
              { label: 'Testers',       value: testers.length,     color: 'from-orange-500 to-red-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className={`w-10 h-10 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white mb-3`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Developers */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span>
              Developers
            </h2>
            {developers.length === 0 ? (
              <p className="text-slate-400 text-sm">No developers found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {developers.map((member) => (
                  <div key={member._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {member.firstName?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{member.firstName} {member.lastName}</p>
                        <p className="text-slate-400 text-xs truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">Developer</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>{member.status || 'active'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Testers */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400 inline-block"></span>
              Testers
            </h2>
            {testers.length === 0 ? (
              <p className="text-slate-400 text-sm">No testers found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testers.map((member) => (
                  <div key={member._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {member.firstName?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{member.firstName} {member.lastName}</p>
                        <p className="text-slate-400 text-xs truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">Tester</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>{member.status || 'active'}</span>
                    </div>
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

export default ManagerTeam