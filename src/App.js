import Footer from "./components/Footer";
import Header from "./components/Header";
import "./index.css";
import TodoList from "./components/TodoList";
import { createContext, useState, useEffect } from "react";
export const ThemeContext = createContext(null);

function App() {
	const htmlBody = document.body;

	const savedTheme = localStorage.getItem("theme")
		? JSON.parse(localStorage.getItem("theme"))
		: "light";

	const savedBodyTheme = localStorage.getItem("bodyTheme")
		? JSON.parse(localStorage.getItem("bodyTheme"))
		: "l-body";

	const [theme, setTheme] = useState(savedTheme);
	const [bodyTheme, setBodyTheme] = useState(savedBodyTheme);

	useEffect(() => {
		let storedTheme = localStorage.setItem("theme", JSON.stringify(theme));

		if (storedTheme) {
			setTheme(storedTheme);
		}
	}, [theme]);

	useEffect(() => {
		let storedBodyTheme = localStorage.setItem(
			"bodyTheme",
			JSON.stringify(bodyTheme)
		);

		if (storedBodyTheme) {
			setBodyTheme(storedBodyTheme);
		} else if (!storedBodyTheme) {
			htmlBody.classList.add(bodyTheme);
		}
	}, [bodyTheme, htmlBody]);

	const toggleTheme = () => {
		setTheme((curr) => (curr === "light" ? "dark" : "light"));
		setBodyTheme((curr) => (curr === "l-body" ? "dark-body" : "l-body"));

		if (theme === "light") {
			htmlBody.classList.add("dark-body");
			htmlBody.classList.remove("l-body");
		} else if (theme === "dark") {
			htmlBody.classList.add("l-body");
			htmlBody.classList.remove("dark-body");
		}
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
