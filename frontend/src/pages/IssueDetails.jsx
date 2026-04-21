import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	changeIssueStatus,
	fetchIssueById,
	removeIssue
} from "../store/slices/issueSlice";
import { pushToast } from "../store/slices/toastSlice";

const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];

function IssueDetails() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { currentIssue, detailsLoading, actionLoading } = useSelector((state) => state.issues);

	useEffect(() => {
		dispatch(fetchIssueById(id));
	}, [dispatch, id]);

	const handleStatusUpdate = async (status) => {
		if (status === currentIssue.status) {
			return;
		}

		const requiresConfirmation = status === "Resolved" || status === "Closed";
		if (requiresConfirmation) {
			const confirmed = window.confirm(`Mark this issue as ${status}?`);
			if (!confirmed) {
				return;
			}
		}

		const action = await dispatch(changeIssueStatus({ id, status }));
		if (changeIssueStatus.fulfilled.match(action)) {
			dispatch(pushToast({ type: "success", message: `Issue marked as ${status}` }));
			dispatch(fetchIssueById(id));
		}
	};

	const handleDelete = async () => {
		const confirmed = window.confirm("Delete this issue permanently?");
		if (!confirmed) {
			return;
		}

		const action = await dispatch(removeIssue(id));
		if (removeIssue.fulfilled.match(action)) {
			dispatch(pushToast({ type: "success", message: "Issue deleted" }));
			navigate("/");
		}
	};

	if (detailsLoading || !currentIssue) {
		return <div className="panel mx-auto rounded-xl bg-white p-6 shadow-md">Loading issue details...</div>;
	}

	const descriptionRows = Math.max(3, (currentIssue.description || "").split("\n").length + 1);

	return (
		<section className="detail-page app-shell mx-auto max-w-[980px] px-4 py-8">
			<div className="detail-header mb-8 flex items-start justify-between gap-6">
				<div className="detail-header-main flex flex-1 flex-col gap-3">
					<h2 className="text-3xl font-semibold text-white">Issue Details</h2>
					<div className="detail-quick-meta grid gap-3 md:grid-cols-3">
						<div className="detail-meta-chip rounded-xl border border-blue-200/30 bg-slate-950/20 p-3">
							<span className="block text-xs font-medium tracking-wide text-blue-200">Issue Name</span>
							<strong className="mt-1 block text-base font-medium text-blue-50">{currentIssue.title}</strong>
						</div>
						<div className="detail-meta-chip rounded-xl border border-blue-200/30 bg-slate-950/20 p-3">
							<span className="block text-xs font-medium tracking-wide text-blue-200">Status</span>
							<strong className="mt-1 block text-base font-medium text-blue-50">{currentIssue.status}</strong>
						</div>
						<div className="detail-meta-chip rounded-xl border border-blue-200/30 bg-slate-950/20 p-3">
							<span className="block text-xs font-medium tracking-wide text-blue-200">Created At</span>
							<strong className="mt-1 block text-base font-medium text-blue-50">{new Date(currentIssue.createdAt).toLocaleString()}</strong>
						</div>
					</div>
				</div>
			</div>

			<section className="detail-card rounded-xl border border-slate-300/25 bg-white p-8 shadow-2xl">
				<h2 className="mb-6 text-2xl font-semibold text-slate-900">Issue Information</h2>
				<div className="details-form-grid grid gap-6 md:grid-cols-2">
					<div className="form-group mb-0 flex flex-col gap-2">
						<label htmlFor="view-title">Title</label>
						<input id="view-title" className="readonly-field w-full bg-slate-100" value={currentIssue.title} readOnly />
					</div>

					<div className="form-group mb-0 flex flex-col gap-2">
						<label htmlFor="view-status">Status</label>
						<input id="view-status" className="readonly-field w-full bg-slate-100" value={currentIssue.status} readOnly />
					</div>

					<div className="form-group mb-0 flex flex-col gap-2">
						<label htmlFor="view-created">Created Date</label>
						<input
							id="view-created"
							className="readonly-field w-full bg-slate-100"
							value={new Date(currentIssue.createdAt).toLocaleString()}
							readOnly
						/>
					</div>

					<div className="form-group mb-0 flex flex-col gap-2">
						<label htmlFor="view-priority">Priority</label>
						<input id="view-priority" className="readonly-field w-full bg-slate-100" value={currentIssue.priority} readOnly />
					</div>

					<div className="form-group mb-0 flex flex-col gap-2">
						<label htmlFor="view-severity">Severity</label>
						<input id="view-severity" className="readonly-field w-full bg-slate-100" value={currentIssue.severity} readOnly />
					</div>

					<div className="form-group details-full-width mb-0 flex flex-col gap-2 md:col-span-2">
						<label htmlFor="view-description">Description</label>
						<textarea
							id="view-description"
							className="readonly-field w-full bg-slate-100"
							value={currentIssue.description}
							rows={descriptionRows}
							readOnly
						/>
					</div>
				</div>

				<div className="detail-meta-item mt-8 flex flex-col gap-3">
					<span className="detail-meta-label text-sm font-semibold uppercase tracking-wide text-slate-500">Status Actions</span>
					<div className="inline-actions flex flex-wrap gap-3">
						{statusOptions.map((status) => (
							<button
								key={status}
								type="button"
								className="detail-status-btn inline-flex items-center justify-center rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900 shadow-sm transition-colors hover:bg-blue-100 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-45 disabled:saturate-50"
								onClick={() => handleStatusUpdate(status)}
								disabled={status === currentIssue.status}
							>
								Mark {status}
							</button>
						))}
					</div>
				</div>

				<div className="form-actions-row detail-form-actions mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">
					<Link to={`/issues/${id}/edit`} className="btn btn-quiet inline-flex items-center justify-center px-5 py-3">
						Update Issue
					</Link>
					<button type="button" className="btn btn-danger inline-flex items-center justify-center border border-red-900 bg-red-900 px-5 py-3 text-red-50 transition-colors hover:bg-blue-100 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-45 disabled:saturate-50" onClick={handleDelete} disabled={actionLoading}>
						Delete
					</button>
				</div>
			</section>
		</section>
	);
}

export default IssueDetails;
