import SearchForm from "./SearchForm";
import RouteCard from "./RouteCard";

function Sidebar({
  source,
  setSource,
  destination,
  setDestination,
  onSearch,
  routes,
  onPredictSeat,
  predictions,
  loadingRouteId,
  selectedRoute,
  setSelectedRoute,
}) {
  return (
    <aside className="w-full overflow-y-auto border-r border-slate-800 bg-slate-950 p-5 lg:w-[400px]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          🚍 SUGAM
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Unified public transport planner
        </p>
      </div>

      <SearchForm
        source={source}
        setSource={setSource}
        destination={destination}
        setDestination={setDestination}
        onSearch={onSearch}
      />

      <div className="mt-5">
        <h2 className="mb-3 text-lg font-semibold">
          Route Options
        </h2>

        {routes.length === 0 ? (
          <p className="text-sm text-slate-500">
            Search IGDTUW to Rajouri Garden to view route options.
          </p>
        ) : (
          <div className="space-y-3">
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