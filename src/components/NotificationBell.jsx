// import { useState, useEffect, useRef } from 'react'

// const notifTypeColor = (t) => {
//   if (t?.includes('bug'))        return 'bg-red-500/20 text-red-400'
//   if (t?.includes('completed'))  return 'bg-green-500/20 text-green-400'
//   if (t?.includes('assigned'))   return 'bg-blue-500/20 text-blue-400'
//   if (t?.includes('submitted'))  return 'bg-purple-500/20 text-purple-400'
//   return 'bg-slate-500/20 text-slate-400'
// }

// const NotificationBell = () => {
//   const [open, setOpen]                   = useState(false)
//   const [notifications, setNotifications] = useState([])
//   const ref   = useRef(null)
//   const token = localStorage.getItem('token')
//   const headers = { Authorization: `Bearer ${token}` }

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false)
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])

//   // Fetch notifications
//   useEffect(() => {
//     const fetch_ = async () => {
//       try {
//         const res  = await fetch('http://localhost:3000/notifications', { headers })
//         const data = await res.json()
//         if (data.data) setNotifications(data.data)
//       } catch (err) { console.error(err) }
//     }
//     fetch_()
//   }, [])

//   const markRead = async (id) => {
//     try {
//       await fetch(`http://localhost:3000/notifications/${id}/read`, { method: 'PUT', headers })
//       setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
//     } catch (err) { console.error(err) }
//   }

//   const markAllRead = async () => {
//     try {
//       await fetch('http://localhost:3000/notifications/read-all', { method: 'PUT', headers })
//       setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
//     } catch (err) { console.error(err) }
//   }

//   const unread = notifications.filter(n => !n.isRead).length

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen(!open)}
//         className="relative p-2 text-slate-300 hover:text-white transition-colors"
//       >
//         {/* Bell icon */}
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//         </svg>
//         {unread > 0 && (
//           <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
//             {unread > 9 ? '9+' : unread}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 top-12 w-80 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
//           <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//             <h3 className="text-white font-semibold text-sm">Notifications</h3>
//             {unread > 0 && (
//               <button onClick={markAllRead} className="text-blue-400 text-xs hover:text-blue-300">
//                 Mark all read
//               </button>
//             )}
//           </div>

//           <div className="max-h-80 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <p className="text-slate-400 text-sm p-6 text-center">No notifications yet</p>
//             ) : (
//               notifications.slice(0, 15).map((n) => (
//                 <div
//                   key={n._id}
//                   onClick={() => markRead(n._id)}
//                   className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-blue-500/5' : ''}`}
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-blue-400' : 'bg-transparent'}`} />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between gap-2 mb-0.5">
//                         <p className="text-white text-xs font-medium truncate">{n.title}</p>
//                         <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${notifTypeColor(n.type)}`}>
//                           {n.type?.replace(/_/g, ' ')}
//                         </span>
//                       </div>
//                       <p className="text-slate-400 text-xs">{n.message}</p>
//                       <p className="text-slate-500 text-xs mt-1">
//                         {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {notifications.length > 0 && (
//             <p className="text-slate-500 text-xs text-center py-2 border-t border-white/10">
//               {notifications.length} total notifications
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default NotificationBell

// import { useState, useEffect, useRef } from 'react'

// const notifTypeColor = (t) => {
//   if (t?.includes('bug'))        return 'bg-red-500/20 text-red-400'
//   if (t?.includes('completed'))  return 'bg-green-500/20 text-green-400'
//   if (t?.includes('assigned'))   return 'bg-blue-500/20 text-blue-400'
//   if (t?.includes('submitted'))  return 'bg-purple-500/20 text-purple-400'
//   if (t?.includes('project'))    return 'bg-cyan-500/20 text-cyan-400'
//   return 'bg-slate-500/20 text-slate-400'
// }

// const NotificationBell = () => {
//   const [open, setOpen]                   = useState(false)
//   const [notifications, setNotifications] = useState([])
//   const ref     = useRef(null)
//   const token   = localStorage.getItem('token')
//   const headers = { Authorization: `Bearer ${token}` }

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false)
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])

//   // Fetch notifications on mount + every 30s (simple polling)
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res  = await fetch('http://localhost:3000/notifications', { headers })
//         const data = await res.json()
//         if (data.data) setNotifications(data.data)
//       } catch (err) { console.error(err) }
//     }
//     load()
//     const interval = setInterval(load, 30000) // refresh every 30s
//     return () => clearInterval(interval)
//   }, [])

//   const markRead = async (id) => {
//     try {
//       await fetch(`http://localhost:3000/notifications/${id}/read`, { method: 'PUT', headers })
//       setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
//     } catch (err) { console.error(err) }
//   }

//   const markAllRead = async () => {
//     try {
//       await fetch('http://localhost:3000/notifications/read-all', { method: 'PUT', headers })
//       setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
//     } catch (err) { console.error(err) }
//   }

//   // NEW — clear all notifications
//   const clearAll = async () => {
//     try {
//       await fetch('http://localhost:3000/notifications/clear-all', { method: 'DELETE', headers })
//       setNotifications([])
//       setOpen(false)
//     } catch (err) { console.error(err) }
//   }

//   const unread = notifications.filter(n => !n.isRead).length

//   return (
//     <div className="relative" ref={ref}>
//       {/* Bell button */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="relative p-2 text-slate-300 hover:text-white transition-colors"
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//         </svg>
//         {unread > 0 && (
//           <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
//             {unread > 9 ? '9+' : unread}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 top-12 w-80 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
          
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//             <h3 className="text-white font-semibold text-sm">
//               Notifications {unread > 0 && <span className="text-blue-400">({unread} new)</span>}
//             </h3>
//             <div className="flex items-center gap-2">
//               {unread > 0 && (
//                 <button onClick={markAllRead} className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
//                   Mark all read
//                 </button>
//               )}
//               {notifications.length > 0 && (
//                 <button onClick={clearAll} className="text-red-400 text-xs hover:text-red-300 transition-colors">
//                   Clear all
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* List */}
//           <div className="max-h-80 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <p className="text-slate-400 text-sm p-6 text-center">No notifications yet</p>
//             ) : (
//               notifications.slice(0, 15).map((n) => (
//                 <div
//                   key={n._id}
//                   onClick={() => markRead(n._id)}
//                   className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-blue-500/5' : ''}`}
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-blue-400' : 'bg-transparent'}`} />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between gap-2 mb-0.5">
//                         <p className="text-white text-xs font-medium truncate">{n.title}</p>
//                         <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${notifTypeColor(n.type)}`}>
//                           {n.type?.replace(/_/g, ' ')}
//                         </span>
//                       </div>
//                       <p className="text-slate-400 text-xs">{n.message}</p>
//                       <p className="text-slate-500 text-xs mt-1">
//                         {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Footer */}
//           {notifications.length > 0 && (
//             <p className="text-slate-500 text-xs text-center py-2 border-t border-white/10">
//               {notifications.length} total · {unread} unread
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default NotificationBell

  import { useState, useEffect, useRef } from 'react'

  const notifTypeColor = (t) => {
    if (!t) return 'bg-slate-500/20 text-slate-400'
    if (t.includes('bug'))       return 'bg-red-500/20 text-red-400'
    if (t.includes('completed')) return 'bg-green-500/20 text-green-400'
    if (t.includes('assigned'))  return 'bg-blue-500/20 text-blue-400'
    if (t.includes('approved'))  return 'bg-green-500/20 text-green-400'
    if (t.includes('rejected'))  return 'bg-red-500/20 text-red-400'
    return 'bg-slate-500/20 text-slate-400'
  }

  const BellIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )

  const NotificationBell = () => {
    const [notifications, setNotifications] = useState([])
    const [open, setOpen]                   = useState(false)
    const [loading, setLoading]             = useState(false)
    const ref                               = useRef(null)

    const token   = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    // ✅ Fetch notifications
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const res  = await fetch('http://localhost:3000/notifications', { headers })
        const data = await res.json()

        // ✅ FIXED CONDITION
        if (data.success) {
          setNotifications(data.data || [])
        }
      } catch (err) {
        console.error('Notification fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    // ✅ Fetch on mount
    useEffect(() => {
      fetchNotifications()
    }, [])

    // ✅ Poll every 15 sec (faster update)
    useEffect(() => {
      const interval = setInterval(fetchNotifications, 5000)
      return () => clearInterval(interval)
    }, [])

    // ✅ REAL-TIME TRIGGER (VERY IMPORTANT)
    useEffect(() => {
      const handler = () => fetchNotifications()

      window.addEventListener("notificationUpdated", handler)

      return () => {
        window.removeEventListener("notificationUpdated", handler)
      }
    }, [])

    // ✅ Close dropdown on outside click
    useEffect(() => {
      const handler = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    const markAllRead = async () => {
      try {
        await fetch('http://localhost:3000/notifications/read-all', {
          method: 'PUT',
          headers
        })

        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        )
      } catch (err) {
        console.error(err)
      }
    }

    const markRead = async (id) => {
      try {
        await fetch(`http://localhost:3000/notifications/${id}/read`, {
          method: 'PUT',
          headers
        })

        setNotifications(prev =>
          prev.map(n =>
            n._id === id ? { ...n, isRead: true } : n
          )
        )
      } catch (err) {
        console.error(err)
      }
    }

    const unreadCount = notifications.filter(n => !n.isRead).length

    return (
      <div className="relative" ref={ref}>
        
        {/* 🔔 Bell Button */}
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 text-slate-300 hover:text-white transition-colors"
        >
          <BellIcon />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* 📩 Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-80 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm">Notifications</h3>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-blue-400 text-xs hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}

                {/* Refresh */}
                <button
                  onClick={fetchNotifications}
                  className="text-slate-400 hover:text-white"
                  title="Refresh"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-slate-400 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 15).map((n) => (
                  <div
                    key={n._id}
                    onClick={() => markRead(n._id)}
                    className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 ${
                      !n.isRead ? 'bg-blue-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      
                      {/* Unread dot */}
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${!n.isRead ? 'bg-blue-400' : ''}`} />

                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <p className="text-white text-xs font-medium">
                            {n.title}
                          </p>

                          {n.type && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${notifTypeColor(n.type)}`}>
                              {n.type.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>

                        <p className="text-slate-400 text-xs">{n.message}</p>

                        <p className="text-slate-500 text-xs mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-white/10 text-center">
                <p className="text-slate-500 text-xs">
                  {notifications.length} total · {unreadCount} unread
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    )
  }

  export default NotificationBell