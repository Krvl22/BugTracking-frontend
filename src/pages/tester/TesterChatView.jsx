import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'
import TaskChat from '../../components/common/TaskChat'
import { useSidebarCollapsed } from '../../hooks/UseSidebarCollapsed'

const TesterChatView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [task, setTask]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const navigate = useNavigate()
  const { taskId } = useParams()
  const mlClass = useSidebarCollapsed('testerSidebarCollapsed')

  const token      = localStorage.getItem('token')
  const h          = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res    = await fetch(`http://localhost:3000/tasks/${taskId}`, { headers: h })
        const result = await res.json()
        if (result.success) setTask(result.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchTask()
  }, [taskId])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`${mlClass} transition-all duration-300 overflow-y-auto h-screen ...`}>
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => navigate('/tester/chat-history')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to History</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Task Chat</h1>
              {task && (
                <p className="text-slate-300 text-sm font-mono">
                  {task.issueKey} — {task.title}
                </p>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 max-w-3xl">
          {task ? (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              {/* Task info strip */}
              <div className="flex flex-wrap gap-3 mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="text-slate-400 text-xs">Project</p>
                  <p className="text-white text-sm font-medium">{task.project?.name ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Module</p>
                  <p className="text-white text-sm font-medium">{task.module?.name ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Developer</p>
                  <p className="text-white text-sm font-medium">
                    {task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Status</p>
                  <p className="text-white text-sm font-medium capitalize">{task.status?.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <TaskChat taskId={taskId} />
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
              <p className="text-slate-400">Task not found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default TesterChatView