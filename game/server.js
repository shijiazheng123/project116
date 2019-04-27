var express = require('express');

var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));

serv.listen(process.env.PORT || 8080);
console.log("Server started.");

var io = require('socket.io')(serv,{});

function doPrint(data){
    console.log(data);
}

io.sockets.on('connection', function(socket){
    console.log("socket connected");
    //output a unique socket.id
    console.log(socket.id);
    socket.on('register', doPrint)
});