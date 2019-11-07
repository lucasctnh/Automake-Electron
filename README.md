# Automake-Electron

Similarly to [Automated-Makefile](https://github.com/coutlcdo/Automated-Makefile), this project is a directory watcher to automate the process of creating and running Makefiles for Allegro projects, it can be easily adapted to fulfill other purposes though.

## Running locally

You can either run `npm install` to only install dependencies or run `npm run start:first` to install all dependencies and run the App on sequence.

## Packaging

Once you have the dependencies installed you can run `npm run dist` to automatically build the installer according to your OS.

Before packaging, remember to set `NODE_ENV` as production mode.

## Mirrors

Pre-packaged installers:
- Version 1.0.0:
	- Windows:
		- [.exe Installer](https://www.dropbox.com/s/knjk4fa51fwokp3/Automake%20Setup%201.0.0.exe?dl=0)
	- Linux:
		- [.deb File]()
		- [AppImage]()
- Version 0.2.6:
	- Windows:
		- [.exe Installer](https://www.dropbox.com/s/5v9du3e1f30myo6/Automake%20Setup%200.2.6.exe?dl=0)
