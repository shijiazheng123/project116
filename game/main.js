const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// window var
let wind;

// create window when app is ready
app.on('ready', () => {
    wind = new BrowserWindow({width: 1200, height: 1000,
        icon: path.join(__dirname, 'assets/player.png')});

    // load index.html
    wind.loadFile("./server/templates/index.html")
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



