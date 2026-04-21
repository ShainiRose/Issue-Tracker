import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, login } from "../store/slices/authSlice";
import { pushToast } from "../store/slices/toastSlice";

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, user } = useSelector((state) => state.auth);

	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});

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
		const action = await dispatch(login(formData));

		if (login.fulfilled.match(action)) {
			dispatch(pushToast({ type: "success", message: "Welcome back!" }));
			navigate("/");
		}
	};

	return (
		<section className="auth-page min-h-screen flex items-center justify-center p-4">
			<div className="auth-card w-full max-w-[400px] rounded-xl bg-white p-8 shadow-2xl">
				<h1 className="mb-4 text-center text-3xl font-semibold text-blue-700">Welcome Back</h1>
				<p className="mb-6 text-center text-sm text-slate-500">Sign in to continue managing your issues</p>

				{error ? <div className="error-box mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">{error}</div> : null}

				<form className="auth-form flex flex-col gap-6" onSubmit={handleSubmit}>
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
							value={formData.password}
							onChange={handleChange}
							className="w-full"
						/>
					</label>

					<button type="submit" className="btn mt-2 w-full justify-center py-3 text-base" disabled={loading}>
						{loading ? "Signing in..." : "Login"}
					</button>
				</form>

				<p className="auth-switch mt-4 text-center text-sm text-slate-500">
					No account? <Link to="/register">Create one</Link>
				</p>
			</div>
		</section>
	);
}

export default Login;
