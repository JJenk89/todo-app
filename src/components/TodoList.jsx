import { useState, useRef } from "react";
import ListFilters from "./ListFilters";

const TodoList = () => {
	//STATE
	const [tasks, setTasks] = useState([
		{ id: 0, name: "Random Task 1", check: true },
		{ id: 1, name: "Eat", check: true },
		{ id: 2, name: "Code", check: true },
	]);
	const [newTask, setNewTask] = useState("");
	const [checkedState, setCheckedState] = useState(
		new Array(tasks.length).fill(false)
	);

	//REFS
	const dragItem = useRef(null);
	const dragOverItem = useRef(null);

	function handleOnCheck(position) {
		//Allows individual checking of boxes
		const updateCheckedState = checkedState.map((task, index) =>
			index === position ? !task : task
		);

		setCheckedState(updateCheckedState);
	}

	function handleInputChange(e) {
		setNewTask(e.target.value);
	}

	function addTask(e) {
		//remove whitespace & check for empty value
		if (newTask.trim() !== "") {
			setTasks((t) => [...t, newTask]);
			setNewTask("");
			setCheckedState((t) => [...t, false]);
			e.preventDefault();
		}
	}

	function deleteTask(id) {
		//Updated tasks array and deletes based on id
		const updatedTasks = tasks.filter((_, i) => i !== id);
		setTasks(updatedTasks);

		//Updates checkbox array and filters deletes tasks based on id
		const updatedCheckedState = checkedState.filter((_, i) => i !== id);
		setCheckedState(updatedCheckedState);
	}

	//Prevents form submitting when task input is empty
	function handleSubmit(e) {
		e.preventDefault();
	}

	//Drag functions
	function handleSort() {
		let t = [...tasks];
		let c = [...checkedState];
		const draggedItemContent = t.splice(dragItem.current, 1)[0];
		t.splice(dragOverItem.current, 0, draggedItemContent);

		const draggedCheckedContent = c.splice(dragItem.current, 1)[0];
		c.splice(dragOverItem.current, 0, draggedCheckedContent);

		//reset refs
		dragItem.current = null;
		dragOverItem.current = null;

		//update array
		setTasks(t);
		setCheckedState(c);
	}

	//List filter functions TODO: PASS TO COMPONENT AS PROPS
	function handleClearCompleted(id) {
		const clearedTasks = [];
		setTasks(clearedTasks);
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
							<input
								type="checkbox"
								name="task"
								id="taskBox"
								checked={checkedState[id]}
								onChange={() => handleOnCheck(id)}
							/>
							<label htmlFor="task" className="task">
								{checkedState[id] ? <del>{task}</del> : task}
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

			<ListFilters
				task={tasks}
				clear={handleClearCompleted}
				checked={checkedState}
			/>
		</>
	);
};

export default TodoList;
