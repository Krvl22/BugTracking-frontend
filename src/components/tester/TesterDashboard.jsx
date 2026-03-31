// import { useState, useEffect } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import TesterSidebar from '../../components/tester/TesterSidebar'
// import NotificationBell from '../../components/NotificationBell'

// const TesterDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [tasks, setTasks]             = useState([])
//   const [bugs, setBugs]               = useState([])
//   const [loading, setLoading]         = useState(true)
//   const navigate = useNavigate()
//   const user     = JSON.parse(localStorage.getItem('user') || '{}')

//   const handleLogout = () => { localStorage.clear(); navigate('/') }

//   useEffect(() => {
//     const fetch_ = async () => {
//       const token = localStorage.getItem('token')
//       const h     = { Authorization: `Bearer ${token}` }

//       const [tRes, bRes] = await Promise.all([
//         fetch('http://localhost:3000/tester/tasks', { headers: h }),
//         fetch(`http://localhost:3000/tester/bugs?userId=${user._id}`, { headers: h }),
//       ])
//       const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
//       if (tData.success) setTasks(tData.data)
//       if (bData.success) setBugs(bData.data)
//       setLoading(false)
//     }
//     fetch_()
//   }, [])

//   const statCards = [
//     { label: 'Tasks To Test', value: tasks.length,                                        color: 'from-blue-500 to-cyan-500',     icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
//     { label: 'Bugs Found',    value: bugs.length,                                         color: 'from-red-500 to-orange-500',    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
//     { label: 'Resolved Bugs', value: bugs.filter(b => b.resolved).length,                 color: 'from-green-500 to-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
//     { label: 'In Testing',    value: tasks.filter(t => t.status === 'in_testing').length,  color: 'from-purple-500 to-pink-500',   icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
//   ]

//   if (loading) return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//       <p className="text-white text-xl">Loading...</p>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//       </div>

//       <TesterSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="lg:ml-64">
//         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Tester Dashboard</h1>
//               <p className="text-slate-300 text-sm">Welcome back, {user?.firstName}!</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* Notification bell */}
//             <NotificationBell />
//             <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//               Logout
//             </button>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10 space-y-6">

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {statCards.map((stat, i) => (
//               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
//                 <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center text-white mb-4`}>
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
//                   </svg>
//                 </div>
//                 <h3 className="text-slate-300 text-sm mb-1">{stat.label}</h3>
//                 <p className="text-3xl font-bold text-white">{stat.value}</p>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//             {/* Tasks to Test */}
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-white">Tasks to Test</h2>
//                 <Link to="/tester/tasks" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
//               </div>
//               <div className="space-y-3">
//                 {tasks.length === 0 ? (
//                   <p className="text-slate-400 text-sm">No tasks to test right now.</p>
//                 ) : tasks.slice(0, 4).map((task) => (
//                   <div key={task._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="flex-1 min-w-0">
//                         <span className="font-mono text-blue-400 text-xs">{task.issueKey}</span>
//                         <p className="text-white font-medium truncate">{task.title}</p>
//                         <p className="text-slate-400 text-xs mt-1">{task.project?.name} • {task.assignedTo?.firstName} {task.assignedTo?.lastName}</p>
//                       </div>
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
//                         task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
//                         task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
//                         'bg-green-500/20 text-green-400'
//                       }`}>{task.priority}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* My Reported Bugs */}
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-white">My Reported Bugs</h2>
//                 <Link to="/tester/bugs" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
//               </div>
//               <div className="space-y-3">
//                 {bugs.length === 0 ? (
//                   <p className="text-slate-400 text-sm">No bugs reported yet.</p>
//                 ) : bugs.slice(0, 4).map((bug) => (
//                   <div key={bug._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                         bug.bugSeverity === 'critical' ? 'bg-red-500/20 text-red-400' :
//                         bug.bugSeverity === 'high'     ? 'bg-orange-500/20 text-orange-400' :
//                         bug.bugSeverity === 'medium'   ? 'bg-yellow-500/20 text-yellow-400' :
//                         'bg-green-500/20 text-green-400'
//                       }`}>{bug.bugSeverity}</span>
//                       <span className={`text-xs font-medium ${bug.resolved ? 'text-green-400' : 'text-red-400'}`}>
//                         {bug.resolved ? 'Resolved' : 'Open'}
//                       </span>
//                     </div>
//                     <p className="text-white text-sm line-clamp-2">{bug.comment}</p>
//                     <p className="text-slate-400 text-xs mt-1">Task: {bug.task?.title ?? 'N/A'}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default TesterDashboard




import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'
import NotificationBell from '../../components/NotificationBell'

const TesterDashboard = () => {
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [tasks, setTasks]                 = useState([])
  const [bugs, setBugs]                   = useState([])
  const [loading, setLoading]             = useState(true)
  const [selectedTask, setSelectedTask]   = useState(null)
  const [approving, setApproving]         = useState(null)
  const [reportingTask, setReportingTask] = useState(null)
  const [bugForm, setBugForm]             = useState({ comment: '', bugSeverity: 'medium' })
  const [submittingBug, setSubmittingBug] = useState(false)
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const token    = localStorage.getItem('token')
  const h        = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const refreshBugs = async () => {
    const res  = await fetch(`http://localhost:3000/tester/bugs?userId=${user._id}`, { headers: h })
    const data = await res.json()
    if (data.success) setBugs(data.data || [])
  }

  useEffect(() => {
    const fetch_ = async () => {
      const [tRes, bRes] = await Promise.all([
        fetch('http://localhost:3000/tester/tasks', { headers: h }),
        fetch(`http://localhost:3000/tester/bugs?userId=${user._id}`, { headers: h }),
      ])
      const [tData, bData] = await Promise.all([tRes.json(), bRes.json()])
      if (tData.success) setTasks(tData.data || [])
      if (bData.success) setBugs(bData.data || [])
      setLoading(false)
    }
    fetch_()
  }, [])

  const handleApprove = async (taskId) => {
    setApproving(taskId)
    const res    = await fetch(`http://localhost:3000/tester/tasks/${taskId}/approve`, { method: 'PATCH', headers: h })
    const result = await res.json()
    if (result.success) { setTasks(prev => prev.filter(t => t._id !== taskId)); setSelectedTask(null) }
    setApproving(null)
  }

  const handleReportBug = async (taskId) => {
    if (!bugForm.comment.trim() || bugForm.comment.trim().length < 10) return
    setSubmittingBug(true)
    try {
      const fd = new FormData()
      fd.append('taskId', taskId)
      fd.append('comment', bugForm.comment.trim())
      fd.append('bugSeverity', bugForm.bugSeverity)
      const res    = await fetch('http://localhost:3000/tester/bugs', { method: 'POST', headers: h, body: fd })
      const result = await res.json()
      if (result.success) {
        setTasks(prev => prev.filter(t => t._id !== taskId))
        setSelectedTask(null); setReportingTask(null)
        setBugForm({ comment: '', bugSeverity: 'medium' })
        refreshBugs()
      }
    } catch (err) { console.error(err) }
    finally { setSubmittingBug(false) }
  }

  const statCards = [
    { label: 'Tasks To Test', value: tasks.length,                                         color: 'from-blue-500 to-cyan-500',     icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Bugs Found',    value: bugs.length,                                          color: 'from-red-500 to-orange-500',    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Resolved',      value: bugs.filter(b => b.resolved).length,                  color: 'from-green-500 to-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Critical',      value: bugs.filter(b => b.bugSeverity === 'critical').length, color: 'from-red-600 to-rose-700',      icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  ]

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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div><h1 className="text-2xl font-bold text-white">Tester Dashboard</h1><p className="text-slate-300 text-sm">Welcome back, {user?.firstName}!</p></div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium">Logout</button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center text-white mb-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                </div>
                <h3 className="text-slate-300 text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks to Test */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Tasks to Test</h2>
                <Link to="/tester/tasks" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
              </div>
              {tasks.length === 0 ? <p className="text-slate-400 text-sm">No tasks to test right now.</p> : (
                <div className="space-y-3">
                  {tasks.slice(0, 4).map(task => (
                    <div key={task._id}
                      onClick={() => { setSelectedTask(task); setReportingTask(null); setBugForm({ comment: '', bugSeverity: 'medium' }) }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="font-mono text-blue-400 text-xs">{task.issueKey}</span>
                          <p className="text-white font-medium truncate">{task.title}</p>
                          <p className="text-slate-400 text-xs mt-1">{task.project?.name} • {task.assignedTo?.firstName} {task.assignedTo?.lastName}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' : task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{task.priority}</span>
                          <span className="text-blue-400 text-xs group-hover:text-blue-300">Review →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Reported Bugs — CLICKABLE → bug details */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">My Reported Bugs</h2>
                <Link to="/tester/bugs" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
              </div>
              {bugs.length === 0 ? <p className="text-slate-400 text-sm">No bugs reported yet.</p> : (
                <div className="space-y-3">
                  {bugs.slice(0, 4).map(bug => (
                    <div key={bug._id}
                      onClick={() => navigate(`/tester/bugs/${bug._id}`)}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.bugSeverity === 'critical' ? 'bg-red-500/20 text-red-400' : bug.bugSeverity === 'high' ? 'bg-orange-500/20 text-orange-400' : bug.bugSeverity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{bug.bugSeverity}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${bug.resolved ? 'text-green-400' : 'text-red-400'}`}>{bug.resolved ? 'Resolved' : 'Open'}</span>
                          {bug.attachmentUrl && <span className="text-blue-400 text-xs">📎</span>}
                        </div>
                      </div>
                      <p className="text-white text-sm line-clamp-1 mb-1">{bug.comment}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-slate-400 text-xs">Task: {bug.task?.issueKey} — {bug.task?.title ?? 'N/A'}</p>
                        <span className="text-blue-400 text-xs group-hover:text-blue-300">Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-blue-400 text-sm">{selectedTask.issueKey}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedTask.priority === 'high' || selectedTask.priority === 'urgent' ? 'bg-red-500/20 text-red-400' : selectedTask.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{selectedTask.priority}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">submitted</span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedTask.title}</h2>
              </div>
              <button onClick={() => { setSelectedTask(null); setReportingTask(null) }} className="text-slate-400 hover:text-white ml-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-2 text-sm mb-6">
              {[
                { label: 'Project',   value: selectedTask.project?.name ?? 'N/A' },
                { label: 'Module',    value: selectedTask.module?.name ?? 'N/A' },
                { label: 'Developer', value: `${selectedTask.assignedTo?.firstName ?? ''} ${selectedTask.assignedTo?.lastName ?? ''}` },
                { label: 'Due Date',  value: selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No due date' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            {reportingTask !== selectedTask._id && (
              <div className="flex gap-3 mb-4">
                <button onClick={() => handleApprove(selectedTask._id)} disabled={approving === selectedTask._id}
                  className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl text-sm font-medium disabled:opacity-50">
                  {approving === selectedTask._id ? 'Approving...' : '✓ Approve Task'}
                </button>
                <button onClick={() => setReportingTask(selectedTask._id)}
                  className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium">
                  🐛 Report Bug
                </button>
              </div>
            )}

            {reportingTask === selectedTask._id && (
              <div className="border-t border-white/10 pt-4 space-y-3">
                <h4 className="text-white font-medium">Report a Bug</h4>
                <textarea value={bugForm.comment} onChange={e => setBugForm(p => ({ ...p, comment: e.target.value }))}
                  placeholder="Describe the bug... (min 10 characters)" rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">Severity</label>
                  <select value={bugForm.bugSeverity} onChange={e => setBugForm(p => ({ ...p, bugSeverity: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low"      className="bg-slate-800">Low</option>
                    <option value="medium"   className="bg-slate-800">Medium</option>
                    <option value="high"     className="bg-slate-800">High</option>
                    <option value="critical" className="bg-slate-800">Critical</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleReportBug(selectedTask._id)} disabled={submittingBug || bugForm.comment.trim().length < 10}
                    className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium disabled:opacity-50">
                    {submittingBug ? 'Submitting...' : 'Submit Bug'}
                  </button>
                  <button onClick={() => { setReportingTask(null); setBugForm({ comment: '', bugSeverity: 'medium' }) }}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TesterDashboard