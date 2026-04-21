import { Link } from "react-router-dom";
import {
	FiAlertTriangle,
	FiCalendar,
	FiCheckCircle,
	FiCircle,
	FiClock,
	FiEdit2,
	FiExternalLink,
	FiFlag,
	FiLock
} from "react-icons/fi";

const statusClassMap = {
	Open: "border-cyan-300 bg-cyan-50 text-cyan-700 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-900",
	"In Progress": "border-amber-300 bg-amber-50 text-amber-800 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-900",
	Resolved: "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-900",
	Closed: "border-slate-700 bg-slate-800 text-slate-100"
};

const levelClassMap = {
	High: "border-red-300 bg-red-50 text-red-700",
	Medium: "border-amber-300 bg-amber-50 text-amber-800",
	Low: "border-blue-300 bg-blue-50 text-blue-800"
};

const statusIconMap = {
	Open: FiCircle,
	"In Progress": FiClock,
	Resolved: FiCheckCircle,
	Closed: FiLock
};

function IssueCard({ issue, onStatusChange }) {
	const createdDate = new Date(issue.createdAt).toLocaleDateString();
	const isClosed = issue.status === "Closed";
	const canStart = issue.status === "Open";
	const canResolve = issue.status !== "Resolved" && issue.status !== "Closed";
	const canClose = issue.status !== "Closed";
	const StatusIcon = statusIconMap[issue.status] || FiCircle;

	const handleStatus = (nextStatus) => {
		const needsConfirm = nextStatus === "Resolved" || nextStatus === "Closed";
		const confirmed = needsConfirm
			? window.confirm(`Mark this issue as ${nextStatus}?`)
			: true;

		if (confirmed) {
			onStatusChange(issue._id, nextStatus);
		}
	};

	return (
		<article className={`issue-card flex flex-col rounded-xl border border-white/20 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl ${isClosed ? "ring-1 ring-slate-700/50" : ""}`}>
			<div className="issue-card-top flex items-start justify-between gap-4">
				<div className="issue-card-head flex min-w-0 flex-1 flex-col gap-2">
					<div className="issue-card-title-row flex min-w-0 items-center gap-2">
						<h3 className="line-clamp-2 flex-1 text-lg font-semibold">{issue.title}</h3>
						<div className="quick-actions quick-actions-inline inline-grid grid-cols-2 gap-1.5">
							<Link
								to={`/issues/${issue._id}`}
								className="card-action-btn icon-action-btn btn-view-alt inline-flex min-h-9 items-center justify-center rounded-lg border border-blue-300 bg-blue-50 p-1.5 text-blue-900"
								aria-label="View details"
								title="View details"
							>
								<FiExternalLink />
							</Link>
							<Link
								to={`/issues/${issue._id}/edit`}
								className="card-action-btn icon-action-btn btn-update-alt inline-flex min-h-9 items-center justify-center rounded-lg border border-cyan-300 bg-cyan-50 p-1.5 text-cyan-900"
								aria-label="Update issue"
								title="Update issue"
							>
								<FiEdit2 />
							</Link>
						</div>
					</div>
					<p className="issue-card-desc line-clamp-2 text-sm text-slate-500">{issue.description}</p>
				</div>
				<span className={`badge ${statusClassMap[issue.status]} inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm font-medium transition-colors`}>
					<StatusIcon />
					{issue.status}
				</span>
			</div>

			<div className="meta-row mb-4 mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
				<span className={`badge subtle ${levelClassMap[issue.priority] || levelClassMap.Low} inline-flex items-center gap-1.5 rounded-md border px-3 py-1`}>
					<FiFlag />
					Priority: {issue.priority}
				</span>
				<span className={`badge subtle ${levelClassMap[issue.severity] || levelClassMap.Low} inline-flex items-center gap-1.5 rounded-md border px-3 py-1`}>
					<FiAlertTriangle />
					Severity: {issue.severity}
				</span>
				<span className="badge subtle inline-flex items-center gap-1.5 rounded-md border border-blue-300 bg-blue-50 px-3 py-1 text-blue-800">
					<FiCalendar />
					Created: {createdDate}
				</span>
			</div>

			<div className="issue-actions grid gap-2 border-t border-slate-200 pt-4">
				<div className="quick-actions quick-actions-status grid grid-cols-3 gap-2">
					<button
						type="button"
						className="card-action-btn btn-start inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-700 bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-100 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-45 disabled:saturate-50"
						onClick={() => handleStatus("In Progress")}
						disabled={!canStart}
					>
						<FiClock />
						Open
					</button>

					<button
						type="button"
						className="card-action-btn btn-resolve inline-flex items-center justify-center gap-1.5 rounded-lg border border-green-700 bg-green-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-100 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-45 disabled:saturate-50"
						onClick={() => handleStatus("Resolved")}
						disabled={!canResolve}
					>
						<FiCheckCircle />
						Resolve
					</button>

					<button
						type="button"
						className="card-action-btn btn-close inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-100 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-45 disabled:saturate-50"
						onClick={() => handleStatus("Closed")}
						disabled={!canClose}
					>
						<FiLock />
						Close
					</button>
				</div>
			</div>
		</article>
	);
}

export default IssueCard;
