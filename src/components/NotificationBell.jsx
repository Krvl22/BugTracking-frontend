import { useState, useEffect, useRef } from 'react'

const notifTypeColor = (t) => {
  if (t?.includes('bug'))        return 'bg-red-500/20 text-red-400'
  if (t?.includes('completed'))  return 'bg-green-500/20 text-green-400'
  if (t?.includes('assigned'))   return 'bg-blue-500/20 text-blue-400'
  if (t?.includes('submitted'))  return 'bg-purple-500/20 text-purple-400'
  return 'bg-slate-500/20 text-slate-400'
}

const NotificationBell = () => {
  const [open, setOpen]                   = useState(false)
  const [notifications, setNotifications] = useState([])
  const ref   = useRef(null)
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch notifications
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch('http://localhost:3000/notifications', { headers })
        const data = await res.json()
        if (data.data) setNotifications(data.data)
      } catch (err) { console.error(err) }
    }
    fetch_()
  }, [])

  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:3000/notifications/${id}/read`, { method: 'PUT', headers })
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) { console.error(err) }
  }

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:3000/notifications/read-all', { method: 'PUT', headers })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) { console.error(err) }
  }

  const unread = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-300 hover:text-white transition-colors"
      >
        {/* Bell icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-blue-400 text-xs hover:text-blue-300">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-slate-400 text-sm p-6 text-center">No notifications yet</p>
            ) : (
              notifications.slice(0, 15).map((n) => (
                <div
                  key={n._id}
                  onClick={() => markRead(n._id)}
                  className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-blue-500/5' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-blue-400' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-white text-xs font-medium truncate">{n.title}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${notifTypeColor(n.type)}`}>
                          {n.type?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">{n.message}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <p className="text-slate-500 text-xs text-center py-2 border-t border-white/10">
              {notifications.length} total notifications
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell