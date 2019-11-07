const nrc = require('node-run-cmd')
const electron = require('electron')
const { ipcRenderer, remote } = electron
const { dialog } = remote

let wait = ms => new Promise((r, j)=>setTimeout(r, ms))

async function waitCmd() {
	let pathBase = ''

	ipcRenderer.send('request-filepaths')
	const response = await ipcRenderer.on('response-filepaths', (e, item) => {
		pathBase = item[0]
		if(pathBase == undefined)
			dialog.showErrorBox('Error', 'A path must be submitted before cleaning')

		nrc.run('make clean', { cwd: pathBase, shell: true })
	})

	await wait(2000)
	return response
}

waitCmd().then(() => {
	ipcRenderer.send('endofClean')
})