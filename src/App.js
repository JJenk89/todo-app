import Footer from "./components/Footer";
import Header from "./components/Header";
import "./index.css";
import TodoList from "./components/TodoList";
import { createContext, useState, useEffect } from "react";
export const ThemeContext = createContext(null);

function App() {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", (event) => {
				const colorScheme = event.matches ? "dark" : "light";
				setTheme(colorScheme);
			});
	}, []);

	const toggleTheme = () => {
		setTheme((curr) => (curr === "light" ? "dark" : "light"));
		document.body.classList.toggle("dark-body");
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<div className="App" id={theme}>
				<Header toggle={toggleTheme} theme={theme} />
				<TodoList />
				<Footer />
			</div>
		</ThemeContext.Provider>
	);
}

export default App;
