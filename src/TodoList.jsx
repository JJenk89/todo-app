const TodoList = (props) => {
	return (
		<ul className="todos">
			<li>{props.taskName}</li>
			<li>Item 1</li>
		</ul>
	);
};

export default TodoList;
