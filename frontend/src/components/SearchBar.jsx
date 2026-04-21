function SearchBar({ filters, onFilterChange, onReset }) {
	const hasActiveFilters = Boolean(filters.search || filters.status || filters.priority || filters.severity);

	return (
		<section className="filters-panel rounded-2xl border border-slate-300/30 bg-white/80 p-6 shadow-lg backdrop-blur-[1px]">
			<div className="filters-grid grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
				<div className="flex flex-col gap-1">
					<label htmlFor="search-title" className="mb-0">
						Search Title
					</label>
					<input
						id="search-title"
						type="text"
						placeholder="Type issue title..."
						value={filters.search}
						onChange={(event) => onFilterChange("search", event.target.value)}
						className="w-full px-3 py-2.5 text-sm"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="status-filter" className="mb-0">
						Status
					</label>
					<select
						id="status-filter"
						value={filters.status}
						onChange={(event) => onFilterChange("status", event.target.value)}
						className="w-full px-3 py-2.5 text-sm leading-5"
					>
						<option value="">All Statuses</option>
						<option value="Open">Open</option>
						<option value="In Progress">In Progress</option>
						<option value="Resolved">Resolved</option>
						<option value="Closed">Closed</option>
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="priority-filter" className="mb-0">
						Priority
					</label>
					<select
						id="priority-filter"
						value={filters.priority}
						onChange={(event) => onFilterChange("priority", event.target.value)}
						className="w-full px-3 py-2.5 text-sm leading-5"
					>
						<option value="">All Priorities</option>
						<option value="Low">Low</option>
						<option value="Medium">Medium</option>
						<option value="High">High</option>
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="severity-filter" className="mb-0">
						Severity
					</label>
					<select
						id="severity-filter"
						value={filters.severity}
						onChange={(event) => onFilterChange("severity", event.target.value)}
						className="w-full px-3 py-2.5 text-sm leading-5"
					>
						<option value="">All Severities</option>
						<option value="Low">Low</option>
						<option value="Medium">Medium</option>
						<option value="High">High</option>
					</select>
				</div>

				<div className="flex flex-col justify-end gap-1">
					<button
						type="button"
						className="btn btn-quiet h-8 w-fit min-w-[120px] px-3 text-xs disabled:cursor-not-allowed disabled:opacity-60"
						onClick={onReset}
						disabled={!hasActiveFilters}
					>
						Reset Filters
					</button>
				</div>
			</div>
		</section>
	);
}

export default SearchBar;
