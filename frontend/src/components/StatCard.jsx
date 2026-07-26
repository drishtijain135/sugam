import { FiActivity } from "react-icons/fi";

function StatCard({ label, value, detail, icon: Icon = FiActivity }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-surface-raised px-4 py-3 shadow-soft">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <div className="mt-0.5 flex items-baseline gap-2">
          <p className="text-xl font-semibold text-white">
            {value}
          </p>

          <p className="truncate text-xs text-slate-500">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
