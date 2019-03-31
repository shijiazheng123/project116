function submit(){
    name1 = document.getElementById("pname").value;
    pname = name1;
    recordname(pname);
    var s = document.getElementById("nameInput");
    if(document.getElementById("pname").value != ""){
        s.style.display = "none";
    }
}

function score(){
    var sc = document.getElementById("score");
    sc.style.display = "block";
}

function back(){
    var sc = document.getElementById("score");
    sc.style.display = "none";
}

//blablabla