function BusCardSkeleton() {
  return (
    <div className="min-w-[260px] rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="animate-pulse">
        <div className="mb-4 h-4 w-24 rounded bg-slate-800" />

        <div className="mb-3 h-6 w-40 rounded bg-slate-800" />

        <div className="mb-2 h-3 w-full rounded bg-slate-800" />
        <div className="mb-4 h-3 w-2/3 rounded bg-slate-800" />

        <div className="flex gap-3">
          <div className="h-8 w-20 rounded-full bg-slate-800" />
          <div className="h-8 w-24 rounded-full bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export default BusCardSkeleton;