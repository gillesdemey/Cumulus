# Cumulus
A SoundCloud player that lives in your menubar.

[![GitHub release](https://img.shields.io/badge/download-latest-blue.svg)](https://github.com/gillesdemey/Cumulus/releases/latest)

<img height="600" width="auto" src="assets/cumulus_app.png">

# Installing

Download the [latest release for OSX](https://github.com/gillesdemey/Cumulus/releases/latest).

*IntelliJ users be warned: This app hijacks the ⌘+Alt+L shortcurt used by IntelliJ to reformat code. See [#40](https://github.com/gillesdemey/Cumulus/issues/40#issuecomment-261022368) and [#77](https://github.com/gillesdemey/Cumulus/issues/77).*

# Developing

## Install dependencies
`npm install`

`npm install -g electron`

## Compile the application
`grunt` or `grunt build`

## Run the application with the [Chrome DevTools](https://developer.chrome.com/devtools)
`NODE_ENV=development electron .`

### Or in Windows:
- PowerShell: `$env:NODE_ENV="development"; electron .`
- CMD: `set "NODE_ENV=development" & electron .`
