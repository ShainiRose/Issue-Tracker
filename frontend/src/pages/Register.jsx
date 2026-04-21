import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, register } from "../store/slices/authSlice";
import { pushToast } from "../store/slices/toastSlice";

function Register() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, user } = useSelector((state) => state.auth);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [validationError, setValidationError] = useState("");

	useEffect(() => {
		if (user?.token) {
			navigate("/");
		}
	}, [user, navigate]);

	useEffect(() => {
		return () => {
			dispatch(clearAuthError());
		};
	}, [dispatch]);

	const handleChange = (event) => {
		setFormData((prev) => ({
			...prev,
			[event.target.name]: event.target.value
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setValidationError("");

		if (formData.password !== formData.confirmPassword) {
			setValidationError("Passwords do not match");
			return;
		}

		const action = await dispatch(
			register({
				name: formData.name,
				email: formData.email,
				password: formData.password
			})
		);

		if (register.fulfilled.match(action)) {
			dispatch(pushToast({ type: "success", message: "Account created" }));
			navigate("/");
		}
	};

	return (
		<section className="auth-page min-h-screen flex items-center justify-center p-4">
			<div className="auth-card w-full max-w-[400px] rounded-xl bg-white p-8 shadow-2xl">
				<h2 className="mb-4 text-center text-[1.75rem] font-semibold text-blue-700">Create Account</h2>
				<p className="mb-6 text-center text-sm text-slate-500">Start tracking your team issues in minutes</p>

				{validationError ? <div className="error-box mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">{validationError}</div> : null}
				{error ? <div className="error-box mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">{error}</div> : null}

				<form className="auth-form flex flex-col gap-6" onSubmit={handleSubmit}>
					<label htmlFor="name" className="flex flex-col gap-2">
						Name
						<input
							id="name"
							name="name"
							type="text"
							required
							value={formData.name}
							onChange={handleChange}
							className="w-full"
						/>
					</label>

					<label htmlFor="email" className="flex flex-col gap-2">
						Email
						<input
							id="email"
							name="email"
							type="email"
							required
							value={formData.email}
							onChange={handleChange}
							className="w-full"
						/>
					</label>

					<label htmlFor="password" className="flex flex-col gap-2">
						Password
						<input
							id="password"
							name="password"
							type="password"
							required
							minLength={6}
							value={formData.password}
							onChange={handleChange}
							className="w-full"
						/>
					</label>

					<label htmlFor="confirmPassword" className="flex flex-col gap-2">
						Confirm Password
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							minLength={6}
							value={formData.confirmPassword}
							onChange={handleChange}
							className="w-full"
						/>
					</label>

					<button type="submit" className="btn mt-2 w-full justify-center py-3 text-base" disabled={loading}>
						{loading ? "Creating account..." : "Register"}
					</button>
				</form>

				<p className="auth-switch mt-4 text-center text-sm text-slate-500">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</div>
		</section>
	);
}

export default Register;
