
let config={
    type:Phaser.AUTO,//automatically detects the rendering type
    scale:{
        mode:Phaser.Scale.fullScreenScaleMode,//full screnn mode
        width:800,
        height:600,
    },
    backgroundColor:0xffffcc,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{
                //gravity along y axis
                y:1000,

            },
            debug:false
        }


    },
    scene:{
        preload:preload,
        create:create,
        update:update,
    }
}
//specs for player
let game_config={
    speed:150,
    jump_speed:-798

}
let game=new Phaser.Game(config);

function preload(){
    this.load.image("ground","assets/topground.png");
    this.load.image("sky","assets/background.png");
    //for loading spritesheet image;
    this.load.spritesheet("dude","assets/dude.png",{frameWidth:32,frameHeight:48});
    this.load.image("apple","assets/apple.png");

    this.load.image("ray","assets/ray.png");

    
}

function create(){
    W=game.config.width;
    console.log(W);
    H=game.config.height;
    //add tile sprite
    let ground=this.add.tileSprite(0,H-128,W,128,'ground')//tile sprite is used for repeating an image in form of tiles
    ground.setOrigin(0,0);

    //adding physics to existing sprite (ground)
    this.physics.add.existing(ground);
    ground.body.allowGravity = false;
    ground.body.immovable=true;
  
    //create a background
    let background=this.add.sprite(0,0,'sky');
    background.setOrigin(0,0);
    background.displayWidth=W;
    background.depth=-2;//background will appear behind the ground image
    
    //adding ray
    let rays=[];
    for(i=-10;i<=10;i++){
        let ray = this.add.sprite(W/2,H-128,"ray")
        ray.displayHeight= 1.2*H
        ray.setOrigin(0.5,1)
        ray.alpha=0.2;
        ray.angle=i*10;
        ray.depth=-1;
        rays.push(ray);
    }

    //tween
    this.tweens.add({
        targets:rays,
        props:{
            angle:{
                value:"+=20"
            }
        },
        duration:6000,
        repeat:-1
    })
    


    //adding player 
    //adding physics engine with sprite by adding .physics
    this.player=this.physics.add.sprite(100,100,'dude',4)//(x,y,name given in preload,frame number)
    console.log(this.player)
    //set the bounce value to player
    this.player.setBounce(0.5);

    //restricting the player within the window/world
    this.player.setCollideWorldBounds(true);
    //player animations
    this.anims.create({
        key:'left',
        frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        frameRate:10,
        repeat:-1
    })
    this.anims.create({
        key:'center',
        frames:this.anims.generateFrameNumbers('dude',{start:4,end:4}),
        frameRate:10,
        
    })
    this.anims.create({
        key:'right',
        frames:this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        frameRate:10,
        repeat:-1
    })


    //adding collision detection between player and ground
    this.physics.add.collider(this.player,ground)

    //adding group of apples =physical objects
    let fruits=this.physics.add.group({
        key:"apple",
        repeat:8,
        setScale:{x:0.2,y:0.2},
        setXY:{x:10,y:0,stepX:100}
    })
    //adding collision detection between fruits and ground
    this.physics.add.collider(fruits,ground);

    //adding bouncing effect on all apples
    fruits.children.iterate((f)=>{
        f.setBounce(Phaser.Math.FloatBetween(0.4,0.7))
    })

    //creating more platform
    let platforms=this.physics.add.staticGroup()
    platforms.create(600,350,"ground").setScale(2,0.5).refreshBody();
    platforms.create(700,100,"ground").setScale(2,0.5).refreshBody();
    platforms.create(100,200,"ground").setScale(2,0.5).refreshBody();
    //adding collision detection between fruits and ground
    this.physics.add.collider(fruits,platforms);
    
    //adding collision detection between player and platform
    this.physics.add.collider(this.player,platforms);

    this.physics.add.overlap(this.player,fruits,eatFruit,null,this)



    //keyboard controls
    this.cursors=this.input.keyboard.createCursorKeys()

    //create camera
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);

    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.25)




}

function update(){
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-game_config.speed);
        this.player.anims.play('left',true);
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(game_config.speed);
        this.player.anims.play('right',true);


    }else{
        this.player.setVelocityX(0);
        this.player.anims.play('center',true)

    }

    //adding jumping ability
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(game_config.jump_speed)

    }

}
count=0;
function eatFruit(player,fruit){
    fruit.disableBody(true,true);
    count+=1;
    if(count==8){
      setTimeout(()=>{
          alert("You Won!")
          location.reload();
      },250)
    }
}