import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "developer",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "password") checkPasswordStrength(value);
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) setPasswordStrength("");
    else if (password.length < 6) setPasswordStrength("weak");
    else if (password.length < 10) setPasswordStrength("medium");
    else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/))
      setPasswordStrength("strong");
    else setPasswordStrength("medium");
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      default: return "bg-slate-600";
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case "weak": return "w-1/3";
      case "medium": return "w-2/3";
      case "strong": return "w-full";
      default: return "w-0";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordStrength === "weak") {
      toast.warning("Password is too weak. Use at least 6 characters.");
      return;
    }

    if (!formData.terms) {
      toast.error("Please accept the Terms and Conditions");
      return;
    }

    setLoading(true);

    try {
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const res = await axios.post("http://localhost:3000/user/register", {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role, // ✅ now matches UserModel enum exactly
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Account created successfully! Please login.");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 409) {
        toast.error("Email already exists. Please login.");
      } else if (err.response?.status === 400) {
        toast.error("Invalid data. Please check your inputs.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">

      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 my-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500"></div>
              <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
            </div>
            <p className="text-slate-300 text-sm">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="your.email@company.com"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "developer", label: "Developer" },
                  { value: "tester", label: "Tester" },
                  { value: "manager", label: "Project Manager" }, // ✅ matches UserModel enum
                  { value: "admin", label: "Admin" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleRoleSelect(r.value)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      formData.role === r.value
                        ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                  placeholder="Create a strong password"
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

              {/* Password Strength Bar */}
              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${getStrengthColor()} ${getStrengthWidth()} transition-all duration-300`}></div>
                  </div>
                  <span className={`text-xs capitalize min-w-12 ${
                    passwordStrength === "weak" ? "text-red-400" :
                    passwordStrength === "medium" ? "text-yellow-400" : "text-green-400"
                  }`}>
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>

              {/* Password match indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 ${
                  formData.password === formData.confirmPassword ? "text-green-400" : "text-red-400"
                }`}>
                  {formData.password === formData.confirmPassword ? "✅ Passwords match" : "❌ Passwords don't match"}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-300">
              Already have an account?{" "}
              <a href="/" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Sign In
              </a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";

// export const Signup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "developer",
//     department: "",
//     terms: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(1); // 2-step form

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     if (name === "password") checkPasswordStrength(value);
//   };

//   const checkPasswordStrength = (password) => {
//     if (password.length === 0) setPasswordStrength("");
//     else if (password.length < 6) setPasswordStrength("weak");
//     else if (password.length < 10) setPasswordStrength("medium");
//     else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/))
//       setPasswordStrength("strong");
//     else setPasswordStrength("medium");
//   };

//   const strengthConfig = {
//     weak: { color: "#ef4444", width: "33%", label: "Weak" },
//     medium: { color: "#f59e0b", width: "66%", label: "Medium" },
//     strong: { color: "#22c55e", width: "100%", label: "Strong" },
//   };

//   const handleNextStep = () => {
//     if (!formData.fullName || !formData.email) {
//       toast.error("Please fill in your name and email");
//       return;
//     }
//     setStep(2);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.password || !formData.confirmPassword) {
//       toast.error("Please fill in all fields");
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     if (passwordStrength === "weak") {
//       toast.warning("Password is too weak");
//       return;
//     }
//     if (!formData.terms) {
//       toast.error("Please accept the Terms and Conditions");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post("https://node5.onrender.com/user/register", {
//         name: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//         department: formData.department,
//       });

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Account created! Redirecting to login...");
//         setTimeout(() => navigate("/"), 2000);
//       }
//     } catch (err) {
//       console.log(err);
//       if (err.response?.status === 409) toast.error("Email already registered");
//       else toast.error("Signup failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const roles = ["developer", "tester", "manager", "admin"];

//   return (
//     <div style={styles.page}>
//       {/* Background */}
//       <div style={styles.bgGlow1} />
//       <div style={styles.bgGlow2} />

//       {/* Top Bar */}
//       <div style={styles.topBar}>
//         <div style={styles.brand}>
//           <div style={styles.brandDot} />
//           <span style={styles.brandName}>BugTracker</span>
//         </div>
//         <a href="/" style={styles.signinLink}>
//           Already have an account? <span style={styles.signinLinkBold}>Sign in</span>
//         </a>
//       </div>

//       {/* Center Content */}
//       <div style={styles.center}>
//         {/* Left: Info Side */}
//         <div style={styles.infoSide}>
//           <div style={styles.stepIndicator}>
//             <div style={{ ...styles.stepDot, ...(step >= 1 ? styles.stepDotActive : {}) }} />
//             <div style={{ ...styles.stepLine, ...(step >= 2 ? styles.stepLineActive : {}) }} />
//             <div style={{ ...styles.stepDot, ...(step >= 2 ? styles.stepDotActive : {}) }} />
//           </div>
//           <h1 style={styles.heading}>
//             {step === 1 ? "Create your\naccount." : "Set up your\nworkspace."}
//           </h1>
//           <p style={styles.subheading}>
//             {step === 1
//               ? "Start tracking bugs and shipping faster with your team."
//               : "Choose your role and secure your account."}
//           </p>

//           <div style={styles.featureList}>
//             {[
//               "Real-time bug reporting & tracking",
//               "Role-based access for your whole team",
//               "Integrated project dashboards",
//             ].map((f) => (
//               <div key={f} style={styles.featureItem}>
//                 <div style={styles.featureDot} />
//                 <span style={styles.featureText}>{f}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right: Form Side */}
//         <div style={styles.formSide}>
//           <div style={styles.card}>
//             {/* Step Header */}
//             <div style={styles.cardHeader}>
//               <div style={styles.stepBadge}>Step {step} of 2</div>
//               <h2 style={styles.cardTitle}>
//                 {step === 1 ? "Personal Info" : "Account Setup"}
//               </h2>
//             </div>

//             {step === 1 ? (
//               <div style={styles.form}>
//                 {/* Full Name */}
//                 <div style={styles.fieldGroup}>
//                   <label style={styles.label}>Full Name</label>
//                   <input
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     placeholder="John Doe"
//                     style={styles.input}
//                     required
//                   />
//                 </div>

//                 {/* Email */}
//                 <div style={styles.fieldGroup}>
//                   <label style={styles.label}>Email Address</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="you@company.com"
//                     style={styles.input}
//                     required
//                   />
//                 </div>

//                 {/* Department */}
//                 <div style={styles.fieldGroup}>
//                   <label style={styles.label}>Department <span style={styles.optional}>(optional)</span></label>
//                   <input
//                     type="text"
//                     name="department"
//                     value={formData.department}
//                     onChange={handleChange}
//                     placeholder="e.g. Engineering, QA"
//                     style={styles.input}
//                   />
//                 </div>

//                 <button type="button" onClick={handleNextStep} style={styles.primaryBtn}>
//                   Continue
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ marginLeft: "8px" }}>
//                     <line x1="5" y1="12" x2="19" y2="12" />
//                     <polyline points="12 5 19 12 12 19" />
//                   </svg>
//                 </button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} style={styles.form}>
//                 {/* Role */}
//                 <div style={styles.fieldGroup}>
//                   <label style={styles.label}>Role</label>
//                   <div style={styles.roleRow}>
//                     {roles.map((r) => (
//                       <button
//                         key={r}
//                         type="button"
//                         onClick={() => setFormData((p) => ({ ...p, role: r }))}
//                         style={{
//                           ...styles.roleChip,
//                           ...(formData.role === r ? styles.roleChipActive : {}),
//                         }}
//                       >
//                         {r.charAt(0).toUpperCase() + r.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div style={styles.fieldGroup}>
//                   <label style={styles.label}>Password</label>
//                   <div style={styles.inputWrapper}>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="Create a strong password"
//                       style={{ ...styles.input, paddingRight: "44px" }}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       style={styles.eyeBtn}
//                     >
//                       {showPassword ? (
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
//                           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
//                           <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
//                           <line x1="1" y1="1" x2="23" y2="23" />
//                         </svg>
//                       ) : (
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
//                           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                           <circle cx="12" cy="12" r="3" />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                   {/* Strength Bar */}
//                   {passwordStrength && (
//                     <div style={styles.strengthRow}>
//                       <div style={styles.strengthTrack}>
//                         <div
//                           style={{
//                             ...styles.strengthFill,
//                             width: strengthConfig[passwordStrength]?.width,
//                             background: strengthConfig[passwordStrength]?.color,
//                           }}
//                         />
//                       </div>
//                       <span style={{ ...styles.strengthLabel, color: strengthConfig[passwordStrength]?.color }}>
//                         {strengthConfig[passwordStrength]?.label}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div style={styles.fieldGroup}>
//                   <label style={styles.label}>Confirm Password</label>
//                   <div style={styles.inputWrapper}>
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       placeholder="Re-enter your password"
//                       style={{ ...styles.input, paddingRight: "44px" }}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       style={styles.eyeBtn}
//                     >
//                       {showConfirmPassword ? (
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
//                           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
//                           <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
//                           <line x1="1" y1="1" x2="23" y2="23" />
//                         </svg>
//                       ) : (
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
//                           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                           <circle cx="12" cy="12" r="3" />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Terms */}
//                 <label style={styles.termsRow}>
//                   <input
//                     type="checkbox"
//                     name="terms"
//                     checked={formData.terms}
//                     onChange={handleChange}
//                     style={styles.checkbox}
//                   />
//                   <span style={styles.termsText}>
//                     I agree to the{" "}
//                     <a href="/terms" style={styles.termsLink}>Terms of Service</a>
//                     {" "}and{" "}
//                     <a href="/privacy" style={styles.termsLink}>Privacy Policy</a>
//                   </span>
//                 </label>

//                 <div style={styles.btnRow}>
//                   <button
//                     type="button"
//                     onClick={() => setStep(1)}
//                     style={styles.backBtn}
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     style={{ ...styles.primaryBtn, flex: 1, ...(loading ? styles.btnDisabled : {}) }}
//                   >
//                     {loading ? "Creating account..." : "Create Account"}
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         input::placeholder { color: #475569; }
//         input:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
//       `}</style>
//     </div>
//   );
// };

// const styles = {
//   page: {
//     minHeight: "100vh",
//     backgroundColor: "#080f1e",
//     fontFamily: "'DM Sans', sans-serif",
//     display: "flex",
//     flexDirection: "column",
//     position: "relative",
//     overflow: "hidden",
//   },
//   bgGlow1: {
//     position: "absolute",
//     top: "-200px",
//     right: "-100px",
//     width: "600px",
//     height: "600px",
//     borderRadius: "50%",
//     background: "radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)",
//     pointerEvents: "none",
//   },
//   bgGlow2: {
//     position: "absolute",
//     bottom: "-200px",
//     left: "-100px",
//     width: "500px",
//     height: "500px",
//     borderRadius: "50%",
//     background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)",
//     pointerEvents: "none",
//   },

//   // TOP BAR
//   topBar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "24px 48px",
//     borderBottom: "1px solid #0f1f3d",
//     position: "relative",
//     zIndex: 10,
//   },
//   brand: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//   },
//   brandDot: {
//     width: "10px",
//     height: "10px",
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
//   },
//   brandName: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: "18px",
//     fontWeight: "700",
//     color: "white",
//     letterSpacing: "-0.3px",
//   },
//   signinLink: {
//     fontSize: "14px",
//     color: "#64748b",
//     textDecoration: "none",
//   },
//   signinLinkBold: {
//     color: "#3b82f6",
//     fontWeight: "500",
//   },

//   // CENTER
//   center: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "80px",
//     padding: "60px 80px",
//     position: "relative",
//     zIndex: 10,
//   },

//   // INFO SIDE
//   infoSide: {
//     flex: 1,
//     maxWidth: "400px",
//   },
//   stepIndicator: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0",
//     marginBottom: "32px",
//   },
//   stepDot: {
//     width: "10px",
//     height: "10px",
//     borderRadius: "50%",
//     background: "#1e293b",
//     border: "2px solid #334155",
//     transition: "all 0.3s",
//   },
//   stepDotActive: {
//     background: "#3b82f6",
//     border: "2px solid #3b82f6",
//   },
//   stepLine: {
//     width: "40px",
//     height: "2px",
//     background: "#1e293b",
//     transition: "all 0.3s",
//   },
//   stepLineActive: {
//     background: "#3b82f6",
//   },
//   heading: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: "48px",
//     fontWeight: "800",
//     color: "white",
//     letterSpacing: "-1.5px",
//     lineHeight: "1.1",
//     whiteSpace: "pre-line",
//     marginBottom: "16px",
//   },
//   subheading: {
//     fontSize: "16px",
//     color: "#64748b",
//     lineHeight: "1.6",
//     marginBottom: "40px",
//     fontWeight: "300",
//   },
//   featureList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "16px",
//   },
//   featureItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//   },
//   featureDot: {
//     width: "6px",
//     height: "6px",
//     borderRadius: "50%",
//     background: "#3b82f6",
//     flexShrink: 0,
//   },
//   featureText: {
//     fontSize: "15px",
//     color: "#94a3b8",
//     fontWeight: "400",
//   },

//   // FORM SIDE
//   formSide: {
//     width: "440px",
//     flexShrink: 0,
//   },
//   card: {
//     background: "#0f1f3d",
//     border: "1px solid #1e3a5f",
//     borderRadius: "20px",
//     padding: "36px",
//   },
//   cardHeader: {
//     marginBottom: "28px",
//   },
//   stepBadge: {
//     display: "inline-block",
//     padding: "4px 12px",
//     background: "rgba(59,130,246,0.1)",
//     border: "1px solid rgba(59,130,246,0.2)",
//     borderRadius: "20px",
//     fontSize: "12px",
//     color: "#60a5fa",
//     fontWeight: "500",
//     marginBottom: "10px",
//     letterSpacing: "0.3px",
//   },
//   cardTitle: {
//     fontFamily: "'Syne', sans-serif",
//     fontSize: "22px",
//     fontWeight: "700",
//     color: "white",
//     letterSpacing: "-0.3px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "18px",
//   },
//   fieldGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "7px",
//   },
//   label: {
//     fontSize: "12px",
//     fontWeight: "500",
//     color: "#64748b",
//     letterSpacing: "0.5px",
//     textTransform: "uppercase",
//   },
//   optional: {
//     fontWeight: "400",
//     textTransform: "none",
//     letterSpacing: "0",
//     color: "#475569",
//   },
//   input: {
//     width: "100%",
//     padding: "12px 14px",
//     background: "#081428",
//     border: "1px solid #1e3a5f",
//     borderRadius: "10px",
//     color: "white",
//     fontSize: "15px",
//     fontFamily: "'DM Sans', sans-serif",
//     transition: "border-color 0.2s, box-shadow 0.2s",
//   },
//   inputWrapper: {
//     position: "relative",
//   },
//   eyeBtn: {
//     position: "absolute",
//     right: "12px",
//     top: "50%",
//     transform: "translateY(-50%)",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     padding: "0",
//   },
//   roleRow: {
//     display: "flex",
//     gap: "8px",
//     flexWrap: "wrap",
//   },
//   roleChip: {
//     padding: "8px 16px",
//     borderRadius: "8px",
//     border: "1px solid #1e3a5f",
//     background: "#081428",
//     color: "#64748b",
//     fontSize: "13px",
//     fontWeight: "500",
//     cursor: "pointer",
//     fontFamily: "'DM Sans', sans-serif",
//     transition: "all 0.2s",
//   },
//   roleChipActive: {
//     background: "rgba(59,130,246,0.15)",
//     border: "1px solid #3b82f6",
//     color: "#60a5fa",
//   },
//   strengthRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     marginTop: "6px",
//   },
//   strengthTrack: {
//     flex: 1,
//     height: "4px",
//     background: "#1e293b",
//     borderRadius: "4px",
//     overflow: "hidden",
//   },
//   strengthFill: {
//     height: "100%",
//     borderRadius: "4px",
//     transition: "width 0.3s, background 0.3s",
//   },
//   strengthLabel: {
//     fontSize: "12px",
//     fontWeight: "500",
//     minWidth: "44px",
//     textAlign: "right",
//   },
//   termsRow: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "10px",
//     cursor: "pointer",
//   },
//   checkbox: {
//     width: "15px",
//     height: "15px",
//     accentColor: "#3b82f6",
//     cursor: "pointer",
//     flexShrink: 0,
//     marginTop: "2px",
//   },
//   termsText: {
//     fontSize: "13px",
//     color: "#64748b",
//     lineHeight: "1.5",
//   },
//   termsLink: {
//     color: "#3b82f6",
//     textDecoration: "none",
//   },
//   btnRow: {
//     display: "flex",
//     gap: "10px",
//   },
//   primaryBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "13px 20px",
//     background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
//     border: "none",
//     borderRadius: "10px",
//     color: "white",
//     fontSize: "15px",
//     fontWeight: "600",
//     cursor: "pointer",
//     fontFamily: "'DM Sans', sans-serif",
//     transition: "opacity 0.2s",
//     width: "100%",
//   },
//   backBtn: {
//     padding: "13px 20px",
//     background: "#0f1f3d",
//     border: "1px solid #1e3a5f",
//     borderRadius: "10px",
//     color: "#94a3b8",
//     fontSize: "15px",
//     fontWeight: "500",
//     cursor: "pointer",
//     fontFamily: "'DM Sans', sans-serif",
//   },
//   btnDisabled: {
//     opacity: "0.6",
//     cursor: "not-allowed",
//   },
// };

// export default Signup;
