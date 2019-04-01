var alldata = {}
var data = {name: "", score: 0, x: 0, y: 0};

function updateScore(scorenum, points){
    totalscore = scorenum + points;
    return totalscore;
}

function resetPlayer() {
    data.name = "";
    data.score = 0;
    data.x = 0;
    data.y = 0;
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

function recordx(xpos){
    data.x = xpos
}

function recordy(ypos){
    data.y = ypos
}

function getx(){
    return data.x
}

function gety(){
    return data.y
}

var assert = require('assert');


//Before game starts, values should be blank.
suite('#before game', function() {
    test('should return empty string, name not instantiated', function () {
        //recordname("");
        assert.equal("", getname());
    })
    test('should return 0, score not instantiated', function () {
        //recordscore("0");
        assert.equal(0, getscore());
    })
    test('should return 0, x not instantiated', function () {
        assert.equal(0, getx());
    })
    test('should return 0, x not instantiated', function () {
        assert.equal(0, gety());
    })
})

//New Player
suite('#during/after game', function() {
    test('should record and return player name', function () {
        recordname("Player1");
        assert.equal("Player1", getname());
    })
    test('should record and return score', function () {
        recordscore(600);
        assert.equal(600, getscore());
    })
    test('should return 50', function () {
        recordx(50);
        assert.equal(50, getx());
    })
    test('should return 80', function () {
        recordy(80);
        assert.equal(80, gety());
    })
})

//Score Reset
suite('#score reset', function() {
    test('should reset all player values', function () {
        recordname("Player1");
        recordscore(600);
        recordx(600);
        recordy(600);
        resetPlayer();
        assert.equal("", getname());
        assert.equal(0, getscore());
        assert.equal(0, getx());
        assert.equal(0, gety());
    })
})