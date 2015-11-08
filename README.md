# Cumulus
A SoundCloud player that lives in your menubar.

[![GitHub release](https://img.shields.io/badge/download-latest-blue.svg)](https://github.com/gillesdemey/Cumulus/releases/latest)

![screen shot 2015-11-08 at 01 48 24](https://cloud.githubusercontent.com/assets/868844/11018153/de01bade-85ba-11e5-84b4-73299530960b.png)

# Developing

## Install dependencies
`npm install`

`npm install -g electron-prebuilt`

## Compile the application
`grunt` or `grunt build`

## Run the application with the [Chrome DevTools](https://developer.chrome.com/devtools)
`NODE_ENV=development electron .`

### Or in Windows:
- PowerShell: `$env:NODE_ENV="development"; electron .`
- CMD: `set "NODE_ENV=development" & electron .`
