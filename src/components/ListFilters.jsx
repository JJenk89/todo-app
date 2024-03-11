const ListFilters = ({ task, clear }) => {
	return (
		<div className="list-filters">
			<p className="items-left">{task.length} items left</p>

			<button
				type="button"
				className="btn toggle-btn"
				aria-pressed="true"
			>
				<span className="visually-hidden">Show</span>
				All
				<span className="visually-hidden">Tasks</span>
			</button>

			<button
				type="button"
				className="btn toggle-btn"
				aria-pressed="true"
			>
				<span className="visually-hidden">Show</span>
				Active
				<span className="visually-hidden">Tasks</span>
			</button>

			<button
				type="button"
				className="btn toggle-btn"
				aria-pressed="true"
			>
				<span className="visually-hidden">Show</span>
				Completed
				<span className="visually-hidden">Tasks</span>
			</button>

			<button
				type="button"
				className="btn toggle-btn"
				aria-pressed="true"
				onClick={() => clear()}
			>
				Clear Completed
				<span className="visually-hidden">Tasks</span>
			</button>
		</div>
	);
};

export default ListFilters;
