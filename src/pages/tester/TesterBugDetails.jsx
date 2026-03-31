import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'

const severityColor = (s) => ({
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low:      'bg-green-500/20 text-green-400 border-green-500/30',
}[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')

const TesterBugDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bug, setBug]                 = useState(null)
  const [loading, setLoading]         = useState(true)
  const [toast, setToast]             = useState('')
  const navigate = useNavigate()
  const { id }   = useParams()
  const token    = localStorage.getItem('token')
  const user     = JSON.parse(localStorage.getItem('user') || '{}')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchBug = async () => {
      try {
        // Fetch from tester bugs list and find matching id — simple approach
        const res    = await fetch(`http://localhost:3000/tester/bugs?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const result = await res.json()
        if (result.success) {
          const found = result.data.find(b => b._id === id)
          if (found) setBug(found)
        }
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchBug()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  if (!bug) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Bug not found</p>
        <button onClick={() => navigate('/tester/bugs')} className="text-blue-400 hover:text-blue-300">← Back to Bugs</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}

      <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button onClick={() => navigate('/tester/bugs')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <span className="text-sm">Back to Bugs</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Bug Details</h1>
              <p className="text-slate-300 text-sm">Bug you reported</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium">Logout</button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6 max-w-3xl">

          {/* Status badges */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${severityColor(bug.bugSeverity)}`}>
              {bug.bugSeverity?.toUpperCase()} Severity
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${bug.resolved ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {bug.resolved ? '✓ Resolved' : '● Open'}
            </span>
          </div>

          {/* Bug description */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-bold text-white mb-4">Bug Description</h2>
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{bug.comment}</p>
          </div>

          {/* Linked task */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Linked Task</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Issue Key',   value: bug.task?.issueKey ?? 'N/A', mono: true },
                { label: 'Task Title',  value: bug.task?.title   ?? 'N/A' },
                { label: 'Reported On', value: bug.createdAt ? new Date(bug.createdAt).toLocaleString() : '—' },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400">{label}</span>
                  <span className={`font-medium ${mono ? 'font-mono text-blue-400' : 'text-white'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution info */}
          {bug.resolved && bug.resolvedAt && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">Resolution</h3>
              <div className="flex justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-sm">
                <span className="text-slate-400">Resolved At</span>
                <span className="text-green-400 font-medium">{new Date(bug.resolvedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Attachment */}
          {bug.attachmentUrl && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Attachment</h3>
              {/\.(png|jpg|jpeg|gif|webp)$/i.test(bug.attachmentUrl) ? (
                <div>
                  <img src={bug.attachmentUrl} alt="Bug attachment" className="rounded-xl max-w-full max-h-96 object-contain border border-white/10 mb-3" />
                  <a href={bug.attachmentUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Open Full Image
                  </a>
                </div>
              ) : (
                <a href={bug.attachmentUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-all">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  Open Attachment
                </a>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default TesterBugDetails