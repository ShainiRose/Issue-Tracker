import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import { removeToast } from "../store/slices/toastSlice";

const iconMap = {
	success: FiCheckCircle,
	error: FiAlertCircle,
	info: FiInfo
};

const toastStyleMap = {
	success: "border-emerald-500 bg-emerald-50 text-emerald-900",
	error: "border-red-500 bg-red-50 text-red-900",
	info: "border-blue-500 bg-blue-50 text-blue-900"
};

function ToastContainer() {
	const dispatch = useDispatch();
	const toasts = useSelector((state) => state.toasts.items);

	useEffect(() => {
		if (!toasts.length) {
			return undefined;
		}

		const timers = toasts.map((toast) =>
			setTimeout(() => {
				dispatch(removeToast(toast.id));
			}, 3000)
		);

		return () => {
			timers.forEach((timer) => clearTimeout(timer));
		};
	}, [toasts, dispatch]);

	return (
		<div className="toast-stack fixed bottom-6 right-6 z-[100] flex max-w-[400px] flex-col gap-3">
			{toasts.map((toast) => {
				const Icon = iconMap[toast.type] || FiInfo;
				const toastTypeClass = toastStyleMap[toast.type] || toastStyleMap.info;
				return (
					<div key={toast.id} className={`toast flex items-start gap-3 rounded-lg border-l-4 px-5 py-4 shadow-xl ${toastTypeClass}`}>
						<Icon className="toast-icon mt-0.5 text-xl" />
						<div className="toast-content flex-1 text-sm leading-6">{toast.message}</div>
						<button
							type="button"
							className="toast-close flex-shrink-0 text-inherit transition-opacity hover:opacity-70"
							onClick={() => dispatch(removeToast(toast.id))}
						>
							<FiX />
						</button>
					</div>
				);
			})}
		</div>
	);
}

export default ToastContainer;
