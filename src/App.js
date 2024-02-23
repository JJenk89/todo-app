import Footer from "./Footer";
import Header from "./Header";
import "./index.css";
import TodoList from "./TodoList";

function App() {
	return (
		<div className="App">
			<Header />
			<div className="wrapper">
				<TodoList taskName="random task" />
				<section className="listStates">
					items left | All | Active | Completed | Clear Completed
				</section>
			</div>
			<p>Drag and drop to reorder list</p>

			<Footer />
		</div>
	);
}

export default App;
