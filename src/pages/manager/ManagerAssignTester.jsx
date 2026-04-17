
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
import { successToast, errorToast } from '../../utils/toast'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const priorityColor = (p) => ({
  high:   'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low:    'bg-green-500/20 text-green-400 border-green-500/30',
  urgent: 'bg-red-600/30 text-red-300 border-red-600/40',
}[p] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const statusColor = (s) => ({
  submitted:   'bg-purple-500/20 text-purple-400',
  in_testing:  'bg-cyan-500/20 text-cyan-400',
  resubmitted: 'bg-indigo-500/20 text-indigo-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const ManagerAssignTester = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [tasks, setTasks]               = useState([])
  const [testers, setTesters]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [assigning, setAssigning]       = useState(null)
  const [selectedTester, setSelectedTester] = useState({})
  const [search, setSearch]             = useState('')
  const mlClass = useSidebarCollapsed('managerSidebarCollapsed')

  const navigate = useNavigate()
  const token    = localStorage.getItem('token')
  const config   = { headers: { Authorization: `Bearer ${token}` } }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const fetchData = async () => {
    try {
      const [taskRes, teamRes] = await Promise.all([
        axios.get('http://localhost:3000/tasks/testing-queue', config),
        axios.get('http://localhost:3000/manager/team', config),
      ])
      setTasks(taskRes.data?.data || [])
      setTesters((teamRes.data?.data || []).filter(u => u.role === 'tester'))
    } catch (err) {
      console.error(err)
      setTasks([])
      setTesters([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAssign = async (taskId) => {
    const testerId = selectedTester[taskId]
    if (!testerId) return
    setAssigning(taskId)
    try {
      await axios.put(
        `http://localhost:3000/manager/assign-tester/${taskId}`,
        { testerId },
        config
      )
      successToast('Tester assigned successfully!')
      setSelectedTester(prev => ({ ...prev, [taskId]: '' }))
      fetchData()
    } catch (err) {
      errorToast(err.response?.data?.message || 'Failed to assign tester')
    } finally {
      setAssigning(null)
    }
  }

  const filtered = tasks.filter(t =>
    `${t.title} ${t.project?.name || ''} ${t.issueKey || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm">Loading tasks...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>

        {/* Header */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Assign Tester</h1>
              <p className="text-slate-300 text-sm">{tasks.length} task{tasks.length !== 1 ? 's' : ''} pending review</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Pending Tasks',  value: tasks.length,   color: 'from-blue-500 to-cyan-500' },
              { label: 'Testers Pool',   value: testers.length, color: 'from-orange-500 to-red-500' },
              { label: 'Showing',        value: filtered.length, color: 'from-purple-500 to-pink-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className={`w-8 h-1 bg-gradient-to-r ${s.color} rounded-full mt-2`} />
              </div>
            ))}
          </div>

          {/* Testers available */}
          {testers.length > 0 && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">Available Testers</h2>
              <div className="flex flex-wrap gap-3">
                {testers.map(tester => (
                  <div key={tester._id} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {tester.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium leading-none">{tester.firstName} {tester.lastName}</p>
                      <p className="text-orange-400 text-xs mt-0.5">Tester</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task list */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Tasks Awaiting Tester</h2>
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52 transition-colors"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm mb-1">
                  {search ? 'No tasks match your search' : 'No tasks pending tester assignment'}
                </p>
                <p className="text-slate-500 text-xs">Tasks with "submitted" status will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(task => (
                  <div key={task._id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:bg-white/8 transition-all">
                    <div className="p-5">
                      {/* Task header */}
                      <div className="flex flex-wrap items-start gap-2 mb-3">
                        {task.issueKey && (
                          <span className="font-mono text-blue-400 text-xs px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20">
                            {task.issueKey}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(task.status)}`}>
                          {task.status?.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h3 className="text-white font-semibold mb-1">{task.title}</h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mb-4">
                        <span>Project: <span className="text-slate-300">{task.project?.name || 'N/A'}</span></span>
                        {task.module?.name && <span>Module: <span className="text-slate-300">{task.module.name}</span></span>}
                        {task.assignedTo && (
                          <span>Developer: <span className="text-cyan-400">{task.assignedTo.firstName} {task.assignedTo.lastName}</span></span>
                        )}
                        {task.dueDate && (
                          <span>Due: <span className="text-slate-300">{new Date(task.dueDate).toLocaleDateString()}</span></span>
                        )}
                      </div>

                      {/* Tester assignment row */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                        {task.testedBy ? (
                          <div className="flex items-center gap-2 flex-1">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {task.testedBy.firstName?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white text-xs font-medium">{task.testedBy.firstName} {task.testedBy.lastName}</p>
                              <p className="text-orange-400 text-xs">Current tester</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-xs flex-1">No tester assigned yet</p>
                        )}

                        <div className="flex items-center gap-2">
                          <select
                            value={selectedTester[task._id] || ''}
                            onChange={e => setSelectedTester(prev => ({ ...prev, [task._id]: e.target.value }))}
                            className="px-3 py-1.5 bg-slate-800 border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 min-w-[160px] transition-colors"
                          >
                            <option value="">— Select tester —</option>
                            {testers.map(tester => (
                              <option key={tester._id} value={tester._id}>
                                {tester.firstName} {tester.lastName}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssign(task._id)}
                            disabled={!selectedTester[task._id] || assigning === task._id}
                            className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                          >
                            {assigning === task._id ? (
                              <>
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                Assigning...
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {task.testedBy ? 'Reassign' : 'Assign'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
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

export default ManagerAssignTester


