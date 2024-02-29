import { useState, useRef } from "react";

const TodoList = () => {
	const [tasks, setTasks] = useState(["Random Task 1", "Eat", "Code"]);
	const [newTask, setNewTask] = useState("");

	const dragItem = useRef(null);
	const dragOverItem = useRef(null);

	function handleInputChange(e) {
		setNewTask(e.target.value);
	}

	function addTask(e) {
		//remove whitespace & check for empty value
		if (newTask.trim() !== "") {
			setTasks((t) => [...t, newTask]);
			setNewTask("");
			e.preventDefault();
		}
	}

	function deleteTask(id) {
		const updatedTasks = tasks.filter((_, i) => i !== id);
		setTasks(updatedTasks);
	}

	//Prevents form submitting when task input is empty
	function handleSubmit(e) {
		e.preventDefault();
	}

	//Drag functions
	function handleSort() {
		let t = [...tasks];
		const draggedItemContent = t.splice(dragItem.current, 1)[0];
		t.splice(dragOverItem.current, 0, draggedItemContent);

		//reset refs
		dragItem.current = null;
		dragOverItem.current = null;

		//update array
		setTasks(t);
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label htmlFor="new-task-input" className="visually-hidden">
					Enter a new task
				</label>
				<input
					type="text"
					id="new-task-input"
					className="input"
					placeholder="Enter a new task"
					autoComplete="off"
					onChange={handleInputChange}
					value={newTask}
				/>
				<button type="submit" onClick={addTask}>
					Add Task
				</button>
			</form>

			<ul className="todos" aria-labelledby="list-heading">
				{tasks.map((task, id) => (
					<li key={id}>
						<div
							className="task-label-group"
							draggable
							onDragStart={() => (dragItem.current = id)}
							onDragEnter={() => (dragOverItem.current = id)}
							onDragEnd={handleSort}
							onDragOver={(e) => e.preventDefault}
						>
							<input type="checkbox" name="task" />
							<label htmlFor="task" className="task">
								{task}
							</label>
							<button
								className="delete-btn"
								onClick={() => deleteTask(id)}
							>
								Delete
								<span className="visually-hidden">{task}</span>
							</button>
						</div>
					</li>
				))}
			</ul>

			<div className="list-filters">
				<p className="items-left">{tasks.length} items left</p>

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
				>
					Clear Completed
					<span className="visually-hidden">Tasks</span>
				</button>
			</div>
		</>
	);
};

export default TodoList;
