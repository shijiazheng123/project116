class energy extends Phaser.Group{
    constructor(){
        super(game);
        this.bar = this.create(0, 475,'energy');
    }
    energypercentage(percent){
        percent = percent/100;
        this.bar.width = 475 * percent;

    }
}