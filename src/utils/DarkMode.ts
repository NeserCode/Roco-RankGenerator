// tailwind dark mode
function initialDarkMode() {
	const darkMode = localStorage.getItem("roco-dark-mode")
	if (darkMode === "true") {
		document.documentElement.classList.add("dark")
	} else {
		document.documentElement.classList.remove("dark")
	}
}

function toggleDarkMode(dark?: boolean) {
	if (dark === undefined)
		dark = !document.documentElement.classList.contains("dark")

	if (dark) document.documentElement.classList.add("dark")
	else document.documentElement.classList.remove("dark")

	// Storage
	localStorage.setItem("roco-dark-mode", dark ? "true" : "false")
}

export { initialDarkMode, toggleDarkMode }
