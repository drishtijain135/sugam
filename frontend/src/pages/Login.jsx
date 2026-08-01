import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Login Successful");

      const role = response.data.user.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "AUTHORITY") {
        navigate("/authority");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-emerald-400">
            SUGAM
          </h1>

          <p className="mt-2 text-slate-400">
            Smart Unified Gateway for Accessible Mobility
          </p>

          <p className="mt-6 text-white text-2xl font-semibold">
            Welcome Back
          </p>

          <p className="text-slate-500 mt-2">
            Login to continue your journey
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </div>

          <button
            className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="mt-8 space-y-3">

          <Link
            to="/register"
            className="block w-full rounded-lg border border-slate-700 py-3 text-center text-white hover:bg-slate-800 transition"
          >
            Register as User
          </Link>

          <Link
            to="/register-authority"
            className="block w-full rounded-lg border border-slate-700 py-3 text-center text-white hover:bg-slate-800 transition"
          >
            Register as Transport Authority
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;