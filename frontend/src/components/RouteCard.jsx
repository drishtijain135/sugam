const modeIcons = {
  bus: "🚌",
  metro: "🚇",
  auto: "🛺",
  walk: "🚶",
};

function getModeIcon(mode) {
  const normalizedMode = mode.trim().toLowerCase();

  return modeIcons[normalizedMode] || "➡️";
}

function RouteCard({
  route,
  onPredictSeat,
  prediction,
  loading,
  selectedRoute,
  setSelectedRoute,
}) {
  const isSelected = selectedRoute?.id === route.id;

  const modes = route.modes
    .split(/->|,/)
    .map((mode) => mode.trim())
    .filter(Boolean);

  const containsBus = modes.some(
    (mode) => mode.toLowerCase() === "bus"
  );

  return (
    <article
      onClick={() => setSelectedRoute(route)}
      className={`cursor-pointer rounded-2xl border p-4 transition duration-200 ${
        isSelected
          ? "border-emerald-400 bg-slate-800 shadow-lg shadow-emerald-400/10"
          : "border-slate-700 bg-slate-800/70 hover:border-slate-500 hover:bg-slate-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Route option
          </p>

          <h3 className="mt-1 text-base font-bold text-white">
            {route.route_title}
          </h3>
        </div>

        <span className="rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-bold uppercase text-slate-950">
          {route.recommendation}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {modes.map((mode, index) => (
          <div
            key={`${mode}-${index}`}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2">
              <span className="text-lg">
                {getModeIcon(mode)}
              </span>

              <span className="text-sm font-medium text-slate-200">
                {mode}
              </span>
            </div>

            {index < modes.length - 1 && (
              <span className="text-slate-600">→</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-[11px] text-slate-500">
            Duration
          </p>

          <p className="mt-1 font-bold text-white">
            {route.estimated_time} min
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-[11px] text-slate-500">
            Fare
          </p>

          <p className="mt-1 font-bold text-white">
            ₹{route.estimated_cost}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-[11px] text-slate-500">
            Comfort
          </p>

          <p className="mt-1 font-bold text-white">
            {route.comfort_score}%
          </p>
        </div>
      </div>

      {containsBus && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPredictSeat(route);
          }}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-yellow-400 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Predicting..."
            : "Predict Seat Availability"}
        </button>
      )}

      {prediction && (
        <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">
              Seat chance
            </span>

            <span className="font-bold text-emerald-400">
              {prediction.seatChance}%
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-slate-300">
              Crowd level
            </span>

            <span className="font-bold text-white">
              {prediction.crowdLevel}
            </span>
          </div>
        </div>
      )}

      {isSelected && (
        <p className="mt-3 text-xs font-semibold text-emerald-400">
          ✓ Selected route
        </p>
      )}
    </article>
  );
}

export default RouteCard;