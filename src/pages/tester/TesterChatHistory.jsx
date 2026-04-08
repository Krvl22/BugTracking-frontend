import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'

const TesterChatHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tasks, setTasks]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const navigate = useNavigate()
  const token    = localStorage.getItem('token')
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const h        = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch all bugs reported by this tester to get their linked tasks
        const res    = await fetch(`http://localhost:3000/tester/bugs?userId=${user._id}`, { headers: h })
        const result = await res.json()
        if (result.success) {
          // De-duplicate by task ID — one chat per task
          const seen = new Set()
          const uniqueTasks = []
          for (const bug of result.data) {
            const taskId = bug.task?._id
            if (taskId && !seen.has(taskId)) {
              seen.add(taskId)
              uniqueTasks.push({
                taskId,
                issueKey:  bug.task?.issueKey  ?? 'N/A',
                taskTitle: bug.task?.title      ?? 'Unknown Task',
                project:   bug.task?.project?.name ?? '',
                lastBugAt: bug.createdAt,
              })
            }
          }
          setTasks(uniqueTasks)
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const filtered = tasks.filter(t =>
    `${t.issueKey} ${t.taskTitle} ${t.project}`.toLowerCase().includes(search.toLowerCase())
  )

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

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Chat History</h1>
              <p className="text-slate-300 text-sm">All task chats you've participated in</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Search */}
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by task, issue key, or project..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500" />
          </div>

          {/* Stats */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
            <p className="text-slate-300 text-sm mb-1">Total Conversations</p>
            <p className="text-3xl font-bold text-white">{tasks.length}</p>
          </div>

          {/* Chat list */}
          {filtered.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-slate-400">No chat history found.</p>
              <p className="text-slate-500 text-sm mt-1">Chats appear here once you report bugs on tasks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((t, i) => (
                <div key={t.taskId}
                  onClick={() => navigate(`/tester/chat-history/${t.taskId}`)}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-blue-400 text-xs">{t.issueKey}</span>
                          {t.project && <span className="text-slate-500 text-xs">· {t.project}</span>}
                        </div>
                        <p className="text-white font-medium truncate">{t.taskTitle}</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Last activity: {new Date(t.lastBugAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-blue-400 text-sm group-hover:text-blue-300">Open Chat →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default TesterChatHistory