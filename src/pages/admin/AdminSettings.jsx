import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const AdminSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved]             = useState(false);
  const [pwForm, setPwForm]           = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError]         = useState('');
  const [pwSuccess, setPwSuccess]     = useState('');

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [profile, setProfile] = useState({
    firstName: storedUser.firstName || '',
    lastName:  storedUser.lastName  || '',
    email:     storedUser.email     || '',
    role:      storedUser.role      || '',
  });
  const [preview, setPreview] = useState(storedUser.profilePic || null);

  const navigate = useNavigate();
  const location = useLocation();
  const token    = localStorage.getItem('token');
  const headers  = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const navItems = [
    { name: 'Dashboard', path: '/admindashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users',     path: '/admin/users',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Projects',  path: '/admin/projects',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Settings',  path: '/admin/settings',  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const handleSaveProfile = async () => {
    try {
      const res  = await fetch(`http://localhost:3000/users/${storedUser._id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ firstName: profile.firstName, lastName: profile.lastName })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify({ ...storedUser, firstName: profile.firstName, lastName: profile.lastName }));
        window.dispatchEvent(new Event('userUpdated')) // ✅ add this
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    setPwError(''); setPwSuccess('');
    if (!pwForm.newPassword || !pwForm.confirmPassword) { setPwError('Fill all fields'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword)  { setPwError('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6)                  { setPwError('Password must be at least 6 characters'); return; }
    try {
      const res  = await fetch('http://localhost:3000/users/forgot-password', {
        method: 'POST', headers,
        body: JSON.stringify({ email: storedUser.email })
      });
      const data = await res.json();
      if (data.success) {
        setPwSuccess('Password reset link sent to your email!');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwError(data.message || 'Failed to send reset link');
      }
    } catch(err) {
      setPwError('Server error');    
      console.log(err);
    }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]
    
    if (!file) return
    setPreview(URL.createObjectURL(file))
    const formData = new FormData()
    formData.append("profilePic", file)
    const res = await fetch("http://localhost:3000/users/profile-pic", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    const data = await res.json()
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.data))
      setPreview(data.data.profilePic)
      window.dispatchEvent(new Event('userUpdated')) // ✅ add this
    }
    e.target.value = ""
  }

  const handleRemovePhoto = async () => {
    const res = await fetch("http://localhost:3000/users/profile-pic/remove", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      localStorage.setItem("user", JSON.stringify({ ...storedUser, profilePic: null }))
      setPreview(null)
      window.dispatchEvent(new Event('userUpdated')) // ✅ add this
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-3">
            <Link to="/admindashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
              Bug Tracker
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-white/10'
                }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* <div className="mt-4">
            <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                {preview ? (
                  <img src={preview} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                    {storedUser.firstName?.charAt(0) || 'A'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{profile.firstName} {profile.lastName}</p>
                  <p className="text-slate-400 text-xs truncate">{profile.email}</p>
                </div>
              </div>
            </div>
          </div> */}
          <div className="mt-4">
            <Link
              to="/admin/settings"
              className="block backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center space-x-3">
                {preview ? (
                  <img src={preview} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                    {profile.firstName?.charAt(0) || 'A'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{profile.firstName} {profile.lastName}</p>
                  <p className="text-slate-400 text-xs truncate">{profile.email}</p>
                </div>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </aside>

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
              <p className="text-slate-300 text-sm">Manage your account</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6 max-w-2xl">

          {/* Profile Section */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

            {/* Avatar + buttons */}
            <div className="flex items-center gap-5 mb-6">
              {preview ? (
                <img src={preview} className="w-16 h-16 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {profile.firstName?.charAt(0) || 'A'}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium transition"
                  >
                    Change Photo
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadPhoto}
                  />
                  {preview && (
                    <button
                      onClick={handleRemovePhoto}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{profile.firstName} {profile.lastName}</p>
                  <p className="text-slate-400 text-sm">{profile.email}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 mt-1 inline-block capitalize">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Name fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">First Name</label>
                  <input type="text" value={profile.firstName}
                    onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Last Name</label>
                  <input type="text" value={profile.lastName}
                    onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Email (read only)</label>
                <input type="email" value={profile.email} disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 cursor-not-allowed" />
              </div>
            </div>

            {saved && <p className="text-green-400 text-sm mt-3">Profile saved successfully</p>}

            <button onClick={handleSaveProfile}
              className="mt-4 px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
              Save Changes
            </button>
          </div>

          {/* Password Section */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
            <p className="text-slate-400 text-sm mb-4">
              Click the button below to receive a password reset link at <span className="text-white">{profile.email}</span>
            </p>
            {pwError   && <p className="text-red-400 text-sm mb-3">{pwError}</p>}
            {pwSuccess && <p className="text-green-400 text-sm mb-3">{pwSuccess}</p>}
            <button onClick={handleChangePassword}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
              Send Password Reset Email
            </button>
          </div>

          {/* Danger Zone */}
          <div className="backdrop-blur-xl bg-red-500/5 rounded-2xl p-6 border border-red-500/20">
            <h2 className="text-xl font-bold text-white mb-2">Danger Zone</h2>
            <p className="text-slate-400 text-sm mb-4">Logging out will clear all session data.</p>
            <button onClick={handleLogout}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all">
              Logout
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminSettings;