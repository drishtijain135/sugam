function Header() {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 bg-slate-950 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-emerald-400">
          Smart mobility dashboard
        </p>

        <h1 className="text-2xl font-bold text-white">
          Move smarter across the city
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-400"
        >
          Notifications
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
            D
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Drishti
            </p>

            <p className="text-xs text-slate-500">
              Traveller
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;