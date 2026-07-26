import { LuBus, LuMapPin } from "react-icons/lu";
import { calculateEta } from "../utils/calculateEta";

function LiveBusCard({ bus, onClick }) {
  const latitude = Number(bus.current_lat);
  const longitude = Number(bus.current_lng);
  const eta = calculateEta(
    bus.current_lat,
    bus.current_lng,
    28.6677,
    77.2303
  );

  const hasCoordinates =
    !Number.isNaN(latitude) && !Number.isNaN(longitude);

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-[240px] shrink-0 rounded-lg border border-slate-800 bg-surface-raised p-3.5 text-left transition hover:border-emerald-400/40 hover:bg-slate-800/40"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
            <LuBus size={16} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">
              {bus.name}
            </h3>

            <p className="truncate text-xs text-slate-500">
              {bus.number_plate}
            </p>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <LuMapPin size={12} />
          <span>
            {hasCoordinates
              ? `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
              : "Location unavailable"}
          </span>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            ETA
          </p>
          <p className="text-sm font-semibold text-emerald-400">
            {eta ? `${eta} min` : "—"}
          </p>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-slate-600">
        Updated{" "}
        {bus.last_updated
          ? new Date(bus.last_updated).toLocaleTimeString()
          : "live tracking active"}
      </p>
    </button>
  );
}

export default LiveBusCard;
