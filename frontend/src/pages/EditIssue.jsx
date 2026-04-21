import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editIssue, fetchIssueById } from "../store/slices/issueSlice";
import { pushToast } from "../store/slices/toastSlice";

function EditIssue() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { detailsLoading, actionLoading } = useSelector((state) => state.issues);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		severity: "Low",
		priority: "Low",
		status: "Open"
	});
	const [createdAt, setCreatedAt] = useState("");

	useEffect(() => {
		dispatch(fetchIssueById(id))
			.unwrap()
			.then((issue) => {
				setFormData({
					title: issue.title,
					description: issue.description,
					severity: issue.severity,
					priority: issue.priority,
					status: issue.status
				});
				setCreatedAt(issue.createdAt || "");
			})
			.catch(() => {});
	}, [dispatch, id]);

	const handleChange = (event) => {
		setFormData((prev) => ({
			...prev,
			[event.target.name]: event.target.value
		}));
	};

	const descriptionRows = Math.max(3, (formData.description || "").split("\n").length + 1);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const action = await dispatch(editIssue({ id, payload: formData }));
		if (editIssue.fulfilled.match(action)) {
			dispatch(pushToast({ type: "success", message: "Issue updated" }));
			navigate(`/issues/${id}`);
		}
	};

	if (detailsLoading) {
		return <div className="panel mx-auto rounded-xl bg-white p-6 shadow-md">Loading issue...</div>;
	}

	return (
		<section className="detail-page app-shell mx-auto max-w-[980px] px-4 py-8 edit-page">
			<div className="detail-header mb-8 flex items-start justify-between gap-6">
				<div className="detail-header-main flex flex-1 flex-col gap-3">
					<h2 className="text-3xl font-semibold text-white">Update Issue</h2>
					<div className="detail-quick-meta grid gap-3 md:grid-cols-2">
						<div className="detail-meta-chip rounded-xl border border-blue-200/30 bg-slate-950/20 p-3">
							<span className="block text-xs font-medium tracking-wide text-blue-200">Status</span>
							<strong className="mt-1 block text-base font-medium text-blue-50">{formData.status}</strong>
						</div>
						<div className="detail-meta-chip rounded-xl border border-blue-200/30 bg-slate-950/20 p-3">
							<span className="block text-xs font-medium tracking-wide text-blue-200">Created At</span>
							<strong className="mt-1 block text-base font-medium text-blue-50">
								{createdAt ? new Date(createdAt).toLocaleString() : "-"}
							</strong>
						</div>
					</div>
				</div>
			</div>

			<form className="detail-card rounded-xl border border-slate-300/25 bg-white p-8 shadow-2xl" onSubmit={handleSubmit}>
				<h2 className="mb-6 text-2xl font-semibold text-slate-900">Issue Information</h2>

				<div className="form-group mb-6 flex flex-col gap-2">
					<label htmlFor="title">Title</label>
					<input
						id="title"
						name="title"
						type="text"
						required
						value={formData.title}
						onChange={handleChange}
						className="w-full"
					/>
				</div>

				<div className="form-group mb-6 flex flex-col gap-2">
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						name="description"
						rows={descriptionRows}
						required
						value={formData.description}
						onChange={handleChange}
						className="w-full resize-y"
					/>
				</div>

				<div className="split-fields grid gap-6 md:grid-cols-3">
					<div className="form-group mb-6 flex flex-col gap-2">
						<label htmlFor="status">Status</label>
						<select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full">
							<option value="Open">Open</option>
							<option value="In Progress">In Progress</option>
							<option value="Resolved">Resolved</option>
							<option value="Closed">Closed</option>
						</select>
					</div>

					<div className="form-group mb-6 flex flex-col gap-2">
						<label htmlFor="priority">Priority</label>
						<select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="w-full">
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
						</select>
					</div>

					<div className="form-group mb-6 flex flex-col gap-2">
						<label htmlFor="severity">Severity</label>
						<select id="severity" name="severity" value={formData.severity} onChange={handleChange} className="w-full">
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
						</select>
					</div>
				</div>

				<div className="form-actions-row mt-4 flex justify-end gap-3">
					<Link to={`/issues/${id}`} className="btn btn-quiet inline-flex items-center justify-center px-5 py-3">
						Cancel
					</Link>
					<button type="submit" className="btn inline-flex items-center justify-center px-5 py-3" disabled={actionLoading}>
						{actionLoading ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default EditIssue;
