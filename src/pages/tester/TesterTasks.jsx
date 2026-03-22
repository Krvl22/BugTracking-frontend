import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'

const TesterTasks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(null)
  const [reportingTask, setReportingTask] = useState(null)
  const [bugForm, setBugForm] = useState({ comment: '', bugSeverity: 'medium' })
  const navigate = useNavigate()
 // const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => { localStorage.clear(); navigate("/") }

  const handleApprove = async (taskId) => {
    setApproving(taskId)
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/tester/tasks/${taskId}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    })
    const result = await res.json()
    if (result.success) {
      setData(prev => prev.filter(t => t._id !== taskId))
    }
    setApproving(null)
  }

  const handleReportBug = async (taskId) => {
    if (!bugForm.comment.trim()) return
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:3000/tester/bugs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, comment: bugForm.comment, bugSeverity: bugForm.bugSeverity })
    })
    const result = await res.json()
    if (result.success) {
      setData(prev => prev.filter(t => t._id !== taskId))
      setReportingTask(null)
      setBugForm({ comment: '', bugSeverity: 'medium' })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3000/tester/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Tasks to Test</h1>
              <p className="text-slate-300 text-sm">Review and test submitted tasks</p>
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
              { label: 'Awaiting Test', value: data.length,                                       color: 'from-blue-500 to-cyan-500' },
              { label: 'High Priority', value: data.filter(t => t.priority === 'high' || t.priority === 'urgent').length, color: 'from-red-500 to-orange-500' },
              { label: 'Projects',      value: [...new Set(data.map(t => t.project?._id))].length, color: 'from-purple-500 to-pink-500' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full bg-linear-to-r ${s.color}`} style={{ width: '70%' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tasks */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Submitted Tasks</h2>
            {data.length === 0 ? (
              <p className="text-slate-400">No tasks awaiting testing.</p>
            ) : (
              <div className="space-y-4">
                {data.map((task) => (
                  <div key={task._id} className="bg-white/5 rounded-xl p-5 border border-white/10">

                    {/* Task info */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">{task.issueKey}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>{task.priority}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">submitted</span>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{task.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>Project: <span className="text-slate-300">{task.project?.name ?? 'N/A'}</span></span>
                          <span>Module: <span className="text-slate-300">{task.module?.name ?? 'N/A'}</span></span>
                          <span>Developer: <span className="text-slate-300">{task.assignedTo?.firstName} {task.assignedTo?.lastName}</span></span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {reportingTask !== task._id && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleApprove(task._id)}
                            disabled={approving === task._id}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                          >
                            {approving === task._id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => setReportingTask(task._id)}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all"
                          >
                            Report Bug
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bug report form — shows inline when Report Bug is clicked */}
                    {reportingTask === task._id && (
                      <div className="border-t border-white/10 pt-4 mt-2">
                        <h4 className="text-white font-medium mb-3 text-sm">Report a Bug</h4>
                        <div className="space-y-3">
                          <textarea
                            value={bugForm.comment}
                            onChange={(e) => setBugForm(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Describe the bug..."
                            rows={3}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                          <div className="flex flex-col sm:flex-row gap-3">
                            <select
                              value={bugForm.bugSeverity}
                              onChange={(e) => setBugForm(prev => ({ ...prev, bugSeverity: e.target.value }))}
                              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReportBug(task._id)}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all"
                              >
                                Submit Bug
                              </button>
                              <button
                                onClick={() => { setReportingTask(null); setBugForm({ comment: '', bugSeverity: 'medium' }) }}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-sm font-medium transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
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

export default TesterTasks