import { FiBell } from "react-icons/fi";

function Header() {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 bg-surface-panel px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
          Smart mobility dashboard
        </p>

        <h1 className="mt-0.5 text-xl font-semibold text-white">
          Move smarter across the city
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-surface-raised text-slate-400 transition hover:border-emerald-400/50 hover:text-emerald-400"
        >
          <FiBell size={16} />
        </button>

        <div className="flex items-center gap-2.5 rounded-md border border-slate-800 bg-surface-raised px-2.5 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400 text-sm font-semibold text-slate-950">
            D
          </div>

          <div className="leading-tight">
            <p className="text-sm font-medium text-white">
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
