import { useEffect } from "react";
import { LuX, LuNavigation } from "react-icons/lu";
import { calculateEta } from "../utils/calculateEta";

function BusDetails({ bus, onClose, onViewMap }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!bus) return null;

  const latitude = Number(bus.current_lat);
  const longitude = Number(bus.current_lng);

  const eta = calculateEta(
    bus.current_lat,
    bus.current_lng,
    28.6677,
    77.2303
  );

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-950 p-5 shadow-2xl sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
              Live Vehicle
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              {bus.name || "Bus"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {bus.number_plate || "Number plate unavailable"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <LuX size={18} />
          </button>
        </div>

        {/* Live Status */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

          <div>
            <p className="text-sm font-semibold text-emerald-400">
              Live tracking active
            </p>

            <p className="text-xs text-slate-400">
              Vehicle location is updating in real time.
            </p>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">Latitude</p>

            <p className="mt-2 text-sm font-semibold text-white">
              {Number.isNaN(latitude)
                ? "Unavailable"
                : latitude.toFixed(5)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">Longitude</p>

            <p className="mt-2 text-sm font-semibold text-white">
              {Number.isNaN(longitude)
                ? "Unavailable"
                : longitude.toFixed(5)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">Status</p>

            <p className="mt-2 text-sm font-semibold text-emerald-400">
              Active
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">Last updated</p>

            <p className="mt-2 text-sm font-semibold text-white">
              {bus.last_updated
                ? new Date(bus.last_updated).toLocaleTimeString()
                : "Live now"}
            </p>
          </div>
        </div>

        {/* Journey Details */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-xs text-slate-500">
              Current stop
            </p>

            <p className="text-sm font-medium text-white">
              Civil Lines
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-xs text-slate-500">
              Next stop
            </p>

            <p className="text-sm font-medium text-white">
              Kashmere Gate
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-xs text-slate-500">
              Estimated arrival
            </p>

            <p className="text-sm font-medium text-white">
              {eta ? `${eta} minutes` : "Unavailable"}
            </p>
          </div>
        </div>

        {/* View Map Button */}
        <button
          type="button"
          onClick={onViewMap}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition duration-200 hover:bg-emerald-300 active:scale-[0.98]"
        >
          <LuNavigation size={18} />
          View on map
        </button>
      </aside>
    </div>
  );
}

export default BusDetails;