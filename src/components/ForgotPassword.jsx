import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ForgotPassword = () => {

  const {
    handleSubmit,
    formState: { errors: _errors }, // ✅ no warning
  } = useForm();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ mentor style
  const submitHandler = async () => {

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/users/forgot-password",
        { email }
      );

      if (res.status === 200) {
        toast.success("Password reset link sent to your email");
        setEmail("");
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Forgot Password
        </h2>

        {/* ✅ useForm handleSubmit */}
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <p className="text-center text-sm text-slate-300 mt-4">
          <Link to="/" className="text-blue-400">Back to Login</Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;