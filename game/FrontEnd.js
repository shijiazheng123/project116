// var Phaser = Phaser || {};


var socket = io.connect({transports: ['websocket']});
var game = new Phaser.Game(800,500,Phaser.AUTO,'game');

//information
var yourInfo;
var playersInfo = {};
var IdtoPlayers = {};
var foodtoId = {};
var yourId;
var player;
var currentPosX;
var currentPosY;

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

function goBack(){
    var back = document.getElementById("scoreboard");
    back.innerHTML = "<button class= \"button\" type=\"button\" onclick=\"location.href='http://localhost:8080';\">Play Again</button>"
}

socket.on('message', function (event) {
    console.log("connected");
    console.log(event);
    var info = JSON.parse(event);

    yourInfo = info['personal'];
    playersInfo = info['playerinfo'];

    //player
    for(var i of Object.keys(yourInfo)){
        currentPosX = yourInfo[i]['x'];
        currentPosY = yourInfo[i]['y'];
        player = game.add.sprite(yourInfo[i]['x'], yourInfo[i]['y'],'player');
        game.physics.enable(player,Phaser.Physics.ARCADE);
        game.camera.follow(player);
        game.camera.deadzone = new Phaser.Rectangle(300, 150, 100, 100);
        player.body.collideWorldBounds = true;
        yourId = i;
        playerExists = true;
    }

    for(var p of Object.entries(playersInfo)){
        addNewPlayer(p);
    }

    for(var f of Object.keys(info['food'])){
        var fo = food.create(info['food'][f]['x'], info['food'][f]['y'], 'food');
        foodtoId[f] = fo;
    }
});

socket.on('newP', function (event) {
    var newPInfo = JSON.parse(event);
    var newp;
    for(var p of Object.entries(newPInfo)){
        newp = p;
    }
    addNewPlayer(newp);
});

function addNewPlayer(info){
    if(info[0] != yourId){
        var newEnemy = enemies.create(info[1]['x'], info[1]['y'], 'enemy');
        newEnemy.body.collideWorldBounds = true;
        IdtoPlayers[info[0]] = newEnemy;
        playersInfo[info[0]] = playersInfo[1];
    }
}

socket.on('removePlayer', function (event) {
    if(onGame){
        var removedPlayer = JSON.parse(event);
        if(removedPlayer != yourId){
            var deadPlayer = IdtoPlayers[removedPlayer];
            deadPlayer.destroy();
            delete IdtoPlayers[removedPlayer];
            delete playersInfo[removedPlayer];
        }
    }
});

socket.on('move', function (event) {
    var movedPlayer = JSON.parse(event);
    var key = Object.keys(movedPlayer);
    if(key[0] !== yourId){
        IdtoPlayers[[key[0]]].position.x = movedPlayer[key[0]]['x'];
        IdtoPlayers[[key[0]]].position.y = movedPlayer[key[0]]['y'];
    }
});


socket.on('deleteFood', function (event) {
    if(onGame){
        var msg = JSON.parse(event);
        var key = Object.entries(msg);
        for(var f of Object.keys(foodtoId)){
            if(f === key[0][0]){
                foodtoId[f].destroy();
                delete foodtoId[f];
            }
        }
        if(key[0][0].includes("G") || !key[0][1]['eaten']){
            foodtoId[key[0][0]] = food.create(key[0][1]['x'], key[0][1]['y'], 'food');
        }
    }


});





//sprites
var enemies;
var food;
var onGame = false;

//global
var scorenum;
var scoreBar;
var meter;
var background;
var Energy;
var t; //text

//statuses
var fireMode;
var playerExists = false;

//controls
var plantPoison;




var mainGame = {
    init: function () {
        game.stage.disableVisibilityChange = true; //stops game from pausing when tab is inactive
    },

    preload: function () {
        game.load.image('floor','assets/kitchenfloor.png');
        game.load.image('player','assets/player.png');
        game.load.image('enemy','assets/enemy.png');
        game.load.image('food','assets/food.png');
        game.load.image('energy', 'assets/energybar.png');
        game.load.image('empty', 'assets/energybarempty.png');

    },
    create: function () {
        onGame = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0,0,3000,1800);

        scorenum = 0;
        meter = 0;

        background = game.add.tileSprite(0,0,3200,2000,'floor');

        //food
        food = game.add.group();
        food.enableBody = true;

        //enemy group
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.setAll('outOfBoundsKill',true);

        //control to plant bad food
        plantPoison = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        socket.emit('newPlayer');

        //energy bar and scores
        scoreBar = ("Score:" + scorenum);
        var style = {font: "24px Arial", align: "center"};
        t = game.add.text(515, 475, scoreBar, style);
        t.fixedToCamera = true;

        var empty = game.add.sprite(0,475,'empty');
        empty.fixedToCamera = true;

        Energy = new energy();
        Energy.fixedToCamera = true;
    },
    update: function(){
        Energy.energypercentage(meter);

        if(game.input.mousePointer.justPressed(100)){
            var dist = Phaser.Math.distance(player.body.x, player.body.y,
                game.input.worldX, game.input.worldY);
            var duration = dist*3;
            var tween = game.add.tween(player).to({x: game.input.worldX, y: game.input.worldY}, duration,
                Phaser.Easing.Linear.None);
            tween.start();
        }


        if(meter === 0){
            fireMode = false;
        }

        if(meter === 100){
            fireMode = true;
        }

        if(plantPoison.isDown){
            if(fireMode){
                socket.emit('plantPoison', JSON.stringify({'x': player.body.x, 'y': yourInfo[yourId]['y'] = player.body.y - 150, 'eaten': false}));
                fireMode = false;
                meter = 0;
            }
        }

        if(playerExists){
            game.physics.arcade.overlap(player,food,foodcollect,null,this);
            if(currentPosX != player.body.x || currentPosY != player.body.y){
                socket.emit('movePlayer', JSON.stringify({'x': player.body.x, 'y': player.body.y}));
                currentPosX = player.body.x;
                currentPosY = player.body.y;
            }
        }

        if(scorenum < 0){
            this.start();
        }

    },
    start: function () {
        socket.emit('lose');
        goBack();
        game.state.start('gameOver');
    }

};

function foodcollect(player,food){
    if(!fireMode){
        food.destroy();
        var id;
        for(var f of Object.keys(foodtoId)){
           if(foodtoId[f] === food){
              socket.emit('foodEaten', f);
              delete foodtoId[f];
              id = f;
           }
        }
        if(meter < 100){
            if(id.includes("G")){
                meter = meter + 50;
                scorenum = scorenum + 30;
            }else{
                scorenum = scorenum - 30;
            }
            t.setText("Score: " + scorenum);
            Energy.energypercentage(meter);
        }

        delete foodtoId[food];

    }
}

var gameoverscreen = {


    create: function () {
        onGame = false;
        game.stage.backgroundColor = "#fff";

        var t = game.add.text(50,150,"you lose");

    }
};


game.state.add('mainGame',mainGame);
game.state.add('gameOver',gameoverscreen);
game.state.start('mainGame');



