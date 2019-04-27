var socket = io.connect();


setUpSocket();

function setUpSocket() {
    socket.on('connect', function (event) {
        // connected to server
        socket.send('Hello Server!');
    });

}

function initialize(){
    // submit();
    var username = JSON.stringify(getname());
    socket.emit('register', 'blbla');
}


function submit(){
    name1 = document.getElementById("pname").value;
    pname = name1;
    recordname(pname);
    var s = document.getElementById("nameInput");
    if(document.getElementById("pname").value != ""){
        s.style.display = "none";
    }
    // setUpSocket();
    initialize();
}


function showHome(){
    var s = document.getElementById("nameInput");
    s.style.display = "block";
}

//blablabla