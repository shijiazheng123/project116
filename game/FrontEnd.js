// var Phaser = Phaser || {};


var socket = io.connect({transports: ['websocket']});
var game = new Phaser.Game(800,500,Phaser.AUTO,'game');





//main game
var background;
var player;
var cursors;
var bullets;
var firebutton;
var nextFire = 0;
var food;
var foodKey = {};
var nextfood = 0;
var fooddelay = 10;
var enemies;
var enemybullets;
var enemybullet;
var enemyObjects = {};
var enemyDict = {};
var moveX = 0;
var moveY = 0;
// var enemiesalive = [];
var meter = 0;
var Energy;
var fireMode = false;
var timer;
var scorenum = 0;
var pname = "";
var t;
var score;
var gameinfo;
var yourInfo;
var lost = false;


//for testing purposes
var testbutton; //to test specific functions, get rid of later
var tween; //enemy movement automatically
var count = 0;
var nextEnemyfire = 0; // enemy firing automatically


setUpSocket();


socket.on('message', function (event) {
    var info = JSON.parse(event);
    console.log(info);

    for(var i=0; i<info['playerList'].length; i++){
        enemyDict[info['playerList'][i]['id']] = info['playerList'][i]
    }

    console.log(enemyDict);
    gameinfo = info['gameStatus'];
    console.log(gameinfo);

    // for(var i = 0; i < info["global"]["playerInfo"].length; i++){
    //     console.log(info["global"]["playerInfo"][i]);
    //     otherPlayers.push(info["global"]["playerInfo"][i]);
    // }
    //
    //
    // boxInfo["numbers"] = info["global"]["boxes"]["noP"] + info["global"]["boxes"]["withP"];
    // console.log(boxInfo);
    //
    yourInfo = info["personal"];
    console.log(yourInfo);
});



socket.on('newPlayer', function(event){
    var data = JSON.parse(event);
    console.log(data);
    newPlayerJoined(data);
    enemyDict[data['id']] = data;
    // enemyInfo.push(data);
    console.log(enemyDict);
});

function setUpSocket() {
    socket.on('connect', function (event) {
        socket.send('Hello Server!');
    });
    console.log("connected");
}

function initialize(username){
    console.log(username);
    recordname(username);
    socket.emit("register", username);
}



function pressedPlay(){
    var data = {
        "username": getname(),
    };

    socket.emit('start',JSON.stringify(data));

}


function playerJoined(){

    // console.log(enemyInfo);

    for(var i of Object.keys(enemyDict)){
        newPlayerJoined(enemyDict[i]);
        console.log(enemyDict);
    }


    player = game.add.sprite(game.world.centerX, game.world.centerY,'player');
    game.physics.enable(player,Phaser.Physics.ARCADE);

    game.camera.follow(player);
    game.camera.deadzone = new Phaser.Rectangle(300, 150, 100, 100);
    player.body.collideWorldBounds = true;


    // bullets = game.add.group();
    // bullets.enableBody = true;
    // bullets.physicsBodyType = Phaser.Physics.ARCADE;
    //
    // bullets.createMultiple(100, 'bullets');
    // bullets.setAll('checkWorldBounds', true);
    // bullets.setAll('outOfBoundsKill', true);

    console.log("created player");


}


function newPlayerJoined(data){

    console.log("a new player joined " + data['username']);

    enemyDict[data['id']] = data;

    var newEnemy = enemies.create(data["x"], data["y"], 'enemy');
    newEnemy.body.collideWorldBounds = true;
    // newEnemy.body.velocity.x = data["vx"];
    // newEnemy.body.velocity.y = data["vy"];
    enemyObjects[data['id']] = newEnemy;
    // console.log(enemyObjects);
    // // // enemies.push(newEnemy);
    // // // enemyInfo.push(data);
    // enemyDict[data["id"]] = newEnemy;
}

socket.on('enemyMoved', function(event){
    enemyMoved(event);
});

function enemyMoved(data){
    var info = JSON.parse(data);
    // console.log(info['id']);
    // console.log(info);
    // var movedPlayer = findId(info['id']);
    // console.log(enemyObjects);

    var movedPlayer;

    for(var e of Object.keys(enemyObjects)){
        // console.log(e);
        if(e == info['id']){
            // console.log(e);
            movedPlayer = enemyObjects[e];
        }
    }


    if(!movedPlayer){
        return;
    }


    enemyDict[info['id']]['x'] = info['x'];
    enemyDict[info['id']]['y'] = info['y'];
    enemyDict[info['id']]['vx'] = info['vx'];
    enemyDict[info['id']]['vy'] = info['vy'];

    for(var en of Object.keys(enemyObjects)){
        var ene = enemyObjects[en];
        var newen = enemies.create(enemyDict[en]['x'], enemyDict[en]['y'], 'enemy');
        enemyObjects[en] = newen;
        ene.destroy();
    }


}

function findId(id){
    for (var i of Object.keys(enemyObjects)) {
        if(i == id) {
            // console.log(enemyObjects[i]);
            return enemyObjects[i];
        }
    }

}

socket.on('removePlayer', function(event){
    playerRemove(event);
});

function playerRemove(data){

    var info = JSON.parse(data);
    var deadPlayer = findId(info['id']);

    if(!deadPlayer){
        return;
    }

    deadPlayer.destroy();
    console.log("a player disconnected" + info['username']);

    delete enemyDict[info["id"]];
    delete enemyObjects[info["id"]];
}

socket.on('deleteFood', function (event) {
    var key = JSON.parse(event);
    for(var f of Object.keys(foodKey)){
        if(f == key){
            foodKey[f].destroy();
            delete foodKey[f];
        }
    }
});

socket.on('regenFood', function(event){
    var n = JSON.parse(event);
    // console.log(n);
    for(var k of Object.keys(n)){
        var fo = food.create(n[k]['x'],n[k]['y'], 'food');
        foodKey[k] = fo;
        // console.log(foodKey[k]);
    }

});


var menu ={
    preload:function () {
        game.load.image('angryboi', 'assets/angryboi.png');
        game.load.image('button','assets/button.png')
    },

    create:function () {
        game.stage.backgroundColor = '#ff5050';
        game.add.image(0,0, 'angryboi');

        var controls = game.add.text(125, 100, "Collect Food to fill your energy bar, Once filled, kill as many enemy chefs as you can",{font: '14px Arial', fill: '#ffbf00'} );

        var t = game.add.text(150, 150, "Arrow Keys to Move, Mouse Click to Shoot", {font: '24px Arial', fill: '#ffbf00'});


        var button = game.add.button(350, 200, 'button', this.start, game);

        // var key = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        //
        // key.onDown.addOnce(this.start, this);
    },
    start: function () {
        game.state.start('mainGame');
        pressedPlay();
    }
};


var mainGame = {
    preload:function(){
        game.load.image('floor','assets/kitchenfloor.png');
        game.load.image('player','assets/player.png');
        game.load.image('enemy','assets/enemy.png');
        // game.load.image('enemybullets','assets/enemybullets.png');
        game.load.image('food','assets/food.png');
        game.load.image('energy', 'assets/energybar.png');
        game.load.image('empty', 'assets/energybarempty.png');

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0,0,3000,1800);
    },
    create:function(){

        scorenum = 0;
        meter = 0;

        background = game.add.tileSprite(0,0,3200,2000,'floor');


        //enemy group
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.setAll('outOfBoundsKill',true);

        //player
        // playerJoined();
        socket.on('startGame', playerJoined());





        //set up controllers
        cursors = game.input.keyboard.createCursorKeys();
        //bullets group
        // bullets = game.add.group();
        // bullets.enableBody = true;
        // bullets.physicsBodyType = Phaser.Physics.ARCADE;
        //
        // bullets.createMultiple(100, 'bullets');
        // bullets.setAll('checkWorldBounds', true);
        // bullets.setAll('outOfBoundsKill', true);
        // firebutton = game.input.activePointer;




        //enemy bullets group
        // enemybullets = game.add.group();
        // enemybullets.enableBody = true;
        // enemybullets.physicsBodyType = Phaser.Physics.ARCADE;
        //
        // enemybullets.createMultiple(10, 'enemybullets');
        // enemybullets.setAll('checkWorldBounds', true);
        // enemybullets.setAll('outOfBoundsKill', true);
        // enemybullets.setAll('anchor.x',0.5);
        // enemybullets.setAll('anchor.y',1);




        //food group
        food = game.add.group();
        food.enableBody = true;


        for(var f of Object.keys(gameinfo['food'])){
            var fo = food.create(gameinfo['food'][f]['x'],gameinfo['food'][f]['y'],'food');
            foodKey[f] = fo;
            // console.log(fo);
        }




        //energy bar and scores
        score = ("Score: " + scorenum);
        var style = {font: "24px Arial", align: "center"};
        t = game.add.text(515, 475, score, style);
        t.fixedToCamera = true;

        var empty = game.add.sprite(0,475,'empty');
        empty.fixedToCamera = true;

        var empty = game.add.sprite(0,475,'empty');
        empty.fixedToCamera = true;

        Energy = new energy();

        Energy.fixedToCamera = true;

        //timer for depleting meter
        timer = game.time.create(false);
        timer.loop(500, depleteMeter, this);
        timer.start();


        testbutton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //get rid of testbutton when finished

    },
    update:function(){

        Energy.energypercentage(meter);

        //collecting food and changing the energy meter
        game.physics.arcade.overlap(player,food,foodcollect,null,this);


        //player controls

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;


        if(cursors.left.isDown || cursors.right.isDown || cursors.down.isDown || cursors.up.isDown){
            if(cursors.left.isDown){
                player.body.velocity.x = -250;
                moveX = -5;
            }
            else if(cursors.right.isDown){
                player.body.velocity.x = 250;
                moveX = 5;
            }

            if(cursors.down.isDown){
                player.body.velocity.y = 250;
                moveY = 5;
            }
            else if(cursors.up.isDown){
                player.body.velocity.y = -250;
                moveY = -5;
            }



        }

        socket.emit('move_player', JSON.stringify({"username": getname(), "x": player.body.x,
            "y": player.body.y, "vx": player.body.velocity.x, "vy": player.body.velocity.y}));




        // if(game.input.mousePointer.justPressed(50)){
        //     game.physics.arcade.moveToPointer(player,300);
        // }




        //checks if meter is full or empty to allow firing, when meter is full, start timer for depleting meter until it reaches 0
        if(meter == 0){
            timer.pause();
            fireMode = false;
        }

        if(meter == 100){
            timer.resume();
            fireMode = true;
        }

        if(fireMode){

            // this.start();

            // if (firebutton.isDown) {
            //     fire();
            // }

        }

        //socket.emit('fire', JSON.stringify({"username": getname(), "x": player.body.x, "y": player.body.y}))

        //recording score
        recordscore(scorenum);

        //detecting bullet hitting player
        // game.physics.arcade.overlap(bullets,enemies,deadenemy,null,this);
        // game.physics.arcade.overlap(enemybullets,player,this.start,null,this);


        //get rid of later
        // if (testbutton.isDown){
            // if(meter > 0 && meter >= 20){
            //     meter = meter - 20;
            // }else if(meter <20){
            //     meter = 0;
            // }
        // }


    },
    start: function () {
        // game.state.start('chopMode');
        game.state.start('gameover');
    }

};

// var scorenum;
// var meter;
// var background;
// var food;
// var yourInfo;
// var otherPlayers = [];
// var boxInfo = {"numbers": 0, "players": []};
//
// var mainGame = {
//     preload:function(){
//         game.load.image('floor','assets/kitchenfloor.png');
//         game.load.image('player','assets/player.png');
//         game.load.image('bullets','assets/bullets.png');
//         game.load.image('enemy','assets/enemy.png');
//         game.load.image('enemybullets','assets/enemybullets.png');
//         game.load.image('food','assets/food.png');
//         game.load.image('energy', 'assets/energybar.png');
//         game.load.image('empty', 'assets/energybarempty.png');
//
//         game.physics.startSystem(Phaser.Physics.ARCADE);
//         game.world.setBounds(0,0,800,500);
//     },
//     create:function(){
//
//         scorenum = 0;
//         // meter = 0;
//         game.stage.backgroundColor = "#F26E51";
//
//         socket.on('newPlayer', function (event) {
//             var info = JSON.parse(event);
//             otherPlayers.push(info);
//             console.log(otherPlayers);
//             console.log(info["username"] + "joined");
//         });
//
//         food = game.add.group();
//         food.enableBody = true;
//
//         // var rows = 10;
//         var i = 0;
//         while(i < boxInfo["numbers"]){
//
//             food.create(75, 50, 'food');
//             food.create(150, 50, 'food');
//             food.create(225, 50, 'food');
//             food.create(300, 50, 'food');
//             food.create(375, 50, 'food');
//             food.create(425, 50, 'food');
//             food.create(0, 50, 'food');
//             food.create(400, 50, 'food');
//             food.create(450, 50, 'food');
//             food.create(500, 50, 'food');
//
//         }
//
//
//
//
//
//     },
//     update:function(){
//
//
//
//     },
//     start: function () {
//         game.state.start('gameover');
//     }
//
// };


// function fire(){
//     if(game.time.now > nextFire){
//         var bullet = bullets.getFirstExists(false);
//
//         if(bullet){
//             bullet.reset(player.x,player.y +5);
//             game.physics.arcade.moveToPointer(bullet, 300);
//             nextFire = game.time.now + 200;
//         }
//     }
// }

function depleteMeter(){
    if(meter > 0){
        meter = meter - 10;
    }
}

// function enemyfire(){
//     enemybullet = enemybullets.getFirstExists(false);
//     enemiesalive.length = 0;
//     enemies.forEachAlive(function(enemy){
//         enemiesalive.push(enemy);
//     });
//
//     if(enemybullet && enemiesalive.length > 0){
//         var random = game.rnd.integerInRange(0, enemiesalive.length - 1);
//
//         var shoot = enemiesalive[random];
//         enemybullet.reset(shoot.body.x, shoot.body.y);
//
//         game.physics.arcade.moveToObject(enemybullet,player, 100);
//         nextEnemyfire = game.time.now + 10;
//     }
//
// }

function foodcollect(player,food){
    if(!fireMode){
            food.destroy();
            // console.log(food);
            for(var f of Object.keys(foodKey)){
                if(foodKey[f] == food){
                    socket.emit('foodEaten', JSON.stringify(f));
                    delete foodKey[f];
                }
            }
            if(meter < 100){
                meter = meter + 10;
                scorenum = updateScore(scorenum, 30);
                t.setText("Score: " + scorenum);
                Energy.energypercentage(meter);
            }
    }
}

function deadenemy(bullet, enemy){
    // bullet.kill();
    enemy.destroy();
}

function updateScore(points){
    scorenum = scorenum + points;
}


// var chopMode = {
//     preload: function(){
//         game.load.image('floor','assets/kitchenfloor.png');
//         game.load.image('escape','assets/bullets.png');
//         game.load.image('playermad','assets/ptarget.png');
//         game.load.image('energy', 'assets/energybar.png');
//         game.load.image('empty', 'assets/energybarempty.png');
//     },
//     create: function(){
//         lost = false;
//         meter = 100;
//         scorenum = getscore();
//
//         background = game.add.tileSprite(0,0,3200,2000,'floor');
//
//         score = ("Score: " + scorenum);
//         var style = {font: "24px Arial", align: "center"};
//         t = game.add.text(515, 475, score, style);
//         t.fixedToCamera = true;
//
//         var empty = game.add.sprite(0,475,'empty');
//         empty.fixedToCamera = true;
//
//         Energy = new energy();
//
//         Energy.fixedToCamera = true;
//
//         //timer for depleting meter
//         timer = game.time.create(false);
//         timer.loop(500, depleteMeter, this);
//         timer.start();
//     },
//     update: function(){
//         Energy.energypercentage(meter);
//         timer.resume();
//
//         if(meter == 0){
//             this.start();
//         }
//
//     },
//     start: function(){
//         if(!lost){
//             game.state.start('mainGame');
//         }else{
//             game.state.start('gameover');
//         }
//     }
// };


var gameoverscreen = {


    create: function () {
        game.stage.backgroundColor = "#fff";

        var t = game.add.text(50,150,"you lose");
        var p = game.add.text(50,170,"User: " + getname());
        var s = game.add.text(50,190,"Score: " + getscore());

        var leaderboard = game.add.text(50,250,"Leaderboard:\nperson: 9999999" +
            "\nperson: 9999999\nperson: 9999999");

        var key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        key.onDown.addOnce(this.start, this);
    },
    start: function () {
        game.state.start('mainGame');
    }
};

game.state.add('mainGame',mainGame);
// game.state.add('chopMode', chopMode);
// game.state.start('mainGame');
game.state.add('menu',menu);
game.state.add('gameover',gameoverscreen);
game.state.start('menu');


