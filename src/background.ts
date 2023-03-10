"use strict"

import { app, protocol, BrowserWindow, globalShortcut, Menu } from "electron"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"
const isDevelopment = process.env.NODE_ENV !== "production"

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
])

async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		title: "Roco Battle Generator Beta",
		resizable: false,
		webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: process.env
				.ELECTRON_NODE_INTEGRATION as unknown as boolean,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
			enableRemoteModule: true,
		},
	})

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
	} else {
		createProtocol("app")
		// Load the index.html when not in development
		win.loadURL("app://./index.html")
	}

	globalShortcut.register("CommandOrControl+E", () => {
		if (win.isFocused()) {
			win.webContents.openDevTools()
		} else win.webContents.closeDevTools()
	})
	globalShortcut.register("CommandOrControl+Q", () => {
		if (win.isFocused()) win.webContents.reload()
	})
	globalShortcut.register("CommandOrControl+D", () => {
		if (win.isFocused()) win.webContents.send("dark-mode")
	})

	// Menu bar
	const template = [
		{
			label: "应用",
			submenu: [
				{
					label: "重新加载",
					click: function () {
						win.webContents.reload()
					},
				},
				{
					label: "退出",
					click: function () {
						app.quit()
					},
				},
			],
		},
		{
			label: "其他",
			submenu: [
				// { type: "separator" },
				{
					label: "切换夜间模式",
					click: () => {
						win.webContents.send("dark-mode")
					},
				},
			],
		},
	]
	// @ts-ignore
	Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
	createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data: string) => {
			if (data === "graceful-exit") {
				app.quit()
			}
		})
	} else {
		process.on("SIGTERM", () => {
			app.quit()
		})
	}
}
