# Cumulus
A SoundCloud player that lives in your menubar.

[ ![Download](https://api.bintray.com/packages/gillesdemey/generic/Cumulus/images/download.svg) ](https://bintray.com/artifact/download/gillesdemey/generic/Cumulus.zip)

![screenshot 2015-05-27 20 21 00](https://cloud.githubusercontent.com/assets/868844/7845299/5810af32-04b6-11e5-8465-45c611a418b7.png)

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
