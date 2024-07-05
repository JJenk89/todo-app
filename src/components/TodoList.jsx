import { useState, useEffect } from "react";
import ListFilters from "./ListFilters";

let filteredActiveArray = [{}];
let filteredCompleteArray = [{}];

const TodoList = () => {
	//STATE

	const retrievedTasks = localStorage.getItem("tasks")
		? JSON.parse(localStorage.getItem("tasks"))
		: [];

	const [tasks, setTasks] = useState(retrievedTasks);
	const [newTask, setNewTask] = useState("");
	const [filteredActiveTasks, setFilteredActiveTasks] =
		useState(filteredActiveArray);
	const [filteredCompleteTasks, setFilteredCompleteTasks] = useState(
		filteredCompleteArray
	);
	const [button, setButton] = useState("all");
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [draggingItemIndex, setDraggingItemIndex] = useState(null);
	const [draggingItemTouchIndex, setDraggingItemTouchIndex] = useState(null);

	//REFS

	//SAVE & RETRIEVE LISTS USING USEREF HOOK

	useEffect(() => {
		let storedTasks = JSON.parse(localStorage.getItem("tasks"));
		if (storedTasks) {
			setTasks(storedTasks);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}, [tasks]);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

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

	//List filter functions TODO: PASS TO COMPONENT AS PROPS
	function handleClearCompleted() {
		const clearedTasks = tasks.filter((task) => task.check !== true);
		setTasks(clearedTasks);
		setFilteredCompleteTasks(clearedTasks);
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

	////////////////////////////////
	/////// DRAG FUNCTIONS ////////
	////////////////////////////////

	const handleDragStart = (e, id) => {
		setDraggingItemIndex(id);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (id) => {
		if (draggingItemIndex === id) return;
		const newItems = [...tasks];
		const draggingItem = newItems[draggingItemIndex];
		newItems.splice(draggingItemIndex, 1);
		newItems.splice(id, 0, draggingItem);
		setDraggingItemIndex(id);
		setTasks(newItems);
	};

	const handleDragEnd = () => {
		setDraggingItemIndex(null);
	};

	////////////////////////////////
	// TOUCHSCREEN DRAG FUNCTIONS //
	////////////////////////////////

	function handleTouchStart(id) {
		console.log(`touched ${id}`);
		setDraggingItemTouchIndex(id);
	}

	function handleTouchMove(e) {
		const touchLocation = e.targetTouches[0];
		const target = document.elementFromPoint(
			touchLocation.clientX,
			touchLocation.clientY
		);
		if (!target) return;

		const targetIndex = Number(target.getAttribute("data-index"));
		if (!isNaN(targetIndex) && draggingItemTouchIndex !== targetIndex) {
			const newItems = [...tasks];
			const draggingItem = newItems[draggingItemTouchIndex];
			newItems.splice(draggingItemTouchIndex, 1);
			newItems.splice(targetIndex, 0, draggingItem);
			setDraggingItemTouchIndex(targetIndex);
			setTasks(newItems);
		}
	}

	function handleTouchEnd() {
		console.log(`released`);
		setDraggingItemTouchIndex(null);
	}

	const taskDataItems = tasks.map((task, id) => (
		<li key={task.id}>
			<div
				className="task-label-group"
				data-index={id}
				draggable
				onDragStart={(e) => handleDragStart(e, id)}
				/* 				onDragEnter={() => (dragOverItem.current = id)}
				 */ onDragEnd={handleDragEnd}
				onDragOver={() => handleDragOver(id)}
				onTouchStart={() => handleTouchStart(id)}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<label htmlFor={task.id} className="checkbox-container">
					<input
						type="checkbox"
						name="task"
						id={task.id}
						checked={task.check}
						onChange={() => handleOnCheck(task.id)}
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="11"
						height="9"
						viewBox="-5 -4 22 18"
						className={`checkbox ${
							task.check ? "checkbox--active" : ""
						}`}
					>
						<path
							fill="none"
							stroke={task.check ? "#fff" : "none"}
							strokeWidth="2"
							d="M1 4.304L3.696 7l6-6"
							className="check"
						/>
					</svg>
					<span htmlFor="task" className="task">
						{task.check ? <del>{task.name}</del> : task.name}
					</span>
				</label>

				<button className="delete-btn" onClick={() => deleteTask(id)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						transform="scale(0.6)"
					>
						<path
							fill="#494C6B"
							fillRule="evenodd"
							d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
						/>
					</svg>
					<span className="visually-hidden"> delete {task.name}</span>
				</button>
			</div>
		</li>
	));

	const activeTasks = filteredActiveTasks.map((task, id) => (
		<li key={task.id}>
			<div
				className="task-label-group"
				data-index={id}
				draggable
				onDragStart={(e) => handleDragStart(e, id)}
				/* 				onDragEnter={() => (dragOverItem.current = id)}
				 */ onDragEnd={handleDragEnd}
				onDragOver={() => handleDragOver(id)}
				onTouchStart={() => handleTouchStart(id)}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<label htmlFor={task.id} className="checkbox-container">
					<input
						type="checkbox"
						name="task"
						id={task.id}
						checked={task.check}
						onChange={() => handleOnCheck(task.id)}
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="11"
						height="9"
						viewBox="-5 -4 22 18"
						className={`checkbox ${
							task.check ? "checkbox--active" : ""
						}`}
					>
						<path
							fill="none"
							stroke={task.check ? "#fff" : "none"}
							strokeWidth="2"
							d="M1 4.304L3.696 7l6-6"
							className="check"
						/>
					</svg>
					<span htmlFor="task" className="task">
						{task.check ? <del>{task.name}</del> : task.name}
					</span>
				</label>

				<button className="delete-btn" onClick={() => deleteTask(id)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						transform="scale(0.6)"
					>
						<path
							fill="#494C6B"
							fillRule="evenodd"
							d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
						/>
					</svg>
					<span className="visually-hidden"> delete {task.name}</span>
				</button>
			</div>
		</li>
	));

	const completedTasks = filteredCompleteTasks.map((task, id) => (
		<li key={task.id}>
			<div
				className="task-label-group"
				data-index={id}
				draggable
				onDragStart={(e) => handleDragStart(e, id)}
				/* 				onDragEnter={() => (dragOverItem.current = id)}
				 */ onDragEnd={handleDragEnd}
				onDragOver={() => handleDragOver(id)}
				onTouchStart={() => handleTouchStart(id)}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<label htmlFor={task.id} className="checkbox-container">
					<input
						type="checkbox"
						name="task"
						id={task.id}
						checked={task.check}
						onChange={() => handleOnCheck(task.id)}
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="11"
						height="9"
						viewBox="-5 -4 22 18"
						className={`checkbox ${
							task.check ? "checkbox--active" : ""
						}`}
					>
						<path
							fill="none"
							stroke={task.check ? "#fff" : "none"}
							strokeWidth="2"
							d="M1 4.304L3.696 7l6-6"
							className="check"
						/>
					</svg>
					<span htmlFor="task" className="task">
						{task.check ? <del>{task.name}</del> : task.name}
					</span>
				</label>

				<button className="delete-btn" onClick={() => deleteTask(id)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						transform="scale(0.6)"
					>
						<path
							fill="#494C6B"
							fillRule="evenodd"
							d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
						/>
					</svg>
					<span className="visually-hidden"> delete {task.name}</span>
				</button>
			</div>
		</li>
	));

	return (
		<div className="wrapper">
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

			<ul className="todos" aria-labelledby="list-heading">
				{button === "all" && taskDataItems}
				{button === "active" && activeTasks}
				{button === "completed" && completedTasks}

				{windowSize.width < 600 ? (
					<div className="items-left-clear">
						<p className="items-left">{tasks.length} items left</p>

						<button
							type="button"
							className="btn toggle-btn clear-completed-btn"
							aria-pressed="true"
							onClick={handleClearCompleted}
						>
							Clear Completed
							<span className="visually-hidden">Tasks</span>
						</button>
					</div>
				) : (
					<div className="items-left-clear">
						<p className="items-left">{tasks.length} items left</p>
						<ListFilters
							showComplete={handleShowCompleted}
							showActive={handleShowActive}
							showAll={handleShowAll}
						/>
						<button
							type="button"
							className="btn toggle-btn clear-completed-btn"
							aria-pressed="true"
							onClick={handleClearCompleted}
						>
							Clear Completed
							<span className="visually-hidden">Tasks</span>
						</button>
					</div>
				)}
			</ul>

			{windowSize.width < 600 ? (
				<ListFilters
					showComplete={handleShowCompleted}
					showActive={handleShowActive}
					showAll={handleShowAll}
				/>
			) : null}
			<p className="dnd-instruction">Drag and drop to reorder list</p>
		</div>
	);
};

export default TodoList;
