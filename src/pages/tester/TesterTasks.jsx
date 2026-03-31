// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import TesterSidebar from '../../components/tester/TesterSidebar'

// const TesterTasks = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [data, setData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [approving, setApproving] = useState(null)
//   const [reportingTask, setReportingTask] = useState(null)
//   const [bugForm, setBugForm] = useState({ comment: '', bugSeverity: 'medium' })
//   const navigate = useNavigate()

//   const handleLogout = () => { localStorage.clear(); navigate("/") }

//   const handleApprove = async (taskId) => {
//     setApproving(taskId)
//     const token = localStorage.getItem("token")
//     const res = await fetch(`http://localhost:3000/tester/tasks/${taskId}/approve`, {
//       method: "PATCH",
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     const result = await res.json()
//     if (result.success) {
//       setData(prev => prev.filter(t => t._id !== taskId))
//     }
//     setApproving(null)
//   }

//   const handleReportBug = async (taskId) => {
//     if (!bugForm.comment.trim()) return
//     const token = localStorage.getItem("token")
//     const res = await fetch("http://localhost:3000/tester/bugs", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       body: JSON.stringify({ taskId, comment: bugForm.comment, bugSeverity: bugForm.bugSeverity })
//     })
//     const result = await res.json()
//     if (result.success) {
//       setData(prev => prev.filter(t => t._id !== taskId))
//       setReportingTask(null)
//       setBugForm({ comment: '', bugSeverity: 'medium' })
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token")
//       const res = await fetch("http://localhost:3000/tester/tasks", {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       const result = await res.json()
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
//               <h1 className="text-2xl font-bold text-white">Tasks to Test</h1>
//               <p className="text-slate-300 text-sm">Review and test submitted tasks</p>
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
//               { label: 'Awaiting Test', value: data.length,                                       color: 'from-blue-500 to-cyan-500' },
//               { label: 'High Priority', value: data.filter(t => t.priority === 'high' || t.priority === 'urgent').length, color: 'from-red-500 to-orange-500' },
//               { label: 'Projects',      value: [...new Set(data.map(t => t.project?._id))].length, color: 'from-purple-500 to-pink-500' },
//             ].map((s, i) => (
//               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                 <p className="text-slate-300 text-sm mb-1">{s.label}</p>
//                 <p className="text-3xl font-bold text-white">{s.value}</p>
//                 <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
//                   <div className={`h-full bg-linear-to-r ${s.color}`} style={{ width: '70%' }} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Tasks */}
//           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//             <h2 className="text-xl font-bold text-white mb-6">Submitted Tasks</h2>
//             {data.length === 0 ? (
//               <p className="text-slate-400">No tasks awaiting testing.</p>
//             ) : (
//               <div className="space-y-4">
//                 {data.map((task) => (
//                   <div key={task._id} className="bg-white/5 rounded-xl p-5 border border-white/10">

//                     {/* Task info */}
//                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
//                       <div className="flex-1">
//                         <div className="flex flex-wrap items-center gap-2 mb-2">
//                           <span className="font-mono text-blue-400 text-sm">{task.issueKey}</span>
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                             task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
//                             task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
//                             'bg-green-500/20 text-green-400'
//                           }`}>{task.priority}</span>
//                           <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">submitted</span>
//                         </div>
//                         <h3 className="text-white font-semibold mb-2">{task.title}</h3>
//                         <div className="flex flex-wrap gap-3 text-xs text-slate-400">
//                           <span>Project: <span className="text-slate-300">{task.project?.name ?? 'N/A'}</span></span>
//                           <span>Module: <span className="text-slate-300">{task.module?.name ?? 'N/A'}</span></span>
//                           <span>Developer: <span className="text-slate-300">{task.assignedTo?.firstName} {task.assignedTo?.lastName}</span></span>
//                         </div>
//                       </div>

//                       {/* Action buttons */}
//                       {reportingTask !== task._id && (
//                         <div className="flex gap-2 shrink-0">
//                           <button
//                             onClick={() => handleApprove(task._id)}
//                             disabled={approving === task._id}
//                             className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
//                           >
//                             {approving === task._id ? 'Approving...' : 'Approve'}
//                           </button>
//                           <button
//                             onClick={() => setReportingTask(task._id)}
//                             className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all"
//                           >
//                             Report Bug
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     {/* Bug report form — shows inline when Report Bug is clicked */}
//                     {reportingTask === task._id && (
//                       <div className="border-t border-white/10 pt-4 mt-2">
//                         <h4 className="text-white font-medium mb-3 text-sm">Report a Bug</h4>
//                         <div className="space-y-3">
//                           <textarea
//                             value={bugForm.comment}
//                             onChange={(e) => setBugForm(prev => ({ ...prev, comment: e.target.value }))}
//                             placeholder="Describe the bug..."
//                             rows={3}
//                             className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                           />
//                           <div className="flex flex-col sm:flex-row gap-3">
//                             <select
//                               value={bugForm.bugSeverity}
//                               onChange={(e) => setBugForm(prev => ({ ...prev, bugSeverity: e.target.value }))}
//                               className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                               <option value="low">Low</option>
//                               <option value="medium">Medium</option>
//                               <option value="high">High</option>
//                               <option value="critical">Critical</option>
//                             </select>
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => handleReportBug(task._id)}
//                                 className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all"
//                               >
//                                 Submit Bug
//                               </button>
//                               <button
//                                 onClick={() => { setReportingTask(null); setBugForm({ comment: '', bugSeverity: 'medium' }) }}
//                                 className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-sm font-medium transition-all"
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
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

// export default TesterTasks


import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'
import NotificationBell from '../../components/NotificationBell'

const TesterTasks = () => {
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [data, setData]                   = useState([])
  const [loading, setLoading]             = useState(true)
  const [approving, setApproving]         = useState(null)
  const [reportingTask, setReportingTask] = useState(null)
  const [bugForm, setBugForm]             = useState({ comment: '', bugSeverity: 'medium' })
  const [bugFile, setBugFile]             = useState(null)
  const [submittingBug, setSubmittingBug] = useState(false)

  // Standalone bug report (no task required)
  const [showStandaloneBug, setShowStandaloneBug]   = useState(false)
  const [standaloneBugForm, setStandaloneBugForm]   = useState({ comment: '', bugSeverity: 'medium', taskId: '' })
  const [standaloneBugFile, setStandaloneBugFile]   = useState(null)
  const [allTasks, setAllTasks]                     = useState([])
  const [submittingStandalone, setSubmittingStandalone] = useState(false)

  const fileRef           = useRef(null)
  const standaloneFileRef = useRef(null)
  const navigate          = useNavigate()
  const user              = JSON.parse(localStorage.getItem('user') || '{}')
  const token             = localStorage.getItem('token')
  const h                 = { Authorization: `Bearer ${token}` }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const handleApprove = async (taskId) => {
    setApproving(taskId)
    const res    = await fetch(`http://localhost:3000/tester/tasks/${taskId}/approve`, { method: 'PATCH', headers: h })
    const result = await res.json()
    if (result.success) setData(prev => prev.filter(t => t._id !== taskId))
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
      if (bugFile) fd.append('attachment', bugFile)
      const res    = await fetch('http://localhost:3000/tester/bugs', { method: 'POST', headers: h, body: fd })
      const result = await res.json()
      if (result.success) {
        setData(prev => prev.filter(t => t._id !== taskId))
        setReportingTask(null)
        setBugForm({ comment: '', bugSeverity: 'medium' })
        setBugFile(null)
      }
    } catch (err) { console.error(err) }
    finally { setSubmittingBug(false) }
  }

  const handleStandaloneReport = async () => {
    if (!standaloneBugForm.comment.trim() || standaloneBugForm.comment.trim().length < 10) return
    if (!standaloneBugForm.taskId) return
    setSubmittingStandalone(true)
    try {
      const fd = new FormData()
      fd.append('taskId',      standaloneBugForm.taskId)
      fd.append('comment',     standaloneBugForm.comment.trim())
      fd.append('bugSeverity', standaloneBugForm.bugSeverity)
      if (standaloneBugFile) fd.append('attachment', standaloneBugFile)
      const res    = await fetch('http://localhost:3000/tester/bugs', { method: 'POST', headers: h, body: fd })
      const result = await res.json()
      if (result.success) {
        setShowStandaloneBug(false)
        setStandaloneBugForm({ comment: '', bugSeverity: 'medium', taskId: '' })
        setStandaloneBugFile(null)
      }
    } catch (err) { console.error(err) }
    finally { setSubmittingStandalone(false) }
  }

  useEffect(() => {
    const fetchData = async () => {
      const [tRes, allRes] = await Promise.all([
        fetch('http://localhost:3000/tester/tasks',        { headers: h }),
        fetch('http://localhost:3000/tasks',               { headers: h }),
      ])
      const [tResult, allResult] = await Promise.all([tRes.json(), allRes.json()])
      if (tResult.success)   setData(tResult.data)
      if (allResult.success) setAllTasks(allResult.data)
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
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={() => setShowStandaloneBug(true)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all">
              + Report Bug
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Awaiting Test', value: data.length,                                                               color: 'from-blue-500 to-cyan-500' },
              { label: 'High Priority', value: data.filter(t => t.priority === 'high' || t.priority === 'urgent').length, color: 'from-red-500 to-orange-500' },
              { label: 'Projects',      value: [...new Set(data.map(t => t.project?._id))].length,                       color: 'from-purple-500 to-pink-500' },
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
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">{task.issueKey}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
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

                      {reportingTask !== task._id && (
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleApprove(task._id)} disabled={approving === task._id}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium disabled:opacity-50">
                            {approving === task._id ? 'Approving...' : 'Approve'}
                          </button>
                          <button onClick={() => { setReportingTask(task._id); setBugForm({ comment: '', bugSeverity: 'medium' }); setBugFile(null) }}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium">
                            Report Bug
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bug form inline */}
                    {reportingTask === task._id && (
                      <div className="border-t border-white/10 pt-4 mt-2">
                        <h4 className="text-white font-medium mb-3 text-sm">Report a Bug</h4>
                        <div className="space-y-3">
                          <textarea value={bugForm.comment}
                            onChange={e => setBugForm(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Describe the bug in detail (min 10 characters)..."
                            rows={4}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                          <div>
                            <label className="text-slate-400 text-xs mb-1 block">Bug Severity</label>
                            <select value={bugForm.bugSeverity}
                              onChange={e => setBugForm(prev => ({ ...prev, bugSeverity: e.target.value }))}
                              className="w-full sm:w-48 px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                            </select>
                          </div>
                          {/* File attachment */}
                          <div>
                            <label className="text-slate-400 text-xs mb-1 block">
                              Attach Screenshot / File <span className="text-red-400">*</span>
                            </label>
                            <div onClick={() => fileRef.current?.click()}
                              className={`flex items-center gap-3 px-4 py-3 border border-dashed rounded-xl cursor-pointer transition-all ${bugFile ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}>
                              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <span className={`text-sm truncate ${bugFile ? 'text-green-400' : 'text-slate-400'}`}>
                                {bugFile ? bugFile.name : 'Click to attach screenshot (required)'}
                              </span>
                              {bugFile && (
                                <button onClick={e => { e.stopPropagation(); setBugFile(null) }}
                                  className="ml-auto text-red-400 hover:text-red-300 text-xs shrink-0">Remove</button>
                              )}
                            </div>
                            <input ref={fileRef} type="file" className="hidden"
                              onChange={e => setBugFile(e.target.files?.[0] || null)} />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleReportBug(task._id)}
                              disabled={submittingBug || bugForm.comment.trim().length < 10 || !bugFile}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium disabled:opacity-50">
                              {submittingBug ? 'Submitting...' : 'Submit Bug'}
                            </button>
                            <button onClick={() => { setReportingTask(null); setBugForm({ comment: '', bugSeverity: 'medium' }); setBugFile(null) }}
                              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-sm font-medium">
                              Cancel
                            </button>
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

      {/* STANDALONE BUG REPORT MODAL */}
      {showStandaloneBug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Report a Bug</h2>
              <button onClick={() => setShowStandaloneBug(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Select Task <span className="text-red-400">*</span></label>
                <select value={standaloneBugForm.taskId}
                  onChange={e => setStandaloneBugForm(p => ({ ...p, taskId: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="">— Select a task —</option>
                  {allTasks.map(t => (
                    <option key={t._id} value={t._id}>{t.issueKey} — {t.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Bug Description <span className="text-red-400">*</span></label>
                <textarea value={standaloneBugForm.comment}
                  onChange={e => setStandaloneBugForm(p => ({ ...p, comment: e.target.value }))}
                  placeholder="Describe the bug in detail (min 10 characters)..."
                  rows={5}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">Severity</label>
                <select value={standaloneBugForm.bugSeverity}
                  onChange={e => setStandaloneBugForm(p => ({ ...p, bugSeverity: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">
                  Screenshot / File <span className="text-red-400">*</span>
                </label>
                <div onClick={() => standaloneFileRef.current?.click()}
                  className={`flex items-center gap-3 px-4 py-3 border border-dashed rounded-xl cursor-pointer transition-all ${standaloneBugFile ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}>
                  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className={`text-sm truncate ${standaloneBugFile ? 'text-green-400' : 'text-slate-400'}`}>
                    {standaloneBugFile ? standaloneBugFile.name : 'Click to attach screenshot (required)'}
                  </span>
                  {standaloneBugFile && (
                    <button onClick={e => { e.stopPropagation(); setStandaloneBugFile(null) }}
                      className="ml-auto text-red-400 text-xs shrink-0">Remove</button>
                  )}
                </div>
                <input ref={standaloneFileRef} type="file" className="hidden"
                  onChange={e => setStandaloneBugFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleStandaloneReport}
                  disabled={submittingStandalone || standaloneBugForm.comment.trim().length < 10 || !standaloneBugForm.taskId || !standaloneBugFile}
                  className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium disabled:opacity-50">
                  {submittingStandalone ? 'Submitting...' : 'Submit Bug Report'}
                </button>
                <button onClick={() => setShowStandaloneBug(false)}
                  className="flex-1 py-3 bg-white/5 text-slate-300 border border-white/10 rounded-xl text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TesterTasks