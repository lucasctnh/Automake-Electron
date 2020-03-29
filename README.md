# Automake-Electron

Similarly to [Automated-Makefile](https://github.com/coutlcdo/Automated-Makefile), this project is a directory watcher to automate the process of creating and running Makefiles for Allegro projects, it can be easily adapted to fulfill other purposes though. Now able to compile C++ Allegro projects.

## Running locally

You can either run `npm install` to only install dependencies or run `npm run start:first` to install all dependencies and run the App on sequence.

## Packaging

Once you have the dependencies installed you can run `npm run dist` to automatically build the installer according to your OS.

Before packaging, remember to set `NODE_ENV` as production mode.

## Mirrors

Pre-packaged installers:
- Version 1.1.1 **(latest)**:
	- Windows:
		- [.exe Installer](https://www.dropbox.com/s/ovuqn1o1xh6ss60/Automake%20Setup%201.1.1.exe?dl=0)
- Version 1.0.0:
	- Windows:
		- [.exe Installer](https://www.dropbox.com/s/knjk4fa51fwokp3/Automake%20Setup%201.0.0.exe?dl=0)
	- Linux:
		- [.deb File](https://www.dropbox.com/s/tf8gst4d5i8mf2j/automated-makefile-electron_1.0.0_amd64.deb?dl=0)
		- [AppImage](https://www.dropbox.com/s/2z2pwbj7pkei6x4/Automake-1.0.0.AppImage?dl=0)
- Version 0.2.6:
	- Windows:
		- [.exe Installer](https://www.dropbox.com/s/5v9du3e1f30myo6/Automake%20Setup%200.2.6.exe?dl=0)
