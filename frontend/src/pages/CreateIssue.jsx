import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createIssue } from "../store/slices/issueSlice";
import { pushToast } from "../store/slices/toastSlice";

const initialForm = {
	title: "",
	description: "",
	severity: "Low",
	priority: "Low"
};

function CreateIssue() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const actionLoading = useSelector((state) => state.issues.actionLoading);

	const [formData, setFormData] = useState(initialForm);

	const handleChange = (event) => {
		setFormData((prev) => ({
			...prev,
			[event.target.name]: event.target.value
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const action = await dispatch(createIssue(formData));
		if (createIssue.fulfilled.match(action)) {
			dispatch(pushToast({ type: "success", message: "Issue created" }));
			navigate("/");
		}
	};

	return (
		<section className="detail-page app-shell mx-auto max-w-[980px] px-4 py-8">
			<div className="detail-header mb-8 flex items-start justify-between gap-6">
				<div className="detail-header-main flex flex-1 flex-col gap-3">
					<h2 className="text-3xl font-semibold text-white">Create New Issue Request</h2>
				</div>
			</div>

			<form className="detail-card mx-auto max-w-[700px] rounded-xl border border-slate-300/25 bg-white p-8 shadow-2xl" onSubmit={handleSubmit}>
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
						rows={6}
						required
						value={formData.description}
						onChange={handleChange}
						className="w-full resize-y"
					/>
				</div>

				<div className="split-fields grid gap-6 md:grid-cols-2">
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

				<div className="form-actions-row mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">
					<Link to="/" className="btn btn-quiet inline-flex items-center justify-center px-5 py-3">
						Cancel
					</Link>
					<button type="submit" className="btn inline-flex items-center justify-center px-5 py-3" disabled={actionLoading}>
						{actionLoading ? "Creating..." : "Create Issue"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default CreateIssue;
