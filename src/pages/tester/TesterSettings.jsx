import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TesterSidebar from '../../components/tester/TesterSidebar'

const TesterSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving]           = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [message, setMessage]         = useState({ text: '', ok: true })
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
  const [form, setForm]               = useState({ firstName: '', lastName: '' })
  const fileRef  = useRef(null)
  const navigate = useNavigate()
  const token    = localStorage.getItem('token')
  const headers  = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}')
    setCurrentUser(u)
    setForm({ firstName: u.firstName || '', lastName: u.lastName || '' })
  }, [])

  useEffect(() => {
    const sync = () => {
      const u = JSON.parse(localStorage.getItem('user') || '{}')
      setCurrentUser(u)
      setForm({ firstName: u.firstName || '', lastName: u.lastName || '' })
    }
    window.addEventListener('storage', sync)
    window.addEventListener('userUpdated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('userUpdated', sync)
    }
  }, [])

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const showMsg = (text, ok = true) => {
    setMessage({ text, ok })
    setTimeout(() => setMessage({ text: '', ok: true }), 4000)
  }

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      showMsg('First and last name are required', false); return
    }
    setSaving(true)
    try {
      const res  = await fetch(`http://localhost:3000/users/${currentUser._id}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName.trim(), lastName: form.lastName.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        const updated = { ...currentUser, firstName: form.firstName.trim(), lastName: form.lastName.trim() }
        localStorage.setItem('user', JSON.stringify(updated))
        setCurrentUser(updated)
        window.dispatchEvent(new Event('userUpdated'))
        showMsg('Profile updated!')
      } else {
        showMsg(data.message || 'Failed to update', false)
      }
    } catch { showMsg('Server error', false) }
    finally { setSaving(false) }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { showMsg('Please select an image', false); return }
    if (file.size > 2 * 1024 * 1024)    { showMsg('Image must be under 2MB', false); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('profilePic', file)
      const res  = await fetch('http://localhost:3000/users/profile-pic', {
        method: 'PATCH', headers, body: fd,
      })
      const data = await res.json()
      if (data.success) {
        const updated = { ...currentUser, profilePic: data.data.profilePic }
        localStorage.setItem('user', JSON.stringify(updated))
        setCurrentUser(updated)
        window.dispatchEvent(new Event('userUpdated'))
        showMsg('Photo updated!')
      } else { showMsg(data.message || 'Upload failed', false) }
    } catch { showMsg('Server error', false) }
    finally { setUploading(false); e.target.value = '' }
  }

  const handleRemovePhoto = async () => {
    if (!currentUser.profilePic) return
    setUploading(true)
    try {
      const res  = await fetch('http://localhost:3000/users/profile-pic/remove', {
        method: 'PATCH', headers,
      })
      const data = await res.json()
      if (data.success) {
        const updated = { ...currentUser, profilePic: null }
        localStorage.setItem('user', JSON.stringify(updated))
        setCurrentUser(updated)
        window.dispatchEvent(new Event('userUpdated'))
        showMsg('Photo removed.')
      } else { showMsg(data.message || 'Failed', false) }
    } catch { showMsg('Server error', false) }
    finally { setUploading(false) }
  }

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
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-slate-300 text-sm">Manage your profile</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6 max-w-2xl">

          {message.text && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${message.ok ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {message.text}
            </div>
          )}

          {/* Profile Information */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

            <div className="flex items-center gap-5 mb-8">
              <div className="relative shrink-0">
                {currentUser.profilePic ? (
                  <img src={currentUser.profilePic} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/20" alt="avatar" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold ring-2 ring-white/20">
                    {currentUser.firstName?.charAt(0) || 'T'}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-lg">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-slate-400 text-sm mb-1">{currentUser.email}</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-orange-500/20 text-orange-400 mb-3">Tester</span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <div className="flex gap-3">
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                    {uploading ? 'Uploading…' : 'Change Photo'}
                  </button>
                  {currentUser.profilePic && (
                    <button onClick={handleRemovePhoto} disabled={uploading}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">First Name</label>
                <input type="text" value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Last Name</label>
                <input type="text" value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            <div className="mb-6">
              <label className="text-slate-400 text-xs mb-1.5 block">Email (read only)</label>
              <input type="email" value={currentUser.email || ''} readOnly
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 cursor-not-allowed" />
            </div>
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Change Password */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-2">Change Password</h2>
            <p className="text-slate-400 text-sm mb-6">To change your password, use the Forgot Password option on the login page. This ensures your account stays secure.</p>
            <button onClick={() => { localStorage.clear(); navigate('/') }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all text-sm">
              Go to Login (use Forgot Password)
            </button>
          </div>

          {/* Account Info */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Account Info</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Role',   value: 'Tester' },
                { label: 'Status', value: currentUser.status || 'active' },
                { label: 'Joined', value: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default TesterSettings