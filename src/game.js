var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('play', {
    preload: function() {
        //background sprites
        this.game.load.image('forest-back', 'assets/parallax_forest_pack/layers/parallax-forest-back-trees.png');
        this.game.load.image('forest-lights', 'assets/parallax_forest_pack/layers/parallax-forest-lights.png');
        this.game.load.image('forest-middle', 'assets/parallax_forest_pack/layers/parallax-forest-middle-trees.png');
        this.game.load.image('forest-front', 'assets/parallax_forest_pack/layers/parallax-forest-front-trees.png');
        //monster sprites
        this.game.load.image('aerocephal', 'assets/allacrost_enemy_sprites/aerocephal.png');
        this.game.load.image('arcana_drake', 'assets/allacrost_enemy_sprites/arcana_drake.png');
        this.game.load.image('aurum-drakueli', 'assets/allacrost_enemy_sprites/aurum-drakueli.png');
        this.game.load.image('bat', 'assets/allacrost_enemy_sprites/bat.png');
        this.game.load.image('daemarbora', 'assets/allacrost_enemy_sprites/daemarbora.png');
        this.game.load.image('deceleon', 'assets/allacrost_enemy_sprites/deceleon.png');
        this.game.load.image('demonic_essence', 'assets/allacrost_enemy_sprites/demonic_essence.png');
        this.game.load.image('dune_crawler', 'assets/allacrost_enemy_sprites/dune_crawler.png');
        this.game.load.image('green_slime', 'assets/allacrost_enemy_sprites/green_slime.png');
        this.game.load.image('nagaruda', 'assets/allacrost_enemy_sprites/nagaruda.png');
        this.game.load.image('rat', 'assets/allacrost_enemy_sprites/rat.png');
        this.game.load.image('scorpion', 'assets/allacrost_enemy_sprites/scorpion.png');
        this.game.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
        this.game.load.image('snake', 'assets/allacrost_enemy_sprites/snake.png');
        this.game.load.image('spider', 'assets/allacrost_enemy_sprites/spider.png');
        this.game.load.image('stygian_lizard', 'assets/allacrost_enemy_sprites/stygian_lizard.png');
    },
    create: function() {
        //background creation
        var state = this;
 
        this.background = this.game.add.group();
        // setup each of our background layers to take the full screen
        ['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
        .forEach(function(image) {
        var bg = state.game.add.tileSprite(0, 0, state.game.world.width,
            state.game.world.height, image, '', state.background);
        bg.tileScale.setTo(4,4);
        });

        //monster creation
        var monsterData = [
            {name: 'Aerocephal',        image: 'aerocephal',        maxHealth: 10},
            {name: 'Arcana Drake',      image: 'arcana_drake',      maxHealth: 20},
            {name: 'Aurum Drakueli',    image: 'aurum-drakueli',    maxHealth: 30},
            {name: 'Bat',               image: 'bat',               maxHealth: 5},
            {name: 'Daemarbora',        image: 'daemarbora',        maxHealth: 10},
            {name: 'Deceleon',          image: 'deceleon',          maxHealth: 10},
            {name: 'Demonic Essence',   image: 'demonic_essence',   maxHealth: 15},
            {name: 'Dune Crawler',      image: 'dune_crawler',      maxHealth: 8},
            {name: 'Green Slime',       image: 'green_slime',       maxHealth: 3},
            {name: 'Nagaruda',          image: 'nagaruda',          maxHealth: 13},
            {name: 'Rat',               image: 'rat',               maxHealth: 2},
            {name: 'Scorpion',          image: 'scorpion',          maxHealth: 2},
            {name: 'Skeleton',          image: 'skeleton',          maxHealth: 6},
            {name: 'Snake',             image: 'snake',             maxHealth: 4},
            {name: 'Spider',            image: 'spider',            maxHealth: 4},
            {name: 'Stygian Lizard',    image: 'stygian_lizard',    maxHealth: 20}
        ];

        this.monsters = this.game.add.group();
 
        var monster;
        monsterData.forEach(function(data) {
            // create a sprite for them off screen
            monster = state.monsters.create(1000, state.game.world.centerY, data.image);
            // center anchor
            monster.anchor.setTo(0.5);
            // reference to the database
            monster.details = data;

            // use the built in health component
            monster.health = monster.maxHealth = data.maxHealth;
            
            // hook into health and lifecycle events
            monster.events.onKilled.add(state.onKilledMonster, state);
            monster.events.onRevived.add(state.onRevivedMonster, state);
        
            //enable input so we can click it!
            monster.inputEnabled = true;
            monster.events.onInputDown.add(state.onClickMonster, state);
        });

        this.currentMonster = this.monsters.getRandom();
        this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);

        // the main player
        this.player = {
            clickDmg: 1,
            gold: 0
        };

        this.monsterInfoUI = this.game.add.group();
        this.monsterInfoUI.position.setTo(this.currentMonster.x - 220, this.currentMonster.y + 120);
        this.monsterNameText = this.monsterInfoUI.addChild(this.game.add.text(0, 0, this.currentMonster.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(0, 80, this.currentMonster.health + ' HP', {
            font: '32px Arial Black',
            fill: '#ff0000',
            strokeThickness: 4
        }));

        this.dmgTextPool = this.add.group();
        var dmgText;
        for (var d=0; d<50; d++) {
            dmgText = this.add.text(0, 0, '1', {
                font: '64px Arial Black',
                fill: '#fff',
                strokeThickness: 4
            });
            // start out not existing, so we don't draw it yet
            dmgText.exists = false;
            dmgText.tween = game.add.tween(dmgText)
                .to({
                    alpha: 0,
                    y: 100,
                    x: this.game.rnd.integerInRange(100, 700)
                }, 1000, Phaser.Easing.Cubic.Out);
        
            dmgText.tween.onComplete.add(function(text, tween) {
                text.kill();
            });
            this.dmgTextPool.add(dmgText);
        }

    },

    onKilledMonster: function(monster) {
        // move the monster off screen again
        monster.position.set(1000, this.game.world.centerY);
     
        // pick a new monster
        this.currentMonster = this.monsters.getRandom();
        // make sure they are fully healed
        this.currentMonster.revive(this.currentMonster.maxHealth);
    },

    onRevivedMonster: function(monster) {
        monster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
        // update the text display
        this.monsterNameText.text = monster.details.name;
        this.monsterHealthText.text = monster.health + 'HP';
    },

    onClickMonster: function(monster, pointer) {
        // apply click damage to monster
        this.currentMonster.damage(this.player.clickDmg);
        // update the health text
        this.monsterHealthText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP' : 'DEAD';

        // grab a damage text from the pool to display what happened
        var dmgText = this.dmgTextPool.getFirstExists(false);
        if (dmgText) {
            dmgText.text = this.player.clickDmg;
            dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dmgText.alpha = 1;
            dmgText.tween.start();
        }
    }
});

game.state.start('play');
