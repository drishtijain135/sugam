import { useCallback, useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import BusMap from "../components/BusMap";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import useSocket from "../hooks/useSocket";
import LiveBusCard from "../components/LiveBusCard";
import BusDetails from "../components/BusDetails";

import {
  getBuses,
  predictSeat,
  searchRoutes,
} from "../services/api";

function Dashboard() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [source, setSource] = useState("IGDTUW");
  const [destination, setDestination] = useState("Rajouri Garden");

  const [predictions, setPredictions] = useState({});
  const [loadingRouteId, setLoadingRouteId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [selectedBus, setSelectedBus] = useState(null);
  const [focusedBus, setFocusedBus] = useState(null);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await getBuses();
        setBuses(response.data.buses);
      } catch (error) {
        console.error("Unable to fetch buses:", error);
      }
    };

    fetchBuses();
  }, []);

  const handleLocationUpdate = useCallback((data) => {
    setBuses((previousBuses) =>
      previousBuses.map((bus) =>
        bus.id === data.busId
          ? {
              ...bus,
              current_lat: data.lat,
              current_lng: data.lng,
            }
          : bus
      )
    );
  }, []);

  useSocket(handleLocationUpdate);

  const handleSearch = async () => {
    try {
      const response = await searchRoutes(source, destination);

      setRoutes(response.data.routes);
      setSelectedRoute(null);
      setPredictions({});
    } catch (error) {
      console.error("Route search failed:", error);
    }
  };

  const handlePredictSeat = async (route) => {
    try {
      setLoadingRouteId(route.id);

      const response = await predictSeat({
        bus_id: 1,
        day_of_week: "Monday",
        time_slot: "09:00-09:30",
      });

      setPredictions((previousPredictions) => ({
        ...previousPredictions,
        [route.id]: response.data,
      }));
    } catch (error) {
      console.error("Seat prediction failed:", error);
    } finally {
      setLoadingRouteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col lg:flex-row">
      <Sidebar
        source={source}
        setSource={setSource}
        destination={destination}
        setDestination={setDestination}
        onSearch={handleSearch}
        routes={routes}
        onPredictSeat={handlePredictSeat}
        predictions={predictions}
        loadingRouteId={loadingRouteId}
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
      />

      <div className="flex-1">
        <Header />

        <main className="p-5">
          <section className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard
              label="Active Buses"
              value={buses.length}
              detail="Live on network"
            />

            <StatCard
              label="Available Routes"
              value={routes.length || 3}
              detail="Bus, metro and auto"
            />

            <StatCard
              label="Average Delay"
              value="4 min"
              detail="Within normal range"
            />

            <StatCard
              label="Network Status"
              value="Live"
              detail="Socket connected"
            />
          </section>

          <section className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Live Vehicles
                </h2>

                <p className="text-sm text-slate-400">
                  Real-time locations from the transport network.
                </p>
              </div>

              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                {buses.length} active
              </span>
            </div>

            {buses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-5 text-sm text-slate-500">
                No live buses are currently available.
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {buses.map((bus) => (
                  <LiveBusCard
                    key={bus.id}
                    bus={bus}
                    onClick={() => setSelectedBus(bus)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mb-5">
            <h2 className="text-2xl font-bold">
              Live Transit Map
            </h2>

            <p className="text-sm text-slate-400">
              Track buses and compare multi-modal route options.
            </p>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
            <BusMap
              buses={buses}
              selectedRoute={selectedRoute}
              focusedBus={focusedBus}
            />
          </section>

          {selectedRoute && (
            <section className="mt-4 rounded-2xl border border-slate-700 bg-slate-800 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-emerald-400">
                    Selected journey
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {selectedRoute.route_title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedRoute.modes}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-400 px-3 py-1 text-sm font-bold text-slate-950">
                  {selectedRoute.recommendation}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-500">
                    Duration
                  </p>

                  <p className="font-bold">
                    {selectedRoute.estimated_time} min
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-500">
                    Estimated Fare
                  </p>

                  <p className="font-bold">
                    ₹{selectedRoute.estimated_cost}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-500">
                    Comfort
                  </p>

                  <p className="font-bold">
                    {selectedRoute.comfort_score}%
                  </p>
                </div>
              </div>
            </section>
          )}
                </main>
      </div>

      {selectedBus && (
        <BusDetails
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
          onViewMap={() => {
            setFocusedBus(selectedBus);
            setSelectedBus(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;