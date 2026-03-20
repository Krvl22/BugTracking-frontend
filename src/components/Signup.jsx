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
import { useForm } from "react-hook-form";
import API from "../api/axios";

const ROLES = [
  { value: "developer",       label: "Developer" },
  { value: "tester",          label: "Tester" },
  { value: "project_manager", label: "Project Manager" },
];

const getStrength = (pwd) => {
  if (!pwd) return "";
  if (pwd.length < 6) return "weak";
  if (pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/) && pwd.length >= 10) return "strong";
  return "medium";
};

const STRENGTH_STYLES = {
  weak:   { color: "bg-red-500",    width: "w-1/3", label: "Weak",   text: "text-red-400" },
  medium: { color: "bg-yellow-500", width: "w-2/3", label: "Medium", text: "text-yellow-400" },
  strong: { color: "bg-green-500",  width: "w-full", label: "Strong", text: "text-green-400" },
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

const PasswordInput = ({ label, name, register, rules, error, show, onToggle, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
        {...register(name, rules)}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
      >
        {show ? <EyeOff /> : <EyeOpen />}
      </button>
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
  </div>
);

const Glow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
    <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
  </div>
);

const Signup = () => {
  const navigate = useNavigate();

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

  const [show, setShow]       = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const password     = watch("password");
  const selectedRole = watch("role");
  const strength     = getStrength(password);
  const ss           = STRENGTH_STYLES[strength] || {};

  const submitHandler = async (data) => {
    if (strength === "weak") return toast.warning("Password is too weak");
    if (!data.terms)         return toast.error("Accept Terms & Conditions");

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

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500" />
              <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
            </div>
            <p className="text-slate-300 text-sm">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
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

            {/* Role — 3 options, no Admin */}
            <div className="grid grid-cols-3 gap-3">
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
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${ss.color} ${ss.width}`} />
                </div>
                <p className={`text-xs ${ss.text}`}>{ss.label} password</p>
              </div>
            )}

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              register={register}
              rules={{
                required: "Please confirm your password",
                validate: (val) => val === password || "Passwords do not match"
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
                {...register("terms")}
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
              className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all disabled:opacity-60"
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