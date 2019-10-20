const chokidar = require('chokidar')
const nrc = require('node-run-cmd')

const electron = require('electron')
const { ipcRenderer, shell } = electron

const name = document.getElementById('made-by-abs')
name.onclick = openGit

function openGit() {
	shell.openExternal("https://github.com/coutlcdo")
}

const fs = require('fs')
const path = require('path')

let proj = ''

let pathBase = ''
let pathLib = ''
let allegroV = ''

ipcRenderer.on('response-filepaths', (e, item) => {
	pathBase = item[0]
	pathLib = item[1]

	for(let i=0;i<pathLib.length;i++) {
		if(pathLib[i] == '5') {
			allegroV = pathLib.slice(i, i+6)
		}
	}

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

				const ul = document.querySelector('ul')
				ul.innerHTML = ''

				const li = document.createElement('li')
				const itemText = document.createTextNode('Saved! Compiling...')

				li.appendChild(itemText)
				ul.appendChild(li)

				setTimeout(() => {
					nrc.run('mingw32-make', { cwd: pathBase, shell: true })

					ul.innerHTML = ''
					const li = document.createElement('li')
					const itemText = document.createTextNode('Finished compilation! Waiting for new changes...')

					li.appendChild(itemText)
					ul.appendChild(li)
				}, 1000)
			})
		})
		.on('error', error => console.error(`Watcher error: ${error}`))
})