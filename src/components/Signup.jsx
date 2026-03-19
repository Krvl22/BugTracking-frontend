// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import API from "../api/axios"; // ✅ use same axios instance

// const ROLES = [
//   { value: "developer", label: "Developer" },
//   { value: "tester", label: "Tester" },
//   { value: "project_manager", label: "Project Manager" },
//   { value: "admin", label: "Admin" },
// ];

// const getStrength = (pwd) => {
//   if (!pwd) return "";
//   if (pwd.length < 6) return "weak";
//   if (
//     pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/) &&
//     pwd.length >= 10
//   )
//     return "strong";
//   return "medium";
// };

// const STRENGTH_STYLES = {
//   weak: { color: "bg-red-500", width: "w-1/3", text: "text-red-400" },
//   medium: { color: "bg-yellow-500", width: "w-2/3", text: "text-yellow-400" },
//   strong: { color: "bg-green-500", width: "w-full", text: "text-green-400" },
// };

// const Glow = () => (
//   <div className="absolute inset-0 overflow-hidden pointer-events-none">
//     <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
//     <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
//   </div>
// );

// const PasswordInput = ({
//   label,
//   name,
//   value,
//   onChange,
//   show,
//   onToggle,
//   placeholder,
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-white mb-2">
//       {label}
//     </label>

//     <div className="relative">
//       <input
//         type={show ? "text" : "password"}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required
//         className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
//       />

//       {/* ✅ CLEAN BUTTON (NO EMOJIS) */}
//       <button
//         type="button"
//         onClick={onToggle}
//         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition text-sm"
//       >
//         {show ? "Hide" : "Show"}
//       </button>
//     </div>
//   </div>
// );

// const Signup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "developer",
//     terms: false,
//   });

//   const [show, setShow] = useState({
//     password: false,
//     confirm: false,
//   });

//   const [loading, setLoading] = useState(false);

//   const strength = getStrength(formData.password);
//   const ss = STRENGTH_STYLES[strength] || {};

//   const handleChange = ({ target: { name, value, type, checked } }) =>
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.fullName || !formData.email || !formData.password)
//       return toast.error("Please fill in all required fields");

//     if (formData.password !== formData.confirmPassword)
//       return toast.error("Passwords do not match!");

//     if (strength === "weak")
//       return toast.warning("Password is too weak");

//     if (!formData.terms)
//       return toast.error("Accept Terms & Conditions");

//     setLoading(true);

//     try {
//       const [firstName, ...rest] = formData.fullName.trim().split(" ");

//       const res = await API.post("/users/register", {
//         firstName,
//         lastName: rest.join(" ") || "",
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//       });
      
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Account created successfully!");
//         setTimeout(() => navigate("/"), 1500);
//       }
//     } catch (err) {
//       const status = err.response?.status;

//       if (status === 409) toast.error("Email already exists");
//       else toast.error("Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
//       <Glow />

//       <div className="relative w-full max-w-lg">
//         <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 my-8">

//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="flex items-center justify-center gap-2 mb-3">
//               <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500" />
//               <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
//             </div>
//             <p className="text-slate-300 text-sm">
//               Create your account to get started
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* Full Name */}
//             <input
//               type="text"
//               name="fullName"
//               placeholder="John Doe"
//               value={formData.fullName}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
//             />

//             {/* Email */}
//             <input
//               type="email"
//               name="email"
//               placeholder="your.email@company.com"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
//             />

//             {/* Role */}
//             <div className="grid grid-cols-2 gap-3">
//               {ROLES.map(({ value, label }) => (
//                 <button
//                   key={value}
//                   type="button"
//                   onClick={() =>
//                     setFormData((p) => ({ ...p, role: value }))
//                   }
//                   className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
//                     formData.role === value
//                       ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
//                       : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
//                   }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>

//             {/* Password */}
//             <PasswordInput
//               label="Password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               show={show.password}
//               onToggle={() =>
//                 setShow((p) => ({ ...p, password: !p.password }))
//               }
//               placeholder="Create password"
//             />

//             {/* Strength Bar */}
//             {strength && (
//               <div className="flex gap-2">
//                 <div className={`h-1 ${ss.color} ${ss.width}`} />
//               </div>
//             )}

//             {/* Confirm */}
//             <PasswordInput
//               label="Confirm Password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               show={show.confirm}
//               onToggle={() =>
//                 setShow((p) => ({ ...p, confirm: !p.confirm }))
//               }
//               placeholder="Confirm password"
//             />

//             <div className="flex items-start space-x-3">
//               <input
//                 type="checkbox"
//                 name="terms"
//                 id="terms"
//                 checked={formData.terms}
//                 onChange={handleChange}
//                 className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500 cursor-pointer"
//               />

//               <label
//                 htmlFor="terms"
//                 className="text-sm text-slate-300 cursor-pointer leading-relaxed"
//               >
//                 I agree to the{" "}
//                 <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
//                   Terms of Service
//                 </a>{" "}
//                 and{" "}
//                 <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
//                   Privacy Policy
//                 </a>
//               </label>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-blue-500 text-white rounded-xl"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="white"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="white"
//                       d="M4 12a8 8 0 018-8v8z"
//                     />
//                   </svg>
//                   Creating Account...
//                 </span>
//               ) : (
//                 "Create Account"
//               )}
// </button>
                          
//             <p className="text-center text-sm text-slate-300">
//               Already have an account?{" "}
//               <Link
//                 to="/"
//                 className="text-blue-400 hover:text-blue-300 font-medium transition"
//               >
//                 Sign In
//               </Link>
//             </p>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;





import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form"; // ✅ added
import API from "../api/axios";

const ROLES = [
  { value: "developer",       label: "Developer" },
  { value: "tester",          label: "Tester" },
  { value: "project_manager", label: "Project Manager" },
  { value: "admin",           label: "Admin" },
];

const getStrength = (pwd) => {
  if (!pwd) return "";
  if (pwd.length < 6) return "weak";
  if (pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/) && pwd.length >= 10)
    return "strong";
  return "medium";
};

const STRENGTH_STYLES = {
  weak:   { color: "bg-red-500",    width: "w-1/3", text: "text-red-400" },
  medium: { color: "bg-yellow-500", width: "w-2/3", text: "text-yellow-400" },
  strong: { color: "bg-green-500",  width: "w-full", text: "text-green-400" },
};

const Glow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
    <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
  </div>
);

// ✅ PasswordInput now uses register instead of value/onChange
const PasswordInput = ({ label, name, register, rules, error, show, onToggle, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
        {...register(name, rules)} // ✅ hook-form register
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition text-sm"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
  </div>
);

const Signup = () => {
  const navigate = useNavigate();

  // ✅ replaces all your useState form fields
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName:        "",
      email:           "",
      password:        "",
      confirmPassword: "",
      role:            "developer",
      terms:           false,
    }
  });

  // these 2 stay as useState — they are UI state, not form data
  const [show, setShow]       = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const password     = watch("password");     // ✅ watch for strength bar + confirm match
  const selectedRole = watch("role");         // ✅ watch for role button highlight
  const strength     = getStrength(password);
  const ss           = STRENGTH_STYLES[strength] || {};

  // ✅ mentor's pattern — clean submitHandler, no e.preventDefault needed
  const submitHandler = async (data) => {
    // Extra validations hook-form can't do on its own
    if (strength === "weak")
      return toast.warning("Password is too weak");

    if (!data.terms)
      return toast.error("Accept Terms & Conditions");

    setLoading(true);
    try {
      const [firstName, ...rest] = data.fullName.trim().split(" ");

      const res = await API.post("/users/register", {
        firstName,
        lastName: rest.join(" ") || "",
        email:    data.email,
        password: data.password,
        role:     data.role,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) toast.error("Email already exists");
      else                toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <Glow />

      <div className="relative w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 my-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500" />
              <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
            </div>
            <p className="text-slate-300 text-sm">Create your account to get started</p>
          </div>

          {/* ✅ handleSubmit(submitHandler) — mentor's pattern */}
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="your.email@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Role — custom UI, use setValue like Login */}
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("role", value)} // ✅ setValue
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

            {/* Password */}
            <PasswordInput
              label="Password"
              name="password"
              register={register}
              rules={{ required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } }}
              error={errors.password}
              show={show.password}
              onToggle={() => setShow(p => ({ ...p, password: !p.password }))}
              placeholder="Create password"
            />

            {/* Strength Bar */}
            {strength && (
              <div className="flex gap-2">
                <div className={`h-1 rounded-full ${ss.color} ${ss.width}`} />
              </div>
            )}

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              register={register}
              rules={{
                required: "Please confirm your password",
                validate: (val) => val === password || "Passwords do not match" // ✅ hook-form validate
              }}
              error={errors.confirmPassword}
              show={show.confirm}
              onToggle={() => setShow(p => ({ ...p, confirm: !p.confirm }))}
              placeholder="Confirm password"
            />

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500 cursor-pointer"
                {...register("terms")} // ✅ register checkbox
              />
              <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-300">
              Already have an account?{" "}
              <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium transition">Sign In</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;