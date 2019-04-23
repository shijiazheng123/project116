var Phaser = Phaser || {};

var game = new Phaser.Game(800,500,Phaser.AUTO,'game');


//main game
var background;
var player;
var cursors;
var bullets;
var firebutton;
var nextFire = 0;
var food;
var nextfood = 0;
var fooddelay = 10;
var enemies;
var enemybullets;
var enemybullet;
var enemiesalive = [];
var meter = 0;
var Energy;
var fireMode = false;
var timer;
var scorenum = 0;
var pname = "";
var t;
var score;


//for testing purposes
var testbutton; //to test specific functions, get rid of later
var tween; //enemy movement automatically
var count = 0;
var nextEnemyfire = 0; // enemy firing automatically

//menu
// var button;




var mainGame = {
    preload:function(){
        game.load.image('floor','assets/kitchenfloor.png');
        game.load.image('player','assets/claus cook.png');
        game.load.image('bullets','assets/bullets.png');
        game.load.image('enemy','assets/enemy.png');
        game.load.image('enemybullets','assets/enemybullets.png');
        game.load.image('food','assets/food.png');
        game.load.image('energy', 'assets/energybar.png');
        game.load.image('empty', 'assets/energybarempty.png');
    },
    create:function(){

        scorenum = 0;
        meter = 0;
        background = game.add.tileSprite(0,0,3200,2000,'floor');

        //player
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0,0,3000,1800);

        player = game.add.sprite(game.world.centerX, game.world.centerY,'player');
        game.physics.enable(player,Phaser.Physics.ARCADE);

        game.camera.follow(player);
        game.camera.deadzone = new Phaser.Rectangle(300, 150, 100, 100);
        player.body.collideWorldBounds = true;

        //set up controllers
        cursors = game.input.keyboard.createCursorKeys();
        //bullets group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        bullets.createMultiple(100, 'bullets');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        firebutton = game.input.activePointer;

        //enemy group
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.setAll('outOfBoundsKill',true);
        for(var i=0; i < 30; i++){
            var enemy = enemies.create(game.world.randomX + Math.random() * 3000, game.world.randomY + Math.random() * 3000,'enemy');
        }


        //enemybullets group
        enemybullets = game.add.group();
        enemybullets.enableBody = true;
        enemybullets.physicsBodyType = Phaser.Physics.ARCADE;

        enemybullets.createMultiple(10, 'enemybullets');
        enemybullets.setAll('checkWorldBounds', true);
        enemybullets.setAll('outOfBoundsKill', true);
        enemybullets.setAll('anchor.x',0.5);
        enemybullets.setAll('anchor.y',1);


        //enemy bot movement, remove later
        // tween = game.add.tween(enemies).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        // tween.onLoop.add(move, this);


        //food group
        food = game.add.group();
        food.enableBody = true;
        food.createMultiple(30,'food');
        food.setAll('checkWorldBounds', true);
        food.setAll('outOfBoundsKill', true);

        for(var i=0; i < 50; i++){
            var fo = food.create(game.world.randomX,game.world.randomY,'food');
        }


        //energy bar and scores
        score = ("Score: " + scorenum);
        var style = {font: "24px Arial", align: "center"};
        t = game.add.text(515, 475, score, style);
        t.fixedToCamera = true;

        var empty = game.add.sprite(0,475,'empty');
        empty.fixedToCamera = true;

        Energy = new energy();

        Energy.fixedToCamera = true;

        //timer for depleting meter
        timer = game.time.create(false);
        timer.loop(500, depleteMeter, this);
        timer.start();

        // testbutton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //get rid of testbutton when finished

    },
    update:function(){


        //collecting food and changing the energy meter
        game.physics.arcade.overlap(player,food,foodcollect,null,this);
        Energy.energypercentage(meter);

        //keep generating food after another is collected
        if(nextfood < game.time.now && food.countDead() > 0 ){
            nextfood = game.time.now + fooddelay;
            var f = food.getFirstExists(false);
            f.reset(game.world.randomX,game.world.randomY);
        }

        //player controls
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        if(cursors.left.isDown){
            player.body.velocity.x = -200;
        }
        else if(cursors.right.isDown){
            player.body.velocity.x = 200;
        }
        if(cursors.down.isDown){
            player.body.velocity.y = 200;
        }
        else if(cursors.up.isDown){
            player.body.velocity.y = -200;
        }

        //make enemy chefs fire, remove when it turns into multiplayer
        // if(game.time.now > nextEnemyfire){
        //     enemyfire();
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
            if (firebutton.isDown) {
                fire();
            }
        }

        //recording score
        recordscore(scorenum);

        //detecting bullet hitting player
        game.physics.arcade.overlap(bullets,enemies,deadenemy,null,this);
        game.physics.arcade.overlap(enemybullets,player,this.start,null,this);


        //get rid of later
        // if (testbutton.isDown){
        //     if(meter > 0 && meter >= 20){
        //         meter = meter - 20;
        //     }else if(meter <20){
        //         meter = 0;
        //     }
        // }


    },
    start: function () {
        game.state.start('gameover');
    }

};

function fire(){
    if(game.time.now > nextFire){
        var bullet = bullets.getFirstExists(false);

        if(bullet){
            bullet.reset(player.x,player.y +5);
            game.physics.arcade.moveToPointer(bullet, 300);
            nextFire = game.time.now + 200;
        }
    }
}

function depleteMeter(){
    if(meter > 0){
        meter = meter - 10;
    }
}

function enemyfire(){
    enemybullet = enemybullets.getFirstExists(false);
    enemiesalive.length = 0;
    enemies.forEachAlive(function(enemy){
        enemiesalive.push(enemy);
    });

    if(enemybullet && enemiesalive.length > 0){
        var random = game.rnd.integerInRange(0, enemiesalive.length - 1);

        var shoot = enemiesalive[random];
        enemybullet.reset(shoot.body.x, shoot.body.y);

        game.physics.arcade.moveToObject(enemybullet,player, 100);
        nextEnemyfire = game.time.now + 10;
    }

}

function move(){
    if(count == 0){
        enemies.x += 10;
        count +=1;
    }else{
        enemies.x -=10;
        count = 0;
    }
}

function foodcollect(player,food){
    if(!fireMode){
        food.kill();
        meter = meter + 10;
        scorenum = updateScore(scorenum, 30);
        t.setText("Score: " + scorenum);
        Energy.energypercentage(meter);
    }
}

function deadenemy(bullet, enemy){
    bullet.kill();
    enemy.kill();
}

/*function updateScore(points){
    scorenum = scorenum + points;
}*/


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
    }
};

// function startGame(){
//     game.state.start('mainGame');
// }


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
        game.state.start('menu');
        showHome()
    }
};


game.state.add('mainGame',mainGame);
game.state.add('menu',menu);
game.state.add('gameover',gameoverscreen);
game.state.start('menu');

