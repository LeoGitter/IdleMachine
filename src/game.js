var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('play', {
    preload: function() {
        //background sprites
        this.game.load.image('forest-back', 'assets/parallax_forest_pack/layers/parallax-forest-back-trees.png');
        this.game.load.image('forest-lights', 'assets/parallax_forest_pack/layers/parallax-forest-lights.png');
        this.game.load.image('forest-middle', 'assets/parallax_forest_pack/layers/parallax-forest-middle-trees.png');
        this.game.load.image('forest-front', 'assets/parallax_forest_pack/layers/parallax-forest-front-trees.png');
        //skeleton sprite
        this.game.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
    },
    create: function() {
        var state = this;
 
        this.background = this.game.add.group();
        // setup each of our background layers to take the full screen
        ['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
        .forEach(function(image) {
        var bg = state.game.add.tileSprite(0, 0, state.game.world.width,
            state.game.world.height, image, '', state.background);
        bg.tileScale.setTo(4,4);
        });

        var skeletonSprite = game.add.sprite(450, 290, 'skeleton');
        skeletonSprite.anchor.setTo(0.5, 0.5);
    },
    render: function() {
        game.debug.text('Adventure Awaits!', 250, 290);
    }
});

game.state.start('play');
