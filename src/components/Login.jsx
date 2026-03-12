import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "developer",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/user/login", {
        email: formData.email,
        password: formData.password,
        role: formData.role, // ✅ sending role too
      });

      if (res.status === 200) {
        const userData = res.data.data;

        // ✅ Save user info to localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        toast.success("Login successful! Redirecting...");

        // ✅ Role-based redirect
        const role = userData?.role;
        if (role === "admin") navigate("/admindashboard");
        else if (role === "manager") navigate("/managerdashboard");
        else if (role === "developer") navigate("/developerdashboard");
        else if (role === "tester") navigate("/testerdashboard");
        else toast.warning("Unknown role. Please contact admin.");
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) toast.error("Invalid email or password");
      else if (err.response?.status === 404) toast.error("User not found");
      else toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ℹ️ About useForm:
  // You do NOT need useForm here. Your form is simple and already works perfectly.
  // useForm (React Hook Form) is useful when you have 10+ fields or complex validation.
  // For login (only 2 fields), useState is cleaner and easier to understand.

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500"></div>
              <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
            </div>
            <p className="text-slate-300 text-sm">Sign in to manage your projects</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["developer", "tester", "manager", "admin"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all capitalize ${
                      formData.role === role
                        ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {role === "manager" ? "Project Manager" : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

            <p className="text-center text-sm text-slate-300">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Sign Up
              </a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";

// export const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: "developer",
//     remember: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleRoleSelect = (role) => {
//     setFormData((prev) => ({ ...prev, role }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post("https://node5.onrender.com/user/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       if (res.status === 200) {
//         toast.success("Login successful! Redirecting...");
//         localStorage.setItem("user", JSON.stringify(res.data));

//         const role = res?.data?.data?.role;

//         if (role === "admin") navigate("/admindashboard");
//         else if (role === "manager") navigate("/managerdashboard");
//         else if (role === "developer") navigate("/developerdashboard");
//         else if (role === "tester") navigate("/testerdashboard");
//         else toast.warning("Unknown role, contact admin");
//       }
//     } catch (err) {
//       console.log(err);
//       if (err.response?.status === 401) toast.error("Invalid email or password");
//       else if (err.response?.status === 404) toast.error("User not found");
//       else toast.error("Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const roles = [
//     { id: "developer", label: "Developer", icon: "⌨" },
//     { id: "tester", label: "Tester", icon: "🔍" },
//     { id: "manager", label: "Manager", icon: "📋" },
//     { id: "admin", label: "Admin", icon: "🛡" },
//   ];

//   return (
//     <div style={styles.page}>
//       {/* Left Panel */}
//       <div style={styles.leftPanel}>
//         <div style={styles.leftContent}>
//           <div style={styles.brand}>
//             <div style={styles.brandIcon}>
//               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
//                 <circle cx="12" cy="12" r="3" />
//                 <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
//               </svg>
//             </div>
//             <span style={styles.brandName}>BugTracker</span>
//           </div>

//           <div style={styles.heroText}>
//             <h1 style={styles.heroHeading}>Track. Fix.<br />Ship faster.</h1>
//             <p style={styles.heroSub}>
//               Centralized bug management for high-performing engineering teams.
//             </p>
//           </div>

//           <div style={styles.statsRow}>
//             {[
//               { number: "12k+", label: "Bugs resolved" },
//               { number: "340+", label: "Teams active" },
//               { number: "99.9%", label: "Uptime" },
//             ].map((stat) => (
//               <div key={stat.label} style={styles.statItem}>
//                 <span style={styles.statNumber}>{stat.number}</span>
//                 <span style={styles.statLabel}>{stat.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Decorative grid lines */}
//         <div style={styles.gridOverlay} />
//       </div>

//       {/* Right Panel */}
//       <div style={styles.rightPanel}>
//         <div style={styles.formCard}>
//           <div style={styles.formHeader}>
//             <h2 style={styles.formTitle}>Welcome back</h2>
//             <p style={styles.formSub}>Sign in to your workspace</p>
//           </div>

//           <form onSubmit={handleSubmit} style={styles.form}>
//             {/* Role Selector */}
//             <div style={styles.fieldGroup}>
//               <label style={styles.label}>Your Role</label>
//               <div style={styles.roleGrid}>
//                 {roles.map((r) => (
//                   <button
//                     key={r.id}
//                     type="button"
//                     onClick={() => handleRoleSelect(r.id)}
//                     style={{
//                       ...styles.roleBtn,
//                       ...(formData.role === r.id ? styles.roleBtnActive : {}),
//                     }}
//                   >
//                     <span style={styles.roleBtnLabel}>{r.label}</span>
//                     {formData.role === r.id && (
//                       <span style={styles.roleCheck}>
//                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
//                           <polyline points="20 6 9 17 4 12" />
//                         </svg>
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Email */}
//             <div style={styles.fieldGroup}>
//               <label style={styles.label}>Email Address</label>
//               <div style={styles.inputWrapper}>
//                 <span style={styles.inputIcon}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
//                     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                     <polyline points="22,6 12,13 2,6" />
//                   </svg>
//                 </span>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="you@company.com"
//                   style={styles.input}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div style={styles.fieldGroup}>
//               <div style={styles.labelRow}>
//                 <label style={styles.label}>Password</label>
//                 <a href="/forgot" style={styles.forgotLink}>Forgot password?</a>
//               </div>
//               <div style={styles.inputWrapper}>
//                 <span style={styles.inputIcon}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
//                     <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//                     <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//                   </svg>
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   style={styles.input}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={styles.eyeBtn}
//                 >
//                   {showPassword ? (
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
//                       <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
//                       <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
//                       <line x1="1" y1="1" x2="23" y2="23" />
//                     </svg>
//                   ) : (
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
//                       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                       <circle cx="12" cy="12" r="3" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Remember Me */}
//             <label style={styles.checkRow}>
//               <input
//                 type="checkbox"
//                 name="remember"
//                 checked={formData.remember}
//                 onChange={handleChange}
//                 style={styles.checkbox}
//               />
//               <span style={styles.checkLabel}>Keep me signed in</span>
//             </label>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 ...styles.submitBtn,
//                 ...(loading ? styles.submitBtnDisabled : {}),
//               }}
//             >
//               {loading ? (
//                 <span style={styles.loadingRow}>
//                   <span style={styles.spinner} />
//                   Signing in...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           <p style={styles.signupText}>
//             Don't have an account?{" "}
//             <a href="/signup" style={styles.signupLink}>Create one free</a>
//           </p>
//         </div>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         input::placeholder { color: #94a3b8; }
//         input:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .form-card-anim {
//           animation: fadeUp 0.5s ease forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// const styles = {
//   page: {
//     display: "flex",
//     minHeight: "100vh",
//     fontFamily: "'DM Sans', sans-serif",
//     backgroundColor: "#0f172a",
//   },

//   // LEFT PANEL
//   leftPanel: {
//     position: "relative",
//     flex: "1",
//     background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0ea5e9 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//     padding: "60px",
//   },
//   gridOverlay: {
//     position: "absolute",
//     inset: 0,
//     backgroundImage: `
//       linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
//     `,
//     backgroundSize: "40px 40px",
//     pointerEvents: "none",
//   },
//   leftContent: {
//     position: "relative",
//     zIndex: 1,
//     maxWidth: "420px",
//   },
//   brand: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     marginBottom: "64px",
//   },
//   brandIcon: {
//     width: "48px",
//     height: "48px",
//     borderRadius: "14px",
//     background: "rgba(255,255,255,0.15)",
//     backdropFilter: "blur(10px)",
//     border: "1px solid rgba(255,255,255,0.2)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   brandName: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: "22px",
//     fontWeight: "700",
//     color: "white",
//     letterSpacing: "-0.3px",
//   },
//   heroText: {
//     marginBottom: "48px",
//   },
//   heroHeading: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: "52px",
//     fontWeight: "800",
//     color: "white",
//     lineHeight: "1.1",
//     letterSpacing: "-1.5px",
//     marginBottom: "16px",
//   },
//   heroSub: {
//     fontSize: "17px",
//     color: "rgba(255,255,255,0.7)",
//     lineHeight: "1.6",
//     fontWeight: "300",
//   },
//   statsRow: {
//     display: "flex",
//     gap: "32px",
//     paddingTop: "40px",
//     borderTop: "1px solid rgba(255,255,255,0.15)",
//   },
//   statItem: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "4px",
//   },
//   statNumber: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: "24px",
//     fontWeight: "700",
//     color: "white",
//   },
//   statLabel: {
//     fontSize: "13px",
//     color: "rgba(255,255,255,0.55)",
//     fontWeight: "400",
//   },

//   // RIGHT PANEL
//   rightPanel: {
//     width: "480px",
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "40px",
//     backgroundColor: "#0f172a",
//   },
//   formCard: {
//     width: "100%",
//     maxWidth: "400px",
//   },
//   formHeader: {
//     marginBottom: "36px",
//   },
//   formTitle: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: "30px",
//     fontWeight: "700",
//     color: "white",
//     letterSpacing: "-0.5px",
//     marginBottom: "6px",
//   },
//   formSub: {
//     fontSize: "15px",
//     color: "#64748b",
//     fontWeight: "400",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   fieldGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//   },
//   label: {
//     fontSize: "13px",
//     fontWeight: "500",
//     color: "#94a3b8",
//     letterSpacing: "0.3px",
//     textTransform: "uppercase",
//   },
//   labelRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   forgotLink: {
//     fontSize: "13px",
//     color: "#3b82f6",
//     textDecoration: "none",
//     fontWeight: "500",
//   },
//   roleGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "8px",
//   },
//   roleBtn: {
//     position: "relative",
//     padding: "12px 16px",
//     borderRadius: "10px",
//     border: "1px solid #1e293b",
//     background: "#1e293b",
//     color: "#94a3b8",
//     fontSize: "14px",
//     fontWeight: "500",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     fontFamily: "'DM Sans', sans-serif",
//     textAlign: "left",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   roleBtnActive: {
//     background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
//     border: "1px solid transparent",
//     color: "white",
//   },
//   roleBtnLabel: {},
//   roleCheck: {
//     width: "18px",
//     height: "18px",
//     borderRadius: "50%",
//     background: "rgba(255,255,255,0.2)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   inputWrapper: {
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//   },
//   inputIcon: {
//     position: "absolute",
//     left: "14px",
//     display: "flex",
//     alignItems: "center",
//     pointerEvents: "none",
//   },
//   input: {
//     width: "100%",
//     padding: "13px 44px",
//     background: "#1e293b",
//     border: "1px solid #334155",
//     borderRadius: "10px",
//     color: "white",
//     fontSize: "15px",
//     fontFamily: "'DM Sans', sans-serif",
//     transition: "border-color 0.2s, box-shadow 0.2s",
//   },
//   eyeBtn: {
//     position: "absolute",
//     right: "14px",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     padding: "0",
//   },
//   checkRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     cursor: "pointer",
//   },
//   checkbox: {
//     width: "16px",
//     height: "16px",
//     accentColor: "#3b82f6",
//     cursor: "pointer",
//   },
//   checkLabel: {
//     fontSize: "14px",
//     color: "#94a3b8",
//   },
//   submitBtn: {
//     width: "100%",
//     padding: "14px",
//     background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
//     border: "none",
//     borderRadius: "10px",
//     color: "white",
//     fontSize: "16px",
//     fontWeight: "600",
//     cursor: "pointer",
//     fontFamily: "'DM Sans', sans-serif",
//     letterSpacing: "0.2px",
//     transition: "opacity 0.2s, transform 0.1s",
//     marginTop: "4px",
//   },
//   submitBtnDisabled: {
//     opacity: "0.6",
//     cursor: "not-allowed",
//   },
//   loadingRow: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "10px",
//   },
//   spinner: {
//     display: "inline-block",
//     width: "16px",
//     height: "16px",
//     border: "2px solid rgba(255,255,255,0.3)",
//     borderTopColor: "white",
//     borderRadius: "50%",
//     animation: "spin 0.7s linear infinite",
//   },
//   signupText: {
//     marginTop: "24px",
//     textAlign: "center",
//     fontSize: "14px",
//     color: "#64748b",
//   },
//   signupLink: {
//     color: "#3b82f6",
//     textDecoration: "none",
//     fontWeight: "500",
//   },
// };

// export default Login;




