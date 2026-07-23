function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-emerald-400">
        {detail}
      </p>
    </div>
  );
}

export default StatCard;