import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IssueCard from "../components/IssueCard";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import StatsCard from "../components/StatsCard";
import {
	changeIssueStatus,
	fetchIssues,
	fetchStats
} from "../store/slices/issueSlice";
import { pushToast } from "../store/slices/toastSlice";

const initialFilters = {
	search: "",
	status: "",
	priority: "",
	severity: "",
	page: 1,
	limit: 6
};

function Dashboard() {
	const dispatch = useDispatch();
	const { items, total, page, pages, stats, loading } = useSelector((state) => state.issues);

	const [filters, setFilters] = useState(initialFilters);

	const requestQuery = useMemo(
		() => ({
			...filters,
			search: filters.search.trim()
		}),
		[filters]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(fetchIssues(requestQuery));
		}, 400);

		return () => clearTimeout(timer);
	}, [dispatch, requestQuery]);

	useEffect(() => {
		dispatch(fetchStats());
	}, [dispatch]);

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
			page: 1
		}));
	};

	const handleResetFilters = () => {
		setFilters(initialFilters);
	};

	const handlePageChange = (nextPage) => {
		setFilters((prev) => ({
			...prev,
			page: nextPage
		}));
	};

	const handleStatusChange = async (id, status) => {
		const action = await dispatch(changeIssueStatus({ id, status }));

		if (changeIssueStatus.fulfilled.match(action)) {
			dispatch(pushToast({ type: "success", message: `Issue marked as ${status}` }));
			dispatch(fetchIssues(requestQuery));
			dispatch(fetchStats());
		}
	};

	const exportJson = () => {
		const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `issues-page-${page}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const exportCsv = () => {
		const headers = ["Title", "Status", "Priority", "Severity", "CreatedAt"];
		const rows = items.map((issue) => [
			issue.title,
			issue.status,
			issue.priority,
			issue.severity,
			issue.createdAt
		]);

		const csv = [headers, ...rows]
			.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
			.join("\n");

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `issues-page-${page}.csv`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<section className="dashboard app-shell grid gap-8">
			<div className="stats-grid grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
				<StatsCard title="Open" value={stats.Open} />
				<StatsCard title="In Progress" value={stats.InProgress} />
				<StatsCard title="Resolved" value={stats.Resolved} />
				<StatsCard title="Closed" value={stats.Closed} />
			</div>

			<SearchBar filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />

			<section>
				<div className="issues-header mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-300/40 bg-white/80 p-4 shadow-lg">
					<div className="issues-heading min-w-[220px]">
						<h2 className="text-2xl font-semibold text-slate-900">Your Issues</h2>
						<p className="text-sm text-slate-600">
							Showing {items.length} issues now • {total} total • page {page} of {pages}
						</p>
					</div>

					<div className="export-actions flex flex-wrap gap-2.5">
						<button type="button" className="btn btn-quiet" onClick={exportJson} disabled={!items.length}>
							Export JSON
						</button>
						<button type="button" className="btn btn-quiet" onClick={exportCsv} disabled={!items.length}>
							Export CSV
						</button>
					</div>
				</div>

				{loading ? <div className="panel rounded-xl bg-white p-6">Loading issues...</div> : null}

				{!loading && !items.length ? <div className="panel rounded-xl bg-white p-6">No issues found for these filters.</div> : null}

				<div className="issue-grid grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
					{items.map((issue) => (
						<IssueCard key={issue._id} issue={issue} onStatusChange={handleStatusChange} />
					))}
				</div>

				<Pagination page={page} pages={pages} onPageChange={handlePageChange} />
			</section>
		</section>
	);
}

export default Dashboard;
