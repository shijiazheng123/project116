
//
// var socket = io.connect();
//
// socket.on("connect", socketConnected);
//
// function socketConnected(){
//     console.log("connected");
// }
//
// setUpSocket();
//
// function setUpSocket() {
//     socket.on('connect', function (event) {
//         // connected to server
//         socket.send('Hello Server!');
//     });
//     // socket.emit('register', 'blbla');
//
// }
//
// function initialize(){
//     // submit();
//     // var username = JSON.stringify(getname());
//     socket.emit('register', 'blbla');
// }


function submit(){
    name1 = document.getElementById("pname").value;
    pname = name1;
    recordname(pname);
    var s = document.getElementById("nameInput");
    if(document.getElementById("pname").value != ""){
        s.style.display = "none";
    }

}


function showHome(){
    var s = document.getElementById("nameInput");
    s.style.display = "block";
}

//blablabla