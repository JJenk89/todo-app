const TaskInput = ({ handleSubmit, handleInputChange, newTask, addTask }) => {
	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="new-task-input" className="visually-hidden">
				Enter a new task
			</label>
			<input
				type="text"
				id="new-task-input"
				className="input"
				placeholder="Create a new task..."
				autoComplete="off"
				onChange={handleInputChange}
				value={newTask}
			/>
			<button type="submit" onClick={addTask}></button>
		</form>
	);
};

export default TaskInput;
