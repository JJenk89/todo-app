import { useState, useRef } from "react";
import ListFilters from "./ListFilters";
let taskItems = [
	{ id: 0, name: "Random Task 1", check: false },
	{ id: 1, name: "Eat", check: false },
	{ id: 2, name: "Code", check: false },
];
const TodoList = () => {
	//STATE

	const [tasks, setTasks] = useState(taskItems);
	const [newTask, setNewTask] = useState("");

	//REFS
	const dragItem = useRef(null);
	const dragOverItem = useRef(null);

	function handleOnCheck(id) {
		//Allows individual checking of boxes
		const clonedTasks = [...tasks];
		setTasks(
			clonedTasks.map((t) =>
				t.id === id ? { ...t, check: !t.check } : t
			)
		);
	}

	function handleInputChange(e) {
		setNewTask(e.target.value);
	}

	function addTask(e, text) {
		let idCount = tasks.length;
		//remove whitespace & check for empty value
		const addedTask = {
			name: newTask,
			id: idCount++,
			check: false,
		};

		if (newTask.trim() !== "") {
			setTasks([...tasks, addedTask]);
			setNewTask("");
			e.preventDefault();
		}
	}

	function deleteTask(id) {
		//Updated tasks array and deletes based on id
		const updatedTasks = tasks.filter((_, i) => i !== id);
		setTasks(updatedTasks);

		//Updates checkbox array and filters deletes tasks based on id
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

	//List filter functions TODO: PASS TO COMPONENT AS PROPS
	function handleClearCompleted(id) {
		const clearedTasks = [];
		setTasks(clearedTasks);
	}

	const taskDataItems = tasks.map((task, id) => (
		<li key={task.id}>
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
					checked={task.check}
					onChange={() => handleOnCheck(task.id)}
				/>
				<label htmlFor="task" className="task">
					{task.check ? <del>{task.name}</del> : task.name}
				</label>
				<button className="delete-btn" onClick={() => deleteTask(id)}>
					Delete
					<span className="visually-hidden">{taskItems.name}</span>
				</button>
			</div>
		</li>
	));

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
				{taskDataItems}
			</ul>

			<ListFilters task={tasks} clear={handleClearCompleted} />
		</>
	);
};

export default TodoList;
