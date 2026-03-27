// import React, { useState } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';

// const AdminSettings = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [saved, setSaved]             = useState(false);
//   const [pwForm, setPwForm]           = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
//   const [pwError, setPwError]         = useState('');
//   const [pwSuccess, setPwSuccess]     = useState('');

//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const [profile, setProfile] = useState({
//     firstName: storedUser.firstName || '',
//     lastName:  storedUser.lastName  || '',
//     email:     storedUser.email     || '',
//     role:      storedUser.role      || '',
//   });
//   const [preview, setPreview] = useState(storedUser.profilePic || null);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const token    = localStorage.getItem('token');
//   const headers  = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

//   const navItems = [
//     { name: 'Dashboard', path: '/admindashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//     { name: 'Users',     path: '/admin/users',     icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
//     { name: 'Projects',  path: '/admin/projects',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
//     { name: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
//     { name: 'Settings',  path: '/admin/settings',  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
//   ];

//   const handleLogout = () => { localStorage.clear(); navigate('/'); };

//   const handleSaveProfile = async () => {
//     try {
//       const res  = await fetch(`http://localhost:3000/users/${storedUser._id}`, {
//         method: 'PUT', headers,
//         body: JSON.stringify({ firstName: profile.firstName, lastName: profile.lastName })
//       });
//       const data = await res.json();
//       if (data.success) {
//         localStorage.setItem('user', JSON.stringify({ ...storedUser, firstName: profile.firstName, lastName: profile.lastName }));
//         window.dispatchEvent(new Event('userUpdated')) // ✅ add this
//         setSaved(true);
//         setTimeout(() => setSaved(false), 3000);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChangePassword = async () => {
//     setPwError(''); setPwSuccess('');
//     if (!pwForm.newPassword || !pwForm.confirmPassword) { setPwError('Fill all fields'); return; }
//     if (pwForm.newPassword !== pwForm.confirmPassword)  { setPwError('Passwords do not match'); return; }
//     if (pwForm.newPassword.length < 6)                  { setPwError('Password must be at least 6 characters'); return; }
//     try {
//       const res  = await fetch('http://localhost:3000/users/forgot-password', {
//         method: 'POST', headers,
//         body: JSON.stringify({ email: storedUser.email })
//       });
//       const data = await res.json();
//       if (data.success) {
//         setPwSuccess('Password reset link sent to your email!');
//         setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       } else {
//         setPwError(data.message || 'Failed to send reset link');
//       }
//     } catch(err) {
//       setPwError('Server error');    
//       console.log(err);
//     }
//   };

//   const handleUploadPhoto = async (e) => {
//     const file = e.target.files[0]
    
//     if (!file) return
//     setPreview(URL.createObjectURL(file))
//     const formData = new FormData()
//     formData.append("profilePic", file)
//     const res = await fetch("http://localhost:3000/users/profile-pic", {
//       method: "PATCH",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     })
//     const data = await res.json()
//     if (data.success) {
//       localStorage.setItem("user", JSON.stringify(data.data))
//       setPreview(data.data.profilePic)
//       window.dispatchEvent(new Event('userUpdated')) // ✅ add this
//     }
//     e.target.value = ""
//   }

//   const handleRemovePhoto = async () => {
//     const res = await fetch("http://localhost:3000/users/profile-pic/remove", {
//       method: "PATCH",
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     const data = await res.json()
//     if (data.success) {
//       localStorage.setItem("user", JSON.stringify({ ...storedUser, profilePic: null }))
//       setPreview(null)
//       window.dispatchEvent(new Event('userUpdated')) // ✅ add this
//     }
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//         <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//       </div>

//       {/* Sidebar */}
//       <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
//         <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">
//           <div className="flex items-center justify-between mb-8 px-3">
//             <Link to="/admindashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
//               Bug Tracker
//             </Link>
//             <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <nav className="space-y-2 flex-1">
//             {navItems.map((item) => (
//               <Link key={item.name} to={item.path}
//                 className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
//                   location.pathname === item.path
//                     ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
//                     : 'text-slate-300 hover:bg-white/10'
//                 }`}>
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
//                 </svg>
//                 {item.name}
//               </Link>
//             ))}
//           </nav>

//           {/* <div className="mt-4">
//             <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
//               <div className="flex items-center space-x-3">
//                 {preview ? (
//                   <img src={preview} className="w-10 h-10 rounded-full object-cover shrink-0" />
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
//                     {storedUser.firstName?.charAt(0) || 'A'}
//                   </div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-white text-sm font-medium truncate">{profile.firstName} {profile.lastName}</p>
//                   <p className="text-slate-400 text-xs truncate">{profile.email}</p>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//           <div className="mt-4">
//             <Link
//               to="/admin/settings"
//               className="block backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all"
//             >
//               <div className="flex items-center space-x-3">
//                 {preview ? (
//                   <img src={preview} className="w-10 h-10 rounded-full object-cover shrink-0" />
//                 ) : (
//                   <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
//                     {profile.firstName?.charAt(0) || 'A'}
//                   </div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-white text-sm font-medium truncate">{profile.firstName} {profile.lastName}</p>
//                   <p className="text-slate-400 text-xs truncate">{profile.email}</p>
//                 </div>
//                 <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </aside>

//       <div className="lg:ml-64">
//         <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-30 px-4 py-4 lg:px-8 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Settings</h1>
//               <p className="text-slate-300 text-sm">Manage your account</p>
//             </div>
//           </div>
//           <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
//             Logout
//           </button>
//         </header>

//         <main className="p-4 lg:p-8 relative z-10 space-y-6 max-w-2xl">

//           {/* Profile Section */}
//           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//             <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

//             {/* Avatar + buttons */}
//             <div className="flex items-center gap-5 mb-6">
//               {preview ? (
//                 <img src={preview} className="w-16 h-16 rounded-full object-cover shrink-0" />
//               ) : (
//                 <div className="w-16 h-16 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
//                   {profile.firstName?.charAt(0) || 'A'}
//                 </div>
//               )}

//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center gap-2">
//                   <label
//                     htmlFor="fileUpload"
//                     className="cursor-pointer px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium transition"
//                   >
//                     Change Photo
//                   </label>
//                   <input
//                     id="fileUpload"
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleUploadPhoto}
//                   />
//                   {preview && (
//                     <button
//                       onClick={handleRemovePhoto}
//                       className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//                 <div>
//                   <p className="text-white font-medium">{profile.firstName} {profile.lastName}</p>
//                   <p className="text-slate-400 text-sm">{profile.email}</p>
//                   <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 mt-1 inline-block capitalize">
//                     {profile.role}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Name fields */}
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-slate-400 text-sm mb-1 block">First Name</label>
//                   <input type="text" value={profile.firstName}
//                     onChange={e => setProfile({ ...profile, firstName: e.target.value })}
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <div>
//                   <label className="text-slate-400 text-sm mb-1 block">Last Name</label>
//                   <input type="text" value={profile.lastName}
//                     onChange={e => setProfile({ ...profile, lastName: e.target.value })}
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
//                 </div>
//               </div>
//               <div>
//                 <label className="text-slate-400 text-sm mb-1 block">Email (read only)</label>
//                 <input type="email" value={profile.email} disabled
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 cursor-not-allowed" />
//               </div>
//             </div>

//             {saved && <p className="text-green-400 text-sm mt-3">Profile saved successfully</p>}

//             <button onClick={handleSaveProfile}
//               className="mt-4 px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all">
//               Save Changes
//             </button>
//           </div>

//           {/* Password Section */}
//           <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
//             <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
//             <p className="text-slate-400 text-sm mb-4">
//               Click the button below to receive a password reset link at <span className="text-white">{profile.email}</span>
//             </p>
//             {pwError   && <p className="text-red-400 text-sm mb-3">{pwError}</p>}
//             {pwSuccess && <p className="text-green-400 text-sm mb-3">{pwSuccess}</p>}
//             <button onClick={handleChangePassword}
//               className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
//               Send Password Reset Email
//             </button>
//           </div>

//           {/* Danger Zone */}
//           <div className="backdrop-blur-xl bg-red-500/5 rounded-2xl p-6 border border-red-500/20">
//             <h2 className="text-xl font-bold text-white mb-2">Danger Zone</h2>
//             <p className="text-slate-400 text-sm mb-4">Logging out will clear all session data.</p>
//             <button onClick={handleLogout}
//               className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all">
//               Logout
//             </button>
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminSettings;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admindashboard', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Users',     path: '/admin/users',     d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Projects',  path: '/admin/projects',  d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { name: 'Analytics', path: '/admin/analytics', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { name: 'Settings',  path: '/admin/settings',  d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

const AdminSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [message, setMessage]         = useState('');
  const [uploading, setUploading]     = useState(false);

  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || '{}')
  );
  const [form, setForm] = useState({
    firstName: currentUser.firstName || '',
    lastName:  currentUser.lastName  || '',
  });
  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });

  const navigate  = useNavigate();
  const location  = useLocation();
  const fileRef   = useRef(null);
  const token     = localStorage.getItem('token');
  const headers   = { Authorization: `Bearer ${token}` };

  // Keep form in sync if user changes elsewhere
  useEffect(() => {
    const sync = () => {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      setCurrentUser(u);
      setForm({ firstName: u.firstName || '', lastName: u.lastName || '' });
    };
    window.addEventListener('storage',     sync);
    window.addEventListener('userUpdated', sync);
    return () => {
      window.removeEventListener('storage',     sync);
      window.removeEventListener('userUpdated', sync);
    };
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // ── Save profile (name) ────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true); setMessage('');
    try {
      const res  = await fetch(`http://localhost:3000/users/${currentUser._id}`, {
        method:  'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ firstName: form.firstName, lastName: form.lastName }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...currentUser, firstName: form.firstName, lastName: form.lastName };
        localStorage.setItem('user', JSON.stringify(updated));
        setCurrentUser(updated);
        window.dispatchEvent(new Event('userUpdated'));
        setMessage('Profile updated successfully!');
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch { setMessage('Server error'); }
    finally   { setSaving(false); }
  };

  // ── Change password ────────────────────────────────────────────
  const handleChangePassword = async () => {
    setMessage('');
    if (passwords.newPass !== passwords.confirm) { setMessage('New passwords do not match'); return; }
    if (passwords.newPass.length < 6)            { setMessage('Password must be at least 6 characters'); return; }
    try {
      const res  = await fetch(`http://localhost:3000/users/${currentUser._id}/password`, {
        method:  'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      setMessage(data.success ? 'Password changed successfully!' : (data.message || 'Failed to change password'));
      if (data.success) setPasswords({ current: '', newPass: '', confirm: '' });
    } catch { setMessage('Server error'); }
  };

  // ── Upload photo ───────────────────────────────────────────────
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate: image only, max 2 MB
    if (!file.type.startsWith('image/'))      { setMessage('Please select an image file'); return; }
    if (file.size > 2 * 1024 * 1024)         { setMessage('Image must be under 2 MB');    return; }

    setUploading(true); setMessage('');
    try {
      const fd = new FormData();
      fd.append('profilePic', file);

      const res  = await fetch(`http://localhost:3000/users/${currentUser._id}/profile-pic`, {
        method:  'POST',
        headers, // no Content-Type — browser sets multipart boundary automatically
        body:    fd,
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...currentUser, profilePic: data.data.profilePic };
        localStorage.setItem('user', JSON.stringify(updated));
        setCurrentUser(updated);
        window.dispatchEvent(new Event('userUpdated'));
        setMessage('Photo updated successfully!');
      } else {
        setMessage(data.message || 'Failed to upload photo');
      }
    } catch { setMessage('Server error'); }
    finally   { setUploading(false); }
  };

  // ── Remove photo ───────────────────────────────────────────────
  const handleRemovePhoto = async () => {
    if (!currentUser.profilePic) return;
    setUploading(true); setMessage('');
    try {
      const res  = await fetch(`http://localhost:3000/users/${currentUser._id}/profile-pic`, {
        method:  'DELETE',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...currentUser, profilePic: null };
        localStorage.setItem('user', JSON.stringify(updated));
        setCurrentUser(updated);
        window.dispatchEvent(new Event('userUpdated'));
        setMessage('Photo removed.');
      } else {
        setMessage(data.message || 'Failed to remove photo');
      }
    } catch { setMessage('Server error'); }
    finally   { setUploading(false); }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-3">
            <Link to="/admindashboard" className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">Bug Tracker</Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.name} to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-white/10'
                }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
                </svg>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Sidebar user card */}
          <div className="mt-4">
            <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                {currentUser?.profilePic ? (
                  <img src={currentUser.profilePic} className="w-10 h-10 rounded-full object-cover shrink-0" alt="avatar" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                    {currentUser.firstName?.charAt(0) || 'A'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-slate-400 text-xs truncate">{currentUser.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="lg:ml-64">

        {/* Header */}
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
          <button onClick={handleLogout}
            className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all">
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-8 relative z-10 space-y-6 max-w-2xl">

          {/* ── Feedback message ── */}
          {message && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
              message.toLowerCase().includes('success') || message.toLowerCase().includes('updated') || message.toLowerCase().includes('removed') || message.toLowerCase().includes('changed')
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          {/* ── Profile Information card ── */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

            {/* ── FIXED: Avatar row with clean button placement ── */}
            <div className="flex items-center gap-5 mb-8">

              {/* Avatar */}
              <div className="relative shrink-0">
                {currentUser?.profilePic ? (
                  <img
                    src={currentUser.profilePic}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/20"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold ring-2 ring-white/20">
                    {currentUser.firstName?.charAt(0) || 'A'}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Info + action buttons stacked vertically beside avatar */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-lg truncate">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-slate-400 text-sm truncate mb-1">{currentUser.email}</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 capitalize mb-3">
                  {currentUser.role || 'Admin'}
                </span>

                {/* Buttons on their own row, left-aligned, no overlap */}
                <div className="flex items-center gap-3">
                  {/* Hidden file input */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading…' : 'Change Photo'}
                  </button>

                  {currentUser?.profilePic && (
                    <button
                      onClick={handleRemovePhoto}
                      disabled={uploading}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">First Name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="mb-6">
              <label className="text-slate-400 text-xs mb-1.5 block">Email (read only)</label>
              <input
                type="email"
                value={currentUser.email || ''}
                readOnly
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* ── Change Password card ── */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">New Password</label>
                <input
                  type="password"
                  value={passwords.newPass}
                  onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Repeat new password"
                />
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all"
            >
              Update Password
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminSettings;