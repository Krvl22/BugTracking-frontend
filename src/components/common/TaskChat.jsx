import { useState, useEffect, useRef } from 'react'

const TaskChat = ({ taskId }) => {
  const [messages, setMessages] = useState([])
  const [text, setText]         = useState('')
  const [sending, setSending]   = useState(false)
  const [error, setError]       = useState('')
  const bottomRef = useRef(null)

  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')
  const h     = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const fetchMessages = async () => {
    try {
      const res    = await fetch(`http://localhost:3000/chat/${taskId}`, { headers: h })
      const result = await res.json()
      if (result.success) setMessages(result.data || [])
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (taskId) fetchMessages()
    const interval = setInterval(() => { if (taskId) fetchMessages() }, 5000)
    return () => clearInterval(interval)
  }, [taskId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim()) return
    setError('')
    setSending(true)
    try {
      const res    = await fetch(`http://localhost:3000/chat/${taskId}`, {
        method: 'POST', headers: h,
        body: JSON.stringify({ message: text.trim() })
      })
      const result = await res.json()
      if (result.success) { setMessages(prev => [...prev, result.data]); setText('') }
      else setError(result.message || 'Failed to send')
    } catch { setError('Server error') }
    setSending(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  const roleColor = (role) => ({ tester: 'bg-orange-500', developer: 'bg-blue-500', project_manager: 'bg-purple-500', admin: 'bg-red-500' }[role] || 'bg-slate-500')
  const roleBadge = (role) => ({ tester: 'Tester', developer: 'Developer', project_manager: 'Manager', admin: 'Admin' }[role] || role)

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col h-[420px]">
      <div className="px-5 py-4 border-b border-white/10 shrink-0 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="text-white font-semibold text-sm">Chat</span>
        <span className="text-slate-400 text-xs">({messages.length} messages)</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
        {messages.length === 0 ? (
          <p className="text-slate-500 text-xs text-center mt-8">No messages yet. Start the conversation!</p>
        ) : messages.map(msg => {
          const isMe = msg.sender?._id === user._id
          return (
            <div key={msg._id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full ${roleColor(msg.sender?.role)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {msg.sender?.firstName?.[0]}{msg.sender?.lastName?.[0]}
              </div>
              <div className={`max-w-[75%] flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`px-3 py-2 rounded-xl text-sm ${isMe ? 'bg-blue-500/30 text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none'}`}>
                  {msg.message}
                </div>
                <div className="text-[10px] text-slate-500">
                  {msg.sender?.firstName} · {roleBadge(msg.sender?.role)} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-white/10 shrink-0">
        {error && <p className="text-red-400 text-xs mb-1">{error}</p>}
        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKey}
            placeholder="Type a message... (Enter to send)"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <button onClick={handleSend} disabled={sending || !text.trim()}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-40 transition-all shrink-0">
            {sending ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskChat