import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronDown, FiClipboard, FiHome, FiLogOut, FiPlusCircle } from "react-icons/fi";
import { logout } from "../store/slices/authSlice";
import { pushToast } from "../store/slices/toastSlice";

function Navbar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const menuRef = useRef(null);
	const user = useSelector((state) => state.auth.user);
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	const isDashboard = location.pathname === "/";
	const initials = (user?.name || "User")
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0].toUpperCase())
		.join("");

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleLogout = () => {
		dispatch(logout());
		dispatch(pushToast({ type: "info", message: "Logged out successfully" }));
		setIsOpen(false);
		navigate("/login");
	};

	return (
		<header
			className={`top-nav sticky top-0 z-[100] flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4 shadow-md backdrop-blur-md transition-colors duration-300 ${
				isScrolled
					? "border-white/40 bg-white/65"
					: "border-slate-200 bg-white"
			}`}
		>
			<div className="brand-wrap flex items-center gap-3.5">
				<FiClipboard className="brand-icon text-[1.8rem] text-blue-700" />
				<div>
					<h1 className="text-2xl font-semibold text-blue-700">Issue Tracker</h1>
					<p className="text-xs text-slate-500">Track, prioritize, and resolve faster</p>
				</div>
			</div>

			<div className="nav-actions flex items-center gap-3">
				<Link to="/" className="btn btn-quiet inline-flex items-center gap-2">
					<FiHome />
					Dashboard
				</Link>

				{isDashboard ? (
					<Link to="/issues/new" className="btn inline-flex items-center gap-2">
						<FiPlusCircle />
						Create Issue
					</Link>
				) : null}

				<div className="profile-menu relative" ref={menuRef}>
					<button
						type="button"
						className={`profile-trigger inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3.5 py-2 font-semibold text-blue-900 transition-shadow hover:shadow-md ${isOpen ? "ring-2 ring-blue-200" : ""}`}
						onClick={() => setIsOpen((prev) => !prev)}
					>
						<span className="profile-avatar inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-800 to-blue-600 text-xs font-bold text-white">{initials}</span>
						<FiChevronDown className={`profile-chevron transition-transform ${isOpen ? "rotate-180" : ""}`} />
					</button>

					{isOpen ? (
						<div className="profile-dropdown absolute right-0 top-full z-20 mt-2 min-w-[150px] rounded-lg border border-slate-200 bg-white p-1 shadow-xl">
							<div className="profile-dropdown-head mb-1 flex flex-col gap-0.5 border-b border-slate-200 px-2.5 pb-2 pt-2">
								<strong>{user?.name || "User"}</strong>
								<span>{user?.email || ""}</span>
							</div>
							<button type="button" className="profile-item inline-flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left font-semibold text-red-700 hover:bg-red-50" onClick={handleLogout}>
								<FiLogOut />
								Logout
							</button>
						</div>
					) : null}
				</div>
			</div>
		</header>
	);
}

export default Navbar;
