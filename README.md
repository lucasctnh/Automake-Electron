# Automake-Electron

Similarly to [Automated-Makefile](https://github.com/coutlcdo/Automated-Makefile), this project is a directory watcher to automate the process of creating and running Makefiles for Allegro projects, it can be easily adapted to fulfill other purposes though.

## Running locally

You can either run `npm install` to only install dependencies or run `npm run start:first` to install all dependencies and run the App on sequence.

## Packaging

Once you have the dependencies installed you can run `npm run dist` to automatically build the installer according to
your OS.

Before packaging, remember to set `NODE_ENV` as production mode.

## Mirrors

Pre-packaged installers:
- Version 0.2.5:
	- Windows:
		- [.exe Installer](https://www.dropbox.com/s/dfybig3zj6t3xqf/Automake%20Setup%200.2.5.exe?dl=0)
- Version 0.1.5:
	- Windows:
		- [.exe Installer](https://www.dropbox.com/s/f3k76mv6d8l813j/Automake%20Setup%200.1.5.exe?dl=0)
	- Linux:
		- [.deb File](https://www.dropbox.com/s/gip1x0dfs8bp6ik/automated-makefile-electron_0.1.5_amd64.deb?dl=0)
		- [AppImage](https://www.dropbox.com/s/r28jaz4lcviogbk/Automake-0.1.5.AppImage?dl=0)
