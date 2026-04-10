// SidebarNotifications.jsx
// Drop-in inline notification list for sidebars — matches the design in screenshots
// Usage: <SidebarNotifications collapsed={collapsed} />

import { useState, useEffect, useRef } from 'react'

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
  if (diff < 60)   return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const SidebarNotifications = ({ collapsed }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:3000/notifications', { headers })
      const data = await res.json()
      if (data.success) setNotifications(data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchNotifications() }, [])

  // Poll every 15s
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [])

  // Real-time trigger
  useEffect(() => {
    const handler = () => fetchNotifications()
    window.addEventListener('notificationUpdated', handler)
    return () => window.removeEventListener('notificationUpdated', handler)
  }, [])

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:3000/notifications/read-all', { method: 'PUT', headers })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) { console.error(err) }
  }

  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:3000/notifications/${id}/read`, { method: 'PUT', headers })
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) { console.error(err) }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const recent      = notifications.slice(0, 5)

  // Collapsed: show just a bell icon with badge
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

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-blue-500/30 text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-slate-500 hover:text-slate-300 text-[10px] transition-colors"
          >
            clear
          </button>
        )}
      </div>

      {/* Notification Items */}
      <div className="space-y-1 max-h-52 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {recent.length === 0 ? (
          <p className="text-slate-500 text-xs px-2 py-3 text-center">No notifications</p>
        ) : recent.map((n) => {
          const { bg, icon, dot } = typeIcon(n.type || '')
          return (
            <div
              key={n._id}
              onClick={() => markRead(n._id)}
              className={`flex items-start gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all hover:bg-white/5 ${!n.isRead ? 'bg-white/[0.03]' : ''}`}
            >
              {/* Type icon */}
              <div className={`w-6 h-6 rounded-full ${bg} flex items-center justify-center text-xs shrink-0 mt-0.5`}>
                {icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-tight truncate ${!n.isRead ? 'text-white' : 'text-slate-400'}`}>
                  {n.title || n.message}
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5">{timeAgo(n.createdAt)}</p>
              </div>

              {/* Unread dot */}
              {!n.isRead && (
                <div className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0 mt-1.5`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SidebarNotifications