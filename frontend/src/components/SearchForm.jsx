import { FiArrowUp, FiArrowDown, FiRepeat } from "react-icons/fi";

function SearchForm({
  source,
  setSource,
  destination,
  setDestination,
  onSearch,
  searchingRoutes,
}) {
  const swapLocations = () => {
    const oldSource = source;
    setSource(destination);
    setDestination(oldSource);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !source.trim() ||
      !destination.trim() ||
      searchingRoutes
    ) {
      return;
    }

    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-800 bg-surface-raised p-4"
    >
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Plan your journey
        </p>

        <h2 className="mt-0.5 text-base font-semibold text-white">
          Where are you going?
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-[38px] h-[56px] border-l-2 border-dashed border-slate-700" />

        <label className="mb-3 block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <FiArrowUp size={12} className="text-emerald-400" />
            Pickup location
          </span>

          <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-surface-sunken px-3 transition focus-within:border-emerald-400">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />

            <input
              type="text"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="Enter your starting point"
              className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </label>

        <button
          type="button"
          onClick={swapLocations}
          aria-label="Swap source and destination"
          className="absolute right-3 top-[64px] z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
        >
          <FiRepeat size={13} />
        </button>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <FiArrowDown size={12} className="text-amber-400" />
            Drop-off location
          </span>

          <div className="flex items-center gap-3 rounded-md border border-slate-700 bg-surface-sunken px-3 transition focus-within:border-amber-400/70">
            <span className="h-2 w-2 shrink-0 rounded-sm bg-amber-400" />

            <input
              type="text"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Enter your destination"
              className="w-full bg-transparent py-3 pr-8 text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={
          !source.trim() ||
          !destination.trim() ||
          searchingRoutes
        }
        className="mt-4 w-full rounded-md bg-emerald-400 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {searchingRoutes ? "Searching routes..." : "Search best routes"}
      </button>

      <p className="mt-2.5 text-center text-xs text-slate-500">
        Compare travel time, fare, crowd and comfort
      </p>
    </form>
  );
}

export default SearchForm;
