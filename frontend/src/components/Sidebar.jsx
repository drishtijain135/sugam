import { LuBusFront } from "react-icons/lu";
import SearchForm from "./SearchForm";
import RouteCard from "./RouteCard";

function Sidebar({
  source,
  setSource,
  destination,
  setDestination,
  onSearch,
  searchingRoutes,
  routeError,
  routes,
  onPredictSeat,
  predictions,
  loadingRouteId,
  selectedRoute,
  setSelectedRoute,
}) {
  return (
    <aside className="h-screen w-full overflow-y-auto border-r border-slate-800 bg-surface-panel p-4 md:w-[380px] md:p-5">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
          <LuBusFront size={18} />
        </div>

        <div>
          <h1 className="text-lg font-semibold text-white">
            SUGAM
          </h1>

          <p className="text-xs text-slate-500">
            Unified public transport planner
          </p>
        </div>
      </div>

      <SearchForm
        source={source}
        setSource={setSource}
        destination={destination}
        setDestination={setDestination}
        onSearch={onSearch}
        searchingRoutes={searchingRoutes}
      />

      <div className="mt-5">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Route options
        </h2>

        {searchingRoutes ? (
          <p className="py-4 text-sm text-slate-400">
            Searching routes...
          </p>
        ) : routeError ? (
          <p className="py-4 text-sm text-red-400">
            {routeError}
          </p>
        ) : routes.length === 0 ? (
          <p className="text-sm text-slate-500">
            Search IGDTUW to Rajouri Garden to view route options.
          </p>
        ) : (
          <div className="space-y-2.5">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onPredictSeat={onPredictSeat}
                prediction={predictions[route.id]}
                loading={loadingRouteId === route.id}
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
