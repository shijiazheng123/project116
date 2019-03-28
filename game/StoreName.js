function submit(){
    var s = document.getElementById("nameInput");
    if(document.getElementById("name").value != ""){
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