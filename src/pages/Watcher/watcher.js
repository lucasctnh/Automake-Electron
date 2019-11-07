const chokidar = require('chokidar')
const nrc = require('node-run-cmd')

const electron = require('electron')
const { ipcRenderer, shell, remote } = electron
const { dialog } = remote

const name = document.getElementById('cpr')
name.onclick = openGit

function openGit() {
	shell.openExternal("https://github.com/coutlcdo")
}

const fs = require('fs')
const path = require('path')
const url = require('url')

let proj = ''

let pathBase = ''
let pathLib = ''
let allegroV = ''

function rewritePathOnScreen() {
	const ul2 = document.getElementById('ul2')
	const path1 = document.createElement('li')
	const path2 = document.createElement('li')
	if(pathBase !== '' && pathLib !== '') {
		ul2.innerHTML = ''
		const pathText1 = document.createTextNode(`Project folder = ${pathBase}`)
		const pathText2 = document.createTextNode(`Library folder = ${pathLib}`)

		path1.appendChild(pathText1)
		path2.appendChild(pathText2)
		ul2.appendChild(path1)
		ul2.appendChild(path2)
	} else {
		ul2.innerHTML = ''
		const pathText1 = document.createTextNode('No paths were found')

		path1.appendChild(pathText1)
		ul2.appendChild(path1)
	}
}
rewritePathOnScreen()

ipcRenderer.on('response-filepaths', (e, item) => {
	pathBase = item[0]
	pathLib = item[1]
	if(pathBase == undefined || pathLib.length == undefined) {
		dialog.showErrorBox('Error', 'One or more paths are missing.')

		remote.getCurrentWindow().loadURL(url.format({
			pathname: path.join(__dirname, '../../findFolders.html'),
			protocol: 'file:',
			slashes: true,
		}))

		return
	}

	for(let i=0;i<pathLib.length;i++) {
		if(pathLib[i] == '5') {
			allegroV = pathLib.slice(i, i+6)
		}
	}

	rewritePathOnScreen()

	let watcher = chokidar.watch(pathBase, { ignored: /Makefile/, ignoreInitial: true, persistent: true })

	watcher
		.on('add', file_path => {
			const ul = document.querySelector('ul')
			ul.innerHTML = ''

			const li = document.createElement('li')
			const itemText = document.createTextNode(file_path)

			li.appendChild(itemText)
			ul.appendChild(li)
		})
		.on('change', file_path => {
			let file = path.basename(file_path)
			let extension = path.extname(file)
			let filename = path.basename(file, extension)

			proj = filename

			let data = `# Name of the project
PROJ_NAME=${proj}
PROJ_EXE=$(PROJ_NAME).exe

# Allegro inclusion
PATH_ALLEGRO=${pathLib}
LIB_ALLEGRO=\\lib\\liballegro-${allegroV}-monolith-mt.a
INCLUDE_ALLEGRO=\\include

# .c file
C_SOURCE=$(PROJ_NAME).c

# Object file
OBJ=$(C_SOURCE:.c=.o)

# Compiler
CC=gcc

#
# Compilation and linking
#
all: $(PROJ_EXE)

$(PROJ_EXE): $(OBJ)
	$(CC) -o $@ $^ $(PATH_ALLEGRO)$(LIB_ALLEGRO)

$(OBJ): $(C_SOURCE)
	$(CC) -I $(PATH_ALLEGRO)$(INCLUDE_ALLEGRO) -c $<

clean:
	del *.o *.exe`

			fs.writeFile(`${pathBase}/Makefile`, data, function (err) {
				if (err) throw err

				const ul = document.getElementById('ul1')
				ul.innerHTML = ''

				const li = document.createElement('li')
				const itemText = document.createTextNode('Saved! Compiling...')

				li.appendChild(itemText)
				ul.appendChild(li)

				setTimeout(() => {
					let flag_error = 0;

					showError = (data) => {
						ul.innerHTML = ''

						console.log(data)
						flag_error = 1;

						const li = document.createElement('li')
						const itemText = document.createTextNode(`${data}`)

						li.appendChild(itemText)
						ul.appendChild(li)

						const content = document.getElementById('cont')
						if(data.length > 1200) {
							content.setAttribute('class', 'dcontent alertError')

							const cpr = document.getElementById('cpr')
							cpr.setAttribute('class', 'made-by-rel')
						}
						else
							content.setAttribute('class', 'content alertError')

						dialog.showErrorBox('Error', 'Compilation has failed. Details are shown on app.')
					}
					nrc.run('make', { cwd: pathBase, shell: true, onError: showError })

					if(flag_error == 0) {
						ul.innerHTML = ''
						const content = document.getElementById('cont')
						content.setAttribute('class', 'content')
						const cpr = document.getElementById('cpr')
						cpr.setAttribute('class', 'made-by-abs')

						const li = document.createElement('li')
						const itemText = document.createTextNode('Finished compilation! Waiting for new changes...')

						li.appendChild(itemText)
						ul.appendChild(li)
					}
				}, 1000)
			})
		})
		.on('error', error => console.error(`Watcher error: ${error}`))

	ipcRenderer.on('open-last', (e) => {
		if(proj === '')
			dialog.showErrorBox('Error', 'No projects were compiled.')
		else
			nrc.run(`${proj}.exe`, { cwd: pathBase, shell: false, onError: showError })
	})
	ipcRenderer.on('open-last-f', (e) => {
		if(proj === '')
			dialog.showErrorBox('Error', 'No projects were compiled.')
		else {
			let fullPath = pathBase + '/' + proj + '.exe'
			shell.showItemInFolder(fullPath)
		}
	})
})