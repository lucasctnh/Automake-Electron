# Automake-Electron

Similarly to [Automated-Makefile](https://github.com/coutlcdo/Automated-Makefile), this project is a directory watcher to automate the process of creating and running Makefiles for Allegro projects, it can be easily adapted to fulfill other purposes though.

## Running locally

You can either run `npm install` to only install dependencies or run `npm run start:first` to install all dependencies and run the App on sequence.

## Packaging

Once you have the dependencies installed you can run `npm run dist` to automatically build the installer according to
your OS.

Before packaging, remember to set NODE_ENV as production mode.

## Mirrors

Pre-packaged installers:
- Version 0.1.4:
	- Windows: [MIRROR #1](https://www.dropbox.com/s/qgvbuqdyiuat4wm/Automake%20Setup%200.1.4.exe?dl=0)
