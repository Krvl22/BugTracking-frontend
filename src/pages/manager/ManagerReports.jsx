// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

// const ManagerReports = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   const handleLogout = () => { localStorage.clear(); navigate("/") }

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token")
//       const res = await fetch("http://localhost:3000/manager/reports", {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       const result = await res.json()
//       console.log("Reports:", result)
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

//   const statusColors = {
//     to_do: 'from-slate-500 to-slate-600',
//     assigned: 'from-blue-500 to-blue-600',
//     in_progress: 'from-yellow-500 to-orange-500',
//     submitted: 'from-purple-500 to-purple-600',
//     in_testing: 'from-cyan-500 to-teal-500',
//     bug_found: 'from-red-500 to-red-600',
//     fix_in_progress: 'from-orange-500 to-orange-600',
//     completed: 'from-green-500 to-emerald-500',
//   }

//   const severityColors = {
//     low:      'from-green-500 to-emerald-500',
//     medium:   'from-yellow-500 to-amber-500',
//     high:     'from-orange-500 to-red-400',
//     critical: 'from-red-500 to-red-700',
//   }

//   const totalTasks = data?.tasksByStatus?.reduce((sum, t) => sum + t.count, 0) || 0
//   const totalBugs  = data?.bugsBySeverity?.reduce((sum, b) => sum + b.count, 0) || 0

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//       </div>

//       <ManagerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="lg:ml-64">
//         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Reports</h1>
//               <p className="text-slate-300 text-sm">Project overview and statistics</p>
//             </div>
//           </div>
//           <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//             Logout
//           </button>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10 space-y-6">

//           {/* Top stats */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//             {[
//               { label: 'Total Projects', value: data?.totalProjects ?? 0, color: 'from-blue-500 to-cyan-500',     icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
//               { label: 'Total Tasks',    value: totalTasks,               color: 'from-purple-500 to-pink-500',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
//               { label: 'Total Bugs',     value: totalBugs,                color: 'from-orange-500 to-red-500',   icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
//             ].map((s, i) => (
//               <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//                 <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white mb-4`}>
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
//                   </svg>
//                 </div>
//                 <p className="text-slate-300 text-sm mb-1">{s.label}</p>
//                 <p className="text-3xl font-bold text-white">{s.value}</p>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//             {/* Tasks by Status */}
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//               <h2 className="text-xl font-bold text-white mb-6">Tasks by Status</h2>
//               {!data?.tasksByStatus?.length ? (
//                 <p className="text-slate-400">No task data.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {data.tasksByStatus.map((item) => (
//                     <div key={item._id}>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-slate-300 text-sm capitalize">{item._id?.replace(/_/g, ' ')}</span>
//                         <span className="text-white font-bold">{item.count}</span>
//                       </div>
//                       <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
//                         <div
//                           className={`h-full bg-linear-to-r ${statusColors[item._id] || 'from-blue-500 to-cyan-500'} transition-all duration-500`}
//                           style={{ width: totalTasks ? `${(item.count / totalTasks) * 100}%` : '0%' }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Bugs by Severity */}
//             <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//               <h2 className="text-xl font-bold text-white mb-6">Bugs by Severity</h2>
//               {!data?.bugsBySeverity?.length ? (
//                 <p className="text-slate-400">No bug data.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {data.bugsBySeverity.map((item) => (
//                     <div key={item._id}>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-slate-300 text-sm capitalize">{item._id}</span>
//                         <span className="text-white font-bold">{item.count}</span>
//                       </div>
//                       <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
//                         <div
//                           className={`h-full bg-linear-to-r ${severityColors[item._id] || 'from-red-500 to-orange-500'} transition-all duration-500`}
//                           style={{ width: totalBugs ? `${(item.count / totalBugs) * 100}%` : '0%' }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//         </main>
//       </div>
//     </div>
//   )
// }

// export default ManagerReports


import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ManagerSidebar from '../../components/projectManager/ManagerSidebar'

/* ─── Tiny canvas chart helpers ─────────────────────────────────── */

// Draw a doughnut chart on a canvas ref
function drawDoughnut(canvas, labels, values, colors) {
  if (!canvas) return
  const ctx   = canvas.getContext('2d')
  const W     = canvas.width
  const H     = canvas.height
  const cx    = W / 2
  const cy    = H / 2
  const r     = Math.min(cx, cy) - 20
  const inner = r * 0.55
  const total = values.reduce((s, v) => s + v, 0)

  ctx.clearRect(0, 0, W, H)
  if (total === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.arc(cx, cy, inner, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('No data', cx, cy + 5)
    return
  }

  let startAngle = -Math.PI / 2
  values.forEach((val, i) => {
    const slice = (val / total) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, startAngle, startAngle + slice)
    ctx.closePath()
    ctx.fillStyle = colors[i % colors.length]
    ctx.fill()
    startAngle += slice
  })

  // punch out inner circle
  ctx.beginPath()
  ctx.arc(cx, cy, inner, 0, Math.PI * 2)
  ctx.fillStyle = '#0f172a'
  ctx.fill()

  // center text
  ctx.fillStyle = '#fff'
  ctx.font      = `bold ${Math.round(r * 0.28)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText(total, cx, cy + 2)
  ctx.font      = `${Math.round(r * 0.14)}px sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('total', cx, cy + r * 0.22)
}

// Draw a horizontal bar chart
function drawBar(canvas, labels, values, colors) {
  if (!canvas) return
  const ctx   = canvas.getContext('2d')
  const W     = canvas.width
  const H     = canvas.height
  const max   = Math.max(...values, 1)
  const barH  = Math.floor((H - 20) / labels.length) - 6
  const leftPad = 10

  ctx.clearRect(0, 0, W, H)

  labels.forEach((label, i) => {
    const y    = 10 + i * (barH + 6)
    const barW = ((values[i] / max) * (W - leftPad - 50)) || 0

    // track
    ctx.fillStyle = 'rgba(255,255,255,0.07)'
    ctx.beginPath()
    ctx.roundRect(leftPad, y, W - leftPad - 50, barH, 4)
    ctx.fill()

    // bar
    if (barW > 0) {
      ctx.fillStyle = colors[i % colors.length]
      ctx.beginPath()
      ctx.roundRect(leftPad, y, barW, barH, 4)
      ctx.fill()
    }

    // value label
    ctx.fillStyle = '#fff'
    ctx.font      = `bold 12px sans-serif`
    ctx.textAlign = 'right'
    ctx.fillText(values[i], W - 2, y + barH - 4)
  })
}

/* ─── Colour palettes ────────────────────────────────────────────── */
const STATUS_COLORS = {
  to_do:           '#64748b',
  assigned:        '#3b82f6',
  in_progress:     '#eab308',
  submitted:       '#a855f7',
  in_testing:      '#06b6d4',
  bug_found:       '#ef4444',
  fix_in_progress: '#f97316',
  resubmitted:     '#6366f1',
  completed:       '#22c55e',
}

const SEVERITY_COLORS = {
  low:      '#22c55e',
  medium:   '#eab308',
  high:     '#f97316',
  critical: '#ef4444',
}

const FALLBACK_COLORS = [
  '#3b82f6','#06b6d4','#22c55e','#eab308',
  '#f97316','#ef4444','#a855f7','#6366f1',
]

/* ─── Legend component ───────────────────────────────────────────── */
const Legend = ({ items }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
        <span className="text-slate-400 text-xs capitalize">{item.label?.replace(/_/g, ' ')}</span>
        <span className="text-white text-xs font-bold">{item.value}</span>
      </div>
    ))}
  </div>
)

/* ─── Main component ─────────────────────────────────────────────── */
const ManagerReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const navigate = useNavigate()

  const doughnutTaskRef = useRef(null)
  const doughnutBugRef  = useRef(null)
  const barTaskRef      = useRef(null)
  const barBugRef       = useRef(null)

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token  = localStorage.getItem('token')
        const res    = await fetch('http://localhost:3000/manager/reports', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const result = await res.json()
        if (result.success) setData(result.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  // Draw charts whenever data changes
  useEffect(() => {
    if (!data) return

    const taskLabels  = data.tasksByStatus?.map(t => t._id)   || []
    const taskValues  = data.tasksByStatus?.map(t => t.count)  || []
    const taskColors  = taskLabels.map(l => STATUS_COLORS[l] || FALLBACK_COLORS[0])

    const bugLabels   = data.bugsBySeverity?.map(b => b._id)   || []
    const bugValues   = data.bugsBySeverity?.map(b => b.count)  || []
    const bugColors   = bugLabels.map(l => SEVERITY_COLORS[l] || FALLBACK_COLORS[1])

    drawDoughnut(doughnutTaskRef.current, taskLabels, taskValues, taskColors)
    drawDoughnut(doughnutBugRef.current,  bugLabels,  bugValues,  bugColors)
    drawBar(barTaskRef.current, taskLabels, taskValues, taskColors)
    drawBar(barBugRef.current,  bugLabels,  bugValues,  bugColors)
  }, [data])

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  const totalTasks = data?.tasksByStatus?.reduce((s, t) => s + t.count, 0) || 0
  const totalBugs  = data?.bugsBySeverity?.reduce((s, b) => s + b.count, 0) || 0

  const taskLegend = data?.tasksByStatus?.map(t => ({
    label: t._id, value: t.count, color: STATUS_COLORS[t._id] || FALLBACK_COLORS[0]
  })) || []

  const bugLegend = data?.bugsBySeverity?.map(b => ({
    label: b._id, value: b.count, color: SEVERITY_COLORS[b._id] || FALLBACK_COLORS[1]
  })) || []

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
              <h1 className="text-2xl font-bold text-white">Reports</h1>
              <p className="text-slate-300 text-sm">Project overview and statistics</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6">

          {/* ── Top stats ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Total Projects', value: data?.totalProjects ?? 0, color: 'from-blue-500 to-cyan-500',   icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
              { label: 'Total Tasks',    value: totalTasks,               color: 'from-purple-500 to-pink-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { label: 'Total Bugs',     value: totalBugs,                color: 'from-orange-500 to-red-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            ].map((s, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${s.color} flex items-center justify-center text-white mb-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>
                <p className="text-slate-300 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Charts row 1: Doughnut charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Tasks doughnut */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-2">Tasks by Status</h2>
              <p className="text-slate-400 text-xs mb-4">Distribution of all tasks across statuses</p>
              <div className="flex justify-center">
                <canvas
                  ref={doughnutTaskRef}
                  width={220} height={220}
                  className="block"
                />
              </div>
              {taskLegend.length > 0 && <Legend items={taskLegend} />}
              {!taskLegend.length && <p className="text-slate-400 text-sm mt-4">No task data yet.</p>}
            </div>

            {/* Bugs doughnut */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-2">Bugs by Severity</h2>
              <p className="text-slate-400 text-xs mb-4">Bug count broken down by severity level</p>
              <div className="flex justify-center">
                <canvas
                  ref={doughnutBugRef}
                  width={220} height={220}
                  className="block"
                />
              </div>
              {bugLegend.length > 0 && <Legend items={bugLegend} />}
              {!bugLegend.length && <p className="text-slate-400 text-sm mt-4">No bug data yet.</p>}
            </div>
          </div>

          {/* ── Charts row 2: Horizontal bar charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Tasks bar */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-2">Task Volume by Status</h2>
              <p className="text-slate-400 text-xs mb-4">Horizontal bar comparison</p>
              {data?.tasksByStatus?.length ? (
                <canvas
                  ref={barTaskRef}
                  width={500}
                  height={Math.max(160, (data.tasksByStatus.length) * 36 + 20)}
                  className="w-full block"
                />
              ) : (
                <p className="text-slate-400 text-sm">No task data yet.</p>
              )}
              {taskLegend.length > 0 && <Legend items={taskLegend} />}
            </div>

            {/* Bugs bar */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-2">Bug Volume by Severity</h2>
              <p className="text-slate-400 text-xs mb-4">Horizontal bar comparison</p>
              {data?.bugsBySeverity?.length ? (
                <canvas
                  ref={barBugRef}
                  width={500}
                  height={Math.max(160, (data.bugsBySeverity.length) * 36 + 20)}
                  className="w-full block"
                />
              ) : (
                <p className="text-slate-400 text-sm">No bug data yet.</p>
              )}
              {bugLegend.length > 0 && <Legend items={bugLegend} />}
            </div>
          </div>

          {/* ── Progress bars (keep original) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Tasks by Status — Detail</h2>
              {!data?.tasksByStatus?.length ? (
                <p className="text-slate-400">No task data.</p>
              ) : (
                <div className="space-y-4">
                  {data.tasksByStatus.map((item) => (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300 text-sm capitalize">{item._id?.replace(/_/g, ' ')}</span>
                        <span className="text-white font-bold">{item.count}</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width:      totalTasks ? `${(item.count / totalTasks) * 100}%` : '0%',
                            background: STATUS_COLORS[item._id] || '#3b82f6'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Bugs by Severity — Detail</h2>
              {!data?.bugsBySeverity?.length ? (
                <p className="text-slate-400">No bug data.</p>
              ) : (
                <div className="space-y-4">
                  {data.bugsBySeverity.map((item) => (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300 text-sm capitalize">{item._id}</span>
                        <span className="text-white font-bold">{item.count}</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width:      totalBugs ? `${(item.count / totalBugs) * 100}%` : '0%',
                            background: SEVERITY_COLORS[item._id] || '#ef4444'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default ManagerReports