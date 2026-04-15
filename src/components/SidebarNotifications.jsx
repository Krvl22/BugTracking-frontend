import { useState, useEffect } from 'react'

const typeIcon = (type = '') => {
  if (type.includes('bug'))       return { bg: 'bg-red-500/20',    icon: '⚠', dot: 'bg-red-400' }
  if (type.includes('completed')) return { bg: 'bg-green-500/20',  icon: '✓', dot: 'bg-green-400' }
  if (type.includes('submitted')) return { bg: 'bg-blue-500/20',   icon: '↑', dot: 'bg-blue-400' }
  if (type.includes('assigned'))  return { bg: 'bg-purple-500/20', icon: '→', dot: 'bg-purple-400' }
  if (type.includes('approved'))  return { bg: 'bg-green-500/20',  icon: '✓', dot: 'bg-green-400' }
  if (type.includes('rejected'))  return { bg: 'bg-red-500/20',    icon: '✕', dot: 'bg-red-400' }
  if (type.includes('overdue'))   return { bg: 'bg-yellow-500/20', icon: '!', dot: 'bg-yellow-400' }
  return { bg: 'bg-slate-500/20', icon: '·', dot: 'bg-slate-400' }
}

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)    return `${Math.floor(diff)}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const SidebarNotifications = ({ collapsed }) => {
  const [notifications, setNotifications] = useState([])
  const [expanded, setExpanded]           = useState(null)
  const [clearing, setClearing]           = useState(false)

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchNotifications = async () => {
    try {
      const res  = await fetch('http://localhost:3000/notifications', { headers })
      const data = await res.json()
      if (data.success) setNotifications(data.data || [])
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchNotifications() }, [])
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    const handler = () => fetchNotifications()
    window.addEventListener('notificationUpdated', handler)
    return () => window.removeEventListener('notificationUpdated', handler)
  }, [])

  const markRead = async (id, e) => {
    e?.stopPropagation()
    try {
      await fetch(`http://localhost:3000/notifications/${id}/read`, { method: 'PUT', headers })
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) { console.error(err) }
  }

  // Dismiss (delete) a single notification
  const dismissOne = async (id, e) => {
    e?.stopPropagation()
    try {
      // Try DELETE endpoint first; if your backend uses a different route, adjust here
      const res = await fetch(`http://localhost:3000/notifications/${id}`, { method: 'DELETE', headers })
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id))
        window.dispatchEvent(new Event('notificationUpdated'))
      } else {
        // Fallback: just mark as read and hide locally
        await fetch(`http://localhost:3000/notifications/${id}/read`, { method: 'PUT', headers })
        setNotifications(prev => prev.filter(n => n._id !== id))
      }
    } catch (err) {
      // Fallback: remove from local state
      setNotifications(prev => prev.filter(n => n._id !== id))
      console.error(err)
    }
  }

  // Clear All: delete all notifications
  const clearAll = async () => {
    setClearing(true)
    try {
      // Try bulk delete endpoint
      const res = await fetch('http://localhost:3000/notifications/clear-all', { method: 'DELETE', headers })
      if (res.ok) {
        setNotifications([])
        window.dispatchEvent(new Event('notificationUpdated'))
      } else {
        // Fallback: mark all read via existing endpoint, then clear locally
        await fetch('http://localhost:3000/notifications/read-all', { method: 'PUT', headers })
        setNotifications([])
        window.dispatchEvent(new Event('notificationUpdated'))
      }
    } catch (err) {
      // Last resort: just clear locally
      setNotifications([])
      console.error(err)
    } finally {
      setClearing(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const recent      = notifications.slice(0, 6)

  // ── Collapsed view ─────────────────────────────────────────────
  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <div className="relative">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    )
  }

  // ── Expanded view ───────────────────────────────────────────────
  return (
    <div className="mt-3">
      {/* Header row */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-blue-500/30 text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* ✅ Clear All button — visible whenever there are any notifications */}
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            disabled={clearing}
            className="flex items-center gap-1 text-slate-500 hover:text-red-400 text-[10px] transition-colors disabled:opacity-50"
            title="Clear all notifications"
          >
            {clearing ? (
              <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            Clear all
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-0.5 max-h-56 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {recent.length === 0 ? (
          <p className="text-slate-500 text-xs px-2 py-3 text-center">No notifications</p>
        ) : recent.map((n) => {
          const { bg, icon, dot } = typeIcon(n.type || '')
          const isOpen = expanded === n._id
          return (
            <div key={n._id} className={`rounded-lg overflow-hidden transition-all ${!n.isRead ? 'bg-white/[0.04]' : ''}`}>
              {/* Row */}
              <div
                onClick={() => setExpanded(isOpen ? null : n._id)}
                className="flex items-start gap-2.5 px-2 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-all group"
              >
                {/* Type icon */}
                <div className={`w-6 h-6 rounded-full ${bg} flex items-center justify-center text-xs shrink-0 mt-0.5`}>
                  {icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-tight ${!n.isRead ? 'text-white' : 'text-slate-400'}`}>
                    {n.title || n.message}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>

                {/* Right side: unread dot + chevron + ✕ dismiss */}
                <div className="flex items-center gap-1 shrink-0">
                  {!n.isRead && <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
                  <svg className={`w-3 h-3 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {/* ✅ Individual dismiss × button */}
                  <button
                    onClick={(e) => dismissOne(n._id, e)}
                    className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 text-slate-500 hover:text-red-400 transition-all text-[10px] leading-none"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-2 pb-2 ml-8">
                  <p className="text-slate-300 text-xs leading-relaxed mb-2">
                    {n.message || n.title}
                  </p>
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <button
                        onClick={(e) => markRead(n._id, e)}
                        className="text-[10px] px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-md transition-all"
                      >
                        Mark as read ✓
                      </button>
                    )}
                    <button
                      onClick={(e) => dismissOne(n._id, e)}
                      className="text-[10px] px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition-all"
                    >
                      Dismiss ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SidebarNotifications