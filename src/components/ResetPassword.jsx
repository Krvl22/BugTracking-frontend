import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors: _errors }, // ✅ no warning
  } = useForm();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ mentor style
  const submitHandler = async () => {

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:3000/users/reset-password/${token}`,
        { password }
      );

      if (res.status === 200) {
        toast.success("Password reset successful");

        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid or expired token"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

          <input
            type="password"
            required
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
          />

          <input
            type="password"
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default ResetPassword;