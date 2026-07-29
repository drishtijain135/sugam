import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-5">

      <h1 className="text-5xl font-bold">
        SUGAM
      </h1>

      <p className="text-slate-400">
        Smart Unified Gateway for Accessible Mobility
      </p>

      <div className="flex gap-4">

        <Link
          to="/login"
          className="bg-emerald-500 px-5 py-3 rounded-lg"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="border border-white px-5 py-3 rounded-lg"
        >
          Register
        </Link>

      </div>

    </div>
  );
}

export default LandingPage;