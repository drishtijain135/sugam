function BusCardSkeleton() {
  return (
    <div className="min-w-[240px] shrink-0 rounded-lg border border-slate-800 bg-surface-raised p-3.5">
      <div className="animate-pulse">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-md bg-slate-800" />

            <div>
              <div className="h-3.5 w-24 rounded bg-slate-800" />
              <div className="mt-1.5 h-2.5 w-16 rounded bg-slate-800" />
            </div>
          </div>

          <div className="h-5 w-12 rounded-full bg-slate-800" />
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2.5">
          <div className="h-2.5 w-24 rounded bg-slate-800" />
          <div className="h-3.5 w-10 rounded bg-slate-800" />
        </div>

        <div className="mt-2 h-2.5 w-28 rounded bg-slate-800" />
      </div>
    </div>
  );
}

export default BusCardSkeleton;
