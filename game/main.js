const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// window var
let wind;

// create window when app is ready
app.on('ready', () => {
    wind = new BrowserWindow({width: 800, height: 600,
        icon: path.join(__dirname, 'assets/player.png')});

    // load index.html
    wind.loadFile("./index.html")
        /*url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes:true*/
    ;


    // include web contents
    wind.webContents.openDevTools();


    wind.on('closed', ()=>{
        wind = null
    });

})

//app.on('ready', creatWindow())

