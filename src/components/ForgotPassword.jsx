// import axios from "axios";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

// const ForgotPassword = () => {

//   const {
//     handleSubmit,
//     formState: { errors: _errors }, // ✅ no warning
//   } = useForm();

//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ mentor style
//   const submitHandler = async () => {

//     if (!email) {
//       toast.error("Please enter your email");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post(
//         "http://localhost:3000/users/forgot-password",
//         { email }
//       );

//       if (res.status === 200) {
//         toast.success("Password reset link sent to your email");
//         setEmail("");
//       }

//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">

//       <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

//         <h2 className="text-2xl text-white font-bold mb-6 text-center">
//           Forgot Password
//         </h2>

//         {/* ✅ useForm handleSubmit */}
//         <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

//           <input
//             type="email"
//             required
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold"
//           >
//             {loading ? "Sending..." : "Send Reset Link"}
//           </button>

//         </form>

//         <p className="text-center text-sm text-slate-300 mt-4">
//           <Link to="/" className="text-blue-400">Back to Login</Link>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import axios from "axios";
import React, { useState } from "react";
import { successToast, errorToast } from "../utils/toast";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const Glow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
    <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
  </div>
);

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  const [loading, setLoading]   = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/users/forgot-password", {
        email: data.email,
      });

      if (res.status === 200) {
        setEmailSent(true);
        successToast("Password reset link sent! Check your inbox.");
        reset();
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) errorToast("No account found with this email");
      else                errorToast(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <Glow />

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500" />
              <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
            </div>
            <p className="text-slate-300 text-sm">Reset your password</p>
          </div>

          {/* ✅ Success state — shown after email is sent */}
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Check your inbox</p>
              <p className="text-slate-400 text-sm">
                We've sent a password reset link to your email. The link expires in 15 minutes.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="text-blue-400 hover:text-blue-300 text-sm transition"
              >
                Didn't get it? Send again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

              {/* ✅ Email — with label */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@company.com"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.email ? "border-red-500/60" : "border-white/10"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                  })}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.email.message}
                  </p>
                )}
                <p className="text-slate-500 text-xs mt-2">
                  We'll send a secure reset link to this address.
                </p>
              </div>

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
                    Sending...
                  </span>
                ) : "Send Reset Link"}
              </button>

            </form>
          )}

          {/* Back to login */}
          <p className="text-center text-sm text-slate-400 mt-6">
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;