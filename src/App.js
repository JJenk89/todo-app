import Footer from "./components/Footer";
import Header from "./components/Header";
import "./index.css";
import TodoList from "./components/TodoList";

function App() {
	return (
		<div className="App">
			<Header />
			<div className="wrapper">
				<TodoList />
			</div>
			<Footer />
		</div>
	);
}

export default App;
