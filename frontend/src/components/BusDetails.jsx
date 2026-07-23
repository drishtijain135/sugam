import { useEffect } from "react";
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
      {/* Dark background overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Right-side drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-slate-700 bg-slate-950 p-4 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-400">
              Live Vehicle
            </p>

            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              {bus.name || "Bus"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {bus.number_plate || "Number plate unavailable"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xl text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />

            <div>
              <p className="font-semibold text-emerald-400">
                Live tracking active
              </p>

              <p className="text-xs text-slate-400">
                Vehicle location is updating in real time.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-4">
            <p className="text-xs text-slate-500">
              Latitude
            </p>

            <p className="mt-2 font-bold text-white">
              {Number.isNaN(latitude)
                ? "Unavailable"
                : latitude.toFixed(5)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <p className="text-xs text-slate-500">
              Longitude
            </p>

            <p className="mt-2 font-bold text-white">
              {Number.isNaN(longitude)
                ? "Unavailable"
                : longitude.toFixed(5)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <p className="text-xs text-slate-500">
              Status
            </p>

            <p className="mt-2 font-bold text-emerald-400">
              Active
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <p className="text-xs text-slate-500">
              Last updated
            </p>

            <p className="mt-2 font-bold text-white">
              {bus.last_updated
                ? new Date(bus.last_updated).toLocaleTimeString()
                : "Live now"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-slate-800 p-4">
            <p className="text-xs text-slate-500">
              Current stop
            </p>

            <p className="mt-1 font-semibold text-white">
              Civil Lines
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 p-4">
            <p className="text-xs text-slate-500">
              Next stop
            </p>

            <p className="mt-1 font-semibold text-white">
              Kashmere Gate
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 p-4">
            <p className="text-xs text-slate-500">
              Estimated arrival
            </p>

            <p className="mt-1 font-semibold text-white">
              {eta ? `${eta} minutes` : "Unavailable"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewMap}
          className="mt-6 w-full rounded-2xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
        >
          View on map
        </button>
      </aside>
    </div>
  );
}

export default BusDetails;