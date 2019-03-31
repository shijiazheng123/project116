var data = {name: "", score: 0};

function updateScore(scorenum, points){
    totalscore = scorenum + points;
    return totalscore;
}

function scoreReset(){
    scorenum = 0;
}

function recordname(username){
    data.name = username;
}

function recordscore(finalscore){
    data.score = finalscore;
}

function getname(){
    return data.name;
}

function getscore(){
    return data.score;
}