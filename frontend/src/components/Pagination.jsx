function Pagination({ page, pages, onPageChange }) {
	if (!pages || pages <= 1) {
		return null;
	}

	const pageNumbers = [];
	for (let i = 1; i <= pages; i += 1) {
		pageNumbers.push(i);
	}

	return (
		<div className="pagination mt-8 flex flex-wrap items-center justify-center gap-2">
			<button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
				Prev
			</button>

			{pageNumbers.map((item) => (
				<button
					key={item}
					type="button"
					className={`rounded-md border px-3 py-2 text-sm font-medium ${
						item === page
							? "active border-blue-600 bg-blue-600 text-white"
							: "border-slate-300 bg-white text-slate-800 hover:bg-blue-600 hover:text-white"
					}`}
					onClick={() => onPageChange(item)}
				>
					{item}
				</button>
			))}

			<button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
				Next
			</button>
		</div>
	);
}

export default Pagination;
