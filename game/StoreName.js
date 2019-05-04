setUpSocket();


function setUpSocket() {
    socket.on('connect', function (event) {
        socket.send('Hello Server!');
    });

}

function initialize(username) {
    console.log(username);
    socket.emit('register',username);
}