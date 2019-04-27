function submit(){
    name1 = document.getElementById("pname").value;
    pname = name1;
    recordname(pname);
    var s = document.getElementById("nameInput");
    if(document.getElementById("pname").value != ""){
        s.style.display = "none";
    }
    setUpSocket();
    initialize();
}


function showHome(){
    var s = document.getElementById("nameInput");
    s.style.display = "block";
}

//blablabla