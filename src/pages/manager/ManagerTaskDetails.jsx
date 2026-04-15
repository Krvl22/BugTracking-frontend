import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'
import TaskChat from '../../components/common/TaskChat'
import { successToast, errorToast } from '../../utils/toast'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const taskStatusColor = (s) => ({
  to_do:           'bg-slate-500/20 text-slate-400',
  assigned:        'bg-blue-500/20 text-blue-400',
  in_progress:     'bg-yellow-500/20 text-yellow-400',
  submitted:       'bg-purple-500/20 text-purple-400',
  in_testing:      'bg-cyan-500/20 text-cyan-400',
  bug_found:       'bg-red-500/20 text-red-400',
  fix_in_progress: 'bg-orange-500/20 text-orange-400',
  resubmitted:     'bg-indigo-500/20 text-indigo-400',
  completed:       'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const priorityColor = (p) => ({
  low:    'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high:   'bg-orange-500/20 text-orange-400 border-orange-500/30',
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
}[p] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const severityColor = (s) => ({
  critical: 'bg-red-500/20 text-red-400',
  high:     'bg-orange-500/20 text-orange-400',
  medium:   'bg-yellow-500/20 text-yellow-400',
  low:      'bg-green-500/20 text-green-400',
}[s] || 'bg-slate-500/20 text-slate-400')

const ManagerTaskDetails = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [task, setTask]                 = useState(null)
  const [bugs, setBugs]                 = useState([])
  const [testers, setTesters]           = useState([])
  const [developers, setDevelopers]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [activeTab, setActiveTab]       = useState('details')
  const [assigningTester, setAssigningTester]   = useState(false)
  const [selectedTester, setSelectedTester]     = useState('')
  const [assigningDev, setAssigningDev]         = useState(false)
  const [selectedDev, setSelectedDev]           = useState('')
  const mlClass = useSidebarCollapsed('testerSidebarCollapsed')

  const navigate = useNavigate()
  const { id }   = useParams()
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}` }
  const jh       = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const fetchTask = async () => {
    try {
      const [taskRes, bugRes, teamRes] = await Promise.all([
        fetch(`http://localhost:3000/tasks/${id}`,             { headers: h }),
        fetch(`http://localhost:3000/bugcomments/task/${id}`,  { headers: h }),
        fetch('http://localhost:3000/manager/team',            { headers: h }),
      ])
      const [taskData, bugData, teamData] = await Promise.all([taskRes.json(), bugRes.json(), teamRes.json()])

      if (taskData.success) setTask(taskData.data)
      else setError('Task not found')

      if (bugData.success) setBugs(bugData.data || [])

      if (teamData.success) {
        const team = teamData.data || []
        setTesters(team.filter(u => u.role === 'tester'))
        setDevelopers(team.filter(u => u.role === 'developer'))
      }
    } catch (err) {
      setError('Failed to load task')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTask() }, [id])

  const handleAssignTester = async () => {
    if (!selectedTester) return
    setAssigningTester(true)
    try {
      const res  = await fetch(`http://localhost:3000/manager/assign-tester/${id}`, {
        method: 'PUT', headers: jh,
        body: JSON.stringify({ testerId: selectedTester }),
      })
      const data = await res.json()
      if (data.success) {
        successToast('Tester assigned successfully!')
        setSelectedTester('')
        fetchTask()
      } else {
        errorToast(data.message || 'Failed to assign tester')
      }
    } catch { errorToast('Server error') }
    finally { setAssigningTester(false) }
  }

  const handleAssignDev = async () => {
    if (!selectedDev) return
    setAssigningDev(true)
    try {
      const res  = await fetch(`http://localhost:3000/manager/assign-dev/${id}`, {
        method: 'PUT', headers: jh,
        body: JSON.stringify({ developerId: selectedDev }),
      })
      const data = await res.json()
      if (data.success) {
        successToast('Developer reassigned successfully!')
        setSelectedDev('')
        fetchTask()
      } else {
        errorToast(data.message || 'Failed to reassign developer')
      }
    } catch { errorToast('Server error') }
    finally { setAssigningDev(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading task...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => navigate('/manager/tasks')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Tasks</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Task Details</h1>
              {task && <p className="text-slate-300 text-sm font-mono">{task.issueKey}</p>}
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6 max-w-5xl">

          {error && (
            <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm">{error}</div>
          )}

          {task && (
            <>
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColor(task.priority)}`}>
                  {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${taskStatusColor(task.status)}`}>
                  {task.status?.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                {[
                  { key: 'details', label: '📋 Details' },
                  { key: 'chat',    label: '💬 Chat' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Title + Description */}
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
                    {task.description ? (
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                    ) : (
                      <p className="text-slate-500 italic">No description provided.</p>
                    )}
                  </div>

                  {/* Task metadata */}
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold text-white mb-4">Task Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {[
                        { label: 'Issue Key',   value: task.issueKey,  mono: true },
                        { label: 'Project',     value: task.project?.name ?? 'N/A' },
                        { label: 'Module',      value: task.module?.name  ?? 'No module' },
                        { label: 'Developer',   value: task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : '—' },
                        { label: 'Tester',      value: task.testedBy   ? `${task.testedBy.firstName} ${task.testedBy.lastName}` : 'Not assigned' },
                        { label: 'Created By',  value: task.createdBy  ? `${task.createdBy.firstName} ${task.createdBy.lastName}` : '—' },
                        { label: 'Due Date',    value: task.dueDate    ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No due date' },
                        { label: 'Submitted',   value: task.submittedAt ? new Date(task.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                      ].map(({ label, value, mono }) => (
                        <div key={label} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-slate-400">{label}</span>
                          <span className={`font-medium ${mono ? 'font-mono text-blue-400' : 'text-white'}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manager Actions */}
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold text-white mb-4">Manager Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Assign Tester */}
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Assign Tester</label>
                        <div className="flex gap-2">
                          <select value={selectedTester} onChange={e => setSelectedTester(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                            <option value="">— Select tester —</option>
                            {testers.map(u => (
                              <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
                            ))}
                          </select>
                          <button onClick={handleAssignTester} disabled={!selectedTester || assigningTester}
                            className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm transition-all disabled:opacity-50">
                            {assigningTester ? '...' : 'Assign'}
                          </button>
                        </div>
                      </div>

                      {/* Reassign Developer */}
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Reassign Developer</label>
                        <div className="flex gap-2">
                          <select value={selectedDev} onChange={e => setSelectedDev(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                            <option value="">— Select developer —</option>
                            {developers.map(u => (
                              <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
                            ))}
                          </select>
                          <button onClick={handleAssignDev} disabled={!selectedDev || assigningDev}
                            className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg text-sm transition-all disabled:opacity-50">
                            {assigningDev ? '...' : 'Assign'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission file */}
                  {task.attachmentUrl && (
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-lg font-bold text-white mb-4">Submission File</h3>
                      {/\.(png|jpg|jpeg|gif|webp)$/i.test(task.attachmentUrl) ? (
                        <div>
                          <img src={task.attachmentUrl} alt="Submission"
                            className="rounded-xl max-w-full max-h-96 object-contain border border-white/10 mb-3" />
                          <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium transition-all">
                            Open Full Image
                          </a>
                        </div>
                      ) : (
                        <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-all">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          Open Attachment
                        </a>
                      )}
                    </div>
                  )}

                  {/* Bugs on this task */}
                  {bugs.length > 0 && (
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                      <h3 className="text-lg font-bold text-white mb-4">
                        Bugs Reported
                        <span className="text-sm font-normal text-slate-400 ml-2">{bugs.length} bug{bugs.length > 1 ? 's' : ''}</span>
                      </h3>
                      <div className="space-y-3">
                        {bugs.map(bug => (
                          <div key={bug._id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(bug.bugSeverity)}`}>
                                {bug.bugSeverity}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {bug.resolved ? 'Resolved' : 'Open'}
                              </span>
                              <span className="text-slate-500 text-xs ml-auto">
                                by {bug.commentedBy?.firstName} {bug.commentedBy?.lastName}
                              </span>
                            </div>
                            <p className="text-slate-200 text-sm leading-relaxed">{bug.comment}</p>
                            {bug.attachmentUrl && (
                              <a href={bug.attachmentUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 text-blue-400 text-xs hover:text-blue-300">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                View attachment
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Task Chat
                  </h3>
                  <TaskChat taskId={id} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default ManagerTaskDetails