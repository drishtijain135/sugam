import { useEffect, useState } from "react";
import { LuX, LuNavigation } from "react-icons/lu";
import { calculateEta } from "../utils/calculateEta";

function getDistance(lat1, lng1, lat2, lng2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const latitudeDifference = toRadians(lat2 - lat1)
  const longitudeDifference = toRadians(lng2 - lng1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function BusDetails({ bus, onClose, onViewMap }) {
  const [routeStops, setRouteStops] = useState([]);
  const [loadingStops, setLoadingStops] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (bus?.stops) {
      setRouteStops(bus.stops);
    } else {
      setRouteStops([]);
    }
  }, [bus]);

  if (!bus) return null;

  const latitude = Number(bus.current_lat);
  const longitude = Number(bus.current_lng);

  let currentStop = null;
  let nextStop = null;

  if (
    routeStops.length > 0 &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude)
  ) {
    let nearestStopIndex = 0;
    let shortestDistance = Infinity;

    routeStops.forEach((stop, index) => {
      const distance = getDistance(
        latitude,
        longitude,
        Number(stop.latitude),
        Number(stop.longitude)
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestStopIndex = index;
      }
    });

    currentStop = routeStops[nearestStopIndex];
    nextStop = routeStops[nearestStopIndex + 1] || null;
  }

  const eta = nextStop
  ? calculateEta(
      latitude,
      longitude,
      Number(nextStop.latitude),
      Number(nextStop.longitude)
    )
  : null;

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

        {/* Route Information */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Route Information
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs text-slate-500">Organization</span>
              <span className="text-sm text-white">
                {bus.organization_name}
              </span>
            </div>

            <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs text-slate-500">Route Number</span>
              <span className="text-sm text-white">
                {bus.route_number}
              </span>
            </div>

            <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs text-slate-500">Route Name</span>
              <span className="text-sm text-white">
                {bus.route_name}
              </span>
            </div>

            <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs text-slate-500">Source</span>
              <span className="text-sm text-white">
                {bus.source}
              </span>
            </div>

            <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs text-slate-500">Destination</span>
              <span className="text-sm text-white">
                {bus.destination}
              </span>
            </div>

            <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs text-slate-500">Distance</span>
              <span className="text-sm text-white">
                {bus.distance_km} km
              </span>
            </div>

            <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs text-slate-500">Fare</span>
              <span className="text-sm text-white">
                ₹{bus.base_fare}
              </span>
            </div>

            <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <span className="text-xs text-slate-500">Estimated Time</span>
              <span className="text-sm text-white">
                {bus.estimated_time} min
              </span>
            </div>

          </div>
        </div>

        {/* Journey Details */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-xs text-slate-500">
              Current stop
            </p>

            <p className="text-sm font-medium text-white">
              {loadingStops
                ? "Loading..."
                : currentStop?.stop_name || "Unavailable"}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-xs text-slate-500">
              Next stop
            </p>

            <p className="text-sm font-medium text-white">
              {loadingStops
                ? "Loading..."
                : nextStop?.stop_name || "Route completed"}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-xs text-slate-500">
              Estimated arrival
            </p>

            <p className="text-sm font-medium text-white">
              {loadingStops
                ? "Loading..."
                : nextStop
                ? `${eta} minutes`
                : "Arrived"}
            </p>
          </div>
        </div>

        {/* Route Stops */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Route Stops
          </h3>

          <div className="space-y-2">

            {loadingStops ? (
              <p className="text-sm text-slate-400">
                Loading stops...
              </p>
            ) : (
              routeStops.map((stop) => (
                <div
                  key={stop.stop_order}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
                >
                  <div className="flex justify-between">

                    <span className="font-medium text-white">
                      {stop.stop_order}. {stop.stop_name}
                    </span>

                    <span className="text-sm text-emerald-400">
                      {stop.estimated_minutes_from_start} min
                    </span>

                  </div>
                </div>
              ))
            )}

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