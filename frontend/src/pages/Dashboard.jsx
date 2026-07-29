import { useCallback, useEffect, useState } from "react";
import { LuBus, LuRoute, LuClock3, LuRadio } from "react-icons/lu";

import Sidebar from "../components/Sidebar";
import BusMap from "../components/BusMap";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import useSocket from "../hooks/useSocket";
import LiveBusCard from "../components/LiveBusCard";
import BusDetails from "../components/BusDetails";
import BusCardSkeleton from "../components/BusCardSkeleton";
import toast from "react-hot-toast";

import {
  getBuses,
  predictSeat,
  searchRoutes,
} from "../services/api";

function Dashboard() {
  const [buses, setBuses] = useState([]);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [busError, setBusError] = useState("");

  const [routes, setRoutes] = useState([]);

  const [source, setSource] = useState("IGDTUW");
  const [destination, setDestination] = useState("Rajouri Garden");

  const [predictions, setPredictions] = useState({});
  const [loadingRouteId, setLoadingRouteId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [focusedBus, setFocusedBus] = useState(null);

  const [searchingRoutes, setSearchingRoutes] = useState(false);
  const [routeError, setRouteError] = useState("");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoadingBuses(true);
        setBusError("");

        const response = await getBuses();
        setBuses(response.data.buses);
      } catch (error) {
        console.error("Unable to fetch buses:", error);
        setBusError("Unable to load live buses.");
        toast.error("Unable to load live buses.");
      } finally {
        setLoadingBuses(false);
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
              last_updated: data.updatedAt,
            }
          : bus
      )
    );

    setSelectedBus((previousBus) =>
      previousBus && previousBus.id === data.busId
        ? {
            ...previousBus,
            current_lat: data.lat,
            current_lng: data.lng,
            last_updated: data.updatedAt,
          }
        : previousBus
    );
  }, []);

  useSocket(selectedBus?.id, handleLocationUpdate);

  const handleSearch = async () => {
    try {
      setSearchingRoutes(true);
      setRouteError("");

      const response = await searchRoutes(source, destination);
      const foundRoutes = response.data.routes || [];

      setRoutes(foundRoutes);
      setSelectedRoute(null);
      setPredictions({});

      if (foundRoutes.length > 0) {
        toast.success(
          `${foundRoutes.length} route${
            foundRoutes.length > 1 ? "s" : ""
          } found`
        );
      } else {
        toast("No routes found for this journey.");
      }
    } catch (error) {
      console.error("Route search failed:", error);

      setRouteError("Unable to search routes. Please try again.");
      setRoutes([]);
      setSelectedRoute(null);
      setPredictions({});

      toast.error("Route search failed. Please try again.");
    } finally {
      setSearchingRoutes(false);
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
      toast.error("Seat prediction failed.");
    } finally {
      setLoadingRouteId(null);
    }
  };

  return (
    <div className="sugam-grid-background relative min-h-screen overflow-x-hidden">
      {/* Responsive dashboard layout */}
      <div className="relative flex min-h-screen flex-col md:flex-row">
        <Sidebar
          source={source}
          setSource={setSource}
          destination={destination}
          setDestination={setDestination}
          onSearch={handleSearch}
          searchingRoutes={searchingRoutes}
          routeError={routeError}
          routes={routes}
          onPredictSeat={handlePredictSeat}
          predictions={predictions}
          loadingRouteId={loadingRouteId}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
        />

        <div className="min-w-0 flex-1">
          <Header />

          <main className="p-4 sm:p-5">
            <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Active Buses"
                value={buses.length}
                detail="Live on network"
                icon={LuBus}
              />

              <StatCard
                label="Available Routes"
                value={routes.length || 3}
                detail="Bus, metro and auto"
                icon={LuRoute}
              />

              <StatCard
                label="Average Delay"
                value="4 min"
                detail="Within normal range"
                icon={LuClock3}
              />

              <StatCard
                label="Network Status"
                value="Live"
                detail="Socket connected"
                icon={LuRadio}
              />
            </section>

            <section className="mb-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Live Vehicles
                  </h2>

                  <p className="text-sm text-slate-500">
                    Real-time locations from the transport network.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  {buses.length} active
                </span>
              </div>

              {loadingBuses ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[1, 2, 3].map((item) => (
                    <BusCardSkeleton key={item} />
                  ))}
                </div>
              ) : busError ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {busError}
                </div>
              ) : buses.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-700 bg-surface-raised p-4 text-sm text-slate-500">
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

            <section className="mb-3">
              <h2 className="text-lg font-semibold text-white">
                Live Transit Map
              </h2>

              <p className="text-sm text-slate-500">
                Track buses and compare multi-modal route options.
              </p>
            </section>

            <section className="overflow-hidden rounded-lg border border-slate-800">
              <BusMap
                buses={buses}
                selectedRoute={selectedRoute}
                focusedBus={focusedBus}
              />
            </section>

            {selectedRoute && (
              <section className="mt-4 rounded-lg border border-slate-800 bg-surface-raised p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
                      Selected journey
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {selectedRoute.route_title}
                    </h3>

                    <p className="mt-0.5 text-sm text-slate-500">
                      {selectedRoute.modes}
                    </p>
                  </div>

                  <span className="rounded-md bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                    {selectedRoute.recommendation}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div className="rounded-md bg-surface-sunken p-3">
                    <p className="text-xs text-slate-500">
                      Duration
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-white">
                      {selectedRoute.estimated_time} min
                    </p>
                  </div>

                  <div className="rounded-md bg-surface-sunken p-3">
                    <p className="text-xs text-slate-500">
                      Estimated Fare
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-white">
                      ₹{selectedRoute.estimated_cost}
                    </p>
                  </div>

                  <div className="rounded-md bg-surface-sunken p-3">
                    <p className="text-xs text-slate-500">
                      Comfort
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-white">
                      {selectedRoute.comfort_score}%
                    </p>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {selectedBus && (
        <BusDetails
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
          onViewMap={() => {
            setFocusedBus(selectedBus);
            setSelectedBus(null);
            toast.success("Bus location focused on the map.");
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
