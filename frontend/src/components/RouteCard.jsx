import { FiCheckCircle } from "react-icons/fi";
import {
  LuBus,
  LuTrainFront,
  LuCar,
  LuFootprints,
  LuArrowRight,
} from "react-icons/lu";

const modeIcons = {
  bus: LuBus,
  metro: LuTrainFront,
  auto: LuCar,
  walk: LuFootprints,
};

function getModeIcon(mode) {
  const normalizedMode = mode.trim().toLowerCase();

  return modeIcons[normalizedMode] || LuArrowRight;
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
      className={`cursor-pointer rounded-lg border-l-2 border border-slate-800 bg-surface-raised p-4 transition ${
        isSelected
          ? "border-l-emerald-400 bg-slate-800/60"
          : "border-l-transparent hover:border-l-slate-600 hover:bg-slate-800/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Route option
          </p>

          <h3 className="mt-0.5 text-sm font-semibold text-white">
            {route.route_title}
          </h3>
        </div>

        <span className="shrink-0 rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
          {route.recommendation}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {modes.map((mode, index) => {
          const ModeIcon = getModeIcon(mode);

          return (
            <div
              key={`${mode}-${index}`}
              className="flex items-center gap-1.5"
            >
              <div className="flex items-center gap-1.5 rounded-md bg-surface-sunken px-2 py-1">
                <ModeIcon size={13} className="text-slate-400" />

                <span className="text-xs font-medium text-slate-300">
                  {mode}
                </span>
              </div>

              {index < modes.length - 1 && (
                <LuArrowRight size={11} className="text-slate-700" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-md bg-surface-sunken px-2.5 py-2">
          <p className="text-[10px] text-slate-500">
            Duration
          </p>

          <p className="mt-0.5 text-sm font-semibold text-white">
            {route.estimated_time} min
          </p>
        </div>

        <div className="rounded-md bg-surface-sunken px-2.5 py-2">
          <p className="text-[10px] text-slate-500">
            Fare
          </p>

          <p className="mt-0.5 text-sm font-semibold text-white">
            ₹{route.estimated_cost}
          </p>
        </div>

        <div className="rounded-md bg-surface-sunken px-2.5 py-2">
          <p className="text-[10px] text-slate-500">
            Comfort
          </p>

          <p className="mt-0.5 text-sm font-semibold text-white">
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
          className="mt-3 w-full rounded-md border border-amber-400/30 bg-amber-400/10 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Predicting..."
            : "Predict seat availability"}
        </button>
      )}

      {prediction && (
        <div className="mt-2.5 flex items-center justify-between rounded-md border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Seat chance{" "}
              <strong className="font-semibold text-emerald-400">
                {prediction.seatChance}%
              </strong>
            </span>
          </div>

          <span className="font-medium text-slate-300">
            {prediction.crowdLevel}
          </span>
        </div>
      )}

      {isSelected && (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <FiCheckCircle size={12} />
          Selected route
        </p>
      )}
    </article>
  );
}

export default RouteCard;
