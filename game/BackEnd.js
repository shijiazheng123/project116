var data = {name: "", score: 0, x: 0, y: 0};


//Set up of JSON for Socket.io usage.

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

function highscore(dataset){
    var tempscore = 0;
    var tempplayer;
    for(var id in dataset){
        var player = dataset[id];
        if(player.score > tempscore){
            tempscore = player.score;
            tempplayer = player;
        }
    }
    return tempplayer;
}

function addplayer(dataset, data, id){
    dataset[id] = data
}

function getplayer(dataset, id){
    return dataset[id]
}

var assert = require('assert');


//Testing for: before game starts, values should be blank.
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

//Testing for: values changing after a player starts the game.
suite('#during/after game', function() {
    test('should record and return player name', function () {
        recordname("Player1");
        assert.equal("Player1", getname());
        assert.notEqual("", getname());
    })
    test('should record and return score', function () {
        recordscore(600);
        assert.equal(600, getscore());
        assert.notEqual(0, getscore());
    })
    test('should return 50', function () {
        recordx(50);
        assert.equal(50, getx());
        assert.notEqual(0, getx());
    })
    test('should return 80', function () {
        recordy(80);
        assert.equal(80, gety());
        assert.notEqual(0, gety());
    })

    test('checks to see if it clears during the same instance', function () {
        resetPlayer()
        assert.notEqual("Player1", getname());
        assert.notEqual(600, getscore());
        assert.notEqual(50, getx());
        assert.notEqual(80, gety());
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

//Player with the highest score
suite('#high score', function() {
    //Assume dataset is already parsed for these tests
    test('returns player with the highest score in dictionary of players, pos num case', function () {
        var dataset = {1234: {name: "player1", score: 20, x: 0, y: 0}, 1235: {name: "player2", score: 30, x: 0, y: 0}};
        assert.equal(dataset[1235], highscore(dataset));
    })

    test('returns player with the highest score in dictionary of players, neg num case', function () {
        var dataset = {1234: {name: "player1", score: 880, x: 0, y: 0}, 1235: {name: "player2", score: -110, x: 0, y: 0}, 1236: {name: "player3", score: 0, x: 0, y: 0}};
        assert.equal(dataset[1234], highscore(dataset));
    })

    //Testing if it works with JSON parse() and stringify()
    test('returns player with the highest score in dictionary of players, pos num case', function () {
        var dataset = {1234: {name: "player1", score: 20, x: 0, y: 0}, 1235: {name: "player2", score: 30, x: 0, y: 0}};
        var JSONdataset = JSON.stringify(dataset);
        var newdataset = JSON.parse(JSONdataset);
        assert.equal(newdataset[1235], highscore(newdataset));
    })

    test('returns player with the highest score in dictionary of players, neg num case', function () {
        var dataset = {1234: {name: "player1", score: 880, x: 0, y: 0}, 1235: {name: "player2", score: -110, x: 0, y: 0}, 1236: {name: "player3", score: 0, x: 0, y: 0}};
        var JSONdataset = JSON.stringify(dataset);
        var newdataset = JSON.parse(JSONdataset);
        assert.equal(newdataset[1234], highscore(newdataset));
    })

})

//Add & get a player
suite('#add and get', function() {
    //Assume parsed
    test('adds new player to player list, then gets this new player to confirm it has been added to array', function () {
        var dataset = {1234: {name: "player1", score: 20, x: 0, y: 0}, 1235: {name: "player2", score: 30, x: 0, y: 0}};
        var data = {name: "player3", score: 50, x: 0, y: 0};
        addplayer(dataset, data, 1236);
        assert.equal(dataset[1236], getplayer(dataset, 1236));
    })

    //Test with JSON
    test('adds new player to player list, then gets this new player to confirm it has been added to array', function () {
        var dataset = {1234: {name: "player1", score: 20, x: 0, y: 0}, 1235: {name: "player2", score: 30, x: 0, y: 0}};
        var data = {name: "player3", score: 50, x: 0, y: 0};
        var JSONdataset = JSON.stringify(dataset);
        var newdataset = JSON.parse(JSONdataset);
        addplayer(newdataset, data, 1236);
        assert.equal(newdataset[1236], getplayer(newdataset, 1236));
    })

})
