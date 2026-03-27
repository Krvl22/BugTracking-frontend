import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

const statusColor = (s) => ({
  active:    'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  inactive:  'bg-yellow-500/20 text-yellow-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const ManagerSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [project, setProject]         = useState(null)
  const [modules, setModules]         = useState([])
  const [tasks, setTasks]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  // Module form
  const [showAddModule, setShowAddModule] = useState(false)
  const [moduleForm, setModuleForm]       = useState({ name: '', description: '' })
  const [moduleMsg, setModuleMsg]         = useState('')

  const navigate = useNavigate()
  const token    = localStorage.getItem('token')
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const authHeaders = { Authorization: `Bearer ${token}` }
  const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const init = async () => {
      try {
        // Step 1: Get the manager's assigned project
        // The manager's project comes from /manager/my-project OR
        // from the projects list filtered by createdBy === manager's id
        const projRes  = await fetch('http://localhost:3000/manager/my-project', { headers: authHeaders })

        // Guard against non-JSON response
        const ct = projRes.headers.get('content-type') || ''
        if (!ct.includes('application/json')) {
          setError('Could not load project. Please check your assignment.')
          setLoading(false)
          return
        }

        const projData = await projRes.json()

        if (!projData.success || !projData.data) {
          setError(projData.message || 'No project assigned to you.')
          setLoading(false)
          return
        }

        const projectId = projData.data._id
        setProject(projData.data)

        // Step 2: Load modules and tasks for that project
        const [mRes, tRes] = await Promise.all([
          fetch(`http://localhost:3000/modules?projectId=${projectId}`, { headers: authHeaders }),
          fetch(`http://localhost:3000/tasks?project=${projectId}`,     { headers: authHeaders }),
        ])

        const safeParse = async (res) => {
          const ct = res.headers.get('content-type') || ''
          if (!ct.includes('application/json')) return { success: false, data: [] }
          return res.json()
        }

        const [mData, tData] = await Promise.all([safeParse(mRes), safeParse(tRes)])
        if (mData.success) setModules(mData.data)
        if (tData.success) setTasks(tData.data)

      } catch (err) {
        console.error('ManagerSettings init error:', err)
        setError('Failed to load settings. Check your connection.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // ── Add Module ──
  const handleAddModule = async () => {
    setModuleMsg('')
    if (!moduleForm.name.trim()) { setModuleMsg('Module name is required'); return }
    try {
      const res  = await fetch('http://localhost:3000/modules', {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({
          name:        moduleForm.name.trim(),
          description: moduleForm.description.trim(),
          project:     project._id,
          createdBy:   storedUser._id,
        })
      })
      const data = await res.json()
      if (data.success) {
        setShowAddModule(false)
        setModuleForm({ name: '', description: '' })
        // Reload modules
        const mRes  = await fetch(`http://localhost:3000/modules?projectId=${project._id}`, { headers: authHeaders })
        const mData = await mRes.json()
        if (mData.success) setModules(mData.data)
      } else {
        setModuleMsg(data.message || 'Failed to create module')
      }
    } catch { setModuleMsg('Server error') }
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const progressPct    = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading settings...</p>
    </div>
  )

  if (error || !project) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-2">Project not found</p>
        <p className="text-slate-400 text-sm mb-6">{error || 'No project is assigned to your account.'}</p>
        <button onClick={() => navigate('/manager/projects')} className="text-blue-400 hover:text-blue-300">← Back to Projects</button>
      </div>
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
              <h1 className="text-2xl font-bold text-white">Project Settings</h1>
              <p className="text-slate-300 text-sm">{project.name} — {project.projectKey}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Project Overview Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-bold text-white mb-4">Project Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-white">{tasks.length}</p>
                <p className="text-slate-400 text-xs mt-1">Total Tasks</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
                <p className="text-slate-400 text-xs mt-1">Completed</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-blue-400">{modules.length}</p>
                <p className="text-slate-400 text-xs mt-1">Modules</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="text-3xl font-bold text-cyan-400">{project.teamMembers?.length || 0}</p>
                <p className="text-slate-400 text-xs mt-1">Team Members</p>
              </div>
            </div>
            {tasks.length > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Overall Progress</span>
                  <span className="text-white font-medium">{progressPct}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-bold text-white mb-4">Project Details</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Name',        value: project.name },
                { label: 'Project Key', value: project.projectKey },
                { label: 'Status',      value: project.status },
                { label: 'Description', value: project.description || 'No description' },
                { label: 'Created By',  value: project.createdBy ? `${project.createdBy.firstName} ${project.createdBy.lastName}` : '—' },
                { label: 'Start Date',  value: project.startDate ? new Date(project.startDate).toLocaleDateString() : '—' },
                { label: 'End Date',    value: project.endDate   ? new Date(project.endDate).toLocaleDateString()   : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-slate-400">{label}</span>
                  <span className={`text-white font-medium ${label === 'Status' ? statusColor(value) + ' px-2 py-0.5 rounded-full text-xs' : ''}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Modules</h2>
              <button onClick={() => setShowAddModule(true)}
                className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
                + Add Module
              </button>
            </div>
            {modules.length === 0 ? (
              <p className="text-slate-400 text-sm">No modules yet. Add your first module.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map(mod => (
                  <div key={mod._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm">{mod.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(mod.status)}`}>{mod.status}</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-3">{mod.description || 'No description'}</p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tasks</span>
                        <span className="text-white">{tasks.filter(t => (t.module?._id || t.module) === mod._id).length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Add Module Modal */}
      {showAddModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Module</h2>
              <button onClick={() => { setShowAddModule(false); setModuleMsg('') }} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {moduleMsg && <p className="text-red-400 text-sm mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{moduleMsg}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Module Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. Authentication"
                  value={moduleForm.name} onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Description</label>
                <textarea placeholder="Module description..."
                  value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddModule}
                className="flex-1 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
                Add Module
              </button>
              <button onClick={() => { setShowAddModule(false); setModuleMsg('') }}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerSettings