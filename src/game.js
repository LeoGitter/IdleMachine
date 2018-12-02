
var game = new Phaser.game(800, 600, Phaser.AUTO, '');

game.state.add('play', 
{
    preload: function()
    {
        game.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
    },
    create: function()
    {
        var skeletonSprite = game.add.sprite(450, 290, 'skeleton');
        skeletonSprite.anchor.setTo(0.5, 0.5);
    },
    render: function()
    {
        game.debug.text('Adventure Awaits!', 250, 290);
    }
});

game.state.start('play');