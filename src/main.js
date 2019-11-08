const electron = require('electron')
const url = require('url')
const path = require('path')
const strg = require('electron-json-storage')
const os = require('os')

const { app, BrowserWindow, Menu, ipcMain, remote, shell, dialog } = electron

// SET ENV
process.env.NODE_ENV = 'development'

strg.setDataPath(os.tmpdir())

let mainWindow
let addWindow
let thirdWindow

// Listen for app to be ready
app.on('ready', () => {
	// Create new window
	mainWindow = new BrowserWindow({
		width: 800,
		height: 650,
        webPreferences: {
            nodeIntegration: true
		}
	})

	// Load html into window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'findFolders.html'),
		protocol: 'file:',
		slashes: true,
	}))

	// Close all windows when quit
	mainWindow.on('closed', () => {
		app.quit()
	})

	// Build menu from template
	let mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

	// Insert menu
	Menu.setApplicationMenu(mainMenu)
})

let filePaths = []
let flag_dont_save = 0

// Handle and create cleaner (addWindow)
function callCleanWindow() {
	// Create new window
	addWindow = new BrowserWindow({
		width: 200,
		height: 200,
		title: 'Calling cleaner process',
        webPreferences: {
            nodeIntegration: true
        }
	})

	// Load html into window
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'pages/Cleaner/cleaner.html'),
		protocol: 'file:',
		slashes: true,
	}))

	// Handle garbage collection
	addWindow.on('close', () => {
		addWindow = null
	})

	ipcMain.on('request-filepaths', () => {
		addWindow.webContents.send('response-filepaths', filePaths)
	})
}

// Redirect to instructions window
function callInstructionsWindow() {
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'pages/Docs/docs.html'),
		protocol: 'file:',
		slashes: true,
	}))
}

function callLastSettings() {
	strg.get('last', (err, data) => {
		if(err) throw err

		if(data.projPath !== undefined || data.libPath !== undefined) {
			filePaths = []
			filePaths.push(data.projPath)
			filePaths.push(data.libPath)

			flag_dont_save = 1

			mainWindow.webContents.send('fillPaths', filePaths)
			mainWindow.webContents.send('passDontSaveFlag', flag_dont_save)
		}
		else {
			dialog.showErrorBox('Error', "Last save couldn't be found")
		}
	})
}

function callLastProgram() {
	mainWindow.webContents.send('open-last')
}

function callLastFolder() {
	mainWindow.webContents.send('open-last-f')
}

// Load new main page
ipcMain.on('load-watcher', async (e, item) => {
	await mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'pages/Watcher/watcher.html'),
		protocol: 'file:',
		slashes: true,
	}))

	if(filePaths.length == 0)
		filePaths = item

	mainWindow.webContents.send('response-filepaths', filePaths)
})

// Catch endofClean
ipcMain.on('endofClean', () => {
	addWindow.close()
})

// Create menu template
const mainMenuTemplate = [
	{
		label: 'Home',
		accelerator: process.platform == 'darwin' ? 'Command+H' : 'Ctrl+H',
		click() {
			mainWindow.loadURL(url.format({
				pathname: path.join(__dirname, 'findFolders.html'),
				protocol: 'file:',
				slashes: true,
			}))
		}
	},
	{
		label: 'File',
		submenu: [
			{
				label: 'Load Last Settings',
				click() {
					callLastSettings()
				}
			},
			{
				label: 'Open Last Folder',
				click() {
					callLastFolder()
				}
			},
			{
				label: 'Open Last Program',
				accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
				click() {
					callLastProgram()
				}
			},
			{
				label: 'Call Cleaner',
				accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
				click() {
					callCleanWindow()
				}
			},
			{
				label: 'Exit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() {
					app.quit()
				}
			},
		]
	},
	{
		label: 'Help',
		submenu: [
			{
				label: 'Learn More',
				click() {
					shell.openExternal("https://github.com/coutlcdo/Automake-Electron")
				}
			},
			{
				label: 'See Instructions',
				click() {
					callInstructionsWindow()
				}
			}
		]
	},
]

// If mac, add empty object to menu
if(process.platform == 'darwin') {
	mainMenuTemplate.unshift({})
}

// Add developer tools if not in production
if(process.env.NODE_ENV != 'production') {
	mainMenuTemplate.push({
		label: 'View',
		submenu: [
			{
				role: 'reload',
			},
			{
				label: 'Toggle Developers Tools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools()
				}
			},
		]
	})
}