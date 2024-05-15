import { useState, useRef, useEffect } from "react";
import ListFilters from "./ListFilters";

let filteredActiveArray = [{}];
let filteredCompleteArray = [{}];

const TodoList = () => {
	//STATE
	const retrievedTasks = JSON.parse(localStorage.getItem("tasks"));

	const [tasks, setTasks] = useState(retrievedTasks);
	const [newTask, setNewTask] = useState("");
	const [filteredActiveTasks, setFilteredActiveTasks] =
		useState(filteredActiveArray);
	const [filteredCompleteTasks, setFilteredCompleteTasks] = useState(
		filteredCompleteArray
	);
	const [button, setButton] = useState("all");

	//REFS
	const dragItem = useRef(null);
	const dragOverItem = useRef(null);

	//SAVE & RETRIEVE LISTS USING USEREF HOOK
	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}, [tasks]);

	//FUNCTIONS
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

	//FIX ID ASSIGNEMENT BUG//
	function addTask(e) {
		//remove whitespace & check for empty value
		const addedTask = {
			name: newTask,
			id: crypto.randomUUID(),
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
	function handleClearCompleted() {
		const clearedTasks = tasks.filter((task) => task.check !== true);
		setTasks(clearedTasks);
	}

	function handleShowCompleted() {
		const filteredCompletes = tasks.filter((task) => task.check === true);
		setFilteredCompleteTasks(filteredCompletes);
		setButton("completed");
	}

	function handleShowActive() {
		const filteredActives = tasks.filter((task) => task.check === false);
		setFilteredActiveTasks(filteredActives);
		setButton("active");
	}

	function handleShowAll() {
		const newAllTasks = [...tasks];
		setTasks(newAllTasks);
		setButton("all");
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
					<span className="visually-hidden">{task.name}</span>
				</button>
			</div>
		</li>
	));

	const activeTasks = filteredActiveTasks.map((task, id) => (
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
					<span className="visually-hidden">{task.name}</span>
				</button>
			</div>
		</li>
	));

	const completedTasks = filteredCompleteTasks.map((task, id) => (
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
					<span className="visually-hidden">{task.name}</span>
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
				{button === "all" && taskDataItems}
				{button === "active" && activeTasks}
				{button === "completed" && completedTasks}
			</ul>

			<ListFilters
				task={tasks}
				clear={handleClearCompleted}
				showComplete={handleShowCompleted}
				showActive={handleShowActive}
				showAll={handleShowAll}
			/>
		</>
	);
};

export default TodoList;
