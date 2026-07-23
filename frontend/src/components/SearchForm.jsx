function SearchForm({
  source,
  setSource,
  destination,
  setDestination,
  onSearch,
}) {
  const swapLocations = () => {
    const oldSource = source;
    setSource(destination);
    setDestination(oldSource);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!source.trim() || !destination.trim()) {
      return;
    }

    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Plan your journey
        </p>

        <h2 className="mt-1 text-xl font-bold text-white">
          Where are you going?
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-[44px] h-[62px] border-l-2 border-dashed border-slate-700" />

        <label className="mb-3 block">
          <span className="mb-2 block text-xs font-medium text-slate-400">
            Pickup location
          </span>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 transition focus-within:border-emerald-400">
            <span className="relative z-10 h-3 w-3 shrink-0 rounded-full bg-emerald-400 ring-4 ring-emerald-400/10" />

            <input
              type="text"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="Enter your starting point"
              className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </label>

        <button
          type="button"
          onClick={swapLocations}
          aria-label="Swap source and destination"
          className="absolute right-4 top-[76px] z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-lg text-slate-300 shadow-lg transition hover:border-emerald-400 hover:text-emerald-400"
        >
          ⇅
        </button>

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-slate-400">
            Drop-off location
          </span>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 transition focus-within:border-yellow-400">
            <span className="relative z-10 h-3 w-3 shrink-0 rounded-sm bg-yellow-400 ring-4 ring-yellow-400/10" />

            <input
              type="text"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Enter your destination"
              className="w-full bg-transparent py-4 pr-10 text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={!source.trim() || !destination.trim()}
        className="mt-5 w-full rounded-2xl bg-emerald-400 py-4 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Search best routes
      </button>

      <p className="mt-3 text-center text-xs text-slate-500">
        Compare travel time, fare, crowd and comfort
      </p>
    </form>
  );
}

export default SearchForm;