// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";

// const ROLES = [
//   { value: "developer", label: "Developer" },
//   { value: "tester", label: "Tester" },
//   { value: "project_manager", label: "Project Manager" },
//   { value: "admin", label: "Admin" },
// ];

// const ROLE_ROUTES = {
//   admin: "/admindashboard",
//   project_manager: "/managerdashboard",
//   developer: "/developerdashboard",
//   tester: "/testerdashboard",
// };

// const Glow = () => (
//   <div className="absolute inset-0 overflow-hidden">
//     <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//     <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//   </div>
// );

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: "developer",
//     remember: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // ✅ Auto redirect
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (token && role) {
//       navigate(ROLE_ROUTES[role] || "/");
//     }
//   }, [navigate]);

//   const handleChange = ({ target: { name, value, type, checked } }) =>
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       return toast.error("Please fill in all fields");
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post(
//         "http://localhost:3000/users/login",
//         {
//           email: formData.email,
//           password: formData.password,
//           role: formData.role,
//         }
//       );

//       if (res.status === 200) {
//         toast.success("Login Successful");

//         // 🔥 FIXED ROLE HANDLING
//         const role =
//           res.data.user?.role?.name || res.data.user?.role;

//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("role", role);
//         localStorage.setItem("user", JSON.stringify(res.data.user));

//         navigate(ROLE_ROUTES[role] || "/");

//         if (!ROLE_ROUTES[role]) {
//           toast.warning("Unknown role");
//         }
//       }
//     } catch (err) {
//       const status = err.response?.status;

//       if (status === 401) toast.error("Invalid email or password");
//       else if (status === 404) toast.error("User not found");
//       else toast.error("Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
//       <Glow />

//       <div className="relative w-full max-w-md">
//         <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">

//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="flex items-center justify-center gap-2 mb-3">
//               <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500" />
//               <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
//             </div>
//             <p className="text-slate-300 text-sm">
//               Sign in to manage your projects
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* Role */}
//             <div>
//               <label className="block text-sm font-medium text-white mb-3">
//                 Select Your Role
//               </label>

//               <div className="grid grid-cols-2 gap-3">
//                 {ROLES.map(({ value, label }) => (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() =>
//                       setFormData((p) => ({ ...p, role: value }))
//                     }
//                     className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
//                       formData.role === value
//                         ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
//                         : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
//                     }`}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Email */}
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="your.email@company.com"
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
//             />

//             {/* Password */}
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white pr-12"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>

//             {/* Remember + Forgot */}
//             <div className="flex justify-between items-center">
//               <label className="flex items-center gap-2 text-slate-300">
//                 <input type="checkbox" name="remember" />
//                 <span className="text-sm">Remember me</span>
//               </label>

//               {/* ✅ RESTORED */}
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-blue-400 hover:text-blue-300"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold"
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </button>

//             {/* ✅ RESTORED */}
//             <p className="text-center text-sm text-slate-300">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-blue-400">
//                 Sign Up
//               </Link>
//             </p>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import { successToast ,errorToast } from "../utils/toast";

const ROLES = [
  { value: "developer",       label: "Developer" },
  { value: "tester",          label: "Tester" },
  { value: "project_manager", label: "Project Manager" },
  { value: "admin",           label: "Admin" },
];

const ROLE_ROUTES = {
  admin:           "/admindashboard",
  project_manager: "/managerdashboard",
  developer:       "/developerdashboard",
  tester:          "/testerdashboard",
};

const EyeOpen = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const Glow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
    <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
  </div>
);

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      email:    "",
      password: "",
      role:     "developer",
      remember: false,
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const selectedRole                    = watch("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (token && role) navigate(ROLE_ROUTES[role] || "/");
  }, [navigate]);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/users/login", {
        email:    data.email,
        password: data.password,
        role:     data.role,
      });

      if (res.status === 200) {
        successToast("Login Successful")

        const role = res.data.user?.role?.name || res.data.user?.role;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role",  role);
        localStorage.setItem("user",  JSON.stringify(res.data.user));

        if (ROLE_ROUTES[role]) {
          navigate(ROLE_ROUTES[role]);
        } else {
          toast.warning("Unknown role");
          navigate("/");
        }
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401)      errorToast("Invalid email or password");
      else if (status === 404) errorToast("User not found");
      else                     errorToast(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <Glow />

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500" />
              <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
            </div>
            <p className="text-slate-300 text-sm">Sign in to manage your projects</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue("role", value)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      selectedRole === value
                        ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("role")} />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="your.email@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password with eye icon */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input type="checkbox" {...register("remember")} />
                <span className="text-sm">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Forgot password?
              </Link>
            </div>

            {/* Submit with spinner */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-semibold transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

            <p className="text-center text-sm text-slate-300">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">Sign Up</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;