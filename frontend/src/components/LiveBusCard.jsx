function LiveBusCard({ bus, onClick }) {
  const latitude = Number(bus.current_lat);
  const longitude = Number(bus.current_lng);

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-[230px] rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-400/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-xl">
            🚌
          </div>

          <div>
            <h3 className="font-bold text-white">
              {bus.name}
            </h3>

            <p className="text-xs text-slate-500">
              {bus.number_plate}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          Live
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-900 p-3">
          <p className="text-[11px] text-slate-500">
            Latitude
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {Number.isNaN(latitude)
              ? "Unavailable"
              : latitude.toFixed(4)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-3">
          <p className="text-[11px] text-slate-500">
            Longitude
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {Number.isNaN(longitude)
              ? "Unavailable"
              : longitude.toFixed(4)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Last updated:{" "}
        {bus.last_updated
          ? new Date(bus.last_updated).toLocaleTimeString()
          : "Live tracking active"}
      </p>
    </button>
  );
}

export default LiveBusCard;