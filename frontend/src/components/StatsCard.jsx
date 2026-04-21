function StatsCard({ title, value }) {
	const isInProgress = title === "In Progress";

	return (
		<article
			className={`stats-card relative overflow-hidden rounded-xl border p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl ${
				isInProgress
					? "border-sky-200/70 bg-white/80 hover:border-sky-300 hover:bg-white/80"
					: "border-transparent bg-white/80"
			}`}
		>
			<p className="text-sm text-slate-500">{title} Issues</p>
			<h3 className="mt-2 text-5xl font-bold leading-none text-blue-700">{value}</h3>
		</article>
	);
}

export default StatsCard;
