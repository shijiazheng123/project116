var socket = io.connect({transports: ['websocket']});

setUpSocket();


function setUpSocket() {
    socket.on('connect', function (event) {
        socket.send('Hello Server!');
    });

}

function initialize(username) {
    console.log(username);
    // recordname(username);
    socket.emit('register',username);
}

function goBack(){
    var back = document.getElementById("scoreboard");
    back.innerHTML = "<button class= \"button\" type=\"button\" onclick=\"location.href='http://localhost:8080';\">Play Again</button>"
}